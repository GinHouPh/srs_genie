---
tier: 4
role: backend-implementation-guide
depends-on: architecture/system_design.md · contracts/api_contracts.md · contracts/database_schema.md · architecture/security_model.md · domain/domain_rules.md
feeds-into: execution/tasks.md · implementation/testing_strategy.md
owner: AI-generated · human-approved
updated: YYYY-MM-DD
---

# Backend guide

> AI instruction: Generate all backend code to match the patterns in this file.
> Do not introduce a new pattern without appending an ADR to `state/decisions_log.md`
> first. If this guide conflicts with a contract file (api_contracts.md,
> database_schema.md), the contract file wins.

---

## Folder structure

```
src/
├── config/           # env vars, DB connection, external clients
├── middleware/        # auth, rate limiting, error handling, logging
├── modules/
│   └── [resource]/
│       ├── [resource].router.ts      # route definitions only — no logic
│       ├── [resource].controller.ts  # parse request, call service, return response
│       ├── [resource].service.ts     # business logic, domain rule enforcement
│       ├── [resource].repository.ts  # DB queries only — no business logic
│       ├── [resource].schema.ts      # validation schemas (Zod / Joi)
│       └── [resource].test.ts        # unit tests for service + integration for routes
├── shared/
│   ├── errors.ts      # standard error classes
│   ├── response.ts    # response envelope helpers
│   └── types.ts       # shared TypeScript types
└── app.ts             # app factory (no side effects — testable)
```

---

## Layer responsibilities

| Layer | What it does | What it must NOT do |
|-------|-------------|---------------------|
| Router | Register routes + apply middleware | Contain any logic |
| Controller | Parse req, validate schema, call service, format response | Query DB, enforce domain rules |
| Service | Enforce domain rules, orchestrate repositories | Write raw SQL, format HTTP responses |
| Repository | Execute queries, map rows to domain types | Contain business logic |

---

## Code patterns

### Controller pattern
```typescript
// [resource].controller.ts
export const create[Resource] = async (req: Request, res: Response) => {
  const body = [ResourceCreateSchema].parse(req.body); // throws if invalid
  const result = await [resource]Service.create(body, req.user);
  return res.status(201).json(success(result));
};
```

### Service pattern (with domain rule enforcement)
```typescript
// [resource].service.ts
export const create = async (data: CreateDto, actor: User): Promise<[Resource]> => {
  // 1. Enforce domain rules before any write
  if ([condition violating DR-00X]) {
    throw new DomainRuleError('DR-001', '[message]');
  }
  // 2. Delegate to repository
  return [resource]Repository.insert(data);
};
```

### Repository pattern
```typescript
// [resource].repository.ts
export const insert = async (data: CreateDto): Promise<[Resource]> => {
  const [row] = await db('[table_name]').insert(data).returning('*');
  return row;
};

export const findById = async (id: string): Promise<[Resource] | null> => {
  return db('[table_name]').where({ id, deleted_at: null }).first() ?? null;
};
```

---

## Error handling

### Error classes
```typescript
// shared/errors.ts
export class AppError extends Error {
  constructor(public code: string, message: string, public statusCode: number) {
    super(message);
  }
}
export class ValidationError extends AppError {
  constructor(details: object) { super('VALIDATION_ERROR', 'Invalid input', 400); }
}
export class DomainRuleError extends AppError {
  constructor(rule: string, message: string) { super('DOMAIN_RULE_VIOLATION', message, 422); }
}
export class NotFoundError extends AppError {
  constructor(resource: string) { super('NOT_FOUND', `${resource} not found`, 404); }
}
export class ForbiddenError extends AppError {
  constructor() { super('FORBIDDEN', 'Insufficient permissions', 403); }
}
```

### Global error middleware
```typescript
// All errors caught here — controllers never send error responses directly
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  // Log unexpected errors, return generic 500
  logger.error(err);
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } });
});
```

---

## Auth middleware

```typescript
// Apply to all protected routes — references security_model.md
export const requireAuth = (roles?: string[]) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError();
  const user = await verifyToken(token);
  if (roles && !roles.includes(user.role)) throw new ForbiddenError();
  req.user = user;
  next();
};
```

---

## Logging rules

**Format:** JSON structured logs
**Required fields on every log line:** `{ timestamp, level, request_id, user_id?, action, duration_ms? }`
**Never log:** passwords, tokens, card numbers, PII fields defined in security_model.md
**Levels:** `error` (5xx), `warn` (4xx from domain rules), `info` (successful mutations), `debug` (dev only)

---

## Environment variables

> All env vars must be declared in `infrastructure.md`. Access via `config/` only —
> never `process.env` directly in business code.

```typescript
// config/env.ts — validate at startup, fail fast if missing
import { z } from 'zod';
const env = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']),
}).parse(process.env);
export default env;
```
