---
tier: coordination
role: live-task-board
read: before selecting or claiming any task
updated: YYYY-MM-DD
---

# Live Task Board

> AI instruction: Use this board to identify unblocked tasks, check current ownership, and manage task leases.
> Before starting work on any task, secure your claim following `.specs/coordination/protocol.md` §3.
> Always check that `Blocked by` dependencies are marked `done` before claiming.

---

## 1. Task Summary Metrics

| Total Tasks | Todo | Claimed | In Progress | In Review | Done | Blocked |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 6 | 6 | 0 | 0 | 0 | 0 | 0 |

---

## 2. Active Task Table

| Task ID | Title | Status | Complexity | Claimed By | Lease Expires (UTC) | Blocked By | Reviewer |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `TASK-001` | Initialize Project Repository | todo | XS | — | — | — | Human |
| `TASK-002` | Setup Database & Initial Migration | todo | S | — | — | `TASK-001` | — |
| `TASK-003` | Implement Auth Endpoints | todo | M | — | — | `TASK-002` | — |
| `TASK-004` | Implement [Resource] CRUD API | todo | M | — | — | `TASK-003` | — |
| `TASK-005` | Build [Resource] List Page | todo | S | — | — | `TASK-004` | — |
| `TASK-006` | Build [Resource] Form Page | todo | M | — | — | `TASK-005` | — |

---

## 3. Detailed Task Manifests

### TASK-001: Initialize Project Repository
- **Status:** todo
- **Complexity:** XS (< 1 hour)
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
    - `.eslintrc.*`
    - `.prettierrc.*`
    - `docker-compose.yml`
    - `.gitignore`
  - **EXCLUDED:**
    - `src/**`
    - `.specs/**`
- **Verification target:** `npm install` and `npm run build` succeed with zero errors.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-002: Setup Database & Initial Migration
- **Status:** todo
- **Complexity:** S (1–3 hours)
- **Governs:** Database foundations
- **Spec refs:** `contracts/database_schema.md` · `implementation/infrastructure.md`
- **Depends on:** TASK-001
- **Required capabilities:** `database`, `devops`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/config/database.ts`
    - `migrations/**`
    - `docker-compose.yml` (service: db)
  - **EXCLUDED:**
    - `src/modules/**`
    - `.specs/**`
- **Verification target:** Database migrations execute cleanly in local Docker container; shared `updated_at` trigger is functional.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-003: Implement Auth Endpoints
- **Status:** todo
- **Complexity:** M (3–6 hours)
- **Governs:** US-001 · Security model
- **Spec refs:** `contracts/api_contracts.md` (POST /auth/register, POST /auth/login) · `architecture/security_model.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-002
- **Required capabilities:** `backend`, `security`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/auth/**`
    - `src/middleware/auth.middleware.ts`
    - `tests/modules/auth/**`
  - **EXCLUDED:**
    - `src/config/**`
    - `src/shared/**`
    - `.specs/**`
- **Verification target:** Unit tests covering password hashing, token generation, 401 unauthenticated, and 409 conflict scenarios with branch coverage >= 80%.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-004: Implement [Resource] CRUD API
- **Status:** todo
- **Complexity:** M (3–6 hours)
- **Governs:** US-00X · DR-00X
- **Spec refs:** `contracts/api_contracts.md` · `contracts/database_schema.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`
- **Depends on:** TASK-003
- **Required capabilities:** `backend`, `database`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/modules/[resource]/**`
    - `tests/modules/[resource]/**`
  - **EXCLUDED:**
    - `src/modules/auth/**`
    - `src/config/**`
    - `.specs/**`
- **Verification target:** All endpoints match `api_contracts.md` exactly; service layer enforces domain rules DR-00X; integration tests pass.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-005: Build [Resource] List Page
- **Status:** todo
- **Complexity:** S (1–3 hours)
- **Governs:** US-00X
- **Spec refs:** `contracts/ui_contracts.md` ([Resource]ListPage) · `implementation/frontend_guide.md`
- **Depends on:** TASK-004
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/pages/[Resource]ListPage.tsx`
    - `src/components/features/[resource]/[Resource]List.tsx`
    - `src/hooks/use[Resource].ts`
    - `src/api/[resource].api.ts`
    - `tests/pages/[Resource]ListPage.test.tsx`
  - **EXCLUDED:**
    - `src/modules/**` (backend)
    - `src/api/client.ts`
    - `.specs/**`
- **Verification target:** Loading skeleton, error banner with retry, and empty state CTA are rendered matching `ui_contracts.md`.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —

---

### TASK-006: Build [Resource] Form Page
- **Status:** todo
- **Complexity:** M (3–6 hours)
- **Governs:** US-00X
- **Spec refs:** `contracts/ui_contracts.md` ([Resource]FormPage) · `implementation/frontend_guide.md`
- **Depends on:** TASK-005
- **Required capabilities:** `frontend`
- **Claimed by:** —
- **Claimed at:** —
- **Lease expires:** —
- **Scope boundary:**
  - **INCLUDED:**
    - `src/pages/[Resource]FormPage.tsx`
    - `src/components/features/[resource]/[Resource]Form.tsx`
    - `tests/pages/[Resource]FormPage.test.tsx`
  - **EXCLUDED:**
    - `src/modules/**`
    - `.specs/**`
- **Verification target:** Validates fields with Zod; supports both create and edit modes; handles inline field errors and global submission error.
- **Review required:** yes
- **Reviewer:** —
- **Completion evidence:** —
