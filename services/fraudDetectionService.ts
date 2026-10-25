/**
 * Fraud Account Creation Detection, Email MX Verification & Dynamic Blacklisting Service
 * 
 * Provides:
 * 1. Disposable / burner temporary inbox detection (50+ domains)
 * 2. Dummy / placeholder / bogus email detection (fake.com, dummy.com, fake@, test@, etc.)
 * 3. Real-time DNS MX record resolution via DNS-over-HTTPS (DoH) to check active mail routing
 * 4. Sliding-window registration velocity throttling (anti-bot burst)
 * 5. Dynamic multi-type blacklisting (exact email, wildcard domain, IP)
 * 6. Automated risk scoring heuristics & SIEM audit logging
 */

import { BlacklistEntry, BlacklistType, FraudEvaluationResult } from '../types';
import { auditLogger } from './auditLogger';

const STORAGE_BLACKLIST_KEY = 'srs_genie_security_blacklist_v1';
const STORAGE_VELOCITY_KEY = 'srs_genie_reg_velocity_v1';

// Curated list of known disposable, temporary, and burner email services
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.org',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'dispostable.com',
  'trashmail.com',
  'throwawaymail.com',
  'getairmail.com',
  'fakeinbox.com',
  'maildrop.cc',
  'mohmal.com',
  'inboxkitten.com',
  'generator.email',
  'getnada.com',
  'emailondeck.com',
  'dropmail.me',
  'burnermail.io',
  'mytemp.email',
  'tempail.com',
  'nada.ltd',
  'fakemailgenerator.com',
  'crazymailing.com',
  'tempinbox.com',
  'throwaway.com',
  'chacuo.net',
  '0815.ru',
  'mytempmail.com',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'tinypest.com',
  'disposablemail.com',
  'tempmailaddress.com',
  'spambog.com'
]);

// Dummy, placeholder, test, and reserved RFC 2606 domains
const BOGUS_AND_RESERVED_DOMAINS = new Set([
  'fake.com',
  'fake.org',
  'fake.net',
  'dummy.com',
  'dummy.org',
  'dummy.net',
  'test.com',
  'test.org',
  'test.net',
  'testing.com',
  'example.com',
  'example.org',
  'example.net',
  'sample.com',
  'sample.org',
  'placeholder.com',
  'nowhere.com',
  'noemail.com',
  'none.com',
  'invalid',
  'localhost',
  'localdomain',
  'asdf.com',
  'qwerty.com',
  'foo.com',
  'bar.com',
  'baz.com',
  'foobar.com',
  '123.com'
]);

// Obvious placeholder / dummy local-parts (usernames)
const BOGUS_USERNAMES = new Set([
  'fake',
  'dummy',
  'test',
  'tester',
  'testing',
  'sample',
  'asdf',
  'qwerty',
  'nobody',
  'noemail',
  'none',
  'null',
  'void',
  'temp',
  'trash',
  'user',
  'demo',
  'fakeuser',
  'testuser',
  'badactor',
  'spammer',
  'bot'
]);

// Seed baseline blacklisted entries
const BASELINE_BLACKLIST: BlacklistEntry[] = [
  {
    id: 'bl_rule_001',
    type: 'domain',
    value: 'spambot-network.xyz',
    reason: 'Known automated credential stuffing and bot farm network',
    addedAt: '2026-01-01',
    addedBy: 'System Security Sentinel',
    isActive: true
  },
  {
    id: 'bl_rule_002',
    type: 'domain',
    value: 'fraud-specs.ru',
    reason: 'Malicious automated project scraping domain',
    addedAt: '2026-01-05',
    addedBy: 'System Security Sentinel',
    isActive: true
  },
  {
    id: 'bl_rule_003',
    type: 'email',
    value: 'badactor@threat-vector.org',
    reason: 'Chargeback fraud & unauthorized payment probe history',
    addedAt: '2026-01-10',
    addedBy: 'System Security Sentinel',
    isActive: true
  }
];

