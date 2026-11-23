---
tier: agents
role: agent-lifecycle-runbook
read: during every stage of session execution
updated: YYYY-MM-DD
---

# Agent Session Lifecycle

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
2. Verify all user story acceptance criteria (AC) mapped to the task.
3. Validate domain rule enforcement (DR-NNN) in the service layer.
4. Verify that zero files outside the `INCLUDED` boundary were touched:
   ```bash
   git diff --name-only origin/main
   ```
5. If any test or lint check fails, resolve errors iteratively within your worktree.

---

## Phase 5: Completion & Handoff
1. Compile the standardized **Completion Evidence Report** (see `.specs/agents/verification.md`).
2. Update `.specs/coordination/task_board.md`:
   - If peer review is required: set status to `review`.
   - If self-contained/reviewed: set status to `done`.
3. Emit `TASK_COMPLETED` (and `REVIEW_REQUEST` if applicable) in your message stream.
4. Update `.specs/state/current_state.md` with what was implemented.
5. Push your branch and open a Pull Request:
   ```bash
   git push origin agent/{session_id}
   ```

---

## Phase 6: Session Exit or Rebase
1. If your session is ending:
   - Update `.specs/coordination/agent_registry.md` setting your status to `completed`.
   - Emit `SESSION_COMPLETED` in your message stream.
   - Clean up your local worktree:
     ```bash
     cd .. && git worktree remove ../wt-{session_id}
     ```
2. If continuing to another task:
   - Pull the latest `main` into your branch/worktree.
   - Return to Phase 2.
3. If interrupted/recovering from a crash:
   - Inspect `.specs/agents/conflict_resolution.md` for the recovery checklist.
