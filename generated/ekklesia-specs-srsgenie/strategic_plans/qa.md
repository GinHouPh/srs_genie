# QUALITY ASSURANCE AND SOFTWARE TEST PLAN
## AI-Generated Software Quality Management and Testing Specification

**Document Type:** Quality Assurance and Test Plan (QATP)  
**Document Version:** 1.0  
**Project Name:** Ekklesia  
**Product Name:** Ekklesia Platform  
**QA Plan ID:** QAP-001  
**Test Plan ID:** TP-001  
**Document Status:** Approved  
**Prepared By:** AI QA and Test Planning Agent  
**QA Manager:** Principal QA Architect  
**Test Lead:** Senior Test Automation Engineer  
**Technical Lead:** Principal Systems Architect  
**Date Created:** 2026-11-24  
**Last Updated:** 2026-11-24  
**Target Release:** v1.0.0

---

# SECTION 1 — QA AND TEST PLAN OVERVIEW

## 1. Project Identification

### 1.1 Document Information
| Field | Details |
|---|---|
| Project Name | Ekklesia |
| Project ID | PRJ-001 |
| Product Name | Ekklesia Engine |
| QA Plan ID | QAP-001 |
| Test Plan ID | TP-001 |
| Project Type | Full-Stack Enterprise Cloud Application |
| Product Version | 1.0.0 |
| Target Release | v1.0 MVP |
| QA Manager | Principal QA Architect |
| Test Lead | Senior Test Automation Engineer |
| Technical Lead | Principal Systems Architect |
| QA Start Date | Sprint 1 |
| Target Completion | Sprint 4 |
| Document Status | Approved |

### 1.2 Purpose & Quality Vision
This document establishes the authoritative Quality Assurance and Testing Plan for Ekklesia. It guarantees that all functional requirements, security boundaries, multi-tenant data isolations, and performance targets specified in `PRD.md`, `architecture.md`, and `tech_spec.md` are rigorously verified and validated through automated testing pipelines before production release.

### 1.3 Quality Objectives
1. **Zero High/Critical Defect Escape:** Zero S1 or S2 defects allowed into production release.
2. **Mandatory Automated Coverage:** Minimum 85% branch coverage across all domain, service, and security layers.
3. **Sub-200ms Latency Verification:** P95 response latency under 200ms verified via automated k6 load tests.
4. **Guaranteed Multi-Tenant Isolation:** Automated test suite verifying 100% denial of cross-tenant data requests.

---

# SECTION 2 — QUALITY ASSURANCE FRAMEWORK

## 2. Testing Pyramid & QA Strategy
```
       /\
      /E2E\      10% (Playwright Browser Tests - Core Workflows)
     /------\
    /  Integ \    20% (Supertest API & Database RLS Tests)
   /----------\
  / Unit Tests \  70% (Vitest - Domain Logic, Zod Schemas, Utils)
 /--------------\
```

- **Shift-Left Testing:** Unit tests and schema validation run on every local save and pull request.
- **Continuous Quality Gates:** PRs cannot merge unless unit tests, typechecks, and linters pass 100%.

---

# SECTION 3 — QUALITY STANDARDS AND ACCEPTANCE POLICY

## 3. Applicable Standards
- **ISO/IEC 25010:** Product Quality Model (functional suitability, performance, security, reliability).
- **OWASP ASVS Level 2:** Application Security Verification Standard.
- **WCAG 2.1 AA:** Web Content Accessibility Guidelines.

---

# SECTION 4 — TESTING SCOPE AND COVERAGE

## 4. Test Coverage Inventory
| Coverage ID | Module | Feature | Testing Types | Priority |
|---|---|---|---|---|
| COV-001 | Authentication | User Registration, Login, Sliding JWT Rotation | Unit, Integration, E2E | Critical |
| COV-002 | Multi-Tenancy | Organization Provisioning & Row-Level Security | Integration, Security | Critical |
| COV-003 | Core Domain | Entity CRUD, State Machine, Business Invariants | Unit, Integration | High |
| COV-004 | Async Queues | BullMQ Jobs, Retries, Dead-Letter Queue | Integration | High |
| COV-005 | Webhooks | HMAC-SHA256 Signature Verification, Idempotency | Integration, Security | High |

---

# SECTION 5 — TESTING LEVELS & AUTOMATION STRATEGY

## 5. Testing Framework Selection
| Testing Level | Scope | Framework | Execution Frequency |
|---|---|---|---|
| Unit Testing | Domain services, Zod schemas, utils | Vitest | Per commit & PR |
| Component Testing | React 19 UI widgets & hooks | React Testing Library | Per PR |
| API Integration | Express controllers, DB transactions | Supertest | Per PR |
| Multi-Tenant Security | PostgreSQL RLS cross-tenant isolation | Custom Vitest Suite | Per PR |
| End-to-End | Full browser user workflows | Playwright | Nightly & Pre-Release |
| Performance / Load | API throughput & latency under load | k6 | Sprint Milestone |

---

# SECTION 6 — MASTER TEST CASE SPECIFICATIONS

## 6. Concrete Test Case Inventory

### TC-001: Multi-Tenant Row-Level Security (RLS) Isolation
- **Test Type:** Security / Integration
- **Related Requirement:** FR-001 / DR-001
- **Component:** TCMP-003 (PostgreSQL Repository)
- **Preconditions:** Two distinct tenants (Tenant A and Tenant B) provisioned in test database.
- **Test Steps:**
  1. Authenticate as User A belonging to Tenant A; obtain JWT.
  2. Create Project record `Project-Alpha` via `POST /api/v1/projects`.
  3. Authenticate as User B belonging to Tenant B; obtain JWT.
  4. Attempt `GET /api/v1/projects/:idOfProjectAlpha`.
