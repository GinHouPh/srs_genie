import { SRSFormData } from '../../types';

export const QA_TEMPLATE = `# QUALITY ASSURANCE AND SOFTWARE TEST PLAN
## AI-Generated Software Quality Management and Testing Specification

**Document Type:** Quality Assurance and Test Plan (QATP)  
**Document Version:** 1.0  
**Project Name:** [Project Name]  
**Product Name:** [Product Name]  
**QA Plan ID:** [QA Plan ID]  
**Test Plan ID:** [Test Plan ID]  
**Document Status:** [Draft / Under Review / Approved / Active / Completed]  
**Prepared By:** AI QA and Test Planning Agent  
**QA Manager:** [Name]  
**Test Lead:** [Name]  
**Technical Lead:** [Name]  
**Date Created:** [Date]  
**Last Updated:** [Date]  
**Target Release:** [Release Version]

---

# SECTION 0 — AI AGENT OPERATING INSTRUCTIONS

## 0.1 Agent Role
Act as a Senior Quality Assurance Manager, Test Architect, Software Test Engineer, Automation Test Engineer, Performance Engineer, Security Test Analyst, and Quality Engineering Specialist.
Your responsibility is to analyze all available project documentation and generate a comprehensive quality assurance and testing plan that establishes how product quality will be prevented, measured, verified, validated, and maintained throughout the software development lifecycle.

## 0.2 Input Sources
1. User Project Detail Summary.
2. Approved Project Plan & PRD.
3. Software Architecture Document & Technical Specifications.
4. Design System Specification & Project Roadmap.
5. Risk Management Plan & Compliance Requirements.

## 0.3 Primary Objectives
Establish:
- Quality objectives, standards, and QA activities.
- Testing scope, levels (Unit, Component, Integration, Contract, E2E, UAT, Regression).
- Functional, UI/UX, API, Database, Security (OWASP), and Non-Functional testing strategies.
- SaaS & Multi-Tenant test strategies (RLS isolation, tenant data boundaries).
- Test automation architecture (Vitest, Supertest, Playwright, k6).
- Test case design (TC-001..) and Requirements Traceability Matrix (RTM).
- Defect management lifecycle (BUG-001..), severity/priority scales.
- Quality gates (QGATE-001..) and release Go/No-Go criteria.

## 0.4 Source Classification
- Requirement-Derived, Architecture-Derived, Technical-Derived, User-Confirmed, Existing-System, QA-Recommended, Assumed, Pending Approval, Out of Scope.

---

# SECTION 1 — QA AND TEST PLAN OVERVIEW

## 1. Project Identification

### 1.1 Document Information
| Field | Details |
|---|---|
| Project Name | [Project Name] |
| Project ID | [Project ID] |
| Product Name | [Product Name] |
| QA Plan ID | [ID] |
| Test Plan ID | [ID] |
| Project Type | [Type] |
| Product Version | [Version] |
| Target Release | [Release] |
| QA Manager | [Name] |
| Test Lead | [Name] |
| Technical Lead | [Name] |
| QA Start Date | [Date] |
| Target Completion | [Date] |
| Document Status | [Status] |

### 1.2 Purpose, Quality Vision & Objectives
[Establish quality benchmarks, zero-defect release goals, sub-200ms API response gates, and ISO 25010 compliance.]

### 1.3 Scope, Boundaries & Reference Documents
[Applications, modules, and testing boundaries included.]

---

# SECTION 2 — QUALITY ASSURANCE FRAMEWORK

## 2. QA Strategy & Principles
- Quality by Design, Early Testing, Shift-Left Testing, Continuous Testing, Risk-Based Testing, Evidence-Based Acceptance.

### 2.1 QA Activities Across Stages
[Requirements, Design, Architecture, Development, Integration, and Release stages.]

### 2.2 QA Deliverables & Governance
[Test Plan, Test Cases, Automation Scripts, Coverage Reports, Defect Logs, UAT Sign-Off, Quality Gates.]

---

# SECTION 3 — QUALITY STANDARDS AND ACCEPTANCE POLICY

## 3. Quality Standards & Attribute Framework
- ISO 25010 Product Quality Model.
- OWASP Application Security Verification Standard (ASVS).
- WCAG 2.1 Level AA Accessibility Standards.
- Code Quality Gates: >= 85% branch coverage, zero high/critical security vulnerabilities.

---

# SECTION 4 — TESTING SCOPE AND COVERAGE

## 4. Testing Scope & Inventory

### 4.1 Test Coverage Inventory
| Coverage ID | Product Area | Module | Feature | Testing Required | Priority |
|---|---|---|---|---|---|
| COV-001 | Core Platform | Auth & Tenants | User Registration & Login | Unit, Integration, E2E | Critical |

---

# SECTION 5 — TESTING STRATEGY AND METHODOLOGY

## 5. Overall Testing Strategy
- Testing Approach: Risk-Based & Automation-First Continuous Testing.
- Testing Lifecycle: Planning -> Analysis -> Design -> Environment Prep -> Data Prep -> Implementation -> Execution -> Defect Logging -> Retesting -> Regression -> Closure.

---

# SECTION 6 — TESTING LEVELS

## 6. Testing Level Strategy
- Unit Testing: Vitest for isolated business logic, schema validation, and utility functions.
- Component Testing: React Testing Library for frontend component behaviors and states.
- Integration Testing: Supertest against ephemeral test PostgreSQL container.
- Contract Testing: OpenAPI 3.1 & Zod schema validation across client and server.
- End-to-End Testing: Playwright browser automation covering full user workflows.
- Acceptance Testing: Business stakeholder verification against acceptance criteria.
- Regression Testing: Automated test suite executed on every pull request.

---

# SECTION 7 — FUNCTIONAL TESTING

## 7. Functional Testing Strategy
- Positive, Negative, Boundary Value, Equivalence Partitioning, Decision Table, State Transition, and Exploratory Testing.

### 7.1 Functional Coverage Matrix
| Module | Feature | Positive | Negative | Boundary | State | Coverage |
|---|---|---|---|---|---|---|
| [Module] | [Feature] | Passed | Passed | Passed | Passed | 100% |

---

# SECTION 8 — UI/UX AND DESIGN SYSTEM TESTING

## 8. Interface Quality Testing
- Visual & Design Token testing (Tailwind classes, color contrast WCAG 2.1 AA).
- Responsive testing (Mobile 375px, Tablet 768px, Desktop 1280px+).
- Component state validation (Default, Hover, Active, Disabled, Loading, Error, Empty).

---

# SECTION 9 — API AND INTEGRATION TESTING

## 9. API Testing Strategy
- Endpoint testing (CRUD operations, HTTP 200/201/400/401/403/404/409/500).
- Webhook signature verification (HMAC-SHA256) and replay attack rejection.
- Idempotency key testing for mutating POST/PUT requests.

---

# SECTION 10 — DATABASE AND DATA QUALITY TESTING

## 10. Database Testing Strategy
- Schema migration verification (up and down migrations).
- Multi-Tenant Row-Level Security (RLS) boundary testing.
- Transaction ACID compliance and rollback testing.

---

# SECTION 11 — SECURITY TESTING

## 11. Security Testing Strategy
- OWASP Top 10 automated test suites.
- JWT tampering, expiration, and sliding refresh token testing.
- Cross-tenant data isolation and SQL injection immunity tests.

---

# SECTION 12 — NON-FUNCTIONAL TESTING

## 12. Performance & Non-Functional Testing
| Category | Test Scenario | Metric | Target |
|---|---|---|---|
| Performance | API endpoint response time under 100 req/sec | P95 Latency | < 200 ms |
| Database | Query execution latency on indexed tables | P95 Latency | < 50 ms |
| Accessibility | Frontend UI accessibility audit | Axe Core | 0 Violations (WCAG AA) |

---

# SECTION 13 — SAAS & MULTI-TENANT TESTING

## 13. Multi-Tenant Isolation Testing
- Multi-tenant tenant boundary tests ensuring Tenant A cannot access Tenant B records.
- Tenant lifecycle provisioning and soft deletion testing.

---

# SECTION 14 — AI AND MACHINE LEARNING TESTING

## 14. AI Quality Testing (Where Applicable)
- Prompt template evaluation, output schema compliance, and hallucination boundary checks.

---

# SECTION 15 — TEST ENVIRONMENT MANAGEMENT

## 15. Environment Inventory
- Local Dev (Docker Compose), CI Test Runner (GitHub Actions), Staging (AWS ECS Fargate), Production.

---

# SECTION 16 — TEST DATA MANAGEMENT

## 16. Test Data Strategy
- Synthetic seed data generated via deterministic factories; strictly zero production PII in test environments.

---

# SECTION 17 — TEST AUTOMATION STRATEGY

## 17. Automation Framework
- Unit & Integration: Vitest.
- API Testing: Supertest.
- E2E Automation: Playwright.
- Load Testing: k6.

---

# SECTION 18 — TEST CASE DESIGN AND SPECIFICATION

## 18. Master Test Case Inventory
| Test Case ID | Test Title | Level | Related Requirement | Priority | Automation |
|---|---|---|---|---|---|
| TC-001 | Verify Tenant RLS Isolation | Integration | FR-001 | Critical | Automated |
| TC-002 | Verify JWT Rotation & Expired Token Rejection | Integration | FR-002 | Critical | Automated |
| TC-003 | Full User Registration & Login Flow | E2E | FR-001, FR-002 | Critical | Automated |
| TC-004 | Verify BullMQ Background Job Processing | Integration | FR-004 | High | Automated |
| TC-005 | Webhook HMAC-SHA256 Signature Verification | Integration | FR-005 | High | Automated |

---

# SECTION 19 — TEST COVERAGE AND TRACEABILITY

## 19. Requirements Traceability Matrix (RTM)
| Requirement ID | Requirement Name | Test Case ID | Test Type | Status |
|---|---|---|---|---|
| FR-001 | Tenant Management & RLS | TC-001, TC-003 | Integration / E2E | Verified |
| FR-002 | Authentication & JWT | TC-002, TC-003 | Integration / E2E | Verified |
| FR-004 | Background Worker Queue | TC-004 | Integration | Verified |
| FR-005 | Webhook & Integrations | TC-005 | Security / Integration | Verified |

---

# SECTION 20 — DEFECT AND BUG MANAGEMENT

## 20. Defect Lifecycle & Severity
- Severity: S1 Critical, S2 Major, S3 Moderate, S4 Minor.
- Priority: P1 Immediate, P2 High, P3 Normal, P4 Low.
- Lifecycle: New -> Triaged -> Assigned -> Fixed -> Ready for Retest -> Verified -> Closed.

---

# SECTION 21 — TEST EXECUTION MANAGEMENT

## 21. Execution Cycles & Gates
- Pull Request CI Pipeline: Executes Vitest + ESLint + Typecheck.
- Nightly Regression Suite: Executes Playwright E2E and k6 load tests.

---

# SECTION 22 — QUALITY GATES AND RELEASE ACCEPTANCE

## 22. Release Acceptance Criteria
- 100% test pass rate for all S1/S2 test suites.
- Minimum 85% branch coverage on core backend and domain services.
- Zero Critical or High security vulnerabilities in Snyk / npm audit.
- P95 API response latency < 200ms verified under simulated load.

---

# SECTION 23 — USER ACCEPTANCE TESTING (UAT)

## 23. UAT Strategy & Sign-Off
- Scenario-based acceptance testing conducted on Staging environment by Product Owner prior to release.

---

# SECTION 24 — CI/CD AND CONTINUOUS TESTING

## 24. Continuous Testing Pipeline
\`\`\`mermaid
flowchart LR
    Commit[Git Commit] --> Lint[ESLint & TSC]
    Lint --> Unit[Vitest Unit Tests]
    Unit --> Build[Docker Build]
    Build --> Integ[Supertest API Tests]
    Integ --> E2E[Playwright E2E Tests]
    E2E --> Deploy[Deploy Staging]
\`\`\`

---

# SECTION 25 — QUALITY METRICS AND REPORTING

## 25. Key Metrics
- Requirement Coverage: 100%.
- Automated Test Pass Rate: Target >= 98%.
- Code Branch Coverage: Target >= 85%.

---

# SECTION 26 — QA TEAM AND RESOURCE PLANNING

## 26. Team Allocation
- Test Architect, Automation Engineers, QA Security Analyst.

---

# SECTION 27 — TESTING TOOLS AND INFRASTRUCTURE

## 27. Tool Inventory
| Tool ID | Tool Name | Category | Purpose |
|---|---|---|---|
| TOOL-001 | Vitest | Unit / Integration | Test runner for backend and shared services |
| TOOL-002 | Playwright | E2E Automation | Headless Chromium/Firefox/WebKit testing |
| TOOL-003 | Supertest | API Integration | HTTP assertion library for Express routes |
| TOOL-004 | k6 | Load / Stress | Performance benchmarking tool |

---

# SECTION 28 — TESTING SCHEDULE AND ROADMAP

## 28. Timeline
- Aligned directly with the 4 delivery sprints in \`roadmap_resourceplan.md\`.

---

# SECTION 29 — TEST RISK MANAGEMENT

## 29. Testing Risk Register
| Risk ID | Risk | Impact | Mitigation Strategy | Owner |
|---|---|---|---|---|
| QRISK-001 | Flaky browser tests delaying CI pipeline | High | Strict test retries (max 2) and deterministic test fixtures | QA Lead |
| QRISK-002 | Test database state pollution | High | Fresh transactional isolation and automatic database teardown | Backend Lead |

---

# SECTION 30 — PRODUCTION TESTING & VALIDATION

## 30. Post-Deployment Smoke Checks
- Health endpoint checks (\`/health/live\`, \`/health/ready\`).
- Synthetic health check verifying live database connection pool.

---

# SECTION 31 — DEFECT PREVENTION & CONTINUOUS IMPROVEMENT

## 31. Improvement Mechanisms
- Mandatory PR review with automated quality gate checks before merge.

---

# SECTION 32 — TEST CLOSURE & SIGN-OFF

## 32. Sign-Off Approvals
| Role | Approver | Decision | Date |
|---|---|---|---|
| QA Manager | Principal QA Architect | Approved | [Date] |
| Technical Lead | Principal Systems Architect | Approved | [Date] |
| Product Owner | Principal Product Manager | Approved | [Date] |

---

# SECTION 33 — FINAL QA EXECUTIVE SUMMARY

## 33. Executive Summary
The Quality Assurance and Test Plan for [Project Name] guarantees comprehensive automated test coverage across unit, integration, and end-to-end layers. Strict quality gates, zero-drift contract enforcement, and multi-tenant security verification ensure enterprise-grade delivery readiness.

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM
| Item | Prefix | Example |
|---|---|---|
| QA Plan | QAP | QAP-001 |
| Test Plan | TP | TP-001 |
| Coverage | COV | COV-001 |
| Test Scenario | SCN | SCN-001 |
| Test Case | TC | TC-001 |
| Test Cycle | CYCLE | CYCLE-001 |
| Defect | BUG | BUG-001 |
| Test Data | DATA | DATA-001 |
| Environment | ENV | ENV-001 |
| Test Tool | TOOL | TOOL-001 |
| QA Risk | QRISK | QRISK-001 |
| Quality Gate | QGATE | QGATE-001 |
| Improvement | IMP | IMP-001 |
| Decision | QDEC | QDEC-001 |

---

# APPENDIX B — STANDARD ENUMERATIONS
- Test Priority: Critical, High, Medium, Low.
- Test Status: Not Run, Passed, Failed, Blocked, Skipped.
- Defect Severity: S1 Critical, S2 Major, S3 Moderate, S4 Minor.
- Quality Gate: Passed, In Progress, Failed, Waived.

---

# APPENDIX C — FINAL QA AND TEST PLAN VALIDATION CHECKLIST
- [x] Quality objectives and standards (ISO 25010, OWASP, WCAG) established.
- [x] Full testing scope and levels (Unit, Component, Integration, Contract, E2E) defined.
- [x] SaaS and multi-tenant RLS isolation tests specified.
- [x] Test automation framework (Vitest, Playwright, Supertest, k6) documented.
- [x] Requirements Traceability Matrix (RTM) mapped to PRD requirements.
- [x] Quality gates and release acceptance criteria established.
`;

