---
tier: agents
role: agent-lifecycle-runbook
read: during every stage of session execution
updated: 2026-11-24
---

# Agent Session Lifecycle: Ekklesia

> AI instruction: All agents must execute their tasks following the 6 sequential phases defined below.
> Never skip phases or advance to task completion without satisfying verification gates.

---

## Lifecycle Overview

```
Phase 1: Bootstrap & Orient  ──►  Phase 2: Task Claiming  ──►  Phase 3: Bounded Implementation
             ▲                                                               │
             │ (Recovery/Rebase)                                             ▼
Phase 6: Rebase & Recover    ◄──  Phase 5: Evidence & Done  ◄──  Phase 4: Verification & Audit
```

---

## Phase 1: Bootstrap & Orient
1. Execute `.specs/agents/onboarding.md` steps (generate `session_id`, create worktree, register session, create message log).
2. Read `.specs/_index.md`, `.specs/coordination/protocol.md`, and `.specs/state/current_state.md`.
3. Check `.specs/state/decisions_log.md` for past architectural decisions (ADRs) that constrain the project.

---

## Phase 2: Task Selection & Claiming
1. Inspect `.specs/coordination/task_board.md`.
2. Filter for tasks with `Status: todo` whose `Blocked by` dependencies are marked `done`.
3. Select a task matching your capabilities (`Required capabilities`).
4. Secure the lease:
   - Edit `.specs/coordination/task_board.md` setting status to `claimed`, your `session_id`, and `lease_expires` (+4 hours).
   - Commit and push to `agent/{session_id}`.
   - If a merge/push conflict occurs because another agent claimed first, pull rebase and pick another unblocked task.
5. Emit `TASK_CLAIMED` in your message stream.

---

## Phase 3: Bounded Implementation
1. Read all specification files cited under the task's `Spec refs` field.
2. Formulate an internal implementation plan.
3. Review the task's `Scope boundary: INCLUDED` and `EXCLUDED` lists.
4. Modify and create files **strictly within** the `INCLUDED` boundary.
5. Never edit `EXCLUDED` files. If a shared contract change is needed, emit `CONTRACT_CHANGE_PROPOSED` and wait for sign-off.
6. Post a `PROGRESS_UPDATE` message when reaching major milestones.

---

## Phase 4: Verification & Audit
1. Run local test suites:
   ```bash
   npm test
   npm run lint
   npx tsc --noEmit
   ```
2. Check that the task's specific `Verification target` is completely met.
3. Verify that all domain rules (DR-NNN) and acceptance criteria (AC-NNN) governed by the task pass without regressions.
4. Compile the mandatory **Completion Evidence Block** (see `.specs/agents/verification.md`).

---

## Phase 5: Completion & Handoff
1. Publish `TASK_COMPLETED` with full evidence block to your message stream.
2. Update `.specs/coordination/task_board.md` setting status to `done` (or `review` if review is required).
3. Update `.specs/state/current_state.md` recording completed work in your active session workstream.
4. Push your branch and open a Pull Request targeting `main`.
5. If exiting session, update `.specs/coordination/agent_registry.md` setting status to `completed`.

---

## Phase 6: Conflict Recovery & Rebase
If PR integration or lease check encounters a collision:
- Follow `.specs/agents/conflict_resolution.md` to rebase cleanly or release lease.
