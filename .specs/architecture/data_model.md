---
tier: 2
role: canonical-data-model
depends-on: architecture/system_design.md · domain/domain_rules.md · foundation/glossary.md
feeds-into: contracts/database_schema.md · contracts/api_contracts.md · contracts/ui_contracts.md
owner: AI-generated · human-approved
sync-rule: If this file changes, regenerate database_schema.md AND api_contracts.md AND ui_contracts.md
updated: YYYY-MM-DD
---

# Data model

> AI instruction: This is the single source of truth for all data structures.
> Do not define fields in api_contracts.md or database_schema.md that do not exist here.
> Do not define entities here without a corresponding entry in glossary.md.
> This model is tech-agnostic — it is not SQL, not JSON, not Prisma. It is the
> canonical truth from which all formats are derived.

---

## Entity format

```
## [EntityName]
Description: [What this entity represents in domain terms]
Glossary ref: [term in glossary.md]

| Field | Type | Required | Unique | Default | Notes |
|-------|------|----------|--------|---------|-------|
| id | uuid | yes | yes | auto | Primary key |
| [field] | [type] | yes/no | yes/no | [value or —] | [constraint or note] |

Relationships:
- has-many [OtherEntity] via [field]
- belongs-to [OtherEntity] via [field]
- has-one [OtherEntity] via [field]

Indexes:
- [field] — reason: [why this needs an index]
- [field1, field2] compound — reason: [why]
```

---

## Entities

## [EntityName]
**Description:** [Domain description using glossary terms]
**Glossary ref:** glossary.md → [Term]

| Field | Type | Required | Unique | Default | Notes |
|-------|------|----------|--------|---------|-------|
| id | uuid | yes | yes | auto | PK |
| created_at | timestamp | yes | no | now() | Set on insert, never updated |
| updated_at | timestamp | yes | no | now() | Auto-updated on any change |
| [field_name] | string(255) | yes | no | — | [constraint] |
| [field_name] | enum | yes | no | [value] | Values: see glossary.md status values |
| [field_name] | integer | no | no | 0 | Must be ≥ 0 per DR-00X |
| [fk_field_id] | uuid | yes | no | — | FK → [OtherEntity].id |

**Relationships:**
- has-many `[OtherEntity]` via `[OtherEntity].[this_entity_id]`
- belongs-to `[OtherEntity]` via `[fk_field_id]`

**Indexes:**
- `[field]` — supports lookup by [use case]
- `[fk_field_id]` — FK join performance

---

## Entity relationship summary

```
[EntityA] 1 ──< [EntityB]     (one-to-many)
[EntityB] 1 ──< [EntityC]     (one-to-many)
[EntityA] >──< [EntityD]      (many-to-many via [junction_table])
[EntityE] 1 ── 1 [EntityF]    (one-to-one)
```

---

## Soft delete strategy

> Define once — AI applies this pattern consistently across all entities.

**Approach:** [e.g. `deleted_at` timestamp nullable / hard delete / status flag]
**Applies to:** [list entities that use soft delete]
**Query rule:** All queries must filter `WHERE deleted_at IS NULL` unless fetching history.

---

## Field type reference

| Spec type | PostgreSQL | MySQL | SQLite | Notes |
|-----------|-----------|-------|--------|-------|
| uuid | uuid | char(36) | text | Use DB-native generation |
| timestamp | timestamptz | datetime | text (ISO8601) | Always UTC |
| string(n) | varchar(n) | varchar(n) | text | |
| text | text | text | text | Unbounded — use sparingly |
| money | numeric(12,2) | decimal(12,2) | real | Never float for currency |
| enum | varchar + CHECK | enum | text + CHECK | Define allowed values in glossary.md |
