---
tier: 5
role: canonical-task-list
depends-on: all Tier 4 guides · domain/user_stories.md
feeds-into: execution/sprint_plan.md · coordination/task_board.md · state/current_state.md
owner: AI-generated · human-curated priorities
updated: 2026-11-24
---

# Master Task List & Work Breakdown: Ekklesia

> AI instruction: This is the canonical work breakdown for the project.
> For active execution and claiming, refer to `.specs/coordination/task_board.md`.
> Never start a task whose dependencies are not marked `done`.
> Every task must be executed strictly within its declared `Scope boundary: INCLUDED` files.

---

## Status Values
`todo` · `claimed` · `in-progress` · `review` · `done` · `blocked` · `abandoned`

## Complexity Values
`XS` (< 1h) · `S` (1–3h) · `M` (3–6h) · `L` (1–2d) · `XL` (2–5d — must be decomposed)

---

## Detailed Task Manifests (41 Formulated Tasks)

### TASK-001: Initialize Repository Workspace, Linters & Strict TypeScript Conventions
**Status:** done  
**Complexity:** XS  
**Governs:** Foundation setup  
**Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`  
**Depends on:** —  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `package.json`, `tsconfig.json`, `.eslintrc.json`, `.prettierrc`  
- **EXCLUDED:** `src/**`, `.specs/**`  
**Verification target:** npm install && npm run build succeed with 0 errors.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Initialize modern monolithic workspace with React 19 / TypeScript / Tailwind CSS and Node.js 22 LTS / Express TypeScript. Configure strict tsconfig.json, ESLint flat config, Prettier, and husky pre-commit hooks.

**Autonomous Agent Execution Prompt:**
> Initialize repository structure per .specs/implementation/coding_standards.md. Enforce noImplicitAny, strictNullChecks, and exactOptionalPropertyTypes. Setup commitlint conventional commits.

---

### TASK-002: Setup Core Environment Configuration & Schema Validation
**Status:** todo  
**Complexity:** XS  
**Governs:** Foundation setup  
**Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`  
**Depends on:** TASK-001  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/config/env.ts`, `.env.example`  
- **EXCLUDED:** `src/**`, `.specs/**`  
**Verification target:** npm install && npm run build succeed with 0 errors.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Configure zero-dependency environment variable parser with Zod schema validation ensuring all required runtime secrets fail fast on startup.

**Autonomous Agent Execution Prompt:**
> Implement env validation module in src/config/env.ts using Zod. Parse PORT, DATABASE_URL, REDIS_URL, JWT_SECRET, and external API keys.

---

### TASK-003: Implement Structured Logging Engine & Correlation ID Middleware
**Status:** todo  
**Complexity:** S  
**Governs:** Foundation setup  
**Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`  
**Depends on:** TASK-002  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/logger.ts`, `src/shared/middleware/requestCorrelation.ts`  
- **EXCLUDED:** `src/**`, `.specs/**`  
**Verification target:** npm install && npm run build succeed with 0 errors.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Configure structured JSON logger (Pino or Winston) with automatic X-Request-ID propagation across all HTTP and asynchronous contexts.

**Autonomous Agent Execution Prompt:**
> Create src/shared/logger.ts. Implement express middleware in src/shared/middleware/requestCorrelation.ts attaching unique UUIDs to every incoming request.

---

### TASK-004: Configure Centralized Error Handling Hierarchy & Operational Error Classes
**Status:** todo  
**Complexity:** S  
**Governs:** Foundation setup  
**Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`  
**Depends on:** TASK-003  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/errors/AppError.ts`, `src/shared/middleware/errorHandler.ts`  
- **EXCLUDED:** `src/**`, `.specs/**`  
**Verification target:** npm install && npm run build succeed with 0 errors.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct standardized error hierarchy with AppError, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, and ConflictError.

**Autonomous Agent Execution Prompt:**
> Author error definitions in src/shared/errors/AppError.ts. Implement global express error handler in src/shared/middleware/errorHandler.ts returning RFC 7807 Problem Details.

---

### TASK-005: Author Multi-Stage Production Dockerfiles for Backend & Frontend
**Status:** todo  
**Complexity:** S  
**Governs:** Infrastructure & Release  
**Spec refs:** `implementation/infrastructure.md`  
**Depends on:** TASK-001  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `Dockerfile.backend`, `Dockerfile.frontend`, `.dockerignore`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Multi-stage Docker build passes; health check endpoint returns status: "healthy".  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create multi-stage Docker builds separating dependency installation, TypeScript compilation, and lightweight Alpine runtime images with non-root security users.

**Autonomous Agent Execution Prompt:**
> Write Dockerfile.backend and Dockerfile.frontend per .specs/implementation/infrastructure.md. Ensure layer caching optimization and HEALTHCHECK declarations.

---

### TASK-006: Orchestrate Local Development Environment with Docker Compose
**Status:** todo  
**Complexity:** S  
**Governs:** Infrastructure & Release  
**Spec refs:** `implementation/infrastructure.md`  
**Depends on:** TASK-005  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `docker-compose.yml`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Multi-stage Docker build passes; health check endpoint returns status: "healthy".  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create docker-compose.yml declaring service containers for PostgreSQL 16, Redis 7, backend API, frontend web, and health-check networks.

**Autonomous Agent Execution Prompt:**
> Build docker-compose.yml with persistent named volumes, health checks for postgres/redis, and hot-reload mounting for local development.

---

### TASK-007: Initialize Database Connection Pool & Migration Harness
**Status:** todo  
**Complexity:** M  
**Governs:** Database foundations · Data model  
**Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`  
**Depends on:** TASK-006  
**Required capabilities:** `database`, `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/database/connection.ts`, `src/database/migrator.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Configure connection pooling for PostgreSQL 16 + Redis 7 with retry logic, statement timeouts, and migration runner (Knex or Kysely or Prisma).

**Autonomous Agent Execution Prompt:**
> Create database client pool in src/database/connection.ts. Setup migration CLI script in package.json capable of running rollback and migration steps.

---

### TASK-008: Execute DDL Migration: Core Organizations & Multi-Tenant Partitioning
**Status:** todo  
**Complexity:** M  
**Governs:** Database foundations · Data model  
**Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`  
**Depends on:** TASK-007  
**Required capabilities:** `database`, `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/database/migrations/001_create_organizations.sql`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create organizations/tenants table with subscription tier, status, slug, and settings JSONB. Add indexes and triggers enforcing DR-001 tenant isolation.

**Autonomous Agent Execution Prompt:**
> Author SQL migration 001_create_organizations.sql per .specs/contracts/database_schema.md. Include UUID primary keys and created_at/updated_at triggers.

---

### TASK-009: Execute DDL Migration: Users, Credentials & Identity Tables
**Status:** todo  
**Complexity:** M  
**Governs:** Database foundations · Data model  
**Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`  
**Depends on:** TASK-008  
**Required capabilities:** `database`, `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/database/migrations/002_create_users.sql`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create users table with organization_id foreign key, email, password_hash, role, status, email_verified, and metadata.

**Autonomous Agent Execution Prompt:**
> Author SQL migration 002_create_users.sql. Create unique composite index on (organization_id, email). Add soft-delete column deleted_at.

---

### TASK-010: Execute DDL Migration: Core Domain Entities & Relational Tables
**Status:** todo  
**Complexity:** L  
**Governs:** Database foundations · Data model  
**Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`  
**Depends on:** TASK-009  
**Required capabilities:** `database`, `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/database/migrations/003_create_domain_entities.sql`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create primary business tables representing core entities for Ekklesia in Other.

**Autonomous Agent Execution Prompt:**
> Author SQL migration 003_create_domain_entities.sql per .specs/contracts/database_schema.md. Define foreign keys, check constraints, and composite indexes.

---

### TASK-011: Execute DDL Migration: State Transitions, Invariant Checks & Audit Tables
**Status:** todo  
**Complexity:** M  
**Governs:** Database foundations · Data model  
**Spec refs:** `contracts/database_schema.md` · `architecture/data_model.md`  
**Depends on:** TASK-010  
**Required capabilities:** `database`, `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/database/migrations/004_create_audit_logs.sql`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create state history and audit log tables. Add database triggers logging every insert, update, and delete to append-only audit register.

**Autonomous Agent Execution Prompt:**
> Author SQL migration 004_create_audit_logs.sql satisfying DR-003. Enforce immutability via PostgreSQL trigger preventing UPDATE or DELETE on audit_logs.

---

### TASK-012: Configure Redis Client Pool & Distributed Lock Manager (Redlock)
**Status:** todo  
**Complexity:** M  
**Governs:** US-004 · DR-006  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-007  
**Required capabilities:** `backend`, `database`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/cache/redisClient.ts`, `src/shared/cache/distributedLock.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Configure high-performance Redis client with cluster failover, reconnection backoff, and Redlock distributed mutex locking for critical operations.

**Autonomous Agent Execution Prompt:**
> Implement Redis manager in src/shared/cache/redisClient.ts. Author withLock helper in src/shared/cache/distributedLock.ts preventing race conditions.

---

### TASK-013: Configure Redis-Backed Asynchronous Job Queue (BullMQ)
**Status:** todo  
**Complexity:** M  
**Governs:** US-005 · DR-001  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-012  
**Required capabilities:** `backend`, `database`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/queue/queueManager.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Initialize BullMQ job processor with concurrency limits, dead-letter queues, exponential backoff retries, and job progress telemetry.

**Autonomous Agent Execution Prompt:**
> Author src/shared/queue/queueManager.ts. Setup default worker supervisor handling background email delivery, telemetry indexing, and scheduled reports.

---

### TASK-014: Implement Cryptographic Password Hashing Service (Argon2id)
**Status:** todo  
**Complexity:** S  
**Governs:** US-006 · DR-002  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-009  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/auth/password.service.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build secure password hashing and verification module using Argon2id with memory cost 64MB, time cost 3 iterations, and parallelism 4.

**Autonomous Agent Execution Prompt:**
> Author src/modules/auth/password.service.ts using argon2. Enforce minimum 10-character complexity rules and timing-safe comparison.

---

### TASK-015: Implement JWT Token Management & Rotating Sliding Sessions
**Status:** todo  
**Complexity:** M  
**Governs:** US-007 · DR-003  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-014  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/auth/jwt.service.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct JWT minting and verification service. Issue short-lived access tokens (15m) and rotating refresh tokens stored in secure HttpOnly cookies.

**Autonomous Agent Execution Prompt:**
> Author src/modules/auth/jwt.service.ts following .specs/architecture/security_model.md. Maintain token revocation blacklist in Redis.

---

### TASK-016: Implement User Registration, Email Verification & Tenant Onboarding Flow
**Status:** todo  
**Complexity:** M  
**Governs:** US-008 · DR-004  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-015  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/auth/auth.service.ts`, `src/modules/auth/auth.controller.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build registration service with organization creation, password hashing, verification token generation, and welcome event dispatch.

**Autonomous Agent Execution Prompt:**
> Build registration handler in src/modules/auth/auth.service.ts and controller in src/modules/auth/auth.controller.ts validating input with Zod.

---

### TASK-017: Implement User Login, Password Reset & Session Termination Endpoints
**Status:** todo  
**Complexity:** M  
**Governs:** US-001 · DR-005  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-016  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/auth/auth.routes.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build login authentication endpoint with rate limiting, brute-force lockout, password reset token emails, and logout token invalidation.

**Autonomous Agent Execution Prompt:**
> Implement login and logout routes in src/modules/auth/auth.routes.ts per .specs/contracts/api_contracts.md.

---

### TASK-018: Construct Role-Based Access Control (RBAC) Permission Middleware
**Status:** todo  
**Complexity:** S  
**Governs:** US-002 · DR-006  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-015  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/middleware/rbacGuard.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build express middleware validating user roles against the canonical RBAC permission matrix before controller execution.

**Autonomous Agent Execution Prompt:**
> Author src/shared/middleware/rbacGuard.ts. Implement requirePermission(permission) guard verifying permissions against user role claims.

---

### TASK-019: Implement Multi-Tenant Row-Level Database Isolation Interceptor
**Status:** todo  
**Complexity:** M  
**Governs:** US-003 · DR-001  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-018  
**Required capabilities:** `backend`, `database`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/database/tenantContext.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct database query wrapper that automatically binds the active organization_id to all SQL select, insert, update, and delete statements.

**Autonomous Agent Execution Prompt:**
> Build src/shared/database/tenantContext.ts. Enforce DR-001 ensuring cross-tenant queries throw an UnauthorizedAccess error.

---

### TASK-020: Implement Core Domain Entity Repository & CRUD Handlers
**Status:** todo  
**Complexity:** M  
**Governs:** US-004 · DR-002  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-019  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/core/domain.repository.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct repository layer for core Ekklesia entities with pagination, sorting, search filters, and transaction support.

**Autonomous Agent Execution Prompt:**
> Create repository in src/modules/core/domain.repository.ts implementing clean architecture per .specs/implementation/backend_guide.md.

---

### TASK-021: Implement Domain Business Invariant Validator (DR-001 through DR-012)
**Status:** todo  
**Complexity:** M  
**Governs:** US-005 · DR-003  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-020  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/core/domainValidator.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct domain validator enforcing business rules, state transitions, validation checks, and concurrency locks.

**Autonomous Agent Execution Prompt:**
> Author src/modules/core/domainValidator.ts enforcing all business rules declared in .specs/domain/domain_rules.md.

---

### TASK-022: Implement Custom Business Workflows from Project Specification Summary
**Status:** todo  
**Complexity:** M  
**Governs:** US-006 · DR-004  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-021  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/custom/customWorkflow.service.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Author specialized domain services and custom business handlers explicitly detailed in user project summary (# Software Requirements Specification (SRS)
## Ekklesia — SaaS Church Bulletin & Community Platform
...).

**Autonomous Agent Execution Prompt:**
> Review .specs/foundation/brief.md ('User-Provided Build Specification & Project Summary'). Implement specialized domain logic, algorithms, and integration flows specified by the user.

---

### TASK-023: Build API Gateway Router & Standard Request Validation Middleware
**Status:** todo  
**Complexity:** S  
**Governs:** US-007 · DR-005  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-021  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/middleware/validateRequest.ts`, `src/routes/index.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct top-level API router mapping versioned /v1 routes with automated Zod payload validation middleware.

**Autonomous Agent Execution Prompt:**
> Implement validateRequest(schema) middleware in src/shared/middleware/validateRequest.ts rejecting invalid payloads with HTTP 422.

---

### TASK-024: Implement REST Endpoints for Organization & User Management
**Status:** todo  
**Complexity:** M  
**Governs:** US-008 · DR-006  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-023  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/users/user.controller.ts`, `src/modules/users/user.routes.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build controllers for listing users, inviting team members, assigning roles, and updating profile settings.

**Autonomous Agent Execution Prompt:**
> Implement user controllers in src/modules/users/user.controller.ts per .specs/contracts/api_contracts.md.

---

### TASK-025: Implement REST Endpoints for Core Business Operations & CRUD
**Status:** todo  
**Complexity:** L  
**Governs:** US-001 · DR-001  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-024  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/core/domain.controller.ts`, `src/modules/core/domain.routes.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build complete controller suite for creating, retrieving, updating, and archiving core domain resources.

**Autonomous Agent Execution Prompt:**
> Implement controllers in src/modules/core/domain.controller.ts per .specs/contracts/api_contracts.md.

---

### TASK-026: Implement WebSocket Gateway with JWT Handshake & Tenant Channels
**Status:** todo  
**Complexity:** M  
**Governs:** US-002 · DR-002  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-025  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/realtime/websocketServer.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct WebSocket server (ws or Socket.io) handling authentication handshakes, tenant-isolated broadcast channels, and heartbeat keep-alives.

**Autonomous Agent Execution Prompt:**
> Author src/shared/realtime/websocketServer.ts per .specs/architecture/system_design.md. Verify access token during connection handshake.

---

### TASK-027: Implement Redis Pub/Sub Adapter for Multi-Node WebSocket Scaling
**Status:** todo  
**Complexity:** M  
**Governs:** US-003 · DR-003  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-026  
**Required capabilities:** `backend`, `database`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/realtime/redisPubSubAdapter.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Connect WebSocket gateway to Redis Pub/Sub channels to enable horizontal scaling across multiple container instances.

**Autonomous Agent Execution Prompt:**
> Author src/shared/realtime/redisPubSubAdapter.ts broadcasting events across all active gateway nodes.

---

### TASK-028: Build Frontend Application Shell, Agape Design Tokens & Navigation Sidebar
**Status:** todo  
**Complexity:** M  
**Governs:** US-004 · DR-004  
**Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`  
**Depends on:** TASK-001  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/components/layout/AppShell.tsx`, `src/components/layout/Sidebar.tsx`  
- **EXCLUDED:** `src/modules/**`, `src/config/**`, `.specs/**`  
**Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct responsive application layout with collapsible navigation sidebar, breadcrumb header, user profile dropdown, and Agape design tokens in React 19 / TypeScript / Tailwind CSS.

**Autonomous Agent Execution Prompt:**
> Author src/components/layout/AppShell.tsx and src/components/layout/Sidebar.tsx matching styling guidelines in .specs/implementation/frontend_guide.md.

---

### TASK-029: Implement Reactive Global Authentication & Tenant State Store
**Status:** todo  
**Complexity:** M  
**Governs:** US-005 · DR-005  
**Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`  
**Depends on:** TASK-028  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/stores/useAuthStore.ts`  
- **EXCLUDED:** `src/modules/**`, `src/config/**`, `.specs/**`  
**Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build client-side state store (Zustand or React Context) managing user profile, active tenant, permissions, and session token renewal.

**Autonomous Agent Execution Prompt:**
> Author src/stores/useAuthStore.ts with automatic silent token refresh 60 seconds before expiration.

---

### TASK-030: Build Authentication Views: Login, Registration, Password Reset & Invite Accept
**Status:** todo  
**Complexity:** M  
**Governs:** US-006 · DR-006  
**Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`  
**Depends on:** TASK-029  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/views/auth/LoginPage.tsx`, `src/views/auth/RegisterPage.tsx`  
- **EXCLUDED:** `src/modules/**`, `src/config/**`, `.specs/**`  
**Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create responsive, accessible forms with client-side validation, error banners, and loading states.

**Autonomous Agent Execution Prompt:**
> Author src/views/auth/LoginPage.tsx and src/views/auth/RegisterPage.tsx per .specs/contracts/ui_contracts.md.

---

### TASK-031: Build Executive Operations Dashboard with Real-Time KPIs & Visual Charts
**Status:** todo  
**Complexity:** L  
**Governs:** US-007 · DR-001  
**Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`  
**Depends on:** TASK-030  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/views/dashboard/OperationsDashboard.tsx`  
- **EXCLUDED:** `src/modules/**`, `src/config/**`, `.specs/**`  
**Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Construct main operations dashboard displaying metric cards, trend charts, activity feeds, and system health status.

**Autonomous Agent Execution Prompt:**
> Author src/views/dashboard/OperationsDashboard.tsx with responsive grid, skeleton loading, and auto-refresh.

---

### TASK-032: Build Paginated Data Table with Search, Filter & Multi-Select Batch Actions
**Status:** todo  
**Complexity:** M  
**Governs:** US-008 · DR-002  
**Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`  
**Depends on:** TASK-031  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/components/ui/DataTable.tsx`  
- **EXCLUDED:** `src/modules/**`, `src/config/**`, `.specs/**`  
**Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create reusable data grid component supporting server-side sorting, pagination, multi-column filtering, and CSV/Excel export.

**Autonomous Agent Execution Prompt:**
> Author src/components/ui/DataTable.tsx per .specs/contracts/ui_contracts.md.

---

### TASK-033: Build Interactive Map View & Live Fleet / Entity Spatial Canvas
**Status:** todo  
**Complexity:** L  
**Governs:** US-001 · DR-003  
**Spec refs:** `contracts/ui_contracts.md` · `implementation/frontend_guide.md`  
**Depends on:** TASK-032  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/views/map/LiveMapView.tsx`  
- **EXCLUDED:** `src/modules/**`, `src/config/**`, `.specs/**`  
**Verification target:** Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Implement interactive map (Mapbox GL or Leaflet) rendering live location pins, air corridors, geo-fenced boundaries, and trajectory vectors.

**Autonomous Agent Execution Prompt:**
> Author src/views/map/LiveMapView.tsx with WebGL rendering for sub-100ms updates from WebSocket telemetry feed.

---

### TASK-034: Implement Payment Gateway Webhook Verification & Invoice Generator
**Status:** todo  
**Complexity:** M  
**Governs:** US-002 · DR-004  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-025  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/billing/webhookHandler.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build webhook endpoint verifying cryptographic signatures from Stripe / Cashfree. Generate downloadable PDF invoices on settlement.

**Autonomous Agent Execution Prompt:**
> Author src/modules/billing/webhookHandler.ts per .specs/contracts/api_contracts.md. Ensure idempotency key handling.

---

### TASK-035: Implement Transactional Email & Push Notification Dispatch Service
**Status:** todo  
**Complexity:** S  
**Governs:** US-003 · DR-005  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-034  
**Required capabilities:** `backend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/notifications/emailService.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Connect SendGrid / AWS SES email pipeline and Web Push notifications with handlebars HTML email templates.

**Autonomous Agent Execution Prompt:**
> Author src/modules/notifications/emailService.ts with template rendering and retry handling.

---

### TASK-036: Author Comprehensive Vitest Unit Test Suite for Domain Invariants
**Status:** todo  
**Complexity:** M  
**Governs:** US-004 · DR-006  
**Spec refs:** `implementation/testing_strategy.md` · `domain/user_stories.md`  
**Depends on:** TASK-021  
**Required capabilities:** `testing`, `qa`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `tests/unit/domainValidator.spec.ts`, `tests/unit/auth.spec.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All unit, integration, and contract tests pass with 0 regressions; coverage gates satisfied.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create unit tests covering password hashing, token validation, domain rules, calculation formulas, and edge cases achieving 85%+ coverage.

**Autonomous Agent Execution Prompt:**
> Write test specifications in tests/unit/domainValidator.spec.ts and tests/unit/auth.spec.ts per .specs/implementation/testing_strategy.md.

---

### TASK-037: Author Supertest API Integration Test Matrix for Core Endpoints
**Status:** todo  
**Complexity:** L  
**Governs:** US-005 · DR-001  
**Spec refs:** `implementation/testing_strategy.md` · `domain/user_stories.md`  
**Depends on:** TASK-025  
**Required capabilities:** `testing`, `qa`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `tests/integration/api.spec.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All unit, integration, and contract tests pass with 0 regressions; coverage gates satisfied.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Build automated HTTP integration test suite exercising authentication, CRUD mutations, error responses, and tenant isolation.

**Autonomous Agent Execution Prompt:**
> Author tests/integration/api.spec.ts running against test database container verifying all contracts in .specs/contracts/api_contracts.md.

---

### TASK-038: Author Playwright End-to-End (E2E) Browser Workflow Test Suite
**Status:** todo  
**Complexity:** L  
**Governs:** US-006 · DR-002  
**Spec refs:** `implementation/testing_strategy.md` · `domain/user_stories.md`  
**Depends on:** TASK-033  
**Required capabilities:** `testing`, `qa`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `tests/e2e/core-workflow.spec.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All unit, integration, and contract tests pass with 0 regressions; coverage gates satisfied.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Create browser test automation covering user login, dashboard navigation, resource creation modal, and real-time event updates.

**Autonomous Agent Execution Prompt:**
> Author tests/e2e/core-workflow.spec.ts testing end-to-end user journeys per .specs/domain/user_stories.md.

---

### TASK-039: Implement Security Headers (Helmet, CSP), CORS Whitelist & Rate Limiter
**Status:** todo  
**Complexity:** S  
**Governs:** US-007 · DR-003  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-023  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/shared/middleware/securityHeaders.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Configure Content Security Policy (CSP), strict CORS origins, rate limiting (Redis token bucket), and HTTP parameter pollution prevention.

**Autonomous Agent Execution Prompt:**
> Implement security middleware in src/shared/middleware/securityHeaders.ts per .specs/architecture/security_model.md.

---

### TASK-040: Implement Model Context Protocol (MCP) Server for Autonomous Coding Agents
**Status:** todo  
**Complexity:** M  
**Governs:** US-008 · DR-004  
**Spec refs:** `contracts/api_contracts.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-025  
**Required capabilities:** `backend`, `database`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/mcp/mcpServer.ts`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Expose live MCP JSON-RPC protocol endpoint enabling Cursor, Claude Code, and Windsurf to query specifications and task backlogs in real time.

**Autonomous Agent Execution Prompt:**
> Author src/modules/mcp/mcpServer.ts exposing get_spec_file, get_spec_index, and list_spec_tasks.

---

### TASK-041: Configure GitHub Actions CI/CD Production Deployment Pipeline
**Status:** todo  
**Complexity:** M  
**Governs:** Infrastructure & Release  
**Spec refs:** `implementation/infrastructure.md`  
**Depends on:** TASK-038  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `.github/workflows/deploy.yml`  
- **EXCLUDED:** `src/pages/**`, `src/components/**`, `.specs/**`  
**Verification target:** Multi-stage Docker build passes; health check endpoint returns status: "healthy".  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  

**Description:**
Author .github/workflows/deploy.yml running typecheck, lint, Vitest, Docker build, and container deployment upon main merge.

**Autonomous Agent Execution Prompt:**
> Create .github/workflows/deploy.yml per .specs/implementation/infrastructure.md with automated staging deployment.


---

## Task Index

| ID | Title | Phase | Status | Complexity | Depends on | Required Capabilities |
|----|-------|:---:|:---:|:---:|:---:|:---:|
| TASK-001 | Initialize Repository Workspace, Lin | setup | done | XS | — | `devops`, `infrastructure` |
| TASK-002 | Setup Core Environment Configuration | setup | todo | XS | TASK-001 | `devops`, `infrastructure` |
| TASK-003 | Implement Structured Logging Engine  | setup | todo | S | TASK-002 | `devops`, `infrastructure` |
| TASK-004 | Configure Centralized Error Handling | setup | todo | S | TASK-003 | `devops`, `infrastructure` |
| TASK-005 | Author Multi-Stage Production Docker | deployment | todo | S | TASK-001 | `devops`, `infrastructure` |
| TASK-006 | Orchestrate Local Development Enviro | deployment | todo | S | TASK-005 | `devops`, `infrastructure` |
| TASK-007 | Initialize Database Connection Pool  | database | todo | M | TASK-006 | `database`, `backend` |
| TASK-008 | Execute DDL Migration: Core Organiza | database | todo | M | TASK-007 | `database`, `backend` |
| TASK-009 | Execute DDL Migration: Users, Creden | database | todo | M | TASK-008 | `database`, `backend` |
| TASK-010 | Execute DDL Migration: Core Domain E | database | todo | L | TASK-009 | `database`, `backend` |
| TASK-011 | Execute DDL Migration: State Transit | database | todo | M | TASK-010 | `database`, `backend` |
| TASK-012 | Configure Redis Client Pool & Distri | backend | todo | M | TASK-007 | `backend`, `database` |
| TASK-013 | Configure Redis-Backed Asynchronous  | backend | todo | M | TASK-012 | `backend`, `database` |
| TASK-014 | Implement Cryptographic Password Has | backend | todo | S | TASK-009 | `backend` |
| TASK-015 | Implement JWT Token Management & Rot | backend | todo | M | TASK-014 | `backend`, `security` |
| TASK-016 | Implement User Registration, Email V | backend | todo | M | TASK-015 | `backend`, `security` |
| TASK-017 | Implement User Login, Password Reset | backend | todo | M | TASK-016 | `backend`, `security` |
| TASK-018 | Construct Role-Based Access Control  | backend | todo | S | TASK-015 | `backend`, `security` |
| TASK-019 | Implement Multi-Tenant Row-Level Dat | backend | todo | M | TASK-018 | `backend`, `database` |
| TASK-020 | Implement Core Domain Entity Reposit | backend | todo | M | TASK-019 | `backend` |
| TASK-021 | Implement Domain Business Invariant  | backend | todo | M | TASK-020 | `backend` |
| TASK-022 | Implement Custom Business Workflows  | backend | todo | M | TASK-021 | `backend`, `security` |
| TASK-023 | Build API Gateway Router & Standard  | backend | todo | S | TASK-021 | `backend` |
| TASK-024 | Implement REST Endpoints for Organiz | backend | todo | M | TASK-023 | `backend` |
| TASK-025 | Implement REST Endpoints for Core Bu | backend | todo | L | TASK-024 | `backend` |
| TASK-026 | Implement WebSocket Gateway with JWT | backend | todo | M | TASK-025 | `backend`, `security` |
| TASK-027 | Implement Redis Pub/Sub Adapter for  | backend | todo | M | TASK-026 | `backend`, `database` |
| TASK-028 | Build Frontend Application Shell, Ag | frontend | todo | M | TASK-001 | `frontend` |
| TASK-029 | Implement Reactive Global Authentica | frontend | todo | M | TASK-028 | `frontend` |
| TASK-030 | Build Authentication Views: Login, R | frontend | todo | M | TASK-029 | `frontend` |
| TASK-031 | Build Executive Operations Dashboard | frontend | todo | L | TASK-030 | `frontend` |
| TASK-032 | Build Paginated Data Table with Sear | frontend | todo | M | TASK-031 | `frontend` |
| TASK-033 | Build Interactive Map View & Live Fl | frontend | todo | L | TASK-032 | `frontend` |
| TASK-034 | Implement Payment Gateway Webhook Ve | backend | todo | M | TASK-025 | `backend` |
| TASK-035 | Implement Transactional Email & Push | backend | todo | S | TASK-034 | `backend` |
| TASK-036 | Author Comprehensive Vitest Unit Tes | testing | todo | M | TASK-021 | `testing`, `qa` |
| TASK-037 | Author Supertest API Integration Tes | testing | todo | L | TASK-025 | `testing`, `qa` |
| TASK-038 | Author Playwright End-to-End (E2E) B | testing | todo | L | TASK-033 | `testing`, `qa` |
| TASK-039 | Implement Security Headers (Helmet,  | backend | todo | S | TASK-023 | `backend`, `security` |
| TASK-040 | Implement Model Context Protocol (MC | backend | todo | M | TASK-025 | `backend`, `database` |
| TASK-041 | Configure GitHub Actions CI/CD Produ | deployment | todo | M | TASK-038 | `devops`, `infrastructure` |
