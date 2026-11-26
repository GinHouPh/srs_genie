---
tier: 1
role: business-invariants
depends-on: foundation/brief.md
updated: 2026-11-24
---

# Domain Invariants & Business Rules: Ekklesia

> **AI Directive:** These rules are non-negotiable system invariants. Code generation that violates
> any domain rule must be flagged and rejected by automated test assertions.

---

## Invariant Catalog

### DR-001: Zero-Tolerance Multi-Tenant Partitioning
Every database query, insert, update, and delete MUST include an explicit `tenant_id` condition.
Cross-tenant data exposure is categorized as a P0 security incident. Database Row-Level Security (RLS) policies serve as defense-in-depth behind application middleware.

### DR-002: Idempotent Payment & Mutation Operations
All payment charges, subscription changes, and mutating API calls must accept an `Idempotency-Key` HTTP header.
If a duplicate request is received within 24 hours with an identical key, the server must return the cached original response without re-executing business logic.

### DR-003: Immutability of Security & Financial Audit Logs
Audit log entries (`audit_logs`) and completed invoice records are append-only.
No user role, including platform Super Admin, possesses permission to execute `UPDATE` or `DELETE` statements on audit tables.

### DR-004: Quota & Entitlement Hard Gates
When a tenant consumes 100% of their allocated monthly specification or resource quota, subsequent requests must return `HTTP 402 Payment Required` with upgrade links rather than failing silently or causing unexpected charges.

### DR-005: State Machine Transition Integrity
Domain entities must strictly follow defined state machines (e.g. `draft` -> `active` -> `completed` -> `archived`).
Direct jumps across unauthorized states (e.g. `draft` directly to `completed`) must trigger domain validation exceptions.

### DR-006: Soft Deletion & GDPR Scrubbing
Operational entities are marked soft-deleted via `deleted_at TIMESTAMPTZ` to preserve relational integrity.
GDPR "Right to be Forgotten" requests anonymize personal identifiers (`email`, `name`, `phone`) while retaining financial records for legal tax obligations.

### DR-007: Concurrency & Optimistic Lock Verification
Mutating updates on shared resources require an incrementing `version` integer.
If an update query detects that the current database version does not match the client's submitted version, the transaction aborts with `HTTP 409 Conflict`.


---

## Frontier Model Domain Invariants

## 11. Business Rules

