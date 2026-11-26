# AGENTS.md — Autonomous Agent Directives & Universal Manifest: Ekklesia

> **Mandatory Reading for All AI Agents:**  
> This repository operates under a cross-platform, multi-agent engineering specification system.
> Before taking any action, inspecting code, or making edits, you MUST read and follow the master navigation index at `.specs/_index.md` and the coordination protocol at `.specs/coordination/protocol.md`.

---

## 1. Core Operating Principles
1. **Never Infer Unstated Requirements:** Authoritative truth flows strictly from `.specs/foundation/brief.md` and downstream tier specifications.
2. **Never Write Without a Confirmed Lease:** You must claim an unblocked task on `.specs/coordination/task_board.md` and announce it in your session stream before modifying any file.
3. **Respect File Scope Boundaries:** Only touch files explicitly declared under your task's `Scope boundary: INCLUDED` list. Modifying files outside your boundary is a critical protocol violation.
4. **Isolate Concurrent Work:** Always work inside an independent Git worktree (`agent/{session_id}`). Never edit directly on the shared `main` trunk.
5. **Evidence-Based Completion:** Never mark a task `done` without providing reproducible test commands, test logs, and acceptance verification in your completion report.

---

## 2. Fast Bootstrap Commands
- **Install Dependencies:** `npm install` (Use clean install: `npm ci --prefer-offline`)
- **Lint & Static Typecheck:** `npm run lint` && `npx tsc --noEmit`
- **Unit & Integration Tests:** `npm test`
- **Build Production Bundle:** `npm run build`
- **Local Sandbox Server:** `npm run dev`

---

## 3. Specification Navigation Index
- **Master Index & Cascade Rules:** `.specs/_index.md`
- **Agent Onboarding Guide:** `.specs/agents/onboarding.md`
- **Multi-Agent Coordination Protocol:** `.specs/coordination/protocol.md`
- **Active Task Board:** `.specs/coordination/task_board.md`
- **Agent Session Registry:** `.specs/coordination/agent_registry.md`
- **Current System State:** `.specs/state/current_state.md`
- **Architectural Decision Records (ADRs):** `.specs/state/decisions_log.md`