- **Expected Result:** HTTP 404 Not Found (or 403 Forbidden). PostgreSQL RLS policy filters out the row entirely. User B cannot observe or mutate Project Alpha.
- **Pass Criteria:** Cross-tenant query returns zero records; audit log records unauthorized attempt.

### TC-002: Sliding JWT Token Rotation & Blacklist Revocation
- **Test Type:** Security / Integration
- **Related Requirement:** FR-002
- **Component:** TCMP-001 (Auth Service)
- **Preconditions:** Valid user account registered with password hash in Argon2id.
- **Test Steps:**
  1. Authenticate with credentials via `POST /api/v1/auth/login`; receive Access Token (15m) and Refresh Token (7d).
  2. Call `POST /api/v1/auth/refresh` with valid Refresh Token; receive new token pair.
  3. Attempt to reuse old Refresh Token.
  4. Call `POST /api/v1/auth/logout` with current token; attempt subsequent authenticated request.
- **Expected Result:** Step 2 issues fresh tokens. Step 3 rejects with HTTP 401 Unauthorized (token reuse detection triggers session invalidation). Step 4 rejects with HTTP 401 Unauthorized via Redis revocation blacklist.
- **Pass Criteria:** Token reuse immediately invalidates entire token family; revoked tokens rejected instantly.

### TC-003: End-to-End User Registration, Workspace Setup & Project Creation
- **Test Type:** End-to-End (E2E) Browser Automation
- **Related Requirement:** FR-001, FR-002, FR-003
- **Framework:** Playwright
- **Preconditions:** Clean staging/test environment running.
- **Test Steps:**
  1. Navigate to `/register` page.
  2. Fill organization name, email, and strong password; submit form.
  3. Verify redirection to onboarding dashboard.
  4. Click "Create Project", enter project title, and click Save.
  5. Verify new project card renders in dashboard grid with status "Active".
- **Expected Result:** Form inputs validate via Zod; optimistic UI update occurs; backend commits record to PostgreSQL with correct `tenant_id`.
- **Pass Criteria:** Playwright assertion `expect(page.getByText('Active')).toBeVisible()` succeeds within 2000ms.

### TC-004: Asynchronous BullMQ Job Execution & Retry with Exponential Backoff
- **Test Type:** Integration
- **Related Requirement:** FR-004
- **Component:** TCMP-004 (Queue Worker)
- **Preconditions:** Redis 7 container active.
- **Test Steps:**
  1. Enqueue job configured to fail on first attempt.
  2. Worker attempts execution, catches exception, and schedules retry.
  3. Worker re-executes with exponential backoff and succeeds on second attempt.
- **Expected Result:** Job state transitions: `waiting` -> `active` -> `failed` (retry 1) -> `delayed` -> `completed`.
- **Pass Criteria:** Job completes with success; retry count equals 1; no job lost.

### TC-005: Webhook HMAC-SHA256 Signature Verification & Replay Protection
- **Test Type:** Security / Integration
- **Related Requirement:** FR-005 / DR-002
- **Preconditions:** Shared secret configured in environment.
- **Test Steps:**
  1. Send POST request with valid HMAC-SHA256 signature in `X-Signature` header.
  2. Send identical request a second time within 5 minutes.
  3. Send POST request with tampered payload or altered signature.
- **Expected Result:** Request 1 succeeds (HTTP 200). Request 2 is detected as duplicate via idempotency key and returns cached result without reprocessing. Request 3 is rejected with HTTP 401 Unauthorized.
- **Pass Criteria:** Signature verification rejects any altered payload; idempotency prevents duplicate execution.

---

# SECTION 7 — REQUIREMENTS TRACEABILITY MATRIX (RTM)

| Requirement ID | Requirement Name | Test Case ID | Test Type | Automation Status | Pass Criteria |
|---|---|---|---|---|---|
| FR-001 | Multi-Tenant Organization & RLS | TC-001, TC-003 | Security / E2E | Automated (Vitest/Playwright) | 100% Isolation |
| FR-002 | Authentication & JWT Rotation | TC-002, TC-003 | Integration / E2E | Automated (Vitest/Playwright) | Zero Tampering |
| FR-003 | Core Domain Entity Operations | TC-003 | E2E | Automated (Playwright) | UI Verified |
| FR-004 | BullMQ Async Processing | TC-004 | Integration | Automated (Vitest) | Zero Dropped Jobs |
| FR-005 | Webhook & Invariant Auditing | TC-005 | Security | Automated (Vitest) | HMAC Verified |

---

# SECTION 8 — DEFECT SEVERITY & TRIAGE POLICY

## 8. Defect Severity Scale
- **S1 (Critical):** System crash, data corruption, cross-tenant isolation breach, security vulnerability. Blocker for all releases.
- **S2 (Major):** Primary workflow broken with no viable workaround. Blocker for release.
- **S3 (Moderate):** Non-critical feature broken or workaround available. Must be fixed in next sprint.
- **S4 (Minor):** Cosmetic defect, typo, minor visual alignment discrepancy.

---

# SECTION 9 — QUALITY GATES & RELEASE ACCEPTANCE CRITERIA

## 9. Release Go/No-Go Checklist
- [x] **Test Pass Rate:** 100% of S1 and S2 test cases must pass.
- [x] **Code Coverage:** Minimum 85% branch coverage on backend services and repositories.
- [x] **Security Gate:** Zero High or Critical vulnerabilities identified by Snyk / npm audit.
- [x] **Performance Gate:** P95 response latency < 200ms under 100 concurrent virtual users (k6).
- [x] **E2E Stability:** Playwright regression suite passes cleanly on Staging environment.
- [x] **Sign-Off:** QA Lead, Principal Architect, and Product Owner sign off prior to production cutover.
