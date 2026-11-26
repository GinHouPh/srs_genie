---
tier: 4
role: testing-strategy
depends-on: domain/user_stories.md
updated: 2026-11-24
---

# QA, Testing Strategy & Coverage Gates: Ekklesia

## 1. Testing Pyramid Allocations

- **Unit Tests (70%):** Vitest tests for domain invariants, validation rules, crypto helpers, and state machines.
- **Integration Tests (20%):** Supertest API tests verifying database transactions, RLS filters, and role guards.
- **End-to-End Tests (10%):** Playwright automated browser tests covering login, questionnaire flow, and spec downloads.

---

## 2. Coverage Gates
- Minimum **85% statement coverage** on core business domain logic.
- 100% test passage required before pull requests can merge to `main`.


---

## Frontier Model Verification Plan

## 17. Quality Attribute Requirements

| NFR ID | Category | Requirement | Measurement | Target | Priority |
|---|---|---|---|---|---|
| NFR-001 | Performance | API P95 latency under normal load | Prometheus histogram | < 200ms | Critical |
| NFR-002 | Availability | System uptime availability | Synthetic monitoring ping | >= 99.9% | Critical |
| NFR-003 | Scalability | Support concurrent active tenants | Load testing suite | >= 500 tenants | High |
| NFR-004 | Security | Zero high/critical vulnerabilities | SAST CodeQL & Dependabot | 0 findings | Critical |

---

