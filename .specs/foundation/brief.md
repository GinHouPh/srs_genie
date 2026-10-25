---
tier: 0
role: source-of-truth
owner: human
triggers-regen: all tiers below
updated: YYYY-MM-DD
---

# Product brief

> AI instruction: This is the root source of truth. Do not infer requirements not stated
> here. If something is ambiguous, record the question in `state/current_state.md` and
> ask the human before proceeding. Every downstream spec derives from this file.

---

## What it is

<!-- 2–4 sentences. What does this product do? What is the core user action? -->

**Product name:** [Name]

**Description:**
[Describe the product clearly. Avoid marketing language. What does a user actually do with it?]

---

## Who uses it

<!-- List each user role and what they fundamentally need. Keep it short. -->

| Role | Core need |
|------|-----------|
| [Role 1] | [What they need to accomplish] |
| [Role 2] | [What they need to accomplish] |

---

## The problem it solves

<!-- One paragraph. What is painful or missing without this product? -->

---

## Non-negotiable constraints

<!-- Hard rules the AI must never violate or work around. -->

- [ ] [e.g. Must work offline]
- [ ] [e.g. All data must stay in the Philippines (data residency)]
- [ ] [e.g. Must support Android 8+]
- [ ] [e.g. Must be operable by non-technical staff]

---

## Tech stack (fixed decisions)

<!-- Only list what is already decided. Leave blank if not yet decided — do not guess. -->

| Layer | Choice | Reason |
|-------|--------|--------|
| Backend language | | |
| Backend framework | | |
| Database | | |
| Frontend framework | | |
| Auth provider | | |
| Hosting | | |
| CI/CD | | |

---

## Out of scope (v1)

<!-- Explicit list of what is NOT being built in v1. Prevents scope creep. -->

- [Feature not being built]
- [Integration not being built]

---

## Success criteria

<!-- How do we know v1 is done? Measurable outcomes. -->

- [ ] [e.g. A user can register, log in, and complete the core action without assistance]
- [ ] [e.g. System handles 100 concurrent users without degradation]
