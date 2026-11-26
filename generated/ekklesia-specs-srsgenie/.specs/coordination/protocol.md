---
tier: coordination
role: multi-agent-collaboration-protocol
read: mandatory before claiming or executing any task
updated: 2026-11-24
---

# Multi-Agent Coordination Protocol: Ekklesia

> AI instruction: This document defines the non-negotiable rules of engagement for all AI coding agents working on this project.
> No agent is permitted to write or edit source code without an active, confirmed task claim secured through this protocol.
> Violation of scope boundaries or silent contract alteration will result in automated rejection during peer review and CI integration.

---

## 1. Identity & Session Conventions

### 1.1 Agent Identity vs. Session Identity
- **Platform Identity:** The vendor or runtime executing the code (e.g. `codex`, `claude-code`, `cursor`, `windsurf`, `gemini-cli`, `copilot`, `antigravity`).
- **Session Identity (`session_id`):** A unique, deterministic string generated at startup representing this specific execution instance.
  
Format:
```
{platform_short}-{YYYYMMDD}-{HHMMSS}
```
Platform Prefix Map:
- `cx` = OpenAI Codex CLI / Desktop
- `cc` = Claude Code (Anthropic)
- `cr` = Cursor IDE Agent
- `ws` = Windsurf / Cascade (Codeium)
- `gm` = Google Gemini CLI / Jules
- `cp` = GitHub Copilot Coding Agent
- `ag` = Google Antigravity Agent
- `xx` = Generic / Custom Coding Agent

*Example:* `cc-20261123-143022`

---

## 2. Workspace Isolation: Git Worktrees

To prevent filesystem conflicts, `index.lock` collisions, and partial file reads between concurrent agents:
1. Every session **must** create its own isolated Git worktree:
   ```bash
   git fetch origin main
   git worktree add -b agent/{session_id} ../wt-{session_id} origin/main
   ```
2. The agent executes all commands, edits, and test runs strictly inside its dedicated worktree directory (`../wt-{session_id}`).
3. The main working directory and `main` branch are strictly read-only trunks merged only via Pull Requests.

---

## 3. Task Claiming & Lease Protocol

### 3.1 Eligibility Check
Before claiming a task from `.specs/coordination/task_board.md`, the agent must verify:
- Task status is `todo`.
- All prerequisite tasks listed under `Depends on` are marked `done` on `main`.
- The task's `Required Capabilities` match the agent's declared skills.
- The task's `Scope boundary: INCLUDED` does not intersect with any actively running task's included files.

### 3.2 Atomic Push Claim
To guarantee distributed, race-condition-free claiming without requiring a centralized database:
1. Agent edits `.specs/coordination/task_board.md` setting:
   - `Status: claimed`
   - `Claimed by: {session_id}`
   - `Claimed at: {UTC ISO timestamp}`
   - `Lease expires: {Claimed at + 4 hours}`
2. Agent commits and attempts to push to the coordination tracking branch:
   ```bash
   git commit -m "chore(claim): TASK-NNN by {session_id}"
   git push origin agent/{session_id}
   ```
3. If the push or subsequent PR fails due to a concurrent write collision:
   - Run `git pull --rebase`.
   - If another agent has claimed the target task, abort your claim immediately, revert your local board change, and pick another unblocked task.

### 3.3 Lease Durations & Heartbeats
- **Default Lease:** 4 hours from the claim timestamp.
- **Heartbeat Requirement:** Agents working on long tasks should publish a `SESSION_HEARTBEAT` message every 30–60 minutes in their message stream.
- **Stale Claim Reclaim:** If a task remains `claimed` or `in-progress` for > 4 hours with no active heartbeat or PR activity, any newly joined agent may reclaim the task by logging a `TASK_RECLAIMED` notice and resetting the lease.

---

## 4. Scope Boundary Enforcement

Every task defines strict scope boundaries:
- **`Scope boundary: INCLUDED`:** The exact files and directories the agent is authorized to create or edit.
- **`Scope boundary: EXCLUDED`:** Files the agent must NEVER modify directly (e.g. shared configs, database schemas, API contracts, specification files).

> **Enforcement Rule:** A Pull Request that modifies files outside the task's `INCLUDED` boundary will fail independent peer review and will be rejected with `REVISION_REQUIRED`.

---

## 5. Contract Change Protocol

If an agent discovers that implementing its assigned task requires changing an approved shared contract (e.g. `api_contracts.md`, `database_schema.md`, `data_model.md`):
1. **Never edit the contract silently.**
2. Post a `CONTRACT_CHANGE_PROPOSED` message in your session message stream detailing:
   - The exact proposed change.
   - The architectural justification.
   - Which other tasks/agents are impacted.
3. Pause implementation of the affected interface until a human or designated architecture agent approves the change and updates the authoritative spec.

---

## 6. Communication & Logging Standards

- Agents communicate exclusively through append-only markdown streams in `.specs/coordination/messages/`.
- Every agent writes **only** to `.specs/coordination/messages/{session_id}.messages.md`.
- No agent ever edits or overwrites another agent's message file.
- All messages follow the schemas specified in `.specs/agents/communication.md`.
