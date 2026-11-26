---
tier: agents
role: cross-agent-communication-standard
read: when formatting or parsing messages
updated: 2026-11-24
---

# Cross-Agent Communication Standard: Ekklesia

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
- **Timestamp:** 2026-11-24T14:30:25Z
- **Task:** none
- **Priority:** info
- **Payload:**
  Agent session initialized on branch `agent/cc-auth`. Clean worktree created from `origin/main`. Read `_index.md` and `protocol.md`. Ready to evaluate tasks.
```

### 2.2 `TASK_CLAIMED`
Emitted immediately upon updating `.specs/coordination/task_board.md`.
```markdown
## MSG-002: TASK_CLAIMED
- **Timestamp:** 2026-11-24T14:32:00Z
- **Task:** TASK-003
- **Priority:** action-required
- **Payload:**
  Claimed TASK-003 (Auth Endpoints). Prerequisite TASK-002 confirmed done. Lease active for 4 hours.
```

### 2.3 `PROGRESS_UPDATE`
Emitted at key implementation milestones.
```markdown
## MSG-003: PROGRESS_UPDATE
- **Timestamp:** 2026-11-24T15:15:00Z
- **Task:** TASK-003
- **Priority:** info
- **Payload:**
  Implemented JWT signing service and Argon2id password hasher. Passing unit tests.
```

### 2.4 `CONTRACT_CHANGE_PROPOSED`
Emitted when an agent discovers a schema or contract deficiency.
```markdown
## MSG-004: CONTRACT_CHANGE_PROPOSED
- **Timestamp:** 2026-11-24T15:45:00Z
- **Task:** TASK-003
- **Priority:** urgent
- **Payload:**
  Propose adding 'mfa_enabled' boolean column to users table in contracts/database_schema.md.
```

### 2.5 `TASK_COMPLETED`
Emitted upon completing implementation and satisfying verification gates.
```markdown
## MSG-005: TASK_COMPLETED
- **Timestamp:** 2026-11-24T16:30:00Z
- **Task:** TASK-003
- **Priority:** action-required
- **Payload:**
  Completed implementation of TASK-003. Verification evidence included. PR opened for review.
```
