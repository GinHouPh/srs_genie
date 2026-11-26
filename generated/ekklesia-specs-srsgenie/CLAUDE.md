# Claude Code Guidelines: Ekklesia

## System Overview
- **Project Name:** Ekklesia
- **Architecture Standard:** SRS Genie™ System 2 Multi-Agent Architecture (`AGENTS.md` + `.specs/`)
- **Coordination Protocol:** `.specs/coordination/protocol.md` & `.specs/coordination/task_board.md`
- **Strategic Blueprints:** `strategic_plans/` (PRD, Architecture SAD, Tech Spec TSD, Project Plan)

## Core Commands
- Build: `npm run build`
- Dev Server: `npm run dev`
- Tests: `npm test`
- Typecheck: `npx tsc --noEmit`

## Autonomous Agent Invariants
- **Universal Manifest:** Always follow directives in `AGENTS.md` and runbooks in `.specs/agents/`.
- **Worktree Isolation:** Always work in an isolated git worktree (`agent/{session_id}`). Never edit directly on `main`.
- **Contracts First:** Never invent schemas, DB columns, or API routes outside of `.specs/contracts/`.
- **Domain Rules:** Always verify logic against business invariants in `.specs/domain/domain_rules.md`.
- **Security:** Follow `.specs/architecture/security_model.md`. All endpoints must enforce tenant isolation and input sanitization.
- **Task Leases:** Claim tasks on `.specs/coordination/task_board.md`. Respect 4-hour lease boundaries.
- **Evidence-Based Completion:** Provide reproducible test logs and verification evidence before completing tasks.
