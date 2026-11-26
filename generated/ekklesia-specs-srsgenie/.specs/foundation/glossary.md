---
tier: 0
role: canonical-vocabulary
owner: human
triggers-regen: consistency check across all specs
updated: 2026-11-24
---

# Domain Glossary & Vocabulary Standard: Ekklesia

> **AI Directive:** Use only the canonical terms defined below in code, schemas, and specifications.
> Synonyms or informal terms must be mapped to their canonical equivalents to prevent terminology drift.

---

## Industry & Domain Terminology (Other)

| Canonical Term | Definition | Technical Context & Invariant Rules |
|:---|:---|:---|
| **Tenant Partition** | Strict logical boundary isolating an organization's datasets, encryption keys, and configurations. | Enforced via Row-Level Security (RLS) and query middleware. |
| **Sliding Session Token** | Short-lived JWT (15 mins) that automatically renews during active user interaction. | Backed by rotating refresh tokens stored in secure HttpOnly SameSite=Strict cookies. |
| **Idempotency Key** | Client-generated UUID transmitted in HTTP headers to prevent duplicate executions on network retry. | Stored in Redis cache with 24-hour expiration. |
| **Model Context Protocol (MCP)** | Standardized RPC protocol exposing specification tools to autonomous AI coding agents. | Directly consumed by Cursor, Windsurf, and Claude Code. |

---

## Architectural & System Acronyms

| Acronym | Canonical Expansion | Engineering Context |
|:---|:---|:---|
| **RBAC** | Role-Based Access Control | Permission matrix mapping roles (Viewer, Member, Admin, Super Admin) to resources |
| **RLS** | Row-Level Security | PostgreSQL database-level isolation filtering queries by current `tenant_id` |
| **JWT** | JSON Web Token | Stateless sliding bearer tokens signed with asymmetric keys (RS256) |
| **MCP** | Model Context Protocol | Standardized RPC protocol allowing AI agents to query specifications and code context |
| **ADR** | Architecture Decision Record | Immutable record documenting significant technical choices and consequences |
| **P95 / P99** | 95th / 99th Percentile | Latency thresholds ensuring the majority of requests meet performance SLAs |
| **ACID** | Atomicity, Consistency, Isolation, Durability | Database transaction guarantees preventing partial data corruption |
