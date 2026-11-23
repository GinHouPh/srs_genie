---
tier: agents
role: conflict-resolution-and-recovery-guide
read: when encountering concurrency errors, merge conflicts, or stale state
updated: YYYY-MM-DD
---

# Conflict Resolution & Recovery Guide

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
When attempting to merge your PR branch into `main`, Git reports conflict markers (`<<<<<<< HEAD`).

### Recovery Algorithm:
1. Never resolve merge conflicts by blindly overwriting the remote file with your local copy.
2. Inside your worktree, rebase onto the latest `origin/main`:
   ```bash
   git fetch origin main
   git rebase origin/main
   ```
3. For each conflicted file:
   - Inspect whether the conflict is in code or in coordination logs.
   - If in coordination logs (e.g. `task_board.md` or `current_state.md`), preserve BOTH agents' updates by merging sections sequentially.
   - If in source code, verify that the other agent's change does not violate your task's acceptance criteria before accepting changes.
4. Run full test suite:
   ```bash
   npm test
   npm run lint
   ```
5. Complete rebase and force-push with lease to your agent branch:
   ```bash
   git rebase --continue
   git push --force-with-lease origin agent/{session_id}
   ```

---

## 4. Upstream Contract Shift (Cascade Invalidation)

### Symptom:
While you are implementing a task, another agent or human merges a change to Tier 2 (`data_model.md`) or Tier 3 (`api_contracts.md`).

### Recovery Algorithm:
1. Immediately pause implementation.
2. Check `.specs/coordination/messages/` for the `CONTRACT_CHANGE` notice.
3. Pull the latest contracts into your worktree:
   ```bash
   git pull origin main
   ```
4. Re-read the modified contract section.
5. Adjust your module's router, controller, or schema to match the updated contract.
6. Re-run your tests to ensure alignment with the new specification.
