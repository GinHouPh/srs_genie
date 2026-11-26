---
tier: state
role: decisions-log
read: scan at session start · read fully before making architectural decisions
owner: AI appends · human reviews
updated: 2026-11-24
---

# Architecture Decisions Log (ADR): Ekklesia

> AI instruction: Before making any architectural decision, scan this log.
> If a relevant past decision exists, follow it — do not relitigate it.
> If you make a new decision during a session, append it here immediately.
> Every ADR must declare session/agent attribution (`Decided by` and `Proposed in`).
> Never edit or delete past entries. Mark superseded decisions as [SUPERSEDED by ADR-NNN].

---

## ADR-001: Modular Monolith over Microservices for v1
**Date:** 2026-11-24  
**Status:** accepted  
**Decided by:** Human Architect  
**Proposed in:** Project Scaffolding  
**Reviewers:** Human Team  

**Context:** Team is small (1–3 engineers or parallel AI sessions). Splitting into distributed microservices would add deployment, network, and operational complexity before domain boundaries stabilize.

**Options considered:**
- A. Microservices — independent deployment, but high operational overhead and network latency.
- B. Modular monolith — single deployable artifact, strict module boundaries enforced by directory layout.
- C. Fully flat monolith — simple to start, but difficult to refactor or untangle later.

**Decision:** Option B (Modular Monolith). Clean module boundaries enforced via folder structure (`src/modules/[resource]`) make future service splits tractable while keeping CI/CD, local testing, and Docker setup simple.

**Consequences:** Simplifies CI/CD and local development. Agents must strictly enforce module boundaries — no cross-module imports except through defined public interfaces and shared types.

**Affects:** `architecture/system_design.md` · `implementation/backend_guide.md`

---

## ADR-002: Cross-Platform Multi-Agent Collaboration Protocol (System 2 Architecture)
**Date:** 2026-11-24  
**Status:** accepted  
**Decided by:** Antigravity Architect  
**Proposed in:** Specification Reengineering Master Initiative  
**Reviewers:** Lead Project Architect  

**Context:** The project requires coordination among multiple independent AI coding platforms (Codex, Claude Code, Cursor, Windsurf, Copilot, Gemini CLI) without relying on a proprietary central AI orchestrator.

**Options considered:**
- A. Pure shared markdown files — zero isolation, high write collisions and merge conflicts.
- B. Central custom orchestration server — high operational complexity and non-baseline requirement.
- C. Hybrid Specification + Git Worktrees + Append-Only Message Streams — repository-native, zero custom infrastructure, strict filesystem isolation via Git worktrees, atomic claiming, and independent peer review.

**Decision:** Option C (Hybrid Specification + Git Worktrees + Append-Only Message Streams). Leverages the `AGENTS.md` open standard as universal entry point, Git worktrees for filesystem safety, and lock-free append-only message logs for communication.

**Consequences:** Enables vendor-neutral parallel development. Requires agents to follow the 6-phase lifecycle, respect scope boundaries, and provide reproducible test evidence before marking tasks complete.

**Affects:** `AGENTS.md` · `.specs/_index.md` · `.specs/coordination/**` · `.specs/agents/**` · `.specs/execution/tasks.md` · `.specs/state/current_state.md`

---

## ADR-003: Multi-Tenant Row-Level Security
**Date:** 2026-11-24  
**Status:** accepted  
**Decided by:** Lead Security Architect  
**Proposed in:** Database Security Baseline  
**Reviewers:** Backend Engineering Team  

**Context:** Ensuring zero-bleed data isolation in multi-tenant environments.
**Decision:** Implement PostgreSQL Row-Level Security (RLS) linked to session `tenant_id`.
**Consequences:** Database enforces tenant separation even if application queries omit where clauses.
**Affects:** `architecture/security_model.md` · `contracts/database_schema.md`

---

## ADR-004: Stateless Authentication with Refresh Token Rotation
**Date:** 2026-11-24  
**Status:** accepted  
**Decided by:** Backend Engineering Lead  
**Proposed in:** Authentication Design Review  
**Reviewers:** Security Review Board  

**Context:** Balancing security and horizontal scalability.
**Decision:** Use short-lived JWTs (15 mins) with rotating refresh tokens stored in HttpOnly cookies.
**Consequences:** Eliminates central session bottleneck while enabling immediate session revocation.
**Affects:** `architecture/security_model.md` · `contracts/api_contracts.md`

---

## ADR-005: Model Context Protocol (MCP) Live Agent Gateway
**Date:** 2026-11-24  
**Status:** accepted  
**Decided by:** Principal AI Systems Engineer  
**Proposed in:** Agent Tooling Initiative  
**Reviewers:** Developer Experience Team  

**Context:** Allowing Cursor, Windsurf, and Claude Code to autonomously query live specs.
**Decision:** Expose a standardized MCP server endpoint delivering file contents and task checklists.
**Consequences:** Autonomous agents can code continuously with live context sync.
**Affects:** `public/api/mcp.php` · `mcp/**`
