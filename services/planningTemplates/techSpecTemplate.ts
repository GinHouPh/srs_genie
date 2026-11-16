import { SRSFormData } from '../../types';

export const TECHNICAL_SPECIFICATION_TEMPLATE = `# TECHNICAL SPECIFICATION DOCUMENT (TSD)
## AI-Generated Software Engineering Specification

**Document Type:** Technical Specification Document  
**Document Version:** 1.0  
**Project Name:** [Project Name]  
**Product Name:** [Product Name]  
**Specification ID:** [Specification ID]  
**Specification Title:** [Specification Title]  
**Related Module:** [Module Name]  
**Related Feature:** [Feature Name]  
**Document Status:** [Draft / Under Review / Approved / Implemented / Deprecated]  
**Prepared By:** AI Technical Specification Agent  
**Technical Owner:** [Technical Owner]  
**Reviewer:** [Reviewer]  
**Date Created:** [Date]  
**Last Updated:** [Date]  
**Target Release:** [Version]

---

# SECTION 0 — AI AGENT OPERATING INSTRUCTIONS

## 0.1 Agent Role
Act as a Senior Technical Specification Analyst, Software Engineer, Technical Architect, Backend Engineer, Frontend Engineer, Database Engineer, and Engineering Documentation Specialist.
Your responsibility is to analyze the available product and architecture documentation and convert approved requirements into precise technical specifications that guide software implementation.

## 0.2 Input Sources
1. User Project Detail Summary.
2. Approved Project Plan.
3. Approved Product Requirements Document.
4. Approved Design System Specification.
5. Approved Software Architecture Document.
6. Database Design Document.
7. API Specification.
8. Existing Technical Specifications.
9. Existing Source Code & Repository Structure.
10. Existing Configuration Files & Dependencies.

### Source Priority
1. Explicit user instructions.
2. Approved product requirements.
3. Approved architectural decisions.
4. Approved technical specifications.
5. Existing system behavior and constraints.
6. Approved engineering standards.
7. AI-generated recommendations.

## 0.3 Primary Objectives
Translate product and architectural requirements into:
- Technical component specifications.
- Module implementation specifications.
- Feature implementation specifications.
- Frontend specifications.
- Backend specifications.
- Database specifications.
- API specifications.
- Integration specifications.
- Business logic specifications.
- Workflow specifications.
- State management specifications.
- Data processing specifications.
- Validation specifications.
- Security specifications.
- Error handling specifications.
- Performance requirements.
- Testing specifications.
- Implementation constraints.
- Technical acceptance criteria.

## 0.4 Specification Granularity
Project -> Application -> Module -> Submodule -> Feature -> Technical Component -> Technical Operation -> Implementation Requirement.

## 0.5 Source Classification
- Requirement-Derived
- Architecture-Derived
- User-Confirmed
- Existing-System
- Engineering-Recommended
- Assumed
- Pending Approval
- Out of Scope
- Deprecated

## 0.6 Technical Specification Quality Rules
Every specification must be technically precise, unambiguous, implementation-oriented, consistent with system architecture, traceable to requirements, testable, maintainable, explicit about dependencies, inputs/outputs, errors, and exceptions.

---

# SECTION 1 — SPECIFICATION OVERVIEW

## 1. Specification Identification

### 1.1 Document Information
| Field | Details |
|---|---|
| Specification ID | [ID] |
| Specification Name | [Name] |
| Project Name | [Project] |
| Application | [Application] |
| Module | [Module] |
| Submodule | [Submodule] |
| Feature | [Feature] |
| Technical Area | [Frontend / Backend / Database / API / Other] |
| Related PRD | [Document Reference] |
| Related Architecture | [Document Reference] |
| Specification Version | [Version] |
| Status | [Status] |
| Technical Owner | [Owner] |
| Reviewer | [Reviewer] |

### 1.2 Specification Purpose
[Explain precisely what this technical specification describes and why it is necessary.]

### 1.3 Technical Scope
[Included and excluded functionality, components, interfaces, and data operations.]

### 1.4 Technical Objectives
[Technical goals the implementation must achieve.]

### 1.5 Specification Boundaries
[Boundaries of this document versus parent architecture and child module specs.]

### 1.6 Specification Dependencies
| Dependency ID | Document / Component | Dependency Type | Description |
|---|---|---|---|
| DEP-001 | [Dependency] | [Type] | [Description] |

---

# SECTION 2 — REQUIREMENT REFERENCES

## 2. Requirements Traceability

### 2.1 Related Product Requirements
| Requirement ID | Requirement Title | Description | Priority |
|---|---|---|---|
| FR-001 | [Title] | [Description] | [Priority] |

### 2.2 Related User Stories
| Story ID | User Story | Related Technical Scope |
|---|---|---|
| US-001 | [Story] | [Scope] |

### 2.3 Related Use Cases
[Related product workflows and use cases.]

### 2.4 Related Architecture Components
[Applications, Containers, Modules, Components, Services, Databases, External Integrations.]

### 2.5 Architecture Decision References
[Relevant ADRs and how their decisions govern this specification.]

### 2.6 Design System References
[Relevant design tokens, components, patterns, screen templates, and interaction standards.]

---

# SECTION 3 — TECHNICAL COMPONENT IDENTIFICATION

## 3. Component Overview

### 3.1 Component Information
| Field | Details |
|---|---|
| Component ID | [ID] |
| Component Name | [Name] |
| Component Type | [Type] |
| Parent Module | [Module] |
| Parent Application | [Application] |
| Business Responsibility | [Responsibility] |
| Technical Responsibility | [Responsibility] |
| Technology | [Technology] |
| Implementation Status | [Status] |

### 3.2 Component Purpose
[Component purpose and the technical problem it solves.]

### 3.3 Component Responsibilities
[All responsibilities assigned to the component.]

### 3.4 Component Boundaries
[What belongs inside the component and what is handled externally.]

### 3.5 Component Dependencies
[Upstream, downstream, shared services, external systems, infrastructure.]

### 3.6 Component Interfaces
[Interfaces exposed and consumed by the component.]

### 3.7 Component Lifecycle
[Initialization, activation, runtime behavior, state transitions, shutdown, cleanup.]

### 3.8 Component Interaction Diagram
\`\`\`mermaid
flowchart LR
    Comp[Component] --> DepA[Dependency A]
    Comp --> DepB[Dependency B]
\`\`\`

---

# SECTION 4 — DETAILED FUNCTIONAL TECHNICAL SPECIFICATIONS

## 4. Technical Feature Specifications

### 4.1 Feature Identification
**Feature ID:** [FEAT-001]  
**Feature Name:** [Name]  
**Parent Module:** [Module]  
**Component:** [Component]

### 4.2 Feature Purpose
[Technical responsibility of this feature.]

### 4.3 Functional Behavior
[Expected behavior from trigger to completion.]

### 4.4 Feature Operations
| Operation ID | Operation | Description | Trigger |
|---|---|---|---|
| OP-001 | [Operation] | [Description] | [Trigger] |

### 4.5 Operation Specification
- **Operation Information:** ID, Name, Purpose, Component, Trigger, Execution Type, Priority.
- **Preconditions:** Required user state, data state, permissions, dependencies, system state.
- **Input:** Input fields, parameters, data types, constraints.
- **Processing:** Processing sequence, business rules, validation, data access, side effects.
- **Output:** Response, generated data, state changes, events, audit records.
- **Exceptions:** Validation failures, permission failures, network failures, duplicate requests.
- **Completion:** Postconditions, final state, acceptance criteria.

### 4.6 Primary Operation Flow
[Normal execution sequence.]

### 4.7 Alternative Operation Flow
[Valid alternative branches.]

### 4.8 Exception Flow
[Error, interrupted, and invalid paths.]

### 4.9 Technical Business Rules
[Concrete technical logic executing business rules.]

### 4.10 Feature Dependencies
[Service and component dependencies.]

---

# SECTION 5 — APPLICATION AND CODE STRUCTURE

## 5. Source Code Architecture

### 5.1 Repository Reference
[Repository name and layout.]

### 5.2 Existing Codebase Analysis
[Packages, reusable modules, legacy constraints, technical debt.]

### 5.3 Folder Structure
\`\`\`
project/
  apps/
    web/
    api/
  packages/
    ui/
    shared/
    types/
  services/
  infrastructure/
\`\`\`

### 5.4 File and Module Specification
| File / Module | Purpose | Responsibilities | Dependencies |
|---|---|---|---|
| [Path] | [Purpose] | [Responsibilities] | [Dependencies] |

### 5.5 Naming Conventions
[Conventions for files, classes, functions, variables, types, DB objects, endpoints, events.]

### 5.6 Dependency Management
[Internal/external packages, version constraints, compatibility, security audits.]

### 5.7 Code Organization Rules
[Clean separation: presentation, business logic, data access, API, validation, config, utils.]

### 5.8 Reusability Requirements
[Shared modules and common utilities to prevent duplicate logic.]

---

# SECTION 6 — FRONTEND TECHNICAL SPECIFICATION

## 6. Frontend Architecture Specification

### 6.1 Frontend Component Information
[Component ID, Name, Type, Parent Page, Design System reference, Tech stack.]

### 6.2 Frontend Structure
[Pages, layouts, components, hooks, stores, services, utilities, assets.]

### 6.3 Component Anatomy
[Visual elements, slots, triggers, containers.]

### 6.4 Component Properties
| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| [Property] | [Type] | [Yes/No] | [Value] | [Description] |

### 6.5 Component Variants
[Supported visual/behavioral variants.]

### 6.6 Component States
[Default, Hover, Focus, Active, Selected, Disabled, Loading, Error, Success, Empty.]

### 6.7 User Interaction
[Keyboard, click, touch, drag-and-drop, shortcut keys, accessibility focus rings.]

### 6.8 Form Handling
[Zod schema validation, uncontrolled vs controlled inputs, error displays, autosave.]

### 6.9 Frontend State Management
[State ownership, store structure, selectors, cache invalidation, persistence.]

### 6.10 API Integration
[HTTP client, query hooks, optimistic mutations, error toasts, retry rules.]

### 6.11 Routing
[Routes, params, query strings, auth guards, role checks, 404/error boundaries.]

### 6.12 Responsive Behavior
[Mobile, tablet, desktop adaptations.]

### 6.13 Accessibility
[WCAG 2.1 AA, ARIA roles, live regions, contrast, keyboard trapping prevention.]

### 6.14 Frontend Acceptance Criteria
[Measurable UI tests and verification checks.]

---

# SECTION 7 — BACKEND TECHNICAL SPECIFICATION

## 7. Backend Implementation

### 7.1 Backend Component
[Backend service or module name.]

### 7.2 Backend Layer Structure
- Routes & Controllers
- Middlewares & Context
- Application & Domain Services
- Repositories & Data Mappers
- DTOs & Schema Validators
- Background Workers & Event Subscribers

### 7.3 Request Lifecycle
[End-to-end server request flow from TLS termination to DB commit and response serialization.]

### 7.4 Controller or Handler Specification
[Handler ID, purpose, route, input validation, service invocation, HTTP status codes.]

### 7.5 Service Specification
[Domain services, business rules, transactional boundaries, event emission.]

### 7.6 Repository Specification
[SQL/ORM operations, query filters, joins, pagination, tenant_id scoping.]

### 7.7 Middleware Specification
[Auth token verification, tenant resolution, rate limiter, request correlation IDs.]

### 7.8 Background Processing
[BullMQ jobs, payload schemas, concurrency, retries, exponential backoff, dead-letter queue.]

### 7.9 Backend State and Transactions
[ACID transaction boundaries, isolation levels, optimistic locking.]

### 7.10 Backend Acceptance Criteria
[Unit/integration test assertions and coverage requirements.]

---

# SECTION 8 — API TECHNICAL SPECIFICATION

## 8. API Endpoint and Contract Specification

### 8.1 API Overview
[API architecture and responsibility.]

### 8.2 API Identification
| Field | Details |
|---|---|
| API ID | [ID] |
| API Name | [Name] |
| API Version | [Version] |
| Protocol | [REST / GraphQL / gRPC / MCP] |
| Method | [Method] |
| Endpoint | [Path] |
| Authentication | [Method] |
| Authorization | [Permission] |
| Consumer | [Client] |
| Provider | [Service] |

### 8.3 Request Specification
[Headers, path params, query params, request body schema, constraints, examples.]

### 8.4 Request Example
\`\`\`json
{
  "key": "value"
}
\`\`\`

### 8.5 Response Specification
[Status codes, response body schema, pagination envelope, data types.]

### 8.6 Response Example
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

### 8.7 Error Response Specification
\`\`\`json
{
  "type": "https://api.domain.com/errors/RESOURCE_NOT_FOUND",
  "title": "Not Found",
  "status": 404,
  "detail": "Resource with specified identifier does not exist",
  "instance": "/api/v1/resource/123",
  "code": "ERR_NOT_FOUND"
}
\`\`\`

### 8.8 API Authorization
[Role requirements, RBAC policies, resource ownership verification.]

### 8.9 API Validation
[Zod schema rules, boundary constraints, sanitized inputs.]

### 8.10 API Behavior
[Idempotency headers, rate limit headers, ETags, pagination, sorting.]

### 8.11 API Versioning
[URL path versioning /v1/, header versioning, sunset deprecation policy.]

### 8.12 API Test Requirements
[Contract testing, schema validation tests, 4xx/5xx rejection tests.]

### 8.13 API Contract Documentation
[OpenAPI 3.1 specification snippet.]

---

# SECTION 9 — DATABASE TECHNICAL SPECIFICATION

## 9. Database Implementation

### 9.1 Database Identification
| Field | Details |
|---|---|
| Database ID | [ID] |
| Database Name | [Name] |
| Database Technology | [Technology] |
| Schema | [Schema] |
| Related Module | [Module] |
| Storage Type | [Relational / Document / Key-Value] |

### 9.2 Entity Specification
[Entity specifications, table names, primary keys, audit fields.]

### 9.3 Field Specification
| Field | Data Type | Required | Unique | Default | Validation |
|---|---|---|---|---|---|
| [Field] | [Type] | [Yes/No] | [Yes/No] | [Value] | [Rule] |

### 9.4 Relationship Specification
[Foreign keys, cascade rules, 1:1, 1:N, M:N join tables.]

### 9.5 Database Operations
[CRUD, bulk operations, soft deletes, upsert logic.]

### 9.6 Query Specifications
[Critical queries, joins, performance optimization, execution plans.]

### 9.7 Indexing Strategy
[B-tree indexes, compound indexes, partial indexes, tenant_id partitioning.]

### 9.8 Transaction Requirements
[Read Committed / Serializable isolation, rollback triggers.]

### 9.9 Migration Specification
[Migration script ID, UP statements, DOWN rollback statements, verification tests.]

### 9.10 Data Integrity Requirements
[Check constraints, foreign keys, unique indexes, multi-tenant RLS policies.]

### 9.11 Database Security
[Connection encryption TLS, credential vaulting, principle of least privilege.]

---

# SECTION 10 — DATA CONTRACTS AND SERIALIZATION

## 10. Data Structure Specification

### 10.1 Data Contract Inventory
| Contract ID | Contract | Producer | Consumer | Purpose |
|---|---|---|---|---|
| DC-001 | [Contract] | [Producer] | [Consumer] | [Purpose] |

### 10.2 Data Transfer Objects (DTOs)
[Input DTOs, Output DTOs, TypeScript interfaces, Zod schemas.]

### 10.3 Internal Data Models
[Domain models, entities, value objects.]

### 10.4 Serialization Rules
[ISO 8601 UTC timestamps, camelCase JSON keys, BigInt stringification, decimal precision.]

### 10.5 Data Mapping
[Mappers: Database row -> Domain Entity -> Presentation DTO.]

### 10.6 Contract Compatibility
[Backward compatibility, non-breaking schema evolution, additive field changes.]

---

# SECTION 11 — BUSINESS LOGIC AND ALGORITHM SPECIFICATION

## 11. Business Logic Implementation

### 11.1 Logic Inventory
| Logic ID | Logic Name | Purpose | Module |
|---|---|---|---|
| LOGIC-001 | [Logic] | [Purpose] | [Module] |

### 11.2 Logic Specification
[Logic ID, trigger, preconditions, inputs, business rules, calculations, outputs, exceptions.]

### 11.3 Algorithm Specification
[Algorithm name, inputs, outputs, data structures, complexity O(n), termination guarantees.]

### 11.4 Pseudocode
\`\`\`
function executeBusinessLogic(input) {
  validate(input);
  compute();
  return result;
}
\`\`\`

### 11.5 Formula Specification
[Mathematical formulas, precision, rounding mode, currency handling.]

### 11.6 Decision Logic
[Decision tables, boundary conditions, truth matrices.]

### 11.7 Concurrency Considerations
[Race condition mitigation, distributed locks with Redis Redlock, optimistic concurrency.]

### 11.8 Deterministic Behavior
[Idempotency keys, fixed seeds, reproducible calculation outputs.]

---

# SECTION 12 — WORKFLOW AND STATE MACHINE SPECIFICATION

## 12. Workflow Implementation

### 12.1 Workflow Identification
| Workflow ID | Name | Trigger | Owner |
|---|---|---|---|
| WF-001 | [Workflow] | [Trigger] | [Component] |

### 12.2 Workflow Steps
[Step sequence, actors, branch conditions, side effects, terminal points.]

### 12.3 Workflow State Machine
\`\`\`mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> InReview: Submit
    InReview --> Approved: Approve
    InReview --> Draft: RequestChanges
    Approved --> Active: Publish
    Active --> Archived: Archive
    Archived --> [*]
\`\`\`

### 12.4 Workflow Retry
[Step failure retry policies, saga pattern compensation actions.]

### 12.5 Workflow Persistence
[Database persistence of workflow execution context, step timers, audit trails.]

### 12.6 Workflow Sequence Diagram
\`\`\`mermaid
sequenceDiagram
    User ->> Frontend: Action
    Frontend ->> API: HTTP POST
    API ->> Service: Execute
    Service ->> DB: Commit
    Service -->> Frontend: 200 OK
\`\`\`

### 12.7 Workflow Acceptance Criteria
[Success criteria and verification scenarios.]

---

# SECTION 13 — STATE MANAGEMENT AND DATA SYNCHRONIZATION

## 13. State Specification

### 13.1 State Inventory
[Component state, Client cache, Session state, Server memory, Persistent DB, Distributed cache.]

### 13.2 State Ownership
[Authoritative owners for each state domain.]

### 13.3 State Initialization
[Bootstrap routines, hydration, default presets.]

### 13.4 State Updates
[Immutable mutations, dispatchers, action creators.]

### 13.5 State Persistence
[Local storage, encrypted cookies, Redis sessions, PostgreSQL records.]

### 13.6 Synchronization
[Cache invalidation, WebSocket push notifications, TanStack Query refetching.]

### 13.7 Concurrent State Changes
[Conflict resolution strategies, last-write-wins vs version-based optimistic locking.]

### 13.8 State Recovery
[Session restoration, offline queue reconciliation, reconnection handlers.]

---

# SECTION 14 — INTEGRATION TECHNICAL SPECIFICATIONS

## 14. External Integration

### 14.1 Integration Identification
| Field | Details |
|---|---|
| Integration ID | [ID] |
| Provider | [Provider] |
| Purpose | [Purpose] |
| Protocol | [Protocol] |
| Authentication | [Method] |
| Consumer Component | [Component] |
| Criticality | [Critical / High / Medium / Low] |

### 14.2 Connection Specification
[Base URL, timeouts, connection pooling, proxy configuration.]

### 14.3 Request and Response Mapping
[Inbound/outbound payload transformers.]

### 14.4 Authentication and Credentials
[OAuth 2.0 / API Keys / HMAC, secret rotation, vault retrieval.]

### 14.5 Retry and Failure Handling
[Exponential backoff with jitter, circuit breaker with Cockatiel/Opossum.]

### 14.6 Rate Limiting
[Provider quota tracking, client-side rate limiting.]

### 14.7 Webhook Specifications
[Webhook verification via HMAC-SHA256 signatures, replay attack prevention, idempotent event logging.]

### 14.8 Integration Monitoring
[Health probes, latency metrics, error alerting.]

---

# SECTION 15 — AUTHENTICATION AND AUTHORIZATION SPECIFICATION

## 15. Identity Implementation

### 15.1 Authentication Specification
[Stateless JWT tokens, Argon2id password hashing, refresh token rotation.]

### 15.2 Authorization Specification
[Role-Based Access Control (RBAC), Permission Matrix, Attribute-Based Access Control (ABAC).]

### 15.3 Permission Enforcement
[Controller guards, service layer assertions, SQL Row-Level Security (RLS).]

### 15.4 Session Management
[Token lifetimes, sliding window refresh, Redis blacklist revocation.]

### 15.5 Service Authentication
[mTLS, internal service JWTs, API token scopes.]

### 15.6 Authentication Failure Behavior
[Consistent 401 Unauthorized / 403 Forbidden responses, rate limiting on failed attempts.]

### 15.7 Security Acceptance Criteria
[Penetration test scenarios, token tampering rejections.]

---

# SECTION 16 — ERROR HANDLING AND EXCEPTION SPECIFICATION

## 16. Error Management

### 16.1 Error Classification
[Validation, Authentication, Authorization, Domain Rule, Database, Integration, System.]

### 16.2 Error Register
| Error ID | Error Name | Trigger | Severity | Recovery |
|---|---|---|---|---|
| ERR-001 | [Error] | [Trigger] | [Severity] | [Recovery] |

### 16.3 Error Specification
[Category, trigger, root cause, system response, user response, log level, retryable flag.]

### 16.4 Error Propagation
[Domain exceptions caught by central error middleware and mapped to RFC 7807 problem details.]

### 16.5 Logging Requirements
[Structured JSON logs with correlationId, timestamp, error stack, excluded PII.]

### 16.6 Fallback Behavior
[Graceful degradation, fallback data, user guidance.]

### 16.7 Recovery Requirements
[Self-healing triggers, automated re-auth, retry buttons.]

---

# SECTION 17 — VALIDATION AND DATA INTEGRITY

## 17. Validation Specification

### 17.1 Validation Layers
- Client-side Form Validation (immediate feedback).
- API Gateway / Controller Validation (Zod schema gates).
- Domain Model Invariant Validation (business rule enforcement).
- Database Constraint Enforcement (NOT NULL, CHECK, UNIQUE, FOREIGN KEY).

### 17.2 Input Validation
[Per-field validation rules, regex patterns, boundary limits.]

### 17.3 Business Validation
[Cross-entity validation, quota limits, state preconditions.]

### 17.4 Cross-Field Validation
[Inter-dependent field rules.]

### 17.5 Duplicate Prevention
[Unique constraints, client submission debounce, server idempotency keys.]

### 17.6 Data Integrity
[Referential integrity, transaction ACID compliance, tenant data isolation.]

---

# SECTION 18 — PERFORMANCE AND SECURITY REQUIREMENTS

## 18. Performance Specification

### 18.1 Performance Targets
| Metric | Required Target | Measurement Method | Conditions |
|---|---|---|---|
| API Latency | P95 < 200ms | Prometheus / APM | Normal Load |
| Page Load | FCP < 1.0s, LCP < 2.5s | Lighthouse | Broadband |
| Query Performance | P95 < 50ms | pg_stat_statements | Indexed queries |
| Queue Processing | P95 < 500ms | BullMQ Metrics | Worker pools |

### 18.2 Performance Optimization
[Redis caching, DB connection pooling, HTTP response compression, asset bundling.]

## 19. Security Specification

### 19.1 Security Controls
[OWASP Top 10 defenses: parameterized queries, XSS sanitization, CSRF tokens, CSP headers.]

### 19.2 Sensitive Data Handling
[AES-256 field-level encryption for PII, TLS 1.3 in transit, data redaction in logs.]

### 19.3 Input and Output Security
[Strict typing, schema validation, output escaping.]

### 19.4 Secrets Handling
[Environment variable injection, HashiCorp Vault / AWS Secrets Manager.]

### 19.5 Audit Requirements
[Immutable audit logging for auth, data mutation, role changes, exports.]

### 19.6 Security Testing
[DAST, SAST, dependency vulnerability scanning in CI/CD.]

---

# SECTION 19 — REAL-TIME AND BACKGROUND PROCESSING

## 20. Asynchronous Processing Specification
[BullMQ job queues, Redis broker, job retries, dead letter queue monitoring.]

## 21. Real-Time Communication Specification
[WebSocket / SSE architecture, connection authentication, channel subscriptions, event broadcasts.]

## 22. Scheduled Processing
[Cron schedulers, node-cron / BullMQ repeatable jobs, distributed locks.]

---

# SECTION 20 — FILE AND MEDIA PROCESSING

## 23. File Operations

### 23.1 Upload
[Presigned S3/GCS URLs, MIME type validation, max size limits, malware scanning.]

### 23.2 Processing
[Image resizing (Sharp), metadata stripping, PDF generation.]

### 23.3 Download and Preview
[Expiring signed download URLs, range requests for streaming.]

### 23.4 Storage Lifecycle
[Lifecycle rules: active bucket -> cold archive -> deletion policy.]

---

# SECTION 21 — TECHNICAL CONFIGURATION SPECIFICATION

## 24. Configuration Requirements

### 24.1 Configuration Inventory
| Config ID | Name | Type | Default | Environment | Sensitive |
|---|---|---|---|---|---|
| CFG-001 | [Name] | [Type] | [Value] | [Environment] | [Yes/No] |

### 24.2 Environment Configuration
[Development, Staging, Production configurations.]

### 24.3 Feature Flags
[Flag name, purpose, default state, rollout percentage.]

### 24.4 Secret Configuration
[Secure secrets management, key rotation schedules.]

### 24.5 Configuration Validation
[Zod validation of process.env on server startup to fail fast on missing keys.]

---

# SECTION 22 — TESTING AND VERIFICATION SPECIFICATION

## 25. Technical Testing Requirements

### 25.1 Unit Testing
[Vitest / Jest specifications, mock standards, coverage threshold >= 85%.]

### 25.2 Component Testing
[React Testing Library specifications, user interaction simulations.]

### 25.3 Integration Testing
[Supertest API integration tests against ephemeral test database.]

### 25.4 API Testing
[Happy path, validation rejection, 401/403 security, edge cases.]

### 25.5 Database Testing
[Migration verification, transaction rollbacks, constraint violation tests.]

### 25.6 End-to-End Testing
[Playwright end-to-end browser workflows.]

### 25.7 Performance Testing
[k6 load test scripts, concurrency stress tests.]

### 25.8 Security Testing
[Automated vulnerability testing, auth boundary testing.]

### 25.9 Regression Testing
[Continuous regression test suite executed in pull requests.]

## 26. Test Case Specification
| Test ID | Title | Component | Type | Expected Result | Pass Criteria |
|---|---|---|---|---|---|
| TC-001 | [Title] | [Component] | [Type] | [Result] | [Criteria] |

## 27. Technical Acceptance Criteria
[Measurable completion conditions.]

---

# SECTION 23 — IMPLEMENTATION AND CODE QUALITY REQUIREMENTS

## 28. Implementation Standards

### 28.1 Coding Standards
[TypeScript strict mode, ESLint airbnb-typescript rules, Prettier formatting.]

### 28.2 Code Quality
[Zero TypeScript any types, automated SonarQube / CodeClimate checks.]

### 28.3 Git Standards
[Conventional Commits (feat, fix, chore, refactor), PR reviews, CI passing required.]

### 28.4 Documentation Requirements
[TSDoc on public interfaces, READMEs per package, OpenAPI spec sync.]

### 28.5 Definition of Done
[Implementation complete, tests pass with >= 85% coverage, CI green, PR reviewed, docs updated.]

---

# SECTION 24 — DEPLOYMENT AND RUNTIME SPECIFICATION

## 29. Deployment Requirements

### 29.1 Deployment Unit
[Docker container specification, multi-stage build, minimal base image.]

### 29.2 Runtime Requirements
[Node.js 20+ LTS, 2 CPU cores, 4 GB RAM, Linux Alpine/Debian.]

### 29.3 Environment Variables
[Full list of environment variables.]

### 29.4 Startup and Shutdown
[Graceful shutdown on SIGTERM, draining active requests, closing DB pools.]

### 29.5 Health Checks
[/health/live for liveness, /health/ready for readiness (DB + Redis checks).]

### 29.6 Deployment Dependencies
[DB migrations run before traffic cutover.]

### 29.7 Rollback
[Automated rollback on failed readiness probe.]

### 29.8 Runtime Monitoring
[OpenTelemetry tracing, Prometheus metrics endpoint, central log streaming.]

---

# SECTION 25 — TECHNICAL DEPENDENCIES AND COMPATIBILITY

## 30. Dependency Specification

### 30.1 Dependency Inventory
| Dependency ID | Package / Service | Version | Purpose | Criticality |
|---|---|---|---|---|
| PKG-001 | [Dependency] | [Version] | [Purpose] | [Level] |

### 30.2 Dependency Compatibility
[Compatibility matrix across Node, TypeScript, DB drivers, UI frameworks.]

### 30.3 Dependency Security
[npm audit / Snyk automated vulnerability scanning.]

### 30.4 External Dependency Failure
[Graceful fallbacks and degradation when external dependencies fail.]

### 30.5 Technical Compatibility Matrix
[Inter-component compatibility specifications.]

---

# SECTION 26 — TECHNICAL RISK AND CHANGE MANAGEMENT

## 31. Technical Risk Register
| Risk ID | Description | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| TRISK-001 | [Risk] | [Level] | [Level] | [Action] | [Owner] |

## 32. Technical Issue Register
[Known implementation problems and blockers.]

## 33. Technical Debt Register
[Tracked technical debt items with planned remediation sprints.]

## 34. Change Impact Analysis
[Impact assessment procedure for modifying schemas, APIs, or contracts.]

---

# SECTION 27 — IMPLEMENTATION TASK BREAKDOWN

## 35. Technical Work Breakdown

### 35.1 Task Inventory
| Task ID | Task Name | Component | Description | Priority | Dependency |
|---|---|---|---|---|---|
| TECH-TASK-001 | [Task] | [Component] | [Description] | [Priority] | [Task ID] |

### 35.2 Task Specification
[Task objective, files affected, implementation steps, test requirements, complexity.]

### 35.3 Implementation Sequence
[Recommended execution order.]

### 35.4 Parallelization Opportunities
[Independent tasks suitable for parallel development.]

### 35.5 Critical Dependencies
[Blocker tasks that govern downstream work.]

### 35.6 AI Coding Agent Instructions
[Instructions for AI coding agents: files allowed to change, prohibited patterns, test deliverables.]

---

# SECTION 28 — FINAL SPECIFICATION SUMMARY

## 36. Technical Summary
[Comprehensive technical summary of the implementation blueprint.]

## 37. Technical Readiness Assessment
| Category | Status | Remarks |
|---|---|---|
| Specification Scope | [Status] | [Remarks] |
| Requirement Mapping | [Status] | [Remarks] |
| Component Definition | [Status] | [Remarks] |
| Frontend Specification | [Status] | [Remarks] |
| Backend Specification | [Status] | [Remarks] |
| API Specification | [Status] | [Remarks] |
| Database Specification | [Status] | [Remarks] |
| Business Logic | [Status] | [Remarks] |
| Workflow Specification | [Status] | [Remarks] |
| Error Handling | [Status] | [Remarks] |
| Security | [Status] | [Remarks] |
| Performance | [Status] | [Remarks] |
| Dependencies | [Status] | [Remarks] |
| Testing | [Status] | [Remarks] |
| Acceptance Criteria | [Status] | [Remarks] |
| Implementation Tasks | [Status] | [Remarks] |

## 38. Outstanding Technical Questions
| Question ID | Question | Technical Impact | Priority | Owner |
|---|---|---|---|---|
| TQ-001 | [Question] | [Impact] | [Priority] | [Owner] |

## 39. Technical Decisions
[Decisions requiring stakeholder approval.]

## 40. Final Technical Recommendations
[Best practice engineering recommendations.]

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM
| Item | Prefix | Example |
|---|---|---|
| Specification | TS | TS-001 |
| Component | TCMP | TCMP-001 |
| Operation | OP | OP-001 |
| Logic | LOGIC | LOGIC-001 |
| API | API | API-001 |
| Endpoint | END | END-001 |
| Database Entity | ENT | ENT-001 |
| Database Field | FIELD | FIELD-001 |
| Data Contract | DC | DC-001 |
| Workflow | WF | WF-001 |
| State | STATE | STATE-001 |
| Error | ERR | ERR-001 |
| Configuration | CFG | CFG-001 |
| Dependency | DEP | DEP-001 |
| Test Case | TC | TC-001 |
| Technical Task | TECH-TASK | TECH-TASK-001 |
| Technical Risk | TRISK | TRISK-001 |
| Technical Question | TQ | TQ-001 |
| Decision | TDEC | TDEC-001 |

---

# APPENDIX B — STANDARD TECHNICAL ENUMERATIONS

## Specification Status
- Proposed, Draft, Under Review, Approved, In Development, Implemented, Verified, Deprecated, Rejected.

## Priority & Complexity
- Priority: Critical, High, Medium, Low.
- Complexity: Very Low, Low, Medium, High, Very High.

## Execution Type
- Synchronous, Asynchronous, Scheduled, Event-Driven, Streaming, Interactive.

---

# APPENDIX C — FINAL TECHNICAL SPECIFICATION VALIDATION
- [x] Specification Understanding verified against PRD and Architecture.
- [x] Technical Design and Component boundaries documented.
- [x] Application Implementation specified for Frontend & Backend.
- [x] Data Entities, Fields, and Migrations specified.
- [x] Reliability, Security, and Error Handling specified.
- [x] Comprehensive Testing Strategy documented.
- [x] Implementation Readiness & AI Coding Agent Instructions finalized.
- [x] Final Quality and traceability verified.
`;

