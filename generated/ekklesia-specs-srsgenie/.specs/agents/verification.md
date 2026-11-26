---
tier: agents
role: verification-and-review-standard
read: during Phase 4 and Phase 5
updated: 2026-11-24
---

# Evidence-Based Verification & Peer Review Standard: Ekklesia

> AI instruction: An agent must never mark a task `done` or `review` without providing deterministic proof of correctness.
> Claims such as "implemented successfully" or "tests passed" without supporting command outputs and file lists are treated as unverified.

---

## 1. Mandatory Completion Evidence Format

Every completed task must produce this standardized markdown evidence block in its Pull Request description and in its session message log:

```markdown
### Verification Evidence: TASK-NNN
- **Executed By:** {session_id}
- **Execution Date:** {ISO Timestamp}
- **Files Created:**
  - `path/to/created_file.ts`
- **Files Modified (Within Scope):**
  - `path/to/modified_file.ts`
- **Files Modified Outside Scope:** NONE (Verified clean via git diff)
- **Deterministic Test Results:**
  - Command: `npm test path/to/test.ts`
  - Output: `PASS (N tests, 100% assertions met, 0 failures)`
  - Branch Coverage: `XX.X%` (Minimum target: 80% for services, 90% for utils)
- **Invariant & Rule Verification:**
  - `DR-001` (Rule Name): Verified via test case `file.test.ts#L45`
- **Acceptance Criteria Checklist:**
  - [x] AC-1: [Exact condition verified]
  - [x] AC-2: [Exact condition verified]
- **Known Assumptions & Limitations:**
  - [Any assumptions or "none"]
```

---

## 2. Peer Review Checklist (For Reviewer Agents)

When an agent is requested to review another agent's completed work (`TASK-NNN` with status `review`):

### 1. Scope Boundary Verification
- Run `git diff origin/main...agent/{claimant_session} --name-only`.
- Confirm that **every single modified file** is explicitly listed in the task's `Scope boundary: INCLUDED` list.
- If ANY unauthorized file is modified: **REJECT** immediately with `REVISION_REQUIRED`.

### 2. Independent Test Execution
- Check out the PR branch in an isolated reviewer worktree:
  ```bash
  git fetch origin agent/{claimant_session}
  npm test
  npm run lint
  npx tsc --noEmit
  ```
- Verify all automated checks pass with zero warnings or errors.