// Velocity rules: max 3 registrations per 15 minutes per client fingerprint/IP
const VELOCITY_WINDOW_MS = 15 * 60 * 1000;
const MAX_REGISTRATIONS_PER_WINDOW = 3;

class FraudDetectionService {
  private blacklist: BlacklistEntry[] = [];
  private velocityStore: { [fingerprint: string]: number[] } = {};
  private mxCache = new Map<string, { active: boolean; reason?: string; timestamp: number }>();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedBlacklist = localStorage.getItem(STORAGE_BLACKLIST_KEY);
      if (savedBlacklist) {
        this.blacklist = JSON.parse(savedBlacklist);
      } else {
        this.blacklist = [...BASELINE_BLACKLIST];
        this.saveBlacklist();
      }

      const savedVelocity = localStorage.getItem(STORAGE_VELOCITY_KEY);
      if (savedVelocity) {
        this.velocityStore = JSON.parse(savedVelocity);
        this.cleanupVelocityStore();
      }
    } catch (e) {
      this.blacklist = [...BASELINE_BLACKLIST];
    }
  }

  private saveBlacklist() {
    try {
      localStorage.setItem(STORAGE_BLACKLIST_KEY, JSON.stringify(this.blacklist));
    } catch (e) {}
  }

  private saveVelocityStore() {
    try {
      localStorage.setItem(STORAGE_VELOCITY_KEY, JSON.stringify(this.velocityStore));
    } catch (e) {}
  }

  private cleanupVelocityStore() {
    const now = Date.now();
    for (const key of Object.keys(this.velocityStore)) {
      this.velocityStore[key] = this.velocityStore[key].filter(t => now - t < VELOCITY_WINDOW_MS);
      if (this.velocityStore[key].length === 0) {
        delete this.velocityStore[key];
      }
    }
  }

  /**
   * Generates or retrieves a persistent client fingerprint for abuse tracking
   */
  getClientFingerprint(): string {
    try {
      let fp = localStorage.getItem('srs_genie_client_fingerprint_v1');
      if (!fp) {
        const rand = Array.from(crypto.getRandomValues(new Uint8Array(12)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        fp = `fp_${rand}`;
        localStorage.setItem('srs_genie_client_fingerprint_v1', fp);
      }
      return fp;
    } catch (e) {
      return 'fp_anonymous_session';
    }
  }

  /**
   * Checks if an email uses a disposable / temporary burner inbox domain
   */
  isDisposableEmail(email: string): boolean {
    if (!email || !email.includes('@')) return false;
    const domain = email.trim().split('@')[1]?.toLowerCase();
    if (!domain) return false;
    return DISPOSABLE_DOMAINS.has(domain);
  }

  /**
   * Checks if an email is a dummy, test, or placeholder address
   */
  isDummyOrReservedEmail(email: string): { isBogus: boolean; reason?: string } {
    if (!email || !email.includes('@')) return { isBogus: false };
    const parts = email.trim().toLowerCase().split('@');
    const localPart = parts[0];
    const domain = parts[1];

    if (BOGUS_AND_RESERVED_DOMAINS.has(domain)) {
      return {
        isBogus: true,
        reason: `Domain "${domain}" is a reserved or placeholder test domain.`
      };
    }

    if (BOGUS_USERNAMES.has(localPart)) {
      return {
        isBogus: true,
        reason: `Username "${localPart}@" is a generic dummy/test placeholder.`
      };
    }

    // Pattern check: e.g. fake1234@..., test1234@...
    if (/^(fake|dummy|test|asdf|qwerty)[0-9_-]*/.test(localPart) && (domain.length <= 10 || domain.includes('fake') || domain.includes('test'))) {
      return {
        isBogus: true,
        reason: `Placeholder pattern "${localPart}@${domain}" detected.`
      };
    }

    return { isBogus: false };
  }

  /**
   * Verifies domain reachability and active MX routing via DNS-over-HTTPS (DoH)
   */
  async checkDomainMxActive(domain: string): Promise<{ active: boolean; reason?: string; records?: any[] }> {
    if (!domain) return { active: false, reason: 'Invalid domain.' };

    const cleanDomain = domain.trim().toLowerCase();

    // Check memory cache first (1 hour TTL)
    const cached = this.mxCache.get(cleanDomain);
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return { active: cached.active, reason: cached.reason };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      // Query Google Public DNS for MX records
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=MX`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Fallback to active if DNS service itself is unreachable
        return { active: true };
      }

      const data = await response.json();

      // Status 3 = NXDOMAIN (Domain does not exist in public DNS)
      if (data.Status === 3) {
        const result = { active: false, reason: `Domain "${cleanDomain}" does not exist (NXDOMAIN).` };
        this.mxCache.set(cleanDomain, { ...result, timestamp: Date.now() });
        return result;
      }

      // Check if MX records are present in Answer
      const mxRecords = data.Answer ? data.Answer.filter((a: any) => a.type === 15) : [];
      if (mxRecords.length > 0) {
        const result = { active: true, records: mxRecords };
        this.mxCache.set(cleanDomain, { active: true, timestamp: Date.now() });
        return result;
      }

      // If no MX records, check if the domain at least has an A/AAAA record (some legacy mail servers deliver to A)
      const aRecords = data.Answer ? data.Answer.filter((a: any) => a.type === 1 || a.type === 28) : [];
      if (aRecords.length === 0) {
        const result = { active: false, reason: `Domain "${cleanDomain}" has no active Mail Exchange (MX) servers.` };
        this.mxCache.set(cleanDomain, { ...result, timestamp: Date.now() });
        return result;
      }

      return { active: true };
    } catch (e) {
      // If network fails or timeout occurs, do not hard-block legitimate users
      return { active: true };
    }
  }

  /**
   * Calculates local-part entropy and random string heuristics
   */
  private calculateEntropyScore(email: string): number {
    const localPart = email.split('@')[0] || '';
    if (localPart.length < 8) return 0;

    const digits = (localPart.match(/\d/g) || []).length;
    const consonants = (localPart.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
    const ratio = (digits + consonants) / localPart.length;

    if (localPart.length >= 12 && ratio > 0.85) {
      return 35; // Suspiciously generated random email string
    }
    return 0;
  }

  /**
   * Evaluates a prospective registration against all fraud heuristics and denylists (synchronous pass)
   */
  evaluateRegistration(email: string, ip: string = '127.0.0.1', fingerprint?: string): FraudEvaluationResult {
    const normalizedEmail = email.trim().toLowerCase();
    const domain = normalizedEmail.split('@')[1] || '';
    const fp = fingerprint || this.getClientFingerprint();
    const violations: string[] = [];
    let riskScore = 0;

    let isDisposable = false;
    let isBlacklisted = false;
    let isRateLimited = false;
    let isDummyOrReserved = false;
    let blockReason: string | undefined = undefined;

    // 1. Blacklist Check: Exact Email
    const exactMatch = this.blacklist.find(
      b => b.isActive && b.type === 'email' && b.value.toLowerCase() === normalizedEmail
    );
    if (exactMatch) {
      isBlacklisted = true;
      riskScore += 100;
      violations.push(`Blacklisted Email Rule: ${exactMatch.reason}`);
      blockReason = `Access denied: This email address has been administratively blacklisted. (${exactMatch.reason})`;
    }

    // 2. Blacklist Check: Domain / Wildcard
    if (!isBlacklisted && domain) {
      const domainMatch = this.blacklist.find(b => {
        if (!b.isActive || b.type !== 'domain') return false;
        const pattern = b.value.toLowerCase().replace(/^\*\./, '');
        return domain === pattern || domain.endsWith(`.${pattern}`);
      });
      if (domainMatch) {
        isBlacklisted = true;
        riskScore += 100;
        violations.push(`Blacklisted Domain Rule: ${domainMatch.value} (${domainMatch.reason})`);
        blockReason = `Access denied: Domain "${domain}" has been administratively blacklisted.`;
      }
    }

    // 3. Blacklist Check: IP Address
    if (!isBlacklisted && ip) {
      const ipMatch = this.blacklist.find(
        b => b.isActive && b.type === 'ip' && b.value === ip
      );
      if (ipMatch) {
        isBlacklisted = true;
        riskScore += 100;
        violations.push(`Blacklisted IP Address: ${ipMatch.value}`);
        blockReason = `Access denied: Registration from this network address is blocked.`;
      }
    }

    // 4. Dummy / Placeholder / Reserved Domain & Username Check
    const bogusCheck = this.isDummyOrReservedEmail(normalizedEmail);
    if (bogusCheck.isBogus) {
      isDummyOrReserved = true;
      riskScore += 95;
      violations.push(`Placeholder / Dummy Identity (${bogusCheck.reason})`);
      if (!blockReason) {
        blockReason = `Dummy, placeholder, and test email addresses (such as ${normalizedEmail}) are strictly prohibited.`;
      }
    }

    // 5. Disposable / Burner Email Check
    if (this.isDisposableEmail(normalizedEmail)) {
      isDisposable = true;
      riskScore += 85;
      violations.push(`Disposable / Temporary Email Provider (${domain})`);
      if (!blockReason) {
        blockReason = 'Disposable and temporary burner email addresses are strictly prohibited for SaaS compliance.';
      }
    }

    // 6. Registration Velocity Limiter
    this.cleanupVelocityStore();
    const history = this.velocityStore[fp] || [];
    if (history.length >= MAX_REGISTRATIONS_PER_WINDOW) {
      isRateLimited = true;
      riskScore += 80;
      violations.push(`Registration burst velocity exceeded (${history.length} accounts in 15 mins)`);
      if (!blockReason) {
        blockReason = 'Registration velocity limit exceeded. Please wait 15 minutes before creating another account.';
      }
    }

    // 7. Entropy & Pattern Heuristics
    const entropyRisk = this.calculateEntropyScore(normalizedEmail);
    if (entropyRisk > 0) {
      riskScore += entropyRisk;
      violations.push('High-entropy randomized username pattern detected');
    }

    const allowed = riskScore < 70 && !isBlacklisted && !isDisposable && !isRateLimited && !isDummyOrReserved;

    // 8. Audit Logging on Violation
    if (!allowed) {
      const actionType = isBlacklisted
        ? 'auth.fraud.blacklisted_attempt'
        : isDummyOrReserved
        ? 'auth.fraud.dummy_email_blocked'
        : isDisposable
        ? 'auth.fraud.disposable_email_blocked'
        : isRateLimited
        ? 'auth.fraud.velocity_limit_exceeded'
        : 'auth.fraud.risk_score_exceeded';

      auditLogger.log({
        action: actionType,
        status: 'DENIED',
        actorEmail: normalizedEmail,
        ipAddress: ip,
        details: {
          riskScore,
          blockReason,
          violations,
          domain,
          fingerprint: fp
        }
      });
    }

    return {
      allowed,
      riskScore: Math.min(100, riskScore),
      reason: blockReason,
      violations,
      isDisposable,
      isBlacklisted,
      isRateLimited,
      isDummyOrReserved
    };
  }

  /**
   * Complete asynchronous evaluation with live DNS MX verification
   */
  async evaluateRegistrationAsync(email: string, ip: string = '127.0.0.1', fingerprint?: string): Promise<FraudEvaluationResult> {
    const syncResult = this.evaluateRegistration(email, ip, fingerprint);
    if (!syncResult.allowed) {
      return syncResult;
    }

    const domain = email.trim().toLowerCase().split('@')[1];
    if (domain) {
      const mxResult = await this.checkDomainMxActive(domain);
      if (!mxResult.active) {
        const violations = [...syncResult.violations, `Inactive Mail Server: ${mxResult.reason}`];
        const blockReason = mxResult.reason || `Domain "${domain}" has no active Mail Exchange (MX) records.`;

        auditLogger.log({
          action: 'auth.fraud.dead_mx_domain_blocked',
          status: 'DENIED',
          actorEmail: email,
          details: {
            domain,
            reason: blockReason
          }
        });

        return {
          ...syncResult,
          allowed: false,
          riskScore: 90,
          reason: blockReason,
          violations,
          mxActive: false
        };
      }
    }

    return { ...syncResult, mxActive: true };
  }

  /**
   * Records a successful registration to track velocity windows
   */
  recordRegistrationSuccess(fingerprint?: string) {
    const fp = fingerprint || this.getClientFingerprint();
    const now = Date.now();
    const list = this.velocityStore[fp] || [];
    list.push(now);
    this.velocityStore[fp] = list;
    this.saveVelocityStore();
  }

  // --- BLACKLIST CRUD & MANAGEMENT ---

  getBlacklist(): BlacklistEntry[] {
    return [...this.blacklist];
  }

  addBlacklistEntry(params: {
    type: BlacklistType;
    value: string;
    reason: string;
    addedBy?: string;
  }): BlacklistEntry {
    const cleanValue = params.value.trim().toLowerCase();
    const newEntry: BlacklistEntry = {
      id: `bl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: params.type,
      value: cleanValue,
      reason: params.reason.trim(),
      addedAt: new Date().toISOString().split('T')[0],
      addedBy: params.addedBy || 'Security Administrator',
      isActive: true
    };

    this.blacklist = this.blacklist.filter(
      b => !(b.type === newEntry.type && b.value === cleanValue)
    );
    this.blacklist = [newEntry, ...this.blacklist];
    this.saveBlacklist();

    auditLogger.log({
      action: 'security.blacklist.rule_added',
      status: 'SUCCESS',
      details: {
        ruleId: newEntry.id,
        type: newEntry.type,
        value: newEntry.value,
        reason: newEntry.reason
      }
    });

    return newEntry;
  }

  removeBlacklistEntry(id: string): boolean {
    const target = this.blacklist.find(b => b.id === id);
    const initial = this.blacklist.length;
    this.blacklist = this.blacklist.filter(b => b.id !== id);
    this.saveBlacklist();

    if (this.blacklist.length < initial) {
      auditLogger.log({
        action: 'security.blacklist.rule_removed',
        status: 'SUCCESS',
        details: { ruleId: id, value: target?.value, type: target?.type }
      });
      return true;
    }
    return false;
  }

  toggleBlacklistEntry(id: string): boolean {
    const entry = this.blacklist.find(b => b.id === id);
    if (!entry) return false;
    entry.isActive = !entry.isActive;
    this.saveBlacklist();

    auditLogger.log({
      action: 'security.blacklist.rule_toggled',
      status: 'SUCCESS',
      details: { ruleId: id, value: entry.value, isActive: entry.isActive }
    });
    return entry.isActive;
  }

  /**
   * Fast check for login authorization
   */
  isLoginBlocked(email: string): { blocked: boolean; reason?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const domain = normalizedEmail.split('@')[1] || '';

    const exactMatch = this.blacklist.find(
      b => b.isActive && b.type === 'email' && b.value.toLowerCase() === normalizedEmail
    );
    if (exactMatch) {
      return { blocked: true, reason: `Account blacklisted: ${exactMatch.reason}` };
    }

    if (domain) {
      const domainMatch = this.blacklist.find(b => {
        if (!b.isActive || b.type !== 'domain') return false;
        const pattern = b.value.toLowerCase().replace(/^\*\./, '');
        return domain === pattern || domain.endsWith(`.${pattern}`);
      });
      if (domainMatch) {
        return { blocked: true, reason: `Domain blacklisted: ${domainMatch.value}` };
      }
    }

    return { blocked: false };
  }

  getMetrics() {
    const totalRules = this.blacklist.length;
    const activeRules = this.blacklist.filter(b => b.isActive).length;
    const disposableCount = DISPOSABLE_DOMAINS.size;
    const reservedCount = BOGUS_AND_RESERVED_DOMAINS.size;
    return {
      totalRules,
      activeRules,
      disposableCount,
      reservedCount,
      velocityLimit: MAX_REGISTRATIONS_PER_WINDOW,
      velocityWindowMins: VELOCITY_WINDOW_MS / 60000
    };
  }
}

export const fraudDetectionService = new FraudDetectionService();