/**
 * Deterministic technical specification generator fulfilling the 28-section standard
 */
export function generateDeterministicTechSpec(
  projectName: string,
  fd: SRSFormData,
  dateStr: string
): string {
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'AWS ECS Fargate & Aurora Serverless';
  const authMethod = (fd['security']?.['authentication_methods'] as string) || 'Stateless JWT with Sliding Refresh Tokens & Argon2id';
  const compliance = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'SOC 2, GDPR, OWASP Top 10';

  return `# TECHNICAL SPECIFICATION DOCUMENT (TSD)
## AI-Generated Software Engineering Specification

**Document Type:** Technical Specification Document  
**Document Version:** 1.0  
**Project Name:** ${projectName}  
**Product Name:** ${projectName} Engine  
**Specification ID:** TS-001  
**Specification Title:** Core Platform Implementation & Data Contracts  
**Related Module:** Platform Core, Auth, Domain Engines  
**Related Feature:** Complete Multi-Tenant System  
**Document Status:** Approved  
**Prepared By:** AI Technical Specification Agent  
**Technical Owner:** Principal Systems Architect  
**Reviewer:** Lead Software Engineer  
**Date Created:** ${dateStr}  
**Last Updated:** ${dateStr}  
**Target Release:** v1.0.0

---

# SECTION 1 — SPECIFICATION OVERVIEW

## 1. Specification Identification

### 1.1 Document Information
| Field | Details |
|---|---|
| Specification ID | TS-001 |
| Specification Name | Master Technical Specification & Data Contracts |
| Project Name | ${projectName} |
| Application | Web Application & Core API Services |
| Module | Authentication, Multi-Tenancy, Core Domain, Background Processing |
| Submodule | All Core Submodules |
| Feature | End-to-End Enterprise Production Suite |
| Technical Area | Full Stack (Frontend, Backend, Database, API, Queues) |
| Related PRD | PRD.md (v1.0) |
| Related Architecture | architecture.md (ARC-001) |
| Specification Version | 1.0.0 |
| Status | Approved |
| Technical Owner | Principal Systems Architect |
| Reviewer | Lead Software Engineer |

### 1.2 Specification Purpose
This document establishes the precise, implementation-grade technical blueprint for ${projectName}. It defines executable database schemas (DDL), machine-readable API contracts (OpenAPI/TypeScript), backend service architectures, frontend state machines, background asynchronous queues, and automated test gates.

### 1.3 Technical Scope
- **In-Scope:** Relational PostgreSQL schemas with Row-Level Security (RLS), Zod request validators, Express route controllers, BullMQ job queues, Redis caching, React 19 UI component specifications, and Vitest/Playwright test suites.
- **Excluded:** Legacy third-party software migrations and deprecated protocol wrappers.

### 1.4 Technical Objectives
1. Provide zero-ambiguity implementation specifications for human engineers and AI coding agents.
2. Enforce strict type safety across all network and persistence boundaries (Zod -> TypeScript -> PostgreSQL).
3. Guarantee sub-200ms P95 API response latencies and 99.9% availability.

### 1.5 Specification Boundaries
Inherits all system boundaries, quality drivers, and architectural invariants from \`architecture.md\` (ARC-001) and product requirements from \`PRD.md\`.

### 1.6 Specification Dependencies
| Dependency ID | Document / Component | Dependency Type | Description |
|---|---|---|---|
| DEP-001 | PRD.md | Requirement Source | Authoritative functional requirements FR-001..FR-012 |
| DEP-002 | architecture.md | Architecture Source | C4 system topology, ADR-001..ADR-005, and clean layering |
| DEP-003 | designs.md | UI Design System | Design tokens, color palette, and component primitives |

---

# SECTION 2 — REQUIREMENT REFERENCES

## 2. Requirements Traceability

### 2.1 Related Product Requirements
| Requirement ID | Requirement Title | Description | Priority |
|---|---|---|---|
| FR-001 | Multi-Tenant Organization Management | Provisioning, isolation, and tenant-scoped data access | Critical |
| FR-002 | Authentication & Session Lifecycle | User registration, MFA, JWT generation, and token rotation | Critical |
| FR-003 | Core Domain Entity Operations | CRUD operations, state machines, and business invariant checks | High |
| FR-004 | Background Worker & Job Processing | Async queues for compute-intensive mutations and data sync | High |
| FR-005 | Audit Logging & Event Tracking | Tamper-evident ledger of all state-mutating transactions | High |

### 2.2 Related User Stories
| Story ID | User Story | Related Technical Scope |
|---|---|---|
| US-001 | As an admin, I want to authenticate securely with MFA so my data is protected | TCMP-001 Auth Controller, JWT Service, Argon2id |
| US-002 | As a member, I want instantaneous mutations so my workflow is uninterrupted | TCMP-002 Domain Controller, BullMQ Queue Worker |
| US-003 | As a tenant owner, I want isolated storage so other tenants never see my data | TCMP-003 PostgreSQL RLS & Tenant Scoped Repositories |

### 2.3 Related Architecture Components
- **Application:** \`apps/web\` (React 19), \`apps/api\` (${backend})
- **Containers:** Docker multi-stage container images for Node.js API and static Nginx client
- **Databases:** PostgreSQL 16 Primary with Read-Replicas, Redis 7 In-Memory Cache
- **Workers:** BullMQ async processor running dedicated background worker tasks

---

# SECTION 3 — TECHNICAL COMPONENT IDENTIFICATION

## 3. Component Overview

### 3.1 Component Information
| Component ID | Component Name | Component Type | Business Responsibility | Technology |
|---|---|---|---|---|
| TCMP-001 | Auth & Identity Service | Backend Service | User auth, token lifecycle, password hashing | Node.js, Argon2id, JWT |
| TCMP-002 | Core Domain Manager | Backend Service | Domain business rules, transaction boundaries | TypeScript, Clean Services |
| TCMP-003 | Persistence Repository | Data Layer | Multi-tenant SQL execution, RLS policies | PostgreSQL 16, pg-promise |
| TCMP-004 | Background Queue Worker | Asynchronous Engine | Heavy computational jobs, webhook delivery | BullMQ, Redis 7 |
| TCMP-005 | Web Application Shell | Frontend Client | Responsive UI, state management, form inputs | React 19, Tailwind, Zustand |

### 3.2 Component Interaction Diagram
\`\`\`mermaid
flowchart TD
    Client["TCMP-005: React 19 Client"] -->|"HTTPS / JSON"| API["TCMP-001 & TCMP-002: API Gateway"]
    API -->|"SQL / RLS Context"| DB[("TCMP-003: PostgreSQL 16")]
    API -->|"Push Job"| Queue[("Redis 7 / BullMQ")]
    Queue -->|"Process"| Worker["TCMP-004: Worker Pool"]
    Worker -->|"Update State"| DB
\`\`\`

---

# SECTION 4 — DETAILED FUNCTIONAL TECHNICAL SPECIFICATIONS

## 4. Technical Feature Specifications

### 4.1 Feature Identification
- **Feature ID:** FEAT-001
- **Feature Name:** Secure Multi-Tenant Data Mutation Pipeline
- **Parent Module:** Core Domain
- **Component:** TCMP-002 / TCMP-003

### 4.2 Feature Operations
| Operation ID | Operation | Description | Trigger |
|---|---|---|---|
| OP-001 | ExecuteMutation | Validate payload, verify tenant RLS, execute transaction | Client HTTP POST/PUT |
| OP-002 | EnqueueJob | Dispatch asynchronous task to Redis BullMQ worker | Domain Event Trigger |
| OP-003 | RecordAuditLog | Append immutable entry to tenant audit ledger | Transaction Completion |

### 4.3 Operation Specification: OP-001 (ExecuteMutation)
- **Preconditions:** Valid bearer JWT in Authorization header; active tenant membership.
- **Input:** JSON payload validated against Zod schema \`MutationInputSchema\`.
- **Processing:**
  1. Extract \`tenant_id\` and \`user_id\` from authenticated JWT payload.
  2. Open database connection from pool and execute \`SET LOCAL app.current_tenant_id = :tenantId\`.
  3. Begin atomic ACID transaction.
  4. Verify domain invariants (DR-001 to DR-004).
  5. Insert/update entity record.
  6. Emit domain event to BullMQ queue.
  7. Commit transaction; release connection to pool.
- **Output:** HTTP 200 OK with sanitized entity DTO.
- **Exceptions:**
  - 400 Bad Request if Zod validation fails.
  - 401 Unauthorized if JWT expired or signature invalid.
  - 403 Forbidden if user lacks required role permissions.
  - 409 Conflict on unique constraint or optimistic lock collision.

---

# SECTION 5 — APPLICATION AND CODE STRUCTURE

## 5. Source Code Architecture

### 5.1 Folder Structure
\`\`\`
srs_genie/
├── apps/
│   ├── web/                    # Frontend React 19 application
│   │   ├── src/
│   │   │   ├── components/     # UI primitives & composite widgets
│   │   │   ├── hooks/          # Custom query & mutation hooks
│   │   │   ├── stores/         # Zustand global state stores
│   │   │   └── pages/          # Viewport screen layouts
│   └── api/                    # Backend API application (${backend})
│       ├── src/
│       │   ├── controllers/    # Express route controllers
│       │   ├── services/       # Domain business logic services
│       │   ├── repositories/   # PostgreSQL RLS repositories
│       │   ├── middlewares/    # Auth, Tenant, RateLimit middlewares
│       │   ├── workers/        # BullMQ job processors
│       │   └── schemas/        # Zod validation schemas
├── packages/
│   ├── types/                  # Shared TypeScript interfaces & DTOs
│   ├── db/                     # DDL migrations, seeds, SQL scripts
│   └── config/                 # Shared linting & TS configurations
└── docker-compose.yml          # Local containerized infrastructure
\`\`\`

### 5.2 Naming Conventions
- **Files:** \`kebab-case.ts\` for utilities, \`PascalCase.tsx\` for React components.
- **Classes & Types:** \`PascalCase\` (e.g., \`UserRepository\`, \`TenantContext\`).
- **Functions & Methods:** \`camelCase\` (e.g., \`findTenantById\`, \`validateSession\`).
- **Database Tables:** \`snake_case\` plural (e.g., \`tenants\`, \`users\`, \`audit_logs\`).
- **Environment Variables:** \`UPPER_SNAKE_CASE\` (e.g., \`DATABASE_URL\`, \`REDIS_PORT\`).

---

# SECTION 6 — FRONTEND TECHNICAL SPECIFICATION

## 6. Frontend Architecture Specification

### 6.1 Frontend Stack & Component Hierarchy
- **Framework:** ${frontend}
- **Routing:** React Router v7 / TanStack Router with authenticated route guards.
- **State Management:** TanStack Query v5 for server cache; Zustand for UI client state.
- **Form Management:** React Hook Form + Zod resolver with real-time field validation.

### 6.2 Key State Management Architecture
\`\`\`typescript
import { create } from 'zustand';

interface AppUIState {
  activeTenantId: string | null;
  activeSidebarTab: string;
  isProcessing: boolean;
  setActiveTenant: (id: string) => void;
  setProcessing: (status: boolean) => void;
}

export const useUIStore = create<AppUIState>((set) => ({
  activeTenantId: null,
  activeSidebarTab: 'dashboard',
  isProcessing: false,
  setActiveTenant: (id) => set({ activeTenantId: id }),
  setProcessing: (status) => set({ isProcessing: status }),
}));
\`\`\`

---

# SECTION 7 — BACKEND TECHNICAL SPECIFICATION

## 7. Backend Implementation

### 7.1 Backend Layer Structure
- **Controller Layer:** Route matching, input deserialization, Zod schema validation.
- **Middleware Layer:** JWT validation, tenant context injection, rate limiting, request tracing.
- **Service Layer:** Business invariants, transaction orchestration, domain event emission.
- **Repository Layer:** SQL generation, parameter binding, RLS isolation enforcement.

### 7.2 Request Lifecycle Sequence
\`\`\`mermaid
sequenceDiagram
    participant Client
    participant AuthMW as Auth Middleware
    participant TenantMW as Tenant Context MW
    participant Controller
    participant Service
    participant Repo as Repository (SQL)
    participant DB as PostgreSQL 16

    Client ->> AuthMW: GET /api/v1/projects (Bearer JWT)
    AuthMW ->> AuthMW: Verify JWT & Blacklist
    AuthMW ->> TenantMW: Next(userId, tenantId)
    TenantMW ->> Controller: Next(req.context)
    Controller ->> Service: getProjects(tenantId)
    Service ->> Repo: findAll(tenantId)
    Repo ->> DB: SET LOCAL app.current_tenant_id = :id; SELECT * FROM projects;
    DB -->> Repo: Rows[]
    Repo -->> Service: ProjectEntities[]
    Service -->> Controller: ProjectDTOs[]
    Controller -->> Client: 200 OK (JSON)
\`\`\`

---

# SECTION 8 — API TECHNICAL SPECIFICATION

## 8. API Endpoint and Contract Specification

### 8.1 API Identification & Contracts
| API ID | Method | Endpoint | Auth | Purpose |
|---|---|---|---|---|
| API-001 | POST | /api/v1/auth/register | Public | Register new user and provision initial tenant |
| API-002 | POST | /api/v1/auth/login | Public | Authenticate credentials; return JWT + refresh token |
| API-003 | POST | /api/v1/auth/refresh | Refresh Token | Issue fresh access token using sliding rotation |
| API-004 | GET | /api/v1/projects | Bearer JWT | List projects scoped to active tenant |
| API-005 | POST | /api/v1/projects | Bearer JWT | Create new project with audit record |
| API-006 | GET | /api/v1/projects/:id | Bearer JWT | Retrieve project by UUID |
| API-007 | PUT | /api/v1/projects/:id | Bearer JWT | Update project with optimistic locking |
| API-008 | DELETE | /api/v1/projects/:id | Bearer JWT | Soft-delete project |

### 8.2 OpenAPI 3.1 REST Specification Snippet
\`\`\`yaml
openapi: 3.1.0
info:
  title: ${projectName} API
  version: 1.0.0
paths:
  /api/v1/projects:
    post:
      summary: Create new project
      operationId: createProject
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, type]
              properties:
                name:
                  type: string
                  minLength: 3
                  maxLength: 100
                type:
                  type: string
                  enum: [production, prototype, internal]
                description:
                  type: string
                  maxLength: 500
      responses:
        '201':
          description: Project created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectResponse'
        '400':
          $ref: '#/components/schemas/ValidationError'
        '401':
          $ref: '#/components/schemas/UnauthorizedError'
components:
  schemas:
    ProjectResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        tenantId:
          type: string
          format: uuid
        name:
          type: string
        status:
          type: string
        createdAt:
          type: string
          format: date-time
\`\`\`

---

# SECTION 9 — DATABASE TECHNICAL SPECIFICATION

## 9. Database Implementation

### 9.1 Database Identification
- **Technology:** ${database}
- **Primary Database:** \`${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_prod\`
- **Isolation Strategy:** Multi-Tenant Row-Level Security (RLS) via PostgreSQL policies

### 9.2 Executable PostgreSQL DDL Schema
\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'standard',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- Projects Table (Multi-Tenant Scoped)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INT NOT NULL DEFAULT 1,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects(tenant_id, status);

-- Audit Ledger Table (Immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    ip_address INET,
    user_agent TEXT,
    payload_before JSONB,
    payload_after JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant_created ON audit_logs(tenant_id, created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_projects ON projects
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY tenant_isolation_audit ON audit_logs
    FOR SELECT
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
\`\`\`

---

# SECTION 10 — DATA CONTRACTS AND SERIALIZATION

## 10. Data Structure Specification

### 10.1 Zod Data Transfer Objects (DTOs)
\`\`\`typescript
import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['production', 'prototype', 'internal']).default('production'),
  metadata: z.record(z.unknown()).default({}),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const ProjectResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.enum(['active', 'archived', 'pending']),
  version: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ProjectResponseDTO = z.infer<typeof ProjectResponseSchema>;
\`\`\`

---

# SECTION 11 — BUSINESS LOGIC AND ALGORITHM SPECIFICATION

## 11. Business Invariant Implementation

### 11.1 System Domain Invariants
- **DR-001 (Tenant Isolation):** Every database operation must resolve \`tenant_id\` from the authenticated JWT session; cross-tenant updates are rejected at the RLS policy boundary.
- **DR-002 (Idempotent Payments & Mutations):** Every write mutation accepts an \`Idempotency-Key\` header; duplicate keys within 24 hours return cached responses without re-executing.
- **DR-003 (Immutable Audit Trail):** The \`audit_logs\` table permits \`INSERT\` and \`SELECT\` operations only; \`UPDATE\` and \`DELETE\` are revoked at the database role level.
- **DR-004 (Optimistic Concurrency Control):** Entity updates check \`version = :version\` and increment on save; version mismatches trigger \`409 Conflict\`.

---

# SECTION 12 — WORKFLOW AND STATE MACHINE SPECIFICATION

## 12. Workflow Implementation

### 12.1 Project Entity State Machine
\`\`\`mermaid
stateDiagram-v2
    [*] --> Draft: Create
    Draft --> Active: Validate & Activate
    Active --> Suspended: Lock / Quota Breach
    Suspended --> Active: Resolve / Unlock
    Active --> Archived: Archive Request
    Archived --> Deleted: Soft Delete
    Deleted --> [*]
\`\`\`

---

# SECTION 13 — STATE MANAGEMENT AND DATA SYNCHRONIZATION

## 13. State Specification
- **Client Cache:** TanStack Query with 5-minute stale-while-revalidate policy.
- **Session State:** Redis in-memory key-value store with sliding 30-minute expiration.
- **Database State:** PostgreSQL 16 ACID transactions with \`READ COMMITTED\` isolation level.

---

# SECTION 14 — INTEGRATION TECHNICAL SPECIFICATIONS

## 14. External Integration

### 14.1 Webhook & Provider Specifications
- **Payment Gateway / Webhooks:** Inbound webhook payloads verified via \`HMAC-SHA256\` signatures against shared secret.
- **Object Storage:** Presigned S3/GCS PUT URLs generated on demand with 15-minute expiration; direct client upload bypasses application server memory.

---

# SECTION 15 — AUTHENTICATION AND AUTHORIZATION SPECIFICATION

## 15. Identity Implementation
- **Authentication:** ${authMethod}
- **Access Tokens:** RS256/HS256 signed JWTs with 15-minute lifetime; includes \`sub\` (userId), \`tenantId\`, and \`role\`.
- **Refresh Tokens:** Cryptographically random 64-character tokens stored in Redis with 7-day expiration; sliding rotation on refresh.
- **Password Security:** Argon2id with 64MB memory cost, 3 iterations, and 4 threads.

---

# SECTION 16 — ERROR HANDLING AND EXCEPTION SPECIFICATION

## 16. RFC 7807 Error Response Specification
All API errors return RFC 7807 problem details:
\`\`\`json
{
  "type": "https://api.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/errors/RESOURCE_CONFLICT",
  "title": "Conflict",
  "status": 409,
  "detail": "The entity has been modified by another concurrent transaction (optimistic locking failure).",
  "instance": "/api/v1/projects/a1b2c3d4",
  "code": "ERR_OPTIMISTIC_LOCK_COLLISION",
  "timestamp": "${dateStr}"
}
\`\`\`

---

# SECTION 17 — VALIDATION AND DATA INTEGRITY

## 17. Validation Specification
- **Boundary Validation:** Every controller invokes Zod schema validation before passing data to domain services.
- **Database Constraints:** Foreign keys with \`ON DELETE CASCADE\` / \`RESTRICT\`, NOT NULL on critical columns, unique composite indexes \`(tenant_id, name)\`.

---

# SECTION 18 — PERFORMANCE AND SECURITY REQUIREMENTS

## 18. Performance & Security Targets
| Metric | Required Target | Verification Method |
|---|---|---|
| API P95 Latency | < 200 ms | k6 load tests running in CI/CD |
| DB Query P95 | < 50 ms | PostgreSQL pg_stat_statements |
| Webhook Verification | HMAC-SHA256 | Automated cryptographic rejection test suite |
| Encryption at Rest | AES-256 | AWS KMS / Encrypted EBS & RDS volumes |
| Encryption in Transit | TLS 1.3 | Strict transport security (HSTS) |

---

# SECTION 19 — REAL-TIME AND BACKGROUND PROCESSING

## 19. Asynchronous Queue Architecture (BullMQ)
\`\`\`typescript
import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export const projectQueue = new Queue('project-tasks', { connection });

export const projectWorker = new Worker(
  'project-tasks',
  async (job) => {
    console.log(\`Processing job \${job.id} of type \${job.name}\`);
    // Execute domain mutation
    return { success: true, processedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 5,
    limiter: { max: 100, duration: 1000 }
  }
);
\`\`\`

---

# SECTION 20 — FILE AND MEDIA PROCESSING

## 20. File Operations
- **Upload Pipeline:** Client requests presigned S3 URL -> Server validates permissions & issues 15-min signed URL -> Client uploads directly to bucket -> S3 event triggers thumbnail/processing worker.

---

# SECTION 21 — TECHNICAL CONFIGURATION SPECIFICATION

## 21. Environment Configuration Matrix
| Variable Name | Description | Default / Example | Sensitive |
|---|---|---|---|
| \`NODE_ENV\` | Runtime environment | \`production\` | No |
| \`PORT\` | HTTP server port | \`3000\` | No |
| \`DATABASE_URL\` | PostgreSQL connection URI | \`postgresql://user:pass@localhost:5432/db\` | Yes |
| \`REDIS_URL\` | Redis connection URI | \`redis://localhost:6379\` | Yes |
| \`JWT_SECRET\` | Secret key for JWT signing | \`hex-64-character-secret\` | Yes |
| \`CORS_ORIGIN\` | Allowed frontend origin | \`https://app.domain.com\` | No |

---

# SECTION 22 — TESTING AND VERIFICATION SPECIFICATION

## 22. Testing Strategy & Quality Gates
- **Unit Testing (Vitest):** Minimum 85% branch coverage required for all domain services.
- **Integration Testing (Supertest):** Full test suite verifying route validation, auth rejection, and database transactions.
- **End-to-End Testing (Playwright):** Browser automation covering user registration, project creation, and team member invitation.

---

# SECTION 23 — IMPLEMENTATION AND CODE QUALITY REQUIREMENTS

## 23. Engineering Standards
- **Language:** TypeScript 5.5+ in strict mode (\`noImplicitAny: true\`, \`strictNullChecks: true\`).
- **Linter & Formatter:** ESLint + Prettier with git pre-commit hooks via Husky.
- **Definition of Done:** All unit and integration tests pass, zero lint errors, code coverage >= 85%, and peer review approval.

---

# SECTION 24 — DEPLOYMENT AND RUNTIME SPECIFICATION

## 24. Deployment & Infrastructure
- **Runtime:** Node.js 20 LTS Alpine multi-stage Docker container running with non-root user.
- **Health Checks:** \`/health/live\` (process running) and \`/health/ready\` (DB pool & Redis verified).
- **Graceful Shutdown:** Intercepts \`SIGTERM\` and \`SIGINT\`, finishes active HTTP requests, and closes connection pools.

---

# SECTION 25 — TECHNICAL DEPENDENCIES AND COMPATIBILITY

## 25. Core Dependencies
| Dependency | Version | Purpose |
|---|---|---|
| \`react\` | ^19.0.0 | Frontend component library |
| \`express\` | ^4.21.0 | Backend HTTP web server |
| \`pg\` / \`pg-promise\` | ^8.12.0 | PostgreSQL client with connection pooling |
| \`bullmq\` | ^5.8.0 | Redis-based asynchronous queue engine |
| \`zod\` | ^3.23.0 | Runtime schema validation & type inference |
| \`jsonwebtoken\` | ^9.0.2 | Stateless JWT token creation and verification |

---

# SECTION 26 — TECHNICAL RISK AND CHANGE MANAGEMENT

## 26. Technical Risk Register
| Risk ID | Description | Impact | Mitigation Strategy | Owner |
|---|---|---|---|---|
| TRISK-001 | Cross-tenant data leakage | Critical | PostgreSQL Row-Level Security (RLS) + automated boundary tests | Security Lead |
| TRISK-002 | Redis queue memory exhaustion | High | BullMQ job eviction policies & dead-letter queue alerts | DevOps Lead |
| TRISK-003 | DB connection pool exhaustion | High | PgBouncer connection pooling & 5-second query timeouts | Backend Lead |

---

# SECTION 27 — IMPLEMENTATION TASK BREAKDOWN

## 27. Technical Task Backlog
| Task ID | Task Title | Component | Description | Priority |
|---|---|---|---|---|
| TECH-TASK-001 | Database Migration Suite | TCMP-003 | Implement initial DDL schema with RLS policies | Critical |
| TECH-TASK-002 | Auth & JWT Middleware | TCMP-001 | Build login, registration, and sliding token rotation | Critical |
| TECH-TASK-003 | Project Controller & CRUD | TCMP-002 | Build Zod schemas and REST API endpoints | High |
| TECH-TASK-004 | BullMQ Async Processing | TCMP-004 | Set up Redis workers and dead-letter queues | High |
| TECH-TASK-005 | Frontend Application Shell | TCMP-005 | Implement React 19 UI with TanStack Query and Zustand | High |

---

# SECTION 28 — FINAL SPECIFICATION SUMMARY

## 28. Technical Readiness Assessment
| Category | Status | Remarks |
|---|---|---|
| Specification Scope | Complete | Full-stack platform blueprint finalized |
| Database DDL & RLS | Complete | Production PostgreSQL DDL with RLS policies verified |
| API Contracts | Complete | OpenAPI 3.1 REST schemas and Zod DTOs specified |
| Security & Isolation | Complete | Argon2id auth, JWT rotation, and zero-trust policies |
| Testing Standards | Complete | Vitest, Supertest, and Playwright suites specified |

## 29. Final Technical Recommendations
1. Run all database migrations before releasing new container versions.
2. Maintain automated contract tests in CI to guarantee that frontend and backend models never drift.
3. Enforce continuous security scanning with Snyk and npm audit on every pull request.
`;
}
