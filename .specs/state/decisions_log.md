---
role: architecture-decision-records
format: append-only — never edit past entries
read: scan at session start · read fully before making architectural decisions
owner: AI appends · human reviews
---

# Decisions log

> AI instruction: Before making any architectural decision, scan this log.
> If a relevant past decision exists, follow it — do not relitigate it.
> If you make a new decision during a session, append it here immediately.
> Never edit or delete past entries. Mark superseded decisions as [SUPERSEDED by ADR-NNN].

---

## ADR format

```
## ADR-NNN: [Decision title]
Date: YYYY-MM-DD
Status: accepted | superseded by ADR-NNN | deprecated
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

## ADR-001: [Example — Monolith over microservices for v1]
**Date:** YYYY-MM-DD
**Status:** accepted

**Context:** Team is small (1–3 engineers). Splitting into services would add deployment and network complexity before we understand the domain boundaries.

**Options considered:**
- A. Microservices — independent deploy, but high ops overhead
- B. Modular monolith — single deploy, module boundaries enforced by folder structure
- C. Fully flat monolith — simple, but hard to split later

**Decision:** Option B (modular monolith). Clean module boundaries now make a future split tractable. Avoid premature distribution.

**Consequences:** Simpler CI/CD and local dev. Must enforce module boundaries strictly — no cross-module imports except through defined interfaces.

**Affects:** `architecture/system_design.md` · `implementation/backend_guide.md`

---

<!-- Append new ADRs below this line. Increment the number. -->
