---
tier: 5
role: current-sprint-scope
depends-on: execution/tasks.md · execution/dependency_graph.md
feeds-into: state/current_state.md
owner: human-curated · AI-drafted
updated: YYYY-MM-DD
---

# Sprint plan

> AI instruction: When asked "what should I work on next?", read this file first.
> Only work on tasks listed as In scope below. If a task not in this sprint is needed
> to complete a sprint task, flag it rather than pulling it in silently.

---

## Current sprint

**Sprint:** [Sprint number or name — e.g. Sprint 1 / MVP Phase 0]
**Start:** YYYY-MM-DD
**End:** YYYY-MM-DD
**Goal:** [One sentence — what does completing this sprint achieve?]

---

## In scope

| Task | Title | Priority | Owner | Status |
|------|-------|----------|-------|--------|
| TASK-001 | Init repository | P0 | [name/AI] | todo |
| TASK-002 | DB setup + migration | P0 | [name/AI] | todo |
| TASK-003 | Auth endpoints | P0 | [name/AI] | todo |

---

## Out of scope this sprint

> Explicitly excluded — do not start these even if time allows.

- TASK-004 and below — deferred to Sprint 2
- [Any other explicitly deferred tasks]

---

## Sprint notes

- [Any special constraints or focus areas for this sprint]
- [Dependencies on external things — waiting for design, API credentials, etc.]

---

## Definition of done (this sprint)

- [ ] All in-scope tasks marked `done` in tasks.md
- [ ] CI passes on main branch
- [ ] `state/current_state.md` updated with what was built
- [ ] Any new decisions appended to `state/decisions_log.md`
- [ ] `known_issues.md` updated with anything deferred or broken
