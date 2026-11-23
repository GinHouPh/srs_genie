---
tier: agents
role: cross-agent-communication-standard
read: when formatting or parsing messages
updated: YYYY-MM-DD
---

# Cross-Agent Communication Standard

> AI instruction: All communication between agents is persisted in `.specs/coordination/messages/{session_id}.messages.md`.
> Every entry must follow the standardized markdown message format defined below.

---

## 1. Universal Message Envelope Format

```markdown
---

## MSG-{sequence_number}: {MESSAGE_TYPE}
- **Timestamp:** {ISO 8601 UTC Timestamp}
- **Task:** {TASK-NNN or "none" or "general"}
- **Priority:** info | action-required | urgent
- **Payload:**
  {Structured description, evidence, proposal, or handoff details}
```

---

## 2. Standard Message Types & Templates

### 2.1 `SESSION_STARTED`
Emitted upon completing onboarding.
```markdown
## MSG-001: SESSION_STARTED
- **Timestamp:** 2026-11-23T14:30:25Z
- **Task:** none
- **Priority:** info
- **Payload:**
  Agent session initialized on branch `agent/cc-auth`. Clean worktree created from `origin/main`. Read `_index.md` and `protocol.md`. Ready to evaluate tasks.
```

### 2.2 `TASK_CLAIMED`
Emitted immediately upon updating `.specs/coordination/task_board.md`.
```markdown
## MSG-002: TASK_CLAIMED
- **Timestamp:** 2026-11-23T14:32:00Z
- **Task:** TASK-003
- **Priority:** action-required
- **Payload:**
  Claimed TASK-003 (Auth Endpoints). Prerequisite TASK-002 confirmed done. Lease active until 2026-11-23T18:32:00Z (4 hours).
```

### 2.3 `PROGRESS_UPDATE`
Emitted at key implementation milestones.
```markdown
## MSG-003: PROGRESS_UPDATE
- **Timestamp:** 2026-11-23T15:15:00Z
- **Task:** TASK-003
- **Priority:** info
- **Payload:**
  Implemented `src/modules/auth/auth.service.ts` with Argon2 password hashing. Preparing unit test suite.
```

### 2.4 `CONTRACT_CHANGE_PROPOSED`
Emitted when an agent needs to modify a Tier 2/3 specification or shared schema.
```markdown
## MSG-004: CONTRACT_CHANGE_PROPOSED
- **Timestamp:** 2026-11-23T15:45:00Z
- **Task:** TASK-003
- **Priority:** urgent
- **Payload:**
  **Proposed Change:** Return JWT refresh token via `HttpOnly` Set-Cookie header instead of JSON response body.
  **Affected Files:** `contracts/api_contracts.md#auth-endpoints`.
  **Impacted Tasks:** TASK-005 (Frontend Login).
  **Action Required:** Review requested by frontend agent or human.
```

### 2.5 `TASK_BLOCKED`
Emitted when a task cannot proceed due to an external factor or defective dependency.
```markdown
## MSG-005: TASK_BLOCKED
- **Timestamp:** 2026-11-23T16:00:00Z
- **Task:** TASK-003
- **Priority:** action-required
- **Payload:**
  Blocked by missing environment secret `JWT_SECRET` in local `.env.test`. Requesting config clarification.
```

### 2.6 `HANDOFF`
Emitted when transferring an incomplete task to another session.
```markdown
## MSG-006: HANDOFF
- **Timestamp:** 2026-11-23T17:00:00Z
- **Task:** TASK-003
- **Priority:** action-required
- **Payload:**
  **Work Completed:** Service and controller implemented; 8 tests passing.
  **Remaining:** Integration tests for 409 conflict scenario.
  **Branch:** `agent/cc-auth`
  **Next Step:** Run `npm test tests/modules/auth/` and complete remaining assertion.
```

### 2.7 `TASK_COMPLETED`
Emitted when all tests pass and completion evidence is assembled.
```markdown
## MSG-007: TASK_COMPLETED
- **Timestamp:** 2026-11-23T17:30:00Z
- **Task:** TASK-003
- **Priority:** info
- **Payload:**
  TASK-003 completed with full verification evidence. All 12 unit and integration tests passing (89.4% branch coverage). Pull Request opened on branch `agent/cc-auth`. Requesting peer review.
```

### 2.8 `REVIEW_REQUEST` & `REVIEW_RESULT`
Emitted for cross-agent peer review workflows.
```markdown
## MSG-008: REVIEW_RESULT
- **Timestamp:** 2026-11-23T18:00:00Z
- **Task:** TASK-003
- **Priority:** info
- **Payload:**
  **Result:** APPROVED
  **Reviewer:** `cx-20261123-143510`
  **Findings:** Verified zero out-of-scope edits. All tests executed cleanly. Meets DR-001 and DR-002 invariants.
```

### 2.9 `SESSION_COMPLETED`
Emitted when the agent session is exiting.
```markdown
## MSG-009: SESSION_COMPLETED
- **Timestamp:** 2026-11-23T18:05:00Z
- **Task:** none
- **Priority:** info
- **Payload:**
  Session `cc-20261123-143022` finished cleanly. All claimed tasks completed and reviewed. Worktree removed. Exiting.
```
