---
tier: 0
role: canonical-vocabulary
owner: human + AI (append-only)
scope: all files must use these exact terms — no synonyms
updated: YYYY-MM-DD
---

# Glossary

> AI instruction: Read this before writing any spec or code. Every term used across all
> files must match the definitions here exactly. If a new domain term appears during
> generation, add it here before continuing. Never use synonyms for defined terms.

---

## How to add a term

1. Place it alphabetically
2. Write a single precise definition (one sentence)
3. Note if it maps to a specific data entity, API resource, or UI concept
4. Add the date it was introduced

---

## Terms

### [Term A]
**Definition:** [One-sentence definition. Precise. No vagueness.]
**Maps to:** [Entity / API resource / UI component — whichever applies]
**Added:** YYYY-MM-DD

---

### [Term B]
**Definition:**
**Maps to:**
**Added:**

---

## Forbidden synonyms

> These pairs are common sources of drift. Use only the left-hand term everywhere.

| Use this | Never use this |
|----------|---------------|
| [Canonical term] | [Synonym to avoid] |
| [Canonical term] | [Synonym to avoid] |

---

## Status values

> Standardized status strings used across entities and APIs.

| Entity | Allowed statuses |
|--------|-----------------|
| [Entity name] | `pending` · `active` · `cancelled` · `completed` |
| [Entity name] | `draft` · `published` · `archived` |
