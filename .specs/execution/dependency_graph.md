---
tier: 5
role: task-dependency-map
depends-on: execution/tasks.md
feeds-into: execution/sprint_plan.md
owner: AI-generated · regenerate when tasks.md changes
updated: YYYY-MM-DD
---

# Dependency graph

> AI instruction: Use this file to determine which task to pick next.
> A task is "unblocked" when all tasks in its "Blocked by" list are marked `done`.
> Never start a blocked task. When tasks.md changes, regenerate this file.

---

## Current unblocked tasks

> These tasks have no incomplete dependencies — any can be started now.

- [ ] TASK-001: Initialize project repository
- [ ] [other unblocked tasks]

---

## Dependency tree

```
TASK-001 (init repo)
└── TASK-002 (DB setup)
    └── TASK-003 (auth endpoints)
        ├── TASK-004 (resource CRUD API)
        │   └── TASK-005 (resource list page)
        │       └── TASK-006 (resource form)
        └── TASK-00X (another feature)
            └── ...
```

---

## Parallel opportunities

> Tasks in the same group can run simultaneously (no shared dependencies).

| Parallel group | Tasks | Unblocked after |
|---------------|-------|----------------|
| Group A | TASK-005, TASK-00X | TASK-004 done |
| Group B | TASK-00Y, TASK-00Z | TASK-003 done |

---

## Blocked tasks

| Task | Blocked by | Unblocks |
|------|-----------|---------|
| TASK-002 | TASK-001 | TASK-003 |
| TASK-003 | TASK-002 | TASK-004, TASK-00X |
| TASK-004 | TASK-003 | TASK-005, TASK-006 |
| TASK-005 | TASK-004 | TASK-006 |
| TASK-006 | TASK-005 | — |

---

## Critical path

> The longest dependency chain — delays here delay the entire project.

```
TASK-001 → TASK-002 → TASK-003 → TASK-004 → TASK-005 → TASK-006
   XS           S          M           M           S          M
Total: ~[X] days on critical path
```
