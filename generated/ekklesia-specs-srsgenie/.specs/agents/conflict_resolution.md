---
tier: agents
role: conflict-resolution-and-recovery-guide
read: when encountering concurrency errors, merge conflicts, or stale state
updated: 2026-11-24
---

# Conflict Resolution & Recovery Guide: Ekklesia

> AI instruction: Use this runbook when an operation fails due to concurrency collisions, stale claims, broken merges, or crashes.
> Follow the deterministic resolution algorithms below.

---

## 1. Simultaneous Task Claim Collision

### Symptom:
You updated `.specs/coordination/task_board.md` to claim `TASK-NNN`, but your Git push was rejected with `[rejected - non-fast-forward]`.

### Recovery Algorithm:
1. Fetch latest remote state:
   ```bash
   git fetch origin main
   ```
2. Inspect the latest `coordination/task_board.md` on `origin/main`.
3. If another agent successfully committed a claim to `TASK-NNN` first:
   - Revert your local task board change:
     ```bash
     git checkout origin/main -- .specs/coordination/task_board.md
     ```
   - Log `MSG-XXX: CLAIM_COLLISION_RESOLVED` in your session stream:
     *"Task TASK-NNN was claimed by {competing_session}. Releasing local attempt."*
   - Return to `coordination/task_board.md` and claim the next available unblocked task.
4. If the conflict was merely an unrelated message or file edit:
   - Run `git rebase origin/main`.
   - Re-push your claim.

---

## 2. Crashed Agent / Expired Lease Reclaim

### Symptom:
A task is marked `claimed` or `in-progress`, but its `lease_expires` timestamp has passed (> 4 hours), or the owning agent session in `agent_registry.md` has no heartbeat for > 4 hours.

### Recovery Algorithm:
1. Verify that no open Pull Request exists from the claimant's branch.
2. In your session stream, post `TASK_RECLAIM_ANNOUNCED`:
   *"Task TASK-NNN lease expired at {timestamp} with no activity. Reclaiming task."*
3. Update `.specs/coordination/agent_registry.md` marking the old session as `abandoned`.
4. Update `.specs/coordination/task_board.md`:
   - Reset task status to `claimed`.
   - Set `Claimed by` to your own `session_id`.
   - Set `Lease expires` to current UTC time + 4 hours.
5. Commit and push the reclaim.

---

## 3. Git Merge Conflicts on Feature Integration

### Symptom:
When rebasing your worktree branch on `origin/main`, Git halts with merge conflicts.

### Recovery Algorithm:
1. If the conflict is inside your task's `Scope boundary: INCLUDED` files:
   - Inspect upstream changes from `origin/main`.
   - Resolve conflict preserving both upstream contract compliance and your task's implementation.
   - Run `npm test` to verify zero regressions.
   - Run `git add <file>` and `git rebase --continue`.
2. If the conflict is inside an `EXCLUDED` file (e.g. a shared config or schema modified by another merged PR):
   - **Do NOT manually resolve the conflict.**
   - Abort rebase: `git rebase --abort`.
   - Check if the upstream contract change invalidates your implementation.
   - Post a `CONTRACT_DRIFT_DETECTED` message in your stream and request peer coordination.
