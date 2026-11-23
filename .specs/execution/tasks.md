---
tier: 5
role: canonical-task-list
depends-on: all Tier 4 guides · domain/user_stories.md
feeds-into: execution/sprint_plan.md · coordination/task_board.md · state/current_state.md
owner: AI-generated · human-curated priorities
updated: YYYY-MM-DD
---

# Master Task List & Work Breakdown

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

## Standard Task Template

```markdown
### TASK-NNN: [Task title]
**Status:** todo
**Complexity:** S
**Governs:** [US-NNN] · [DR-NNN if applicable]
**Spec refs:** [file(s) to read before starting this task]
**Depends on:** [TASK-NNN, or —]
**Required capabilities:** [backend | frontend | database | testing | devops]
**Claimed by:** —
**Claimed at:** —
**Lease expires:** —
**Scope boundary:**
  - INCLUDED: [Explicit file/directory allowlist — only modify these]
  - EXCLUDED: [Explicit read-only allowlist — never modify directly]
**Verification target:** [Exact test command and pass criteria]
**Review required:** yes | no
**Reviewer:** —
**Completion evidence:** —
**Notes:** [Any clarification or gotcha]
```

---

## Phase 0 — Foundation

### TASK-001: Initialize project repository
**Status:** todo  
**Complexity:** XS  
**Governs:** Foundation setup  
**Spec refs:** `implementation/coding_standards.md` · `implementation/infrastructure.md`  
**Depends on:** —  
**Required capabilities:** `devops`, `infrastructure`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `package.json`, `tsconfig.json`, `.eslintrc.*`, `.prettierrc.*`, `docker-compose.yml`, `.gitignore`  
- **EXCLUDED:** `src/**`, `.specs/**`  
**Verification target:** `npm install` and `npm run build` succeed with 0 errors.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  
**Notes:** Match Node version in `infrastructure.md` exactly.  

---

### TASK-002: Set up database and run initial migration
**Status:** todo  
**Complexity:** S  
**Governs:** Database foundations  
**Spec refs:** `contracts/database_schema.md` · `implementation/infrastructure.md`  
**Depends on:** TASK-001  
**Required capabilities:** `database`, `devops`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/config/database.ts`, `migrations/**`, `docker-compose.yml` (service: db)  
- **EXCLUDED:** `src/modules/**`, `.specs/**`  
**Verification target:** DB running in docker-compose, initial migration applies cleanly, trigger functions active.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  
**Notes:** Include the shared `trigger_set_timestamp()` function from `database_schema.md`.  

---

### TASK-003: Implement auth endpoints
**Status:** todo  
**Complexity:** M  
**Governs:** US-001 · Security model  
**Spec refs:** `contracts/api_contracts.md` (POST /auth/register, POST /auth/login) · `architecture/security_model.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-002  
**Required capabilities:** `backend`, `security`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/auth/**`, `src/middleware/auth.middleware.ts`, `tests/modules/auth/**`  
- **EXCLUDED:** `src/config/**`, `src/shared/**`, `.specs/**`  
**Verification target:** Unit tests covering password hashing, token issue, 401 unauthenticated, and 409 conflict scenarios with branch coverage >= 80%.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  
**Notes:** Follow all patterns in `backend_guide.md` exactly. Tests must cover 401 and 409 cases.  

---

## Phase 1 — Core features

### TASK-004: Implement [resource] CRUD API
**Status:** todo  
**Complexity:** M  
**Governs:** US-00X · DR-00X  
**Spec refs:** `contracts/api_contracts.md` · `contracts/database_schema.md` · `domain/domain_rules.md` · `implementation/backend_guide.md`  
**Depends on:** TASK-003  
**Required capabilities:** `backend`, `database`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/modules/[resource]/**`, `tests/modules/[resource]/**`  
- **EXCLUDED:** `src/modules/auth/**`, `src/config/**`, `.specs/**`  
**Verification target:** All endpoints match `api_contracts.md` exactly; service layer enforces DR-00X; integration tests pass.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  
**Notes:** DR-00X must be enforced in service layer — see `domain_rules.md`.  

---

### TASK-005: Build [resource] list page
**Status:** todo  
**Complexity:** S  
**Governs:** US-00X  
**Spec refs:** `contracts/ui_contracts.md` ([Resource]ListPage) · `implementation/frontend_guide.md`  
**Depends on:** TASK-004  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/pages/[Resource]ListPage.tsx`, `src/components/features/[resource]/[Resource]List.tsx`, `src/hooks/use[Resource].ts`, `src/api/[resource].api.ts`, `tests/pages/[Resource]ListPage.test.tsx`  
- **EXCLUDED:** `src/modules/**`, `src/api/client.ts`, `.specs/**`  
**Verification target:** Loading skeleton, error banner with retry, and empty state CTA are rendered matching `ui_contracts.md`.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  
**Notes:** Loading, error, and empty states required per `frontend_guide.md`.  

---

### TASK-006: Build [resource] form
**Status:** todo  
**Complexity:** M  
**Governs:** US-00X  
**Spec refs:** `contracts/ui_contracts.md` ([Resource]FormPage) · `implementation/frontend_guide.md`  
**Depends on:** TASK-005  
**Required capabilities:** `frontend`  
**Claimed by:** —  
**Claimed at:** —  
**Lease expires:** —  
**Scope boundary:**  
- **INCLUDED:** `src/pages/[Resource]FormPage.tsx`, `src/components/features/[resource]/[Resource]Form.tsx`, `tests/pages/[Resource]FormPage.test.tsx`  
- **EXCLUDED:** `src/modules/**`, `.specs/**`  
**Verification target:** Validates fields with Zod; supports both create and edit modes; handles inline field errors and global submit error.  
**Review required:** yes  
**Reviewer:** —  
**Completion evidence:** —  
**Notes:** Form uses react-hook-form + zod per `frontend_guide.md`.  

---

## Task Index

| ID | Title | Phase | Status | Complexity | Depends on | Required Capabilities |
|----|-------|:---:|:---:|:---:|:---:|:---:|
| TASK-001 | Init repository | 0 | todo | XS | — | `devops`, `infrastructure` |
| TASK-002 | DB setup + migration | 0 | todo | S | TASK-001 | `database`, `devops` |
| TASK-003 | Auth endpoints | 0 | todo | M | TASK-002 | `backend`, `security` |
| TASK-004 | [Resource] CRUD API | 1 | todo | M | TASK-003 | `backend`, `database` |
| TASK-005 | [Resource] list page | 1 | todo | S | TASK-004 | `frontend` |
| TASK-006 | [Resource] form | 1 | todo | M | TASK-005 | `frontend` |
