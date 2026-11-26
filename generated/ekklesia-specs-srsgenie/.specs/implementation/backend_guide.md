---
tier: 4
role: backend-guide
depends-on: architecture/system_design.md
updated: 2026-11-24
---

# Backend Engineering & Implementation Guide: Ekklesia

## 1. Modular Directory Layout

```
server/
├── src/
│   ├── modules/
│   │   ├── auth/              # Auth controller, Argon2id service, JWT tokens
│   │   ├── tenants/           # Tenant provisioning, RLS context middleware
│   │   ├── resources/         # Core domain controllers, services, repositories
│   │   ├── billing/           # Cashfree webhook handlers, subscription plans
│   │   └── mcp/               # Model Context Protocol RPC handlers
│   ├── shared/
│   │   ├── database/          # Connection pooling, migration runner
│   │   ├── middleware/        # Rate limiting, auth guard, error handler
│   │   └── utils/             # Crypto helpers, validation schemas
│   └── app.ts                 # Express / Fastify server bootstrap
└── tests/
    ├── unit/                  # Vitest service unit tests
    └── integration/           # Supertest API endpoint tests
```

---

## 2. Service & Repository Pattern Example

```typescript
// src/modules/resources/resource.service.ts
export class ResourceService {
  constructor(private repo: ResourceRepository) {}

  async createResource(tenantId: string, userId: string, dto: CreateResourceDto) {
    // 1. Enforce business rules
    if (!dto.title || dto.title.length < 3) {
      throw new ValidationError('Resource title must be at least 3 characters.');
    }

    // 2. Persist with tenant context
    const resource = await this.repo.create({
      tenantId,
      createdBy: userId,
      title: dto.title,
      status: 'draft',
      version: 1
    });

    return resource;
  }
}
```
