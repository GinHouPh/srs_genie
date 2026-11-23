---
tier: agents
role: agent-onboarding-runbook
read: first action of any new agent joining the repository
updated: YYYY-MM-DD
---

# Agent Onboarding Runbook

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
# Session Message Log: {session_id}
- **Platform:** {Platform Name}
- **Agent Role:** {Role}
- **Started At:** {UTC Start Time}

---

## MSG-001: SESSION_STARTED
- **Timestamp:** {UTC Start Time}
- **Task:** none
- **Priority:** info
- **Payload:**
  Agent session initialized on branch `agent/{session_id}`. Read `_index.md` and `protocol.md`. Ready to evaluate tasks.
```

---

## Step 5: Acquire Context & Scan Active Work
1. Read `.specs/state/current_state.md` to see currently active sessions and milestones.
2. Read `.specs/coordination/task_board.md` to see claimed vs unblocked tasks.
3. Review recent files in `.specs/coordination/messages/` for any pending proposals or blocker announcements.
4. Proceed to `.specs/agents/lifecycle.md` Phase 2 (Task Claiming).
