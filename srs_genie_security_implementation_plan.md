# SRS Genie — Enterprise SaaS Security Implementation Plan & Engineering Roadmap

**Document Type:** Technical Security Specification & Implementation Plan  
**Target System:** SRS Genie (AI Documentation & Multi-Agent MCP Specification Platform)  
**Standard Alignment:** OWASP ASVS v4.0, OWASP API Security Top 10, SOC 2 Type II, ISO/IEC 27001, PCI-DSS Level 1 (Cashfree PG)  
**Classification:** Confidential — Internal Engineering Document  
**Version:** 1.0.0  

---

## 1. System Context & Environment Profile

Based on Section 24 of the [Enterprise SaaS Security Plan](file:///d:/PROJECTS/srs_genie/security_implementation_plan.md), the target deployment environment for SRS Genie is formalized below:

| Dimension | Specification | Implementation Rationale |
| :--- | :--- | :--- |
| **Product Purpose** | AI Specification Suite Generator & MCP Server | Generates 22-tier technical `.specs` and serves them to Cursor/Windsurf agents. |
| **Backend** | Node.js (v20+ LTS) / Express / TypeScript + MCP Gateway (`mcp/server.mjs`) | Handles project compilation, Cashfree order sessions, and MCP tool execution. |
| **Frontend** | React 19 / TypeScript / Vite | Single Page Application styled with Agape tokens (`#0c0c0c` ink, `#d90429` accent). |
| **Mobile / Extension** | None (Planned VS Code / Cursor IDE Extension) | Local agent integration via Stdio & SSE MCP transport. |
| **Database** | PostgreSQL 16 + Redis (Caching & Rate Limiting) | Relational schema with Row-Level Security (RLS) for tenant isolation. |
| **Cloud Hosting** | Containerized (Docker) on AWS ECS / Azure Container Apps / GCP Cloud Run | Isolated private VPC with Cloudflare edge WAF & CDN. |
| **Tenant Model** | Shared Database with Schema Row-Level Security (RLS) | High-performance multi-tenancy enforcing `tenant_id` on every query. |
| **Identity Provider** | JWT (RS256) + Argon2id / WebAuthn MFA; Optional OIDC/SAML | Self-hosted core with enterprise federation hooks. |
| **Payment Gateway** | Cashfree PG (PCI-DSS Level 1 compliant) | Hosted Checkout + Server-to-Server HMAC-SHA256 Webhook verification. |
| **AI Providers** | Google Gemini, Anthropic Claude, OpenAI, DeepSeek, Local Ollama | Centralized key management and client prompt injection firewalls. |
| **Current Stage** | Transitioning from Staging MVP to Production Multi-Tenant SaaS | Hardening storage, token lifecycles, and agent communication. |
| **Compliance Goals** | SOC 2 Type II, ISO 27001, OWASP ASVS Level 2 | Required for B2B engineering teams storing proprietary product designs. |

---

## 2. Threat Model & Risk Analysis (STRIDE)

| Threat Category | Target in SRS Genie | Potential Vector | Specific Mitigation |
| :--- | :--- | :--- | :--- |
| **Spoofing** | MCP Agent Connection | External actor guesses or steals an MCP API token | Cryptographically random `srs_mcp_live_` tokens with SHA-256 database hashing and instant revocation. |
| **Tampering** | 22-File `.specs` Suite | Malicious client alters project parameters to inject code into output | Strict JSON Schema validation on `SRSFormData`, parameterized file generators, and AST verification. |
| **Repudiation** | Plan Modifications / Billing | Admin or staff claims they didn't delete customer data | Immutable audit log store capturing `actor_id`, `actor_role`, `timestamp`, `action`, and `ip_fingerprint`. |
| **Information Disclosure** | Cross-Tenant Data Access | Client B changes `projectId` in API URL to read Client A's `.specs` | PostgreSQL Row-Level Security (RLS) + server-side middleware validating `project.tenant_id === context.tenant_id`. |
| **Denial of Service** | AI Synthesis Engine | Bot submits massive questionnaires to exhaust Gemini / Claude tokens | Redis sliding-window rate limiting, captcha on unauthenticated flows, quota verification prior to LLM dispatch. |
| **Elevation of Privilege** | User to Super Admin | Client modifies JWT payload or sends `role: 'admin'` in profile update | Asymmetric RS256 token verification; server strictly ignores role fields in client update requests. |

---

## 3. Implementation Plan: Phased Engineering Roadmap

```
+---------------------------------------------------------------------------------+
| Phase 1 (P0): Core IAM, Auth Hardening & Secrets Isolation (Weeks 1 - 2)        |
+---------------------------------------------------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
| Phase 2 (P0): Multi-Tenant PostgreSQL RLS & Storage Hardening (Weeks 3 - 4)    |
+---------------------------------------------------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
| Phase 3 (P0): API Protection, Cashfree PG Hardening & MCP Shield (Weeks 5 - 6)  |
+---------------------------------------------------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
| Phase 4 (P1): Audit Logging, Telemetry & Security Operations (Weeks 7 - 8)      |
+---------------------------------------------------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
| Phase 5 (P1/P2): CI/CD DevSecOps, Vulnerability Mgmt & SOC 2 Audit Readiness    |
+---------------------------------------------------------------------------------+
```

---

### Phase 1: Identity, Authentication & Privilege Hardening (Priority: P0)
**Duration:** Weeks 1 – 2  
**Lead:** Backend / Security Engineer  

#### 1.1 Secure Authentication & Password Storage
* **Argon2id Migration**: Transition from basic client-side hashing to server-side Argon2id (`memoryCost: 65536, timeCost: 3, parallelism: 4`).
* **Session & Token Architecture**:
  * Implement short-lived Access Tokens (15-minute expiration) signed with asymmetric **RS256** keys.
  * Implement revolving Refresh Tokens (7-day validity) stored in `HttpOnly, Secure, SameSite=Strict` cookies.
  * Enable automatic token family reuse detection (instant revocation if a refresh token is used twice).
* **Multi-Factor Authentication (MFA)**:
  * Mandatory TOTP (Google Authenticator / 1Password) for all accounts with role `admin` or `staff`.
  * Optional TOTP for client accounts; backup codes hashed with SHA-256.

#### 1.2 Administrative Role Segregation & Executive Privilege Guard
* **Role Invariants**: Enforce server-side check that prevents clients from updating their own `role`, `staffRole`, or `plan`.
* **Break-Glass Emergency Protocol**: Documented split-knowledge emergency recovery credentials stored in an encrypted vault with dual-custody access.

---

### Phase 2: Multi-Tenant Isolation & Database RLS (Priority: P0)
**Duration:** Weeks 3 – 4  
**Lead:** Database Architect / Backend Engineer  

#### 2.1 PostgreSQL Row-Level Security (RLS) Implementation
All tables (`projects`, `spec_files`, `mcp_keys`, `invoices`, `transactions`, `audit_logs`) must include `tenant_id UUID NOT NULL`.

```sql
-- Production RLS enforcement for SRS Genie
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON projects
FOR ALL
USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID)
WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
```

#### 2.2 Connection Pool Tenant Sanitization
* On every database checkout from connection pool (e.g. pgpool / Prisma / Kysely), execute:
  `SET LOCAL app.current_tenant_id = '<validated_tenant_id>'` inside an explicit transaction.
* Clear session variables on connection release to prevent cross-tenant data leakage.

#### 2.3 Object Storage Isolation (`.specs` ZIP Downloads)
* Move generated ZIP bundles from browser memory to private S3/R2 buckets.
* Bucket key pattern: `tenants/{tenant_id}/projects/{project_id}/specs-suite.zip`.
* Downloads served strictly via **Pre-Signed URLs** with a maximum 60-second TTL.

---

### Phase 3: API Security, Cashfree PG & MCP Agent Armor (Priority: P0)
**Duration:** Weeks 5 – 6  
**Lead:** API & Integrations Engineer  

#### 3.1 Cashfree Payment Gateway Hardening
* **HMAC-SHA256 Webhook Verification**:
  * Verify `x-webhook-signature` using the Cashfree Secret Key before processing any payment status update.
  * Reject payloads with timestamps older than 300 seconds to prevent replay attacks.
  * Store webhook logs in `payment_webhooks` with idempotent order deduplication.
* **Secrets Governance**:
  * Move `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY` from client-accessible configs into backend AWS Secrets Manager / Azure Key Vault.

#### 3.2 MCP (Model Context Protocol) Server Security (`mcp/server.mjs`)
* **Hashed Token Authentication**:
  * Replace plain-text MCP token checks with hashed lookup: `token_hash = sha256(raw_token)`.
  * Validate that the token is active, belongs to the project, and has not exceeded its hourly tool quota.
* **Tool Input Sanitization**:
  * In tools `read_spec` and `search_specs`, strictly validate path traversal attempts (disallow `../`, `..\\`, null bytes).
  * Path whitelist: Files must strictly resolve inside the designated project's `.specs/` hierarchy.
* **Agent Rate Limiting**: Limit external tools to 120 invocations per minute per active key.

#### 3.3 AI Model Provider Prompt Defense
* **Prompt Injection Defense**: Sanitize user inputs in `WizardForm` before forwarding to Gemini, Claude, or OpenAI.
* **Key Encryption at Rest**: Encrypt user-supplied provider API keys in the database using **AES-256-GCM** with a master key derived from Cloud KMS.

---

### Phase 4: Audit Logging, SIEM & Security Telemetry (Priority: P1)
**Duration:** Weeks 7 – 8  
**Lead:** DevOps / SRE  

#### 4.1 Canonical Audit Event Schema
Implement a centralized logger emitting structured JSON events for all sensitive actions:

```typescript
export interface SecurityAuditEvent {
  eventId: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  actorRole: 'admin' | 'staff' | 'client' | 'mcp_agent';
  tenantId: string;
  action: 'auth.login' | 'project.generate' | 'plan.customized' | 'mcp.key_created' | 'invoice.issued' | 'security.violation';
  resourceId?: string;
  resourceType?: string;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}
```

#### 4.2 Immutable Log Storage & Security Alerts
* Ship audit logs directly to CloudWatch / Datadog / Elasticsearch with write-once (WORM) retention.
* Configure real-time alerts for:
  * 5+ failed login attempts within 10 minutes from a single IP.
  * Any attempt to access a project belonging to a different tenant.
  * Manual tampering with Cashfree webhook payloads.
  * Sudden spike in LLM token consumption (> 200,000 tokens in 5 minutes).

---

### Phase 5: Backup, Disaster Recovery & DevSecOps CI/CD (Priority: P1)
**Duration:** Weeks 9 – 10  
**Lead:** DevOps / Security Lead  

#### 5.1 Backup & RPO/RTO Targets
* **Database RPO**: 5 minutes (via automated WAL archiving / Point-in-Time Recovery).
* **Database RTO**: < 1 hour (automated failover to standby replica).
* **Backup Immutability**: Weekly full backups archived to an AWS S3 bucket with Object Lock (Legal Hold enabled).
* **Drill Requirement**: Conduct bi-annual database restoration rehearsals.

#### 5.2 CI/CD Automated Security Gates
Add the following checks to the GitHub Actions deployment pipeline:
* **Gitleaks / Trufflehog**: Block pull requests containing hardcoded API keys or credentials.
* **Semgrep (SAST)**: Enforce OWASP Top 10 rules on all TypeScript and Node.js code.
* **Trivy / OSV-Scanner**: Block deployments with high or critical CVEs in `npm` dependencies or Docker base images.
* **Automated Tenant Isolation Tests**: Unit test suite that attempts cross-tenant reads and asserts HTTP 403 / zero rows returned.

---

### Phase 6: Fraud Account Creation Detection, Anti-Abuse & Dynamic Blacklisting (Priority: P0)
**Duration:** Weeks 11 – 12  
**Lead:** Security Engineer / Fullstack Architect  

#### 6.1 Disposable & Burner Email Engine
* Maintain a curated denylist of 50+ known disposable, throwaway, and burner email inbox domains (`mailinator.com`, `tempmail.com`, `10minutemail.com`, `guerrillamail.com`, `yopmail.com`, `sharklasers.com`, `dispostable.com`, `fakeinbox.com`, etc.).
* Immediately reject registration attempts utilizing disposable inboxes with error `Registration rejected: Disposable email addresses are prohibited`.
* Emit high-severity security audit event: `auth.fraud.disposable_email_blocked`.

#### 6.2 Registration Velocity & Burst Throttling
* Implement client session fingerprinting and IP-based sliding window rate limiting for public account registration.
* Threshold: Maximum 3 registrations per 15-minute sliding window per client fingerprint / IP.
* Excess attempts trigger immediate rejection with `auth.fraud.velocity_limit_exceeded`.

#### 6.3 Dynamic Multi-Type Blacklisting Engine
* Support persistent, administrative blacklisting across three distinct rule types:
  1. **Exact Email**: Blocks specific identified malicious accounts (e.g. `fraudster@target.com`).
  2. **Domain Wildcard**: Blocks entire malicious or spamming organizations (e.g. `*.spambot.net`, `fraud-network.xyz`).
  3. **IP Address / Subnet**: Blocks attacker infrastructure.
* **Cascade Suspension**: When an admin blacklists an email or domain, all existing accounts matching the rule are automatically suspended and their active sessions revoked.
* Block both new registrations and subsequent login attempts for blacklisted entities.

#### 6.4 Registration Risk Scoring Heuristics
Evaluate each registration attempt across multiple risk factors:
* Disposable Domain detected (+80 points)
* Velocity limit reached (+70 points)
* High character randomness / entropy in local-part (+30 points)
* Risk Score >= 70: Automatic registration block.
* Risk Score 40-69: Account flagged for manual admin review in trialing state.

#### 6.5 Admin Console Fraud & Blacklist Management Center
* Dedicated **Fraud & Blacklist** tab in the Admin Console.
* Live metrics: Active Blacklist Rules, Blocked Fraud Registrations, Disposable Domains Filtered, Flagged Accounts.
* Full CRUD for blacklist entries with instant account cascade suspension toggle.
* Interactive **Fraud Risk Simulator** allowing administrators to test any email or domain against the heuristics engine in real-time.

---

## 4. Implementation Status & Action Items

1. [x] **Core IAM & PBKDF2 Password Hashing**: Implemented WebCrypto PBKDF2 with 100,000 iterations and per-user salt in `cryptoService.ts`.
2. [x] **Client Privilege Escalation Invariant**: Enforced server-side stripping of `role` in `authService.ts`.
3. [x] **Brute-Force Account Lockout**: Enforced 3-minute lockout after 5 consecutive failed logins in `authService.ts`.
4. [x] **Multi-Tenant Data Isolation**: Implemented row-level `tenantId` across Projects, Customers, Invoices, Transactions, and MCP keys in `projectStore.ts` and `saasStore.ts`.
5. [x] **AES-256-GCM AI Provider Key Encryption**: Encrypted AI provider secrets at rest with WebCrypto in `saasStore.ts`.
6. [x] **MCP Server Hardening**: Added SHA-256 token verification, strict path traversal guards, and 120 reqs/min rate limiting in `mcp/server.mjs`.
7. [x] **Cashfree PG Secret & Webhook Defense**: Redacted `CASHFREE_SECRET_KEY` from client bundle in `vite.config.ts`; added anti-replay HMAC-SHA256 signature verification.
8. [x] **Enterprise Security Audit Logger & Admin UI**: Implemented `auditLogger.ts` and `AdminAuditLogView.tsx`.
9. [x] **Fraud Detection Engine & Disposable Domain Filter**: Implement `fraudDetectionService.ts` blocking 50+ burner email domains and registration burst abuse.
10. [x] **Dynamic Blacklist Manager & Admin Console UI**: Implement `AdminBlacklistView.tsx` with rule creation, cascade suspension, and risk simulator.

---

*This document is the official security implementation standard for the SRS Genie platform. Review and updates occur quarterly.*
