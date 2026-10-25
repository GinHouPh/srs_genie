---
tier: 1
role: user-requirements
depends-on: foundation/brief.md · foundation/glossary.md
feeds-into: domain/domain_rules.md · contracts/api_contracts.md · contracts/ui_contracts.md · execution/tasks.md · implementation/testing_strategy.md
owner: AI-generated · human-reviewed
updated: YYYY-MM-DD
---

# User stories

> AI instruction: Every story here must trace to a user role defined in `brief.md`.
> Do not invent roles or stories not implied by the brief. Each story must have
> acceptance criteria — these become the basis for test cases in `testing_strategy.md`.

---

## Story format

```
US-[NNN]: [Title]
As a [role from glossary],
I want to [action],
So that [outcome].

Acceptance criteria:
- [ ] [Specific, testable condition]
- [ ] [Specific, testable condition]

Priority: [P0 must-have / P1 should-have / P2 nice-to-have]
Depends on: [US-NNN or —]
```

---

## Epic: [Epic name — group stories by major feature area]

### US-001: [Story title]
As a [role],
I want to [action],
So that [outcome].

**Acceptance criteria:**
- [ ] [Condition]
- [ ] [Condition]
- [ ] [Condition]

**Priority:** P0
**Depends on:** —

---

### US-002: [Story title]
As a [role],
I want to [action],
So that [outcome].

**Acceptance criteria:**
- [ ] [Condition]
- [ ] [Condition]

**Priority:** P0
**Depends on:** US-001

---

## Epic: [Next epic]

### US-003: [Story title]
As a [role],
I want to [action],
So that [outcome].

**Acceptance criteria:**
- [ ] [Condition]

**Priority:** P1
**Depends on:** US-001

---

## Story index

| ID | Title | Role | Priority | Status |
|----|-------|------|----------|--------|
| US-001 | [Title] | [Role] | P0 | todo |
| US-002 | [Title] | [Role] | P0 | todo |
| US-003 | [Title] | [Role] | P1 | todo |
