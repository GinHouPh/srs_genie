---
role: session-handoff
read: start of EVERY session (immediately after _index.md)
write: end of EVERY session
owner: AI writes · human reviews
format: replace the previous session's entry — do not accumulate endlessly
updated: YYYY-MM-DD HH:MM UTC
---

# Current state

> AI instruction: Read this at the start of every session before reading any spec.
> Write to this at the END of every session. Replace the "Last session" section
> with the current session's update. Keep the "Persistent" section growing but pruned
> — remove items that are no longer relevant.

---

## ⚡ Quick context (read this first)

**Where we are:** [One sentence. e.g. "Auth is done, starting CRUD for [resource] next."]
**Last worked on:** [TASK-NNN — what was done]
**Next recommended action:** [Specific next step — e.g. "Run TASK-004 — read api_contracts.md first"]

---

## Last session — [YYYY-MM-DD]

### What was built
- [TASK-NNN] — [brief description of what was implemented]
- [TASK-NNN] — [brief description]

### What was tested
- [Test type]: [what was verified and result]

### What changed in specs
- [File]: [what was updated and why]

### Decisions made
- [Decision] → recorded in `state/decisions_log.md` as ADR-00X

### Open questions (needs human answer before proceeding)
- [ ] [Question]
- [ ] [Question]

---

## Persistent state

### What's working (confirmed)
- [Component/feature]: [status — e.g. "Auth endpoints: all tests passing, deployed to staging"]

### What's broken or incomplete
- [Component/feature]: [issue] — tracked in `known_issues.md` as ISSUE-NNN

### Active constraints
- [e.g. "Staging DB credentials not yet provided — blocking TASK-00X"]
- [e.g. "File upload endpoint deferred — see known_issues.md ISSUE-002"]

### Spec files that need updating
- [ ] [File] — [what needs to change]

---

## Session start checklist (AI self-check)

Before starting any work this session:
- [ ] Read `_index.md` — understand project scope
- [ ] Read this file — understand current state
- [ ] Scan `state/decisions_log.md` — check for relevant past decisions
- [ ] Read `execution/sprint_plan.md` — confirm what's in scope
- [ ] Identify the next unblocked task from `execution/dependency_graph.md`
- [ ] Read the spec files listed in that task's `Spec refs` field
- [ ] Begin work
