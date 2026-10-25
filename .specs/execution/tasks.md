---
tier: 5
role: atomic-task-list
depends-on: all Tier 4 guides · domain/user_stories.md
feeds-into: execution/sprint_plan.md · state/current_state.md
owner: AI-generated · human-curated priorities
updated: YYYY-MM-DD
---

# Tasks

> AI instruction: Pick tasks from this file when asked to implement a feature.
> Always check dependency_graph.md to find the next unblocked task.
> Update task status here after completing work.
> Never start a task whose dependencies are not marked `done`.

---

## Status values
`todo` · `in-progress` · `blocked` · `done` · `deferred`

## Complexity values
`XS` (< 1h) · `S` (1–3h) · `M` (3–6h) · `L` (1–2d) · `XL` (2–5d)

---

## Task format

```
### TASK-NNN: [Task title]
Status: todo
Complexity: S
Governs: [US-NNN] · [DR-NNN if applicable]
Spec refs: [file(s) to read before starting this task]
Depends on: [TASK-NNN, or —]
Output: [What file/code/artifact this task produces]
Notes: [Any clarification or gotcha]
```

---

## Phase 0 — Foundation

### TASK-001: Initialize project repository
**Status:** todo
**Complexity:** XS
**Governs:** —
**Spec refs:** implementation/coding_standards.md · implementation/infrastructure.md
**Depends on:** —
**Output:** Git repo with tsconfig, eslint, prettier, package.json, docker-compose.yml
**Notes:** Match Node version in infrastructure.md exactly

---

### TASK-002: Set up database and run initial migration
**Status:** todo
**Complexity:** S
**Governs:** —
**Spec refs:** contracts/database_schema.md · implementation/infrastructure.md
**Depends on:** TASK-001
**Output:** DB running in docker-compose, migration for all tables in database_schema.md
**Notes:** Include the shared trigger function from database_schema.md

---

### TASK-003: Implement auth endpoints
**Status:** todo
**Complexity:** M
**Governs:** US-001
**Spec refs:** contracts/api_contracts.md (POST /auth/register, POST /auth/login) · architecture/security_model.md · implementation/backend_guide.md
**Depends on:** TASK-002
**Output:** `src/modules/auth/` — router, controller, service, repository, schema, tests
**Notes:** Follow all patterns in backend_guide.md exactly. Tests must cover 401, 409 cases.

---

## Phase 1 — Core features

### TASK-004: Implement [resource] CRUD API
**Status:** todo
**Complexity:** M
**Governs:** US-00X · DR-00X
**Spec refs:** contracts/api_contracts.md · contracts/database_schema.md · domain/domain_rules.md · implementation/backend_guide.md
**Depends on:** TASK-003
**Output:** `src/modules/[resource]/` — full CRUD with domain rule enforcement and tests
**Notes:** DR-00X must be enforced in service layer — see domain_rules.md

---

### TASK-005: Build [resource] list page
**Status:** todo
**Complexity:** S
**Governs:** US-00X
**Spec refs:** contracts/ui_contracts.md ([Resource]ListPage) · implementation/frontend_guide.md
**Depends on:** TASK-004
**Output:** `src/pages/[Resource]ListPage.tsx` + `src/hooks/use[Resource].ts` + `src/api/[resource].api.ts`
**Notes:** Loading, error, and empty states required per frontend_guide.md

---

### TASK-006: Build [resource] form
**Status:** todo
**Complexity:** M
**Governs:** US-00X
**Spec refs:** contracts/ui_contracts.md ([Resource]FormPage) · implementation/frontend_guide.md
**Depends on:** TASK-005
**Output:** `src/pages/[Resource]FormPage.tsx` with create + edit modes

---

## Phase 2 — [Next phase name]

<!-- Add tasks here as the spec matures -->

---

## Task index

| ID | Title | Phase | Status | Complexity | Depends on |
|----|-------|-------|--------|-----------|------------|
| TASK-001 | Init repository | 0 | todo | XS | — |
| TASK-002 | DB setup + migration | 0 | todo | S | TASK-001 |
| TASK-003 | Auth endpoints | 0 | todo | M | TASK-002 |
| TASK-004 | [Resource] CRUD API | 1 | todo | M | TASK-003 |
| TASK-005 | [Resource] list page | 1 | todo | S | TASK-004 |
| TASK-006 | [Resource] form | 1 | todo | M | TASK-005 |