/**
 * Deterministic QA & test plan generator fulfilling the 33-section standard
 */
export function generateDeterministicQA(
  projectName: string,
  fd: SRSFormData,
  dateStr: string
): string {
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const compliance = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'SOC 2, GDPR, OWASP Top 10';

  return `# QUALITY ASSURANCE AND SOFTWARE TEST PLAN
## AI-Generated Software Quality Management and Testing Specification

**Document Type:** Quality Assurance and Test Plan (QATP)  
**Document Version:** 1.0  
**Project Name:** ${projectName}  
**Product Name:** ${projectName} Platform  
**QA Plan ID:** QAP-001  
**Test Plan ID:** TP-001  
**Document Status:** Approved  
**Prepared By:** AI QA and Test Planning Agent  
**QA Manager:** Principal QA Architect  
**Test Lead:** Senior Test Automation Engineer  
**Technical Lead:** Principal Systems Architect  
**Date Created:** ${dateStr}  
**Last Updated:** ${dateStr}  
**Target Release:** v1.0.0

---

# SECTION 1 — QA AND TEST PLAN OVERVIEW

## 1. Project Identification

### 1.1 Document Information
| Field | Details |
|---|---|
| Project Name | ${projectName} |
| Project ID | PRJ-001 |
| Product Name | ${projectName} Engine |
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
This document establishes the authoritative Quality Assurance and Testing Plan for ${projectName}. It guarantees that all functional requirements, security boundaries, multi-tenant data isolations, and performance targets specified in \`PRD.md\`, \`architecture.md\`, and \`tech_spec.md\` are rigorously verified and validated through automated testing pipelines before production release.

### 1.3 Quality Objectives
1. **Zero High/Critical Defect Escape:** Zero S1 or S2 defects allowed into production release.
2. **Mandatory Automated Coverage:** Minimum 85% branch coverage across all domain, service, and security layers.
3. **Sub-200ms Latency Verification:** P95 response latency under 200ms verified via automated k6 load tests.
4. **Guaranteed Multi-Tenant Isolation:** Automated test suite verifying 100% denial of cross-tenant data requests.

---

# SECTION 2 — QUALITY ASSURANCE FRAMEWORK

## 2. Testing Pyramid & QA Strategy
\`\`\`
       /\\
      /E2E\\      10% (Playwright Browser Tests - Core Workflows)
     /------\\
    /  Integ \\    20% (Supertest API & Database RLS Tests)
   /----------\\
  / Unit Tests \\  70% (Vitest - Domain Logic, Zod Schemas, Utils)
 /--------------\\
\`\`\`

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
  2. Create Project record \`Project-Alpha\` via \`POST /api/v1/projects\`.
  3. Authenticate as User B belonging to Tenant B; obtain JWT.
  4. Attempt \`GET /api/v1/projects/:idOfProjectAlpha\`.
- **Expected Result:** HTTP 404 Not Found (or 403 Forbidden). PostgreSQL RLS policy filters out the row entirely. User B cannot observe or mutate Project Alpha.
- **Pass Criteria:** Cross-tenant query returns zero records; audit log records unauthorized attempt.

### TC-002: Sliding JWT Token Rotation & Blacklist Revocation
- **Test Type:** Security / Integration
- **Related Requirement:** FR-002
- **Component:** TCMP-001 (Auth Service)
- **Preconditions:** Valid user account registered with password hash in Argon2id.
- **Test Steps:**
  1. Authenticate with credentials via \`POST /api/v1/auth/login\`; receive Access Token (15m) and Refresh Token (7d).
  2. Call \`POST /api/v1/auth/refresh\` with valid Refresh Token; receive new token pair.
  3. Attempt to reuse old Refresh Token.
  4. Call \`POST /api/v1/auth/logout\` with current token; attempt subsequent authenticated request.
- **Expected Result:** Step 2 issues fresh tokens. Step 3 rejects with HTTP 401 Unauthorized (token reuse detection triggers session invalidation). Step 4 rejects with HTTP 401 Unauthorized via Redis revocation blacklist.
- **Pass Criteria:** Token reuse immediately invalidates entire token family; revoked tokens rejected instantly.

### TC-003: End-to-End User Registration, Workspace Setup & Project Creation
- **Test Type:** End-to-End (E2E) Browser Automation
- **Related Requirement:** FR-001, FR-002, FR-003
- **Framework:** Playwright
- **Preconditions:** Clean staging/test environment running.
- **Test Steps:**
  1. Navigate to \`/register\` page.
  2. Fill organization name, email, and strong password; submit form.
  3. Verify redirection to onboarding dashboard.
  4. Click "Create Project", enter project title, and click Save.
  5. Verify new project card renders in dashboard grid with status "Active".
- **Expected Result:** Form inputs validate via Zod; optimistic UI update occurs; backend commits record to PostgreSQL with correct \`tenant_id\`.
- **Pass Criteria:** Playwright assertion \`expect(page.getByText('Active')).toBeVisible()\` succeeds within 2000ms.

### TC-004: Asynchronous BullMQ Job Execution & Retry with Exponential Backoff
- **Test Type:** Integration
- **Related Requirement:** FR-004
- **Component:** TCMP-004 (Queue Worker)
- **Preconditions:** Redis 7 container active.
- **Test Steps:**
  1. Enqueue job configured to fail on first attempt.
  2. Worker attempts execution, catches exception, and schedules retry.
  3. Worker re-executes with exponential backoff and succeeds on second attempt.
- **Expected Result:** Job state transitions: \`waiting\` -> \`active\` -> \`failed\` (retry 1) -> \`delayed\` -> \`completed\`.
- **Pass Criteria:** Job completes with success; retry count equals 1; no job lost.

### TC-005: Webhook HMAC-SHA256 Signature Verification & Replay Protection
- **Test Type:** Security / Integration
- **Related Requirement:** FR-005 / DR-002
- **Preconditions:** Shared secret configured in environment.
- **Test Steps:**
  1. Send POST request with valid HMAC-SHA256 signature in \`X-Signature\` header.
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
`;
}
