---
tier: 3
role: database-schema
depends-on: architecture/data_model.md · architecture/system_design.md
feeds-into: implementation/backend_guide.md · implementation/testing_strategy.md
owner: AI-generated — never edited directly
sync-rule: Regenerate entirely when data_model.md changes. Never patch manually.
db-dialect: [PostgreSQL / MySQL / SQLite — set this]
updated: YYYY-MM-DD
---

# Database schema

> AI instruction: Every table here is derived from an entity in data_model.md.
> Do not add columns not present in data_model.md. Do not create tables not
> in data_model.md. Index decisions are documented — do not add indexes without
> a rationale. This file is the single source for migration generation.

---

## Migration strategy

**Tool:** [e.g. Prisma Migrate / Flyway / Knex / raw SQL files]
**Migration naming:** `YYYYMMDDHHMMSS_[description].sql`
**Rule:** Never edit a migration that has been applied to production. Add a new one.

---

## Schema

### Table: [table_name]
**Derived from entity:** `data_model.md → [EntityName]`

```sql
CREATE TABLE [table_name] (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- [field comment]
  [field_name]  VARCHAR(255)  NOT NULL,
  [field_name]  TEXT,
  [field_name]  NUMERIC(12,2) NOT NULL DEFAULT 0,
  [field_name]  VARCHAR(50)   NOT NULL CHECK ([field_name] IN ('[val1]', '[val2]')),

  -- FK
  [fk_field]    UUID          NOT NULL REFERENCES [other_table](id) ON DELETE [CASCADE/RESTRICT]
);
```

**Indexes:**
```sql
-- [Reason: supports lookup by X]
CREATE INDEX idx_[table]_[field] ON [table_name]([field_name]);

-- [Reason: compound index for Y query pattern]
CREATE INDEX idx_[table]_[field1]_[field2] ON [table_name]([field1], [field2]);
```

**Trigger (updated_at auto-update):**
```sql
CREATE TRIGGER set_[table]_updated_at
  BEFORE UPDATE ON [table_name]
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### Table: [table_name_2]
**Derived from entity:** `data_model.md → [EntityName2]`

```sql
CREATE TABLE [table_name_2] (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- fields here
);
```

---

## Shared setup (run once)

```sql
-- Auto-update trigger function (shared across all tables)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable UUID generation (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## Seed data

> Minimal data required for the application to function at first boot.

```sql
-- [e.g. Default admin user, default categories, etc.]
INSERT INTO [table] ([fields]) VALUES ([values]);
```

---

## Index strategy rationale

| Index | Type | Reason | Query it supports |
|-------|------|--------|------------------|
| `idx_[table]_[field]` | B-tree | [Reason] | `WHERE [field] = ?` |
| `idx_[table]_[f1]_[f2]` | Compound B-tree | [Reason] | `WHERE [f1] = ? AND [f2] = ?` |
