---
role: multi-session-handoff-ledger
read: start of EVERY session (immediately after _index.md)
write: end of EVERY session
owner: AI writes · human reviews
format: append-and-prune multi-session ledger
updated: YYYY-MM-DD HH:MM UTC
---

# Current State & Multi-Session Runtime Ledger

> AI instruction: Read this at the start of every session before reading any spec.
> Write to this at the END of every session.
> Do NOT overwrite other agents' active session workstreams. Update your own session block.

---

## ⚡ Quick Context (Read First)

**Active Milestone:** Sprint 1 — MVP Foundation  
**Trunk Status:** `main` branch passing all lint and test gates  
**Active Workstreams:** No active external claims; all Sprint 1 tasks currently available  
**Next Recommended Action:** Claim `TASK-001` (Initialize project repository) on `.specs/coordination/task_board.md`  

---

## Active Session Workstreams

<!-- Agents add and update their active session blocks here. Prune once merged to main. -->

*(No active sessions currently running. Ready for agent onboarding.)*

---

## Persistent State

### What's Working (Confirmed)
- Specification architecture reengineered for cross-platform multi-agent collaboration (Tiers 0–5 + coordination + agents + state).
- Repository universal entry point established at `AGENTS.md`.

### What's Broken or Incomplete
- Source code implementation not yet begun (all Phase 0 tasks in `todo` status).
- Tracked issues: None currently open (see `state/known_issues.md`).

### Active Constraints
- Git worktree isolation is mandatory for all parallel agent sessions.
- Zero out-of-scope modifications allowed during task execution.

---

## Pending Cross-Agent Decisions & Proposals

<!-- Cross-agent proposals awaiting stakeholder or peer review. -->
*(None pending).*

---

## Session Start Checklist (AI Self-Check)

Before starting any work this session:
- [ ] Read `AGENTS.md` and `_index.md` — understand project rules and spec map.
- [ ] Read this file — understand active sessions and persistent state.
- [ ] Execute `agents/onboarding.md` — create worktree and register in `coordination/agent_registry.md`.
- [ ] Select an unblocked task from `coordination/task_board.md`.
- [ ] Secure task lease via atomic push before editing code.
- [ ] Implement strictly within `Scope boundary: INCLUDED` files.
- [ ] Execute tests and compile completion evidence per `agents/verification.md`.
- [ ] Post completion message and submit PR.
