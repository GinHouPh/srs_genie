---
tier: 4
role: testing-strategy
depends-on: domain/user_stories.md · contracts/api_contracts.md · domain/domain_rules.md · architecture/security_model.md
feeds-into: execution/tasks.md
owner: AI-generated
updated: YYYY-MM-DD
---

# Testing strategy

> AI instruction: Every test file generated must follow the patterns here.
> Test coverage is traced to user stories (acceptance tests), domain rules (invariant
> tests), and API contracts (contract tests). Do not write tests that aren't traceable
> to one of these sources. Use the exact mock patterns defined below.

---

## Testing pyramid

| Layer | Type | Tool | Target coverage | What it tests |
|-------|------|------|----------------|---------------|
| Unit | Service logic | [Jest / Vitest] | 80%+ branch coverage | Domain rules, calculations, state transitions |
| Integration | API routes | [Supertest / Hono test] | All endpoints in api_contracts.md | Request→response, auth enforcement, error codes |
| Contract | API shapes | [Zod / schema validation] | 100% of endpoints | Response shape matches api_contracts.md |
| E2E | User flows | [Playwright] | All P0 user stories | Critical paths from US-NNN |

---

## File naming

```
src/modules/[resource]/[resource].service.test.ts   ← unit tests
src/modules/[resource]/[resource].routes.test.ts    ← integration tests
tests/e2e/[story-title].spec.ts                     ← E2E tests (named after user story)
```

---

## Unit test patterns

### Service test (domain rule enforcement)
```typescript
// Test: DR-001 — [rule name]
describe('[Resource]Service.create', () => {
  it('throws DomainRuleError when DR-001 condition is met', async () => {
    const input = { /* data that triggers DR-001 */ };
    await expect([resource]Service.create(input, mockUser))
      .rejects.toThrow(DomainRuleError);
  });

  it('creates successfully when all rules pass', async () => {
    [resource]Repository.insert = jest.fn().mockResolvedValue(mockResource);
    const result = await [resource]Service.create(validInput, mockUser);
    expect(result.id).toBeDefined();
  });
});
```

### What to mock in unit tests
- **Always mock:** repositories, external services, email, file storage
- **Never mock:** the service under test, domain rule logic, calculation functions
- **Mock location:** `__mocks__/` at module level — never inline ad-hoc mocks

---

## Integration test patterns

```typescript
// Test: POST /[resource] — US-NNN
describe('POST /api/v1/[resource]', () => {
  it('returns 201 with created resource', async () => {
    const res = await request(app)
      .post('/api/v1/[resource]')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ /* valid payload matching api_contracts.md */ });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(String) });
  });

  it('returns 401 when no token', async () => {
    const res = await request(app).post('/api/v1/[resource]').send({});
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('returns 403 when insufficient role', async () => {
    const res = await request(app)
      .post('/api/v1/[resource]')
      .set('Authorization', `Bearer ${lowPrivilegeToken}`)
      .send(validPayload);
    expect(res.status).toBe(403);
  });

  it('returns 422 when domain rule DR-00X is violated', async () => {
    const res = await request(app)
      .post('/api/v1/[resource]')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ /* data that triggers DR-00X */ });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('DOMAIN_RULE_VIOLATION');
  });
});
```

---

## E2E test patterns

```typescript
// tests/e2e/[us-title].spec.ts — maps to US-NNN
test('US-001: user can register and access dashboard', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'securepassword');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

---

## Test database

- **Separate DB** for tests: `[app_name]_test`
- **Reset strategy:** Truncate all tables between test suites (not individual tests)
- **Seed:** Minimal seed data per test suite defined in `tests/fixtures/`
- **Migrations:** Run full migration set at test suite start

---

## Coverage requirements

| Module | Minimum branch coverage |
|--------|------------------------|
| Services (domain logic) | 80% |
| Repositories | 60% (tested via integration) |
| Controllers | Covered by integration tests |
| Utilities / helpers | 90% |

---

## Domain rule test matrix

> Every domain rule in domain_rules.md must have a test.

| Rule | Test file | Test name | Status |
|------|-----------|-----------|--------|
| DR-001 | `[resource].service.test.ts` | [test name] | todo |
| DR-002 | `[resource].service.test.ts` | [test name] | todo |
