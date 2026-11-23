---
tier: entry
role: multi-agent-navigation-manifest
read: every session, before any other file
updated: YYYY-MM-DD
---

# Project Index & Multi-Agent Runbook

> AI instruction: Read this file first (or `AGENTS.md` at repository root). Do not read any other file until you have parsed the full file table below.
> Next, read `coordination/protocol.md` and check `coordination/task_board.md` before claiming or modifying any work.
> Always read `state/current_state.md` immediately after this file to understand active session streams.

## Project summary

<!-- Replace this paragraph with a 3–5 sentence description of the product. -->
<!-- What does it do, who uses it, what problem does it solve, what is the core tech stack. -->

**[Project name]** — [one-line description]

**Stack:** [e.g. Node.js · PostgreSQL · React · deployed on Railway]

---

## Spec File Map

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
| `execution/tasks.md` | 5 | Master canonical task list with multi-agent scope & leases | When planning work breakdown |
| `execution/dependency_graph.md` | 5 | Task dependency map & parallel groups | When determining task ordering |
| `execution/sprint_plan.md` | 5 | Multi-agent sprint allocations and active milestones | When starting a sprint milestone |
| `coordination/protocol.md` | coord | Multi-agent collaboration protocol & claiming rules | Mandatory before claiming any task |
| `coordination/task_board.md` | coord | Live task board with active leases & claimants | When picking an unblocked task |
| `coordination/agent_registry.md` | coord | Ledger of active and historical agent sessions | At session start, heartbeat, and exit |
| `coordination/messages/` | coord | Append-only message streams per agent session | When announcing claims, handoffs, or milestones |
| `agents/onboarding.md` | runbook | Step-by-step agent bootstrap and worktree setup | When initializing a new agent session |
| `agents/lifecycle.md` | runbook | 6-phase agent lifecycle from bootstrap to completion | To follow standard execution phases |
| `agents/task_execution.md` | runbook | Bounded implementation and scope enforcement rules | During active task implementation |
| `agents/communication.md` | runbook | Message schemas and cross-agent event standards | When posting messages or handoffs |
| `agents/verification.md` | runbook | Evidence-based completion and peer review guide | When validating work before PR submission |
| `agents/conflict_resolution.md` | runbook | Concurrency, collision, and contract drift recovery | When resolving conflicts or stale state |
| `state/current_state.md` | state | Multi-session workstreams, health, confirmed state | Every session — read after this file |
| `state/decisions_log.md` | state | Architecture Decision Records (append-only with attribution) | Before making any architectural change |
| `state/known_issues.md` | state | Bugs, tech debt, deferred decisions | Before touching affected areas |

---

## Regeneration rules

> If an upstream specification file changes, regenerate all files that depend on it. Do not edit derived files directly.

```
brief.md changed          → regenerate everything below Tier 0
glossary.md changed       → review all files for term consistency
data_model.md changed     → regenerate database_schema.md + api_contracts.md + ui_contracts.md
api_contracts.md changed  → regenerate ui_contracts.md + update testing_strategy.md + notify frontend/backend agents
user_stories.md changed   → regenerate tasks.md + testing_strategy.md + update task_board.md
```

---

## Multi-Agent Session Protocol

1. Read `AGENTS.md` (root) and `_index.md` (this file).
2. Execute onboarding: generate `session_id`, spin up isolated Git worktree (`agent/{session_id}`), and register in `coordination/agent_registry.md`.
3. Read `state/current_state.md` and check active sessions.
4. Scan `coordination/task_board.md` and select an unblocked `todo` task matching your capabilities.
5. Secure lease via atomic commit/push; announce `TASK_CLAIMED` in your message stream (`coordination/messages/{session_id}.messages.md`).
6. Read the tier files listed in your task's `Spec refs`.
7. Execute implementation strictly within the task's `Scope boundary: INCLUDED` files.
8. Validate implementation: run tests, verify acceptance criteria, compile completion evidence.
9. Publish `TASK_COMPLETED` with evidence, submit PR to `main`, and update `state/current_state.md`.
