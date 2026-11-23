---
role: architecture-decision-records
format: append-only — never edit past entries
read: scan at session start · read fully before making architectural decisions
owner: AI appends · human reviews
---

# Architecture Decisions Log (ADR)

> AI instruction: Before making any architectural decision, scan this log.
> If a relevant past decision exists, follow it — do not relitigate it.
> If you make a new decision during a session, append it here immediately.
> Every ADR must declare session/agent attribution (`Decided by` and `Proposed in`).
> Never edit or delete past entries. Mark superseded decisions as [SUPERSEDED by ADR-NNN].

---

## ADR Format

```markdown
## ADR-NNN: [Decision title]
Date: YYYY-MM-DD
Status: accepted | superseded by ADR-NNN | deprecated
Decided by: [Human | Session ID]
Proposed in: [MSG-NNN / session_id / issue]
Reviewers: [List of reviewing agents or human]
Context: [What situation forced this decision? 2–3 sentences.]
Options considered:
  A. [Option] — [tradeoff]
  B. [Option] — [tradeoff]
  C. [Option] — [tradeoff]
Decision: [Which option, and the one-sentence reason.]
Consequences: [What does this decision make easier? What does it make harder?]
Affects: [Which spec files reflect this decision]
```

---

## ADR-001: Modular Monolith over Microservices for v1
**Date:** YYYY-MM-DD  
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
**Date:** 2026-11-23  
**Status:** accepted  
**Decided by:** Antigravity Architect (Approved by Human)  
**Proposed in:** Specification Reengineering Master Initiative  
**Reviewers:** Human Project Owner  

**Context:** The project requires coordination among multiple independent AI coding platforms (Codex, Claude Code, Cursor, Windsurf, Copilot, Gemini CLI) without relying on a proprietary central AI orchestrator.

**Options considered:**
- A. Pure shared markdown files — zero isolation, high write collisions and merge conflicts.
- B. Central custom orchestration server — high operational complexity and non-baseline requirement.
- C. Hybrid Specification + Git Worktrees + Append-Only Message Streams — repository-native, zero custom infrastructure, strict filesystem isolation via Git worktrees, atomic claiming, and independent peer review.

**Decision:** Option C (Hybrid Specification + Git Worktrees + Append-Only Message Streams). Leverages the `AGENTS.md` open standard as universal entry point, Git worktrees for filesystem safety, and lock-free append-only message logs for communication.

**Consequences:** Enables vendor-neutral parallel development. Requires agents to follow the 6-phase lifecycle, respect scope boundaries, and provide reproducible test evidence before marking tasks complete.

**Affects:** `AGENTS.md` · `.specs/_index.md` · `.specs/coordination/**` · `.specs/agents/**` · `.specs/execution/tasks.md` · `.specs/state/current_state.md`

---

<!-- Append new ADRs below this line. Increment the number. -->
