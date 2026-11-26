---
tier: agents
role: agent-onboarding-runbook
read: first action of any new agent joining the repository
updated: 2026-11-24
---

# Agent Onboarding Runbook: Ekklesia

> AI instruction: Follow this exact 5-step checklist whenever you start a new session or join this project repository.
> Do not begin inspecting code or editing files until Step 5 is completed.

---

## Step 1: Establish Your Session Identity
Generate your unique `session_id` using the platform prefix and UTC timestamp:
```text
{platform_prefix}-{YYYYMMDD}-{HHMMSS}
```
*Platform Prefixes:*
`cx` (Codex), `cc` (Claude Code), `cr` (Cursor), `ws` (Windsurf), `gm` (Gemini CLI), `cp` (Copilot), `ag` (Antigravity), `xx` (Other).

*Example:* `cc-20261123-143022`

---

## Step 2: Create Your Isolated Git Worktree
Never work directly in the root repository directory or on the `main` branch.
Run the following shell commands:
```bash
# Fetch latest repository state
git fetch origin main

# Create a clean worktree on a new branch named after your session
git worktree add -b agent/{session_id} ../wt-{session_id} origin/main

# Change directory into your worktree
cd ../wt-{session_id}

# Install dependencies offline/cached
npm ci --prefer-offline
```

---

## Step 3: Register in the Agent Session Registry
Open `.specs/coordination/agent_registry.md` and append your session entry to the **Active & Historical Sessions** table:
```markdown
| `{session_id}` | {Platform Name} | {Role/Specialization} | `agent/{session_id}` | active | {UTC Start Time} | {UTC Start Time} | — |
```

---

## Step 4: Initialize Your Message Stream
Create a dedicated append-only message file at:
```text
.specs/coordination/messages/{session_id}.messages.md
```
Add the header block and emit your initial `SESSION_STARTED` message:
```markdown
# Session Message Stream: {session_id}
**Platform:** {Platform Name}  
**Started:** {UTC Start Time}  
**Worktree:** agent/{session_id}  

---

## MSG-001: SESSION_STARTED
- **Timestamp:** {UTC Start Time}
- **Task:** none
- **Priority:** info
- **Payload:**
  Agent session initialized on branch `agent/{session_id}`. Worktree created. Onboarding completed.
```

---

## Step 5: Read Current State & Select Task
1. Read `.specs/_index.md` and `.specs/state/current_state.md`.
2. Open `.specs/coordination/task_board.md` and claim an unblocked task per `.specs/coordination/protocol.md` §3.
