---
tier: 2
role: security-and-auth
depends-on: domain/user_stories.md
updated: 2026-11-24
---

# Security & Authentication Model: Ekklesia

## 1. Role-Based Access Control (RBAC) Matrix

| Resource / Action | Viewer | Member | Admin | Super Admin | System Worker |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Read Domain Resources** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Create / Update Resources** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Delete Resources (Soft)** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Manage Billing & Payment** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Invite & Manage Users** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Global System Configs** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Read Immutable Audit Logs** | ❌ | ❌ | ✅ (Tenant) | ✅ (Global) | ❌ |

---

## 2. Authentication & Credential Architecture

- **Password Hashing:** **Argon2id** with memory cost 64MB, time cost 3 iterations, and parallelism 4.
- **Session Tokens:** Stateless JWT tokens signed via asymmetric RS256 private keys.
  - `access_token`: 15-minute lifespan stored in memory or short-lived auth header.
  - `refresh_token`: 7-day sliding expiration stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie.
- **Rotation Policy:** Refresh token reuse triggers immediate invalidation of all active user sessions.
- **CSRF Defense:** Custom request header requirement (`X-Requested-With: XMLHttpRequest`) combined with double-submit cookie validation.

---

## 3. Cryptographic Data Protection

- **Data at Rest:** Encrypted using **AES-256-GCM** across all database disk volumes and cloud backups.
- **Data in Transit:** Enforced **TLS 1.3** across all HTTP and WebSocket connections; TLS 1.0/1.1 disabled.
- **Secrets Management:** Environment secrets and API keys managed through cloud vault KMS envelopes.


---

## Frontier Model Security Architecture Directives

### 5.2 Persona 2: Compliance & Security Officer

**Persona ID:** PERSONA-002

| Attribute | Details |
|---|---|
| Persona Name | David Chen |
| User Type | Administrative / Governance |
| Role | Head of Information Security & Compliance |
| Background | Certified CISA/CISSP with experience in SOC 2 Type II, GDPR, OWASP Top 10 |
| Primary Goals | Ensure zero unauthorized data access across tenant partitions |
| Needs | Immutable audit logs, exportable compliance reports, MFA enforcement |
| Responsibilities | Auditing access logs, managing user permissions, responding to regulatory inquiries |
| Pain Points | Inability to prove who made a change, lack of session revocation controls |
| Technical Proficiency | Advanced |
| Usage Frequency | Weekly / On-Demand Audits |
| Preferred Platform | Desktop / Secure Web |
| Access Level | Compliance Admin (Read-all audit logs) |
| Success Expectations | Cryptographically verifiable tamper-proof logs |

---

