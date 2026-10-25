---
tier: 1
role: business-invariants
depends-on: foundation/brief.md · foundation/glossary.md · domain/user_stories.md
feeds-into: architecture/system_design.md · contracts/api_contracts.md · implementation/backend_guide.md · implementation/testing_strategy.md
owner: AI-generated · human-reviewed (mandatory before coding)
updated: YYYY-MM-DD
---

# Domain rules

> AI instruction: These rules must NEVER be violated by generated code. Before writing
> any business logic, check this file. Each rule has a severity — HARD rules cause a
> generation halt if violated; SOFT rules emit a warning comment in generated code.
> Do not derive rules not supported by `brief.md` or `user_stories.md`.

---

## Rule format

```
DR-[NNN]: [Rule name]
Severity: HARD | SOFT
Rule: [One-sentence statement of the invariant. Use exact glossary terms.]
Rationale: [Why this rule exists — business reason, not technical reason.]
Enforced at: [API layer / DB constraint / service layer / all]
Test: [US-NNN or specific scenario that validates this rule]
```

---

## Entity rules

### DR-001: [Rule name]
**Severity:** HARD
**Rule:** [A [entity] cannot [action] if [condition].]
**Rationale:** [Business reason.]
**Enforced at:** Service layer + DB constraint
**Test:** US-00X

---

### DR-002: [Rule name]
**Severity:** HARD
**Rule:**
**Rationale:**
**Enforced at:**
**Test:**

---

## State transition rules

> Define valid state transitions for each entity that has a status field.

### [Entity name] state machine

```
[state A] → [state B]   allowed when: [condition]
[state A] → [state C]   allowed when: [condition]
[state B] → [state D]   allowed when: [condition]
[state B] → [state A]   FORBIDDEN — no rollback once submitted
```

---

## Calculation rules

> Business formulas and derived values. Define them once here — never inline in code.

### CR-001: [Calculation name]
**Formula:** `[result] = [expression using glossary terms]`
**Rounding:** [e.g. Round down to 2 decimal places]
**Edge cases:** [e.g. If base is 0, result is 0 — never divide]

---

## Cross-entity rules

> Rules involving more than one entity.

### DR-0XX: [Rule name]
**Severity:** HARD
**Rule:** A [Entity A] may only [action] if the associated [Entity B] is in state [state].
**Enforced at:** Service layer
**Test:** US-00X
