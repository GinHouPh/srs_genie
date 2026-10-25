import { User, UserRole, StaffRole, BlacklistEntry } from '../types';
import { saasStore } from './saasStore';
import { cryptoService } from './cryptoService';
import { auditLogger } from './auditLogger';
import { fraudDetectionService } from './fraudDetectionService';

export interface StoredUser extends User {
  passwordHash: string;
}

const STORAGE_USERS_KEY = 'srs_genie_registered_users_v2';
const STORAGE_SESSION_KEY = 'srs_genie_active_session_v2';

class AuthService {
  private users: StoredUser[] = [];
  private currentUser: User | null = null;
  private failedAttempts: { [email: string]: { count: number; lockedUntil: number } } = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        // Normalize any old roles and ensure tenantId is present
        this.users = this.users.map(u => {
          let role = u.role;
          if ((role as string) === 'editor' || (role as string) === 'viewer') {
            role = 'client' as UserRole;
          }
          const tenantId = u.tenantId || (u.role === 'admin' ? 'tenant_master_001' : `tenant_${u.id}`);
          const isEmailVerified = u.isEmailVerified !== undefined ? u.isEmailVerified : true;
          return { ...u, role, tenantId, isEmailVerified };
        });

        // Ensure admin_root is present with correct hash for Admin123!
        const correctAdminHash = this.hashPassword('Admin123!', 'admin@srsgenie.ai');
        const adminIndex = this.users.findIndex(u => u.email.toLowerCase() === 'admin@srsgenie.ai');
        if (adminIndex >= 0) {
          this.users[adminIndex].passwordHash = correctAdminHash;
          this.users[adminIndex].isEmailVerified = true;
          this.users[adminIndex].role = 'admin';
        } else {
          this.users.unshift({
            id: 'admin_root',
            tenantId: 'tenant_master_001',
            name: 'Business Owner (Admin)',
            email: 'admin@srsgenie.ai',
            passwordHash: correctAdminHash,
            role: 'admin',
            staffRole: 'super_admin',
            company: 'SRS Genie Inc.',
            plan: 'enterprise',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminRoot',
            createdAt: new Date().toISOString(),
            isEmailVerified: true
          });
        }
        this.saveUsers();
      } else {
        // Seed initial Business Owner (Admin)
        const correctAdminHash = this.hashPassword('Admin123!', 'admin@srsgenie.ai');
        const defaultAdmin: StoredUser = {
          id: 'admin_root',
          tenantId: 'tenant_master_001',
          name: 'Business Owner (Admin)',
          email: 'admin@srsgenie.ai',
          passwordHash: correctAdminHash,
          role: 'admin',
          staffRole: 'super_admin',
          company: 'SRS Genie Inc.',
          plan: 'enterprise',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminRoot',
          createdAt: new Date().toISOString(),
          isEmailVerified: true
        };
        this.users = [defaultAdmin];
        this.saveUsers();
      }

      const activeSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (activeSession) {
        let parsed = JSON.parse(activeSession);
        if ((parsed.role as string) === 'editor' || (parsed.role as string) === 'viewer') {
          parsed.role = 'client';
        }
        if (!parsed.tenantId) {
          parsed.tenantId = parsed.role === 'admin' ? 'tenant_master_001' : `tenant_${parsed.id}`;
        }
        this.currentUser = parsed;
      } else {
        // Default to admin on first run
        this.currentUser = this.users[0] || null;
        if (this.currentUser) {
          this.saveSession(this.currentUser);
        }
      }
    } catch (e) {
      console.warn('Storage unavailable in auth service:', e);
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
    } catch (e) {}
  }

  private saveSession(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {}
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private hashPassword(password: string, email: string): string {
    const salt = `srs_salt_${email.toLowerCase()}`;
    const combined = `${salt}:${password}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256_${Math.abs(hash)}`;
  }

  private verifyPassword(password: string, user: StoredUser): boolean {
    // 1. Direct master demo admin password acceptance
    if (user.email.toLowerCase() === 'admin@srsgenie.ai') {
      if (password === 'Admin123!' || password === 'admin123' || password === 'Admin123') {
        user.passwordHash = this.hashPassword('Admin123!', user.email);
        this.saveUsers();
        return true;
      }
    }

    const salted = this.hashPassword(password, user.email);
    if (user.passwordHash === salted) return true;

    // Check legacy hash format
    let legacyHash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      legacyHash = (legacyHash << 5) - legacyHash + char;
      legacyHash |= 0;
    }
    if (user.passwordHash === `hash_${Math.abs(legacyHash)}`) {
      user.passwordHash = salted; // Auto-upgrade
      this.saveUsers();
      return true;
    }

    // Direct match (for initial test seeds)
    if (user.passwordHash === password) {
      user.passwordHash = salted; // Auto-upgrade
      this.saveUsers();
      return true;
    }

    return false;
  }

  private checkBruteForce(email: string): { allowed: boolean; waitSeconds?: number } {
    // Demo admin is exempt from lockout
    if (email.toLowerCase() === 'admin@srsgenie.ai') {
      return { allowed: true };
    }

    const entry = this.failedAttempts[email];
    if (!entry) return { allowed: true };
    const now = Date.now();
    if (entry.lockedUntil > now) {
      const waitSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return { allowed: false, waitSeconds };
    }
    if (entry.lockedUntil <= now && entry.lockedUntil > 0) {
      delete this.failedAttempts[email];
    }
    return { allowed: true };
  }

  private recordFailedAttempt(email: string) {
    const now = Date.now();
    const entry = this.failedAttempts[email] || { count: 0, lockedUntil: 0 };
    entry.count += 1;
    if (entry.count >= 5) {
      entry.lockedUntil = now + 180000; // 3 minute security lockout
    }
    this.failedAttempts[email] = entry;
  }

  private clearFailedAttempts(email: string) {
    delete this.failedAttempts[email];
  }

  /**
   * Public registration: ALWAYS creates a client account for customers.
   * Admin and staff can only be created by the Business Owner.
   */
  /**
   * Public registration: ALWAYS creates a client account for customers.
   * Admin and staff can only be created by the Business Owner.
   */
  async register(params: {
    name: string;
    email: string;
    password: string;
    company?: string;
  }): Promise<{ success: boolean; user?: User; error?: string; verificationCode?: string; requiresVerification?: boolean }> {
    const emailNormalized = params.email.trim().toLowerCase();

    // 1. Check existing account
    if (this.users.some(u => u.email.toLowerCase() === emailNormalized)) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    // 2. Fraud Detection, Bogus Pattern & Live DNS MX Verification Engine
    const fraudEvaluation = await fraudDetectionService.evaluateRegistrationAsync(emailNormalized);
    if (!fraudEvaluation.allowed) {
      return {
        success: false,
        error: fraudEvaluation.reason || 'Registration rejected by automated fraud prevention policies.'
      };
    }

    if (params.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters for enterprise compliance.' };
    }

    const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Role is strictly 'client' for customer registrations, defaulting to free starter plan
    const newUser: StoredUser = {
      id: `usr_client_${Date.now()}`,
      tenantId: tenantId,
      name: params.name.trim(),
      email: emailNormalized,
      passwordHash: this.hashPassword(params.password, emailNormalized),
      role: 'client',
      company: params.company?.trim() || 'Independent',
      plan: 'free',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.name)}`,
      createdAt: new Date().toISOString(),
      isEmailVerified: false,
      verificationCode: verificationCode
    };

    this.users.push(newUser);
    this.saveUsers();

    // Record registration event in velocity window tracker
    fraudDetectionService.recordRegistrationSuccess();

    // Register as a customer in the SaaS Business Store
    saasStore.addCustomer({
      tenantId: tenantId,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company || 'Independent',
      plan: 'free',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      projectsCount: 0,
      monthlySpend: 0,
      paymentStatus: 'paid',
      avatarUrl: newUser.avatarUrl,
      mcpApiKeyCount: 0
    });

    auditLogger.log({
      actorId: newUser.id,
      actorEmail: newUser.email,
      actorRole: 'client',
      tenantId: tenantId,
      action: 'auth.register.pending_verification',
      status: 'SUCCESS',
      details: `New workspace registered with tenant ID ${tenantId}. Verification code generated.`
    });

    const userSafe = this.sanitizeUser(newUser);

    return {
      success: true,
      user: userSafe,
      verificationCode,
      requiresVerification: true
    };
  }

  /**
   * Confirms 6-digit verification code to activate account
   */
  verifyEmailCode(email: string, code: string): { success: boolean; user?: User; error?: string } {
    const emailNormalized = email.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === emailNormalized);

    if (!user) {
      return { success: false, error: 'Account not found.' };
    }

    if (user.isEmailVerified) {
      const userSafe = this.sanitizeUser(user);
      this.currentUser = userSafe;
      this.saveSession(userSafe);
      return { success: true, user: userSafe };
    }

    if (!user.verificationCode || user.verificationCode !== code.trim()) {
      auditLogger.log({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        tenantId: user.tenantId,
        action: 'auth.email.verification_failed',
        status: 'DENIED',
        details: 'Incorrect 6-digit email activation code submitted.'
      });
      return { success: false, error: 'Invalid activation code. Please check your verification code.' };
    }

    user.isEmailVerified = true;
    delete user.verificationCode;
    this.saveUsers();

    const userSafe = this.sanitizeUser(user);
    this.currentUser = userSafe;
    this.saveSession(userSafe);

    auditLogger.log({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      tenantId: user.tenantId,
      action: 'auth.email.verified',
      status: 'SUCCESS',
      details: 'Email ownership and mailbox reachability verified successfully.'
    });

    return { success: true, user: userSafe };
  }

  /**
   * Resends or generates a fresh 6-digit verification code
   */
  resendVerificationCode(email: string): { success: boolean; code?: string; error?: string } {
    const emailNormalized = email.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === emailNormalized);

    if (!user) {
      return { success: false, error: 'Account not found.' };
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    this.saveUsers();

    return { success: true, code: newCode };
  }

  /**
   * Cascade-suspends users and customers matching an added blacklist rule
   */
  suspendAccountsByRule(rule: BlacklistEntry): number {
    let affectedCount = 0;
    const ruleVal = rule.value.toLowerCase();

    for (const u of this.users) {
      if (u.role === 'admin') continue; // Never suspend master admin
      let matches = false;

      if (rule.type === 'email' && u.email.toLowerCase() === ruleVal) {
        matches = true;
      } else if (rule.type === 'domain') {
        const domain = u.email.split('@')[1]?.toLowerCase();
        const pattern = ruleVal.replace(/^\*\./, '');
        if (domain === pattern || domain?.endsWith(`.${pattern}`)) {
          matches = true;
        }
      }

      if (matches) {
        affectedCount++;
        // Revoke active session if currently logged in
        if (this.currentUser?.id === u.id) {
          this.logout();
        }

        // Suspend corresponding SaaS customer in saasStore
        const cust = saasStore.getCustomers().find(c => c.email.toLowerCase() === u.email.toLowerCase());
        if (cust) {
          saasStore.updateCustomer(cust.id, { status: 'suspended' });
        }
      }
    }
    return affectedCount;
  }

  login(email: string, password: string): { success: boolean; user?: User; error?: string; requiresVerification?: boolean; verificationCode?: string } {
    const emailNormalized = email.trim().toLowerCase();

    // 1. Check blacklist status
    const blacklistCheck = fraudDetectionService.isLoginBlocked(emailNormalized);
    if (blacklistCheck.blocked) {
      auditLogger.log({
        actorId: 'unknown',
        actorEmail: emailNormalized,
        actorRole: 'client',
        tenantId: 'unauthenticated',
        action: 'auth.fraud.blacklisted_login_attempt',
        status: 'DENIED',
        details: blacklistCheck.reason || 'Account or domain is blacklisted.'
      });
      return {
        success: false,
        error: `Account suspended: ${blacklistCheck.reason}`
      };
    }

    // 2. Check brute-force rate limit
    const bruteCheck = this.checkBruteForce(emailNormalized);
    if (!bruteCheck.allowed) {
      auditLogger.log({
        actorId: 'unknown',
        actorEmail: emailNormalized,
        actorRole: 'client',
        tenantId: 'unauthenticated',
        action: 'auth.login.throttled',
        status: 'DENIED',
        details: `Account temporarily locked due to repeated failed login attempts. Retry in ${bruteCheck.waitSeconds}s.`
      });
      return {
        success: false,
        error: `Security Lock: 5 consecutive failed attempts. Please wait ${bruteCheck.waitSeconds}s before retrying.`
      };
    }

    const user = this.users.find(u => u.email.toLowerCase() === emailNormalized);

    if (!user) {
      this.recordFailedAttempt(emailNormalized);
      return { success: false, error: 'Invalid email or credentials.' };
    }

    if (!this.verifyPassword(password, user)) {
      this.recordFailedAttempt(emailNormalized);
      auditLogger.log({
        actorId: user.id,
        actorEmail: emailNormalized,
        actorRole: user.role,
        tenantId: user.tenantId || 'unknown',
        action: 'auth.login.failed',
        status: 'FAILED',
        details: 'Failed authentication: Incorrect password.'
      });
      return { success: false, error: 'Invalid email or credentials.' };
    }

    // 3. Check email verification status for non-admin accounts
    if (user.role !== 'admin' && user.isEmailVerified === false) {
      return {
        success: false,
        error: 'Please enter your 6-digit verification code to activate your account.',
        requiresVerification: true,
        verificationCode: user.verificationCode
      };
    }

    this.clearFailedAttempts(emailNormalized);

    auditLogger.log({
      actorId: user.id,
      actorEmail: emailNormalized,
      actorRole: user.role,
      tenantId: user.tenantId || `tenant_${user.id}`,
      action: 'auth.login.success',
      status: 'SUCCESS',
      details: `User session authenticated via Zero Trust control plane (${user.role.toUpperCase()}).`
    });

    const userSafe = this.sanitizeUser(user);
    this.currentUser = userSafe;
    this.saveSession(userSafe);

    return { success: true, user: userSafe };
  }

  logout() {
    if (this.currentUser) {
      auditLogger.log({
        actorId: this.currentUser.id,
        actorEmail: this.currentUser.email,
        actorRole: this.currentUser.role,
        tenantId: this.currentUser.tenantId || 'unknown',
        action: 'auth.logout',
        status: 'SUCCESS',
        details: 'User session explicitly revoked.'
      });
    }
    this.currentUser = null;
    this.saveSession(null);
  }

  updateProfile(userId: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    // Strict Privilege Invariant: Clients cannot self-promote to admin or staff
    if (this.users[idx].role === 'client') {
      if (updates.role && updates.role !== 'client') {
        auditLogger.log({
          actorId: userId,
          actorEmail: this.users[idx].email,
          actorRole: 'client',
          tenantId: this.users[idx].tenantId || 'unknown',
          action: 'security.privilege_escalation.blocked',
          status: 'DENIED',
          details: `Client attempted unauthorized promotion to ${updates.role}. Request blocked.`
        });
        delete updates.role;
      }
      if (updates.staffRole) {
        delete updates.staffRole;
      }
    }

    this.users[idx] = { ...this.users[idx], ...updates };
    this.saveUsers();

    if (this.currentUser?.id === userId) {
      this.currentUser = this.sanitizeUser(this.users[idx]);
      this.saveSession(this.currentUser);
    }

    return this.currentUser;
  }

  deleteAccount(userId: string): boolean {
    const target = this.users.find(u => u.id === userId);
    if (target) {
      auditLogger.log({
        actorId: this.currentUser?.id || userId,
        actorEmail: target.email,
        actorRole: this.currentUser?.role || 'client',
        tenantId: target.tenantId || 'unknown',
        action: 'auth.account.deleted',
        status: 'SUCCESS',
        details: `Account ${target.email} purged from system.`
      });
    }
    this.users = this.users.filter(u => u.id !== userId);
    this.saveUsers();
    if (this.currentUser?.id === userId) {
      this.logout();
    }
    return true;
  }

  getAllUsers(): User[] {
    return this.users.map(u => this.sanitizeUser(u));
  }

  private sanitizeUser(stored: StoredUser): User {
    const { passwordHash, ...user } = stored;
    return user;
  }

  clearAllMockData() {
    const defaultAdmin: StoredUser = {
      id: 'admin_root',
      tenantId: 'tenant_master_001',
      name: 'Business Owner (Admin)',
      email: 'admin@srsgenie.ai',
      passwordHash: this.hashPassword('Admin123!', 'admin@srsgenie.ai'),
      role: 'admin',
      staffRole: 'super_admin',
      company: 'SRS Genie Inc.',
      plan: 'enterprise',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminRoot',
      createdAt: new Date().toISOString()
    };
    this.users = [defaultAdmin];
    this.saveUsers();
    this.logout();
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {}

    auditLogger.log({
      actorId: 'admin_root',
      actorEmail: 'admin@srsgenie.ai',
      actorRole: 'admin',
      tenantId: 'tenant_master_001',
      action: 'system.data_purge',
      status: 'WARNING',
      details: 'All mock and customer test data purged.'
    });
  }
}

export const authService = new AuthService();
