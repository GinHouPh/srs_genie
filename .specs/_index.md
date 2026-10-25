---
tier: entry
role: navigation-manifest
read: every session, before any other file
updated: YYYY-MM-DD
---

# Project index

> AI instruction: Read this file first. Do not read any other file until you have parsed
> the full file table below. Then read only the files relevant to your current task.
> Always read `/state/current_state.md` immediately after this file.

## Project summary

<!-- Replace this paragraph with a 3–5 sentence description of the product. -->
<!-- What does it do, who uses it, what problem does it solve, what is the core tech stack. -->

**[Project name]** — [one-line description]

**Stack:** [e.g. Node.js · PostgreSQL · React · deployed on Railway]

---

## Spec file map

| File | Tier | Contains | When to read |
|------|------|----------|--------------|
| `foundation/brief.md` | 0 | Product vision, constraints, non-negotiables | Always — first spec read |
| `foundation/glossary.md` | 0 | Canonical terms and definitions | Before writing any spec or code |
| `domain/user_stories.md` | 1 | User roles, stories, acceptance criteria | When generating tasks or tests |
| `domain/domain_rules.md` | 1 | Business invariants and logic constraints | Before generating business logic |
| `architecture/system_design.md` | 2 | Component map, patterns, communication style | When designing or debugging architecture |
| `architecture/data_model.md` | 2 | Canonical entities, fields, relationships | Before touching schema or API |
| `architecture/security_model.md` | 2 | Auth strategy, roles, permission matrix | Before generating auth code or endpoints |
| `contracts/api_contracts.md` | 3 | Endpoint definitions, request/response schemas | When generating backend routes or frontend calls |
| `contracts/database_schema.md` | 3 | Table definitions, indexes, migrations | When generating DB code or migrations |
| `contracts/ui_contracts.md` | 3 | Component props, state, events, routes | When generating frontend components |
| `implementation/backend_guide.md` | 4 | Folder layout, service patterns, code conventions | When writing backend code |
| `implementation/frontend_guide.md` | 4 | Component structure, routing, state management | When writing frontend code |
| `implementation/infrastructure.md` | 4 | Cloud, environments, CI/CD, env vars | When writing deploy configs |
| `implementation/testing_strategy.md` | 4 | Coverage targets, test patterns, mocking rules | When writing tests |
| `implementation/coding_standards.md` | 4 | Naming, formatting, PR process | Before writing any code |
| `execution/tasks.md` | 5 | Atomic task list with status | When picking the next task |
| `execution/dependency_graph.md` | 5 | Task dependency map | When determining task order |
| `execution/sprint_plan.md` | 5 | Current sprint scope and priorities | When starting a work session |
| `state/current_state.md` | state | What's built, what's broken, next action | Every session — read after this file |
| `state/decisions_log.md` | state | Architecture Decision Records (append-only) | Before making any architectural decision |
| `state/known_issues.md` | state | Bugs, tech debt, deferred decisions | Before touching affected areas |

---

## Regeneration rules

> If a file changes, regenerate all files that depend on it. Do not edit derived files directly.

```
brief.md changed          → regenerate everything below Tier 0
glossary.md changed       → review all files for term consistency
data_model.md changed     → regenerate database_schema.md + api_contracts.md + ui_contracts.md
api_contracts.md changed  → regenerate ui_contracts.md + update testing_strategy.md
user_stories.md changed   → regenerate tasks.md + testing_strategy.md
```

---

## Session protocol for AI

1. Read `_index.md` (this file)
2. Read `state/current_state.md`
3. Read `state/decisions_log.md` (scan only — check for relevant past decisions)
4. Read only the tier files needed for the current task (see file map above)
5. Execute task
6. Write results to `state/current_state.md`
7. Append any new decisions to `state/decisions_log.md`
