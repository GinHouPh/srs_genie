---
tier: 2
role: architecture-blueprint
depends-on: foundation/brief.md · domain/user_stories.md · domain/domain_rules.md
feeds-into: architecture/data_model.md · architecture/security_model.md · implementation/backend_guide.md · implementation/infrastructure.md
owner: AI-generated · human-approved
updated: YYYY-MM-DD
---

# System design

> AI instruction: This file defines the system's shape. Do not introduce components,
> patterns, or integrations not described here without first appending an ADR to
> `state/decisions_log.md`. This is the architectural contract.

---

## Architecture style

**Pattern:** [e.g. Monolith / Modular monolith / Microservices]
**Communication:** [e.g. REST / GraphQL / gRPC / event-driven]
**Rendering:** [e.g. SPA / SSR / SSG / native mobile]

**Rationale:** [1–2 sentences. Why this style for this project size and team?]

---

## Component map

```
[Client layer]
  └── [Web app / Mobile app]
          │ HTTPS
[API layer]
  └── [API Server]  ← handles auth, routing, validation
          │
[Service layer]
  ├── [Service A]   ← responsible for: [domain area]
  ├── [Service B]   ← responsible for: [domain area]
  └── [Service C]   ← responsible for: [domain area]
          │
[Data layer]
  ├── [Primary DB]  ← [what it stores]
  ├── [Cache]       ← [what it caches and TTL strategy]
  └── [File store]  ← [what files and why external]
          │
[External services]
  ├── [Auth provider]
  ├── [Email service]
  └── [Payment gateway]
```

---

## Component responsibilities

### [Component name]
- **Owns:** [what data/logic this component exclusively controls]
- **Does not own:** [explicit exclusions to prevent boundary confusion]
- **Communicates with:** [other components and how]
- **Scales by:** [horizontal / vertical / stateless]

---

## Key patterns

| Pattern | Applied to | Reason |
|---------|-----------|--------|
| [e.g. Repository pattern] | [Data access layer] | [Reason] |
| [e.g. CQRS] | [Read-heavy endpoints] | [Reason] |
| [e.g. Optimistic UI] | [Frontend mutations] | [Reason] |
| [e.g. Queue + worker] | [Async jobs] | [Reason] |

---

## Data flow: core action

> Walk through the most important user action end to end.

```
1. User submits [action] in [client]
2. Client sends [HTTP method] to [endpoint]
3. API layer validates auth (see security_model.md)
4. [Service A] validates against domain_rules.md DR-00X
5. [Service A] writes to [table] via repository
6. [Optional: event emitted → worker picks up → async action]
7. Response returned: [shape]
8. Client updates UI state
```

---

## Async jobs

| Job | Trigger | Worker | Retry strategy |
|-----|---------|--------|---------------|
| [Job name] | [Event / cron] | [Worker name] | [e.g. 3x with exponential backoff] |

---

## External service contracts

| Service | Used for | Failure behavior |
|---------|---------|-----------------|
| [Service name] | [Purpose] | [e.g. Fail open — log and continue / Fail closed — block action] |
