---
tier: coordination
role: live-task-board
read: before selecting or claiming any task
updated: 2026-11-24
---

# Live Task Board: Ekklesia

> AI instruction: Use this board to identify unblocked tasks, check current ownership, and manage task leases.
> Before starting work on any task, secure your claim following `.specs/coordination/protocol.md` §3.
> Always check that `Blocked by` dependencies are marked `done` before claiming.

---

## 1. Task Summary Metrics

| Total Tasks | Todo | Claimed | In Progress | In Review | Done | Blocked |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 41 | 40 | 0 | 0 | 0 | 1 | 0 |

---

## 2. Active Task Table

| Task ID | Title | Status | Complexity | Claimed By | Lease Expires (UTC) | Blocked By | Reviewer |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `TASK-001` | Initialize Repository Workspace, Lin | done | XS | — | — | — | — |
| `TASK-002` | Setup Core Environment Configuration | todo | XS | — | — | `TASK-001` | — |
| `TASK-003` | Implement Structured Logging Engine  | todo | S | — | — | `TASK-002` | — |
| `TASK-004` | Configure Centralized Error Handling | todo | S | — | — | `TASK-003` | — |
| `TASK-005` | Author Multi-Stage Production Docker | todo | S | — | — | `TASK-001` | — |
| `TASK-006` | Orchestrate Local Development Enviro | todo | S | — | — | `TASK-005` | — |
| `TASK-007` | Initialize Database Connection Pool  | todo | M | — | — | `TASK-006` | — |
| `TASK-008` | Execute DDL Migration: Core Organiza | todo | M | — | — | `TASK-007` | — |
| `TASK-009` | Execute DDL Migration: Users, Creden | todo | M | — | — | `TASK-008` | — |
| `TASK-010` | Execute DDL Migration: Core Domain E | todo | L | — | — | `TASK-009` | — |
| `TASK-011` | Execute DDL Migration: State Transit | todo | M | — | — | `TASK-010` | — |
| `TASK-012` | Configure Redis Client Pool & Distri | todo | M | — | — | `TASK-007` | — |
| `TASK-013` | Configure Redis-Backed Asynchronous  | todo | M | — | — | `TASK-012` | — |
| `TASK-014` | Implement Cryptographic Password Has | todo | S | — | — | `TASK-009` | — |
| `TASK-015` | Implement JWT Token Management & Rot | todo | M | — | — | `TASK-014` | — |
| `TASK-016` | Implement User Registration, Email V | todo | M | — | — | `TASK-015` | — |
| `TASK-017` | Implement User Login, Password Reset | todo | M | — | — | `TASK-016` | — |
| `TASK-018` | Construct Role-Based Access Control  | todo | S | — | — | `TASK-015` | — |
| `TASK-019` | Implement Multi-Tenant Row-Level Dat | todo | M | — | — | `TASK-018` | — |
| `TASK-020` | Implement Core Domain Entity Reposit | todo | M | — | — | `TASK-019` | — |
| `TASK-021` | Implement Domain Business Invariant  | todo | M | — | — | `TASK-020` | — |
| `TASK-022` | Implement Custom Business Workflows  | todo | M | — | — | `TASK-021` | — |
| `TASK-023` | Build API Gateway Router & Standard  | todo | S | — | — | `TASK-021` | — |
| `TASK-024` | Implement REST Endpoints for Organiz | todo | M | — | — | `TASK-023` | — |
| `TASK-025` | Implement REST Endpoints for Core Bu | todo | L | — | — | `TASK-024` | — |
| `TASK-026` | Implement WebSocket Gateway with JWT | todo | M | — | — | `TASK-025` | — |
| `TASK-027` | Implement Redis Pub/Sub Adapter for  | todo | M | — | — | `TASK-026` | — |
| `TASK-028` | Build Frontend Application Shell, Ag | todo | M | — | — | `TASK-001` | — |
| `TASK-029` | Implement Reactive Global Authentica | todo | M | — | — | `TASK-028` | — |
| `TASK-030` | Build Authentication Views: Login, R | todo | M | — | — | `TASK-029` | — |
| `TASK-031` | Build Executive Operations Dashboard | todo | L | — | — | `TASK-030` | — |
| `TASK-032` | Build Paginated Data Table with Sear | todo | M | — | — | `TASK-031` | — |
| `TASK-033` | Build Interactive Map View & Live Fl | todo | L | — | — | `TASK-032` | — |
| `TASK-034` | Implement Payment Gateway Webhook Ve | todo | M | — | — | `TASK-025` | — |
| `TASK-035` | Implement Transactional Email & Push | todo | S | — | — | `TASK-034` | — |
| `TASK-036` | Author Comprehensive Vitest Unit Tes | todo | M | — | — | `TASK-021` | — |
| `TASK-037` | Author Supertest API Integration Tes | todo | L | — | — | `TASK-025` | — |
| `TASK-038` | Author Playwright End-to-End (E2E) B | todo | L | — | — | `TASK-033` | — |
| `TASK-039` | Implement Security Headers (Helmet,  | todo | S | — | — | `TASK-023` | — |
| `TASK-040` | Implement Model Context Protocol (MC | todo | M | — | — | `TASK-025` | — |
| `TASK-041` | Configure GitHub Actions CI/CD Produ | todo | M | — | — | `TASK-038` | — |

---

## 3. Detailed Task Manifests

### TASK-001: Initialize Repository Workspace, Linters & Strict TypeScript Conventions
- **Status:** done
- **Complexity:** XS
- **Governs:** Foundation setup
- **Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`
- **Depends on:** —
- **Required capabilities:** `devops`, `infrastructure`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `package.json`
    - `tsconfig.json`
    - `.eslintrc.json`
    - `.prettierrc`
  - **EXCLUDED:**
    - `src/**`
    - `.specs/**`
- **Verification target:** npm install && npm run build succeed with 0 errors.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-002: Setup Core Environment Configuration & Schema Validation
- **Status:** todo
- **Complexity:** XS
- **Governs:** Foundation setup
- **Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`
- **Depends on:** TASK-001
- **Required capabilities:** `devops`, `infrastructure`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/config/env.ts`
    - `.env.example`
  - **EXCLUDED:**
    - `src/**`
    - `.specs/**`
- **Verification target:** npm install && npm run build succeed with 0 errors.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-003: Implement Structured Logging Engine & Correlation ID Middleware
- **Status:** todo
- **Complexity:** S
- **Governs:** Foundation setup
- **Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`
- **Depends on:** TASK-002
- **Required capabilities:** `devops`, `infrastructure`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/logger.ts`
    - `src/shared/middleware/requestCorrelation.ts`
  - **EXCLUDED:**
    - `src/**`
    - `.specs/**`
- **Verification target:** npm install && npm run build succeed with 0 errors.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-004: Configure Centralized Error Handling Hierarchy & Operational Error Classes
- **Status:** todo
- **Complexity:** S
- **Governs:** Foundation setup
- **Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`
- **Depends on:** TASK-003
- **Required capabilities:** `devops`, `infrastructure`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/errors/AppError.ts`
    - `src/shared/middleware/errorHandler.ts`
  - **EXCLUDED:**
    - `src/**`
    - `.specs/**`
- **Verification target:** npm install && npm run build succeed with 0 errors.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-005: Author Multi-Stage Production Dockerfiles for Backend & Frontend
- **Status:** todo
- **Complexity:** S
- **Governs:** Infrastructure & Release
- **Spec refs:** `implementation/infrastructure.md`
- **Depends on:** TASK-001
- **Required capabilities:** `devops`, `infrastructure`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `Dockerfile.backend`
    - `Dockerfile.frontend`
    - `.dockerignore`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Multi-stage Docker build passes; health check endpoint returns status: "healthy".
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-006: Orchestrate Local Development Environment with Docker Compose
- **Status:** todo
- **Complexity:** S
- **Governs:** Infrastructure & Release
- **Spec refs:** `implementation/infrastructure.md`
- **Depends on:** TASK-005
- **Required capabilities:** `devops`, `infrastructure`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `docker-compose.yml`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Multi-stage Docker build passes; health check endpoint returns status: "healthy".
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-007: Initialize Database Connection Pool & Migration Harness
- **Status:** todo
- **Complexity:** M
- **Governs:** Database foundations · Data model
- **Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`
- **Depends on:** TASK-006
- **Required capabilities:** `database`, `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/database/connection.ts`
    - `src/database/migrator.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-008: Execute DDL Migration: Core Organizations & Multi-Tenant Partitioning
- **Status:** todo
- **Complexity:** M
- **Governs:** Database foundations · Data model
- **Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`
- **Depends on:** TASK-007
- **Required capabilities:** `database`, `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/database/migrations/001_create_organizations.sql`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-009: Execute DDL Migration: Users, Credentials & Identity Tables
- **Status:** todo
- **Complexity:** M
- **Governs:** Database foundations · Data model
- **Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`
- **Depends on:** TASK-008
- **Required capabilities:** `database`, `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/database/migrations/002_create_users.sql`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-010: Execute DDL Migration: Core Domain Entities & Relational Tables
- **Status:** todo
- **Complexity:** L
- **Governs:** Database foundations · Data model
- **Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`
- **Depends on:** TASK-009
- **Required capabilities:** `database`, `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/database/migrations/003_create_domain_entities.sql`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-011: Execute DDL Migration: State Transitions, Invariant Checks & Audit Tables
- **Status:** todo
- **Complexity:** M
- **Governs:** Database foundations · Data model
- **Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`
- **Depends on:** TASK-010
- **Required capabilities:** `database`, `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/database/migrations/004_create_audit_logs.sql`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-012: Configure Redis Client Pool & Distributed Lock Manager (Redlock)
- **Status:** todo
- **Complexity:** M
- **Governs:** US-004 · DR-006
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-007
- **Required capabilities:** `backend`, `database`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/cache/redisClient.ts`
    - `src/shared/cache/distributedLock.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-013: Configure Redis-Backed Asynchronous Job Queue (BullMQ)
- **Status:** todo
- **Complexity:** M
- **Governs:** US-005 · DR-001
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-012
- **Required capabilities:** `backend`, `database`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/queue/queueManager.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-014: Implement Cryptographic Password Hashing Service (Argon2id)
- **Status:** todo
- **Complexity:** S
- **Governs:** US-006 · DR-002
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-009
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/auth/password.service.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-015: Implement JWT Token Management & Rotating Sliding Sessions
- **Status:** todo
- **Complexity:** M
- **Governs:** US-007 · DR-003
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-014
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/auth/jwt.service.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-016: Implement User Registration, Email Verification & Tenant Onboarding Flow
- **Status:** todo
- **Complexity:** M
- **Governs:** US-008 · DR-004
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-015
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/auth/auth.service.ts`
    - `src/modules/auth/auth.controller.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-017: Implement User Login, Password Reset & Session Termination Endpoints
- **Status:** todo
- **Complexity:** M
- **Governs:** US-001 · DR-005
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-016
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/auth/auth.routes.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-018: Construct Role-Based Access Control (RBAC) Permission Middleware
- **Status:** todo
- **Complexity:** S
- **Governs:** US-002 · DR-006
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-015
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/middleware/rbacGuard.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-019: Implement Multi-Tenant Row-Level Database Isolation Interceptor
- **Status:** todo
- **Complexity:** M
- **Governs:** US-003 · DR-001
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-018
- **Required capabilities:** `backend`, `database`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/database/tenantContext.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-020: Implement Core Domain Entity Repository & CRUD Handlers
- **Status:** todo
- **Complexity:** M
- **Governs:** US-004 · DR-002
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-019
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/core/domain.repository.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-021: Implement Domain Business Invariant Validator (DR-001 through DR-012)
- **Status:** todo
- **Complexity:** M
- **Governs:** US-005 · DR-003
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-020
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/core/domainValidator.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-022: Implement Custom Business Workflows from Project Specification Summary
- **Status:** todo
- **Complexity:** M
- **Governs:** US-006 · DR-004
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-021
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/custom/customWorkflow.service.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-023: Build API Gateway Router & Standard Request Validation Middleware
- **Status:** todo
- **Complexity:** S
- **Governs:** US-007 · DR-005
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-021
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/middleware/validateRequest.ts`
    - `src/routes/index.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-024: Implement REST Endpoints for Organization & User Management
- **Status:** todo
- **Complexity:** M
- **Governs:** US-008 · DR-006
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-023
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/users/user.controller.ts`
    - `src/modules/users/user.routes.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-025: Implement REST Endpoints for Core Business Operations & CRUD
- **Status:** todo
- **Complexity:** L
- **Governs:** US-001 · DR-001
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-024
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/core/domain.controller.ts`
    - `src/modules/core/domain.routes.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-026: Implement WebSocket Gateway with JWT Handshake & Tenant Channels
- **Status:** todo
- **Complexity:** M
- **Governs:** US-002 · DR-002
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-025
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/realtime/websocketServer.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-027: Implement Redis Pub/Sub Adapter for Multi-Node WebSocket Scaling
- **Status:** todo
- **Complexity:** M
- **Governs:** US-003 · DR-003
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-026
- **Required capabilities:** `backend`, `database`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/realtime/redisPubSubAdapter.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-028: Build Frontend Application Shell, Agape Design Tokens & Navigation Sidebar
- **Status:** todo
- **Complexity:** M
- **Governs:** US-004 · DR-004
- **Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`
- **Depends on:** TASK-001
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/components/layout/AppShell.tsx`
    - `src/components/layout/Sidebar.tsx`
  - **EXCLUDED:**
    - `src/modules/**`
    - `src/config/**`
    - `.specs/**`
- **Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-029: Implement Reactive Global Authentication & Tenant State Store
- **Status:** todo
- **Complexity:** M
- **Governs:** US-005 · DR-005
- **Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`
- **Depends on:** TASK-028
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/stores/useAuthStore.ts`
  - **EXCLUDED:**
    - `src/modules/**`
    - `src/config/**`
    - `.specs/**`
- **Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-030: Build Authentication Views: Login, Registration, Password Reset & Invite Accept
- **Status:** todo
- **Complexity:** M
- **Governs:** US-006 · DR-006
- **Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`
- **Depends on:** TASK-029
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/views/auth/LoginPage.tsx`
    - `src/views/auth/RegisterPage.tsx`
  - **EXCLUDED:**
    - `src/modules/**`
    - `src/config/**`
    - `.specs/**`
- **Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-031: Build Executive Operations Dashboard with Real-Time KPIs & Visual Charts
- **Status:** todo
- **Complexity:** L
- **Governs:** US-007 · DR-001
- **Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`
- **Depends on:** TASK-030
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/views/dashboard/OperationsDashboard.tsx`
  - **EXCLUDED:**
    - `src/modules/**`
    - `src/config/**`
    - `.specs/**`
- **Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-032: Build Paginated Data Table with Search, Filter & Multi-Select Batch Actions
- **Status:** todo
- **Complexity:** M
- **Governs:** US-008 · DR-002
- **Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`
- **Depends on:** TASK-031
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/components/ui/DataTable.tsx`
  - **EXCLUDED:**
    - `src/modules/**`
    - `src/config/**`
    - `.specs/**`
- **Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-033: Build Interactive Map View & Live Fleet / Entity Spatial Canvas
- **Status:** todo
- **Complexity:** L
- **Governs:** US-001 · DR-003
- **Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`
- **Depends on:** TASK-032
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/views/map/LiveMapView.tsx`
  - **EXCLUDED:**
    - `src/modules/**`
    - `src/config/**`
    - `.specs/**`
- **Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-034: Implement Payment Gateway Webhook Verification & Invoice Generator
- **Status:** todo
- **Complexity:** M
- **Governs:** US-002 · DR-004
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-025
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/billing/webhookHandler.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-035: Implement Transactional Email & Push Notification Dispatch Service
- **Status:** todo
- **Complexity:** S
- **Governs:** US-003 · DR-005
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-034
- **Required capabilities:** `backend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/notifications/emailService.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-036: Author Comprehensive Vitest Unit Test Suite for Domain Invariants
- **Status:** todo
- **Complexity:** M
- **Governs:** US-004 · DR-006
- **Spec refs:** `implementation/testing_strategy.md` · `domain/user_stories.md`
- **Depends on:** TASK-021
- **Required capabilities:** `testing`, `qa`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `tests/unit/domainValidator.spec.ts`
    - `tests/unit/auth.spec.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All unit, integration, and contract tests pass with 0 regressions; coverage gates satisfied.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-037: Author Supertest API Integration Test Matrix for Core Endpoints
- **Status:** todo
- **Complexity:** L
- **Governs:** US-005 · DR-001
- **Spec refs:** `implementation/testing_strategy.md` · `domain/user_stories.md`
- **Depends on:** TASK-025
- **Required capabilities:** `testing`, `qa`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `tests/integration/api.spec.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All unit, integration, and contract tests pass with 0 regressions; coverage gates satisfied.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-038: Author Playwright End-to-End (E2E) Browser Workflow Test Suite
- **Status:** todo
- **Complexity:** L
- **Governs:** US-006 · DR-002
- **Spec refs:** `implementation/testing_strategy.md` · `domain/user_stories.md`
- **Depends on:** TASK-033
- **Required capabilities:** `testing`, `qa`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `tests/e2e/core-workflow.spec.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All unit, integration, and contract tests pass with 0 regressions; coverage gates satisfied.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-039: Implement Security Headers (Helmet, CSP), CORS Whitelist & Rate Limiter
- **Status:** todo
- **Complexity:** S
- **Governs:** US-007 · DR-003
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-023
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/shared/middleware/securityHeaders.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-040: Implement Model Context Protocol (MCP) Server for Autonomous Coding Agents
- **Status:** todo
- **Complexity:** M
- **Governs:** US-008 · DR-004
- **Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-025
- **Required capabilities:** `backend`, `database`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/mcp/mcpServer.ts`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-041: Configure GitHub Actions CI/CD Production Deployment Pipeline
- **Status:** todo
- **Complexity:** M
- **Governs:** Infrastructure & Release
- **Spec refs:** `implementation/infrastructure.md`
- **Depends on:** TASK-038
- **Required capabilities:** `devops`, `infrastructure`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `.github/workflows/deploy.yml`
  - **EXCLUDED:**
    - `src/pages/**`
    - `src/components/**`
    - `.specs/**`
- **Verification target:** Multi-stage Docker build passes; health check endpoint returns status: "healthy".
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

