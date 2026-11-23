---
tier: coordination
role: agent-session-registry
read: start and end of every session
updated: YYYY-MM-DD
---

# Agent Session Registry

> AI instruction: Every agent session must register itself in the table below upon initialization.
> Format your `Session ID` as `{platform}-{YYYYMMDD}-{HHMMSS}` (see `.specs/coordination/protocol.md` §1).
> Update your `Last Heartbeat` and `Status` during execution, and mark your session `completed` before exiting.

---

## Active & Historical Sessions

| Session ID | Platform | Agent Role | Worktree Branch | Status | Started At (UTC) | Last Heartbeat (UTC) | Current Task |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| `example-session-001` | Antigravity | orchestrator | `main` | completed | 2026-11-23T20:00:00Z | 2026-11-23T20:50:00Z | — |

---

## Session Status Definitions
- `active`: Session is actively computing, editing, or executing tests.
- `idle`: Session is initialized or waiting on peer review / contract decision.
- `completed`: Session has finished all claimed work, submitted PRs, and exited cleanly.
- `abandoned`: Session exceeded the 4-hour lease threshold with no heartbeat or activity.

---

## Heartbeat & Recovery Guidelines
1. **Heartbeat Cadence:** Update your `Last Heartbeat` timestamp every 30 to 60 minutes if working on long-running tasks.
2. **Crash Detection:** If an agent session has no heartbeat update for > 4 hours and holds an active task claim, any newly initializing agent may mark that session `abandoned` and reclaim the task per `.specs/coordination/protocol.md` §3.3.
