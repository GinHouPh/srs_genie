---
tier: agents
role: task-execution-guide
read: during Phase 3 implementation
updated: YYYY-MM-DD
---

# Bounded Task Execution Guide

> AI instruction: This guide governs the code writing process.
> Adhere strictly to scope boundaries, follow coding standards, and avoid unauthorized architectural changes.

---

## 1. Scope Boundary Invariants

Every task in `.specs/coordination/task_board.md` contains an explicit scope boundary definition.

```markdown
**Scope boundary:**
  - INCLUDED: [Explicit file/directory allowlist]
  - EXCLUDED: [Explicit read-only allowlist]
```

### The 4 Boundary Rules:
1. **Zero Out-of-Scope Writes:** You may only create, modify, or delete files matching the patterns under `INCLUDED`.
2. **Read-Only Context:** Files under `EXCLUDED` may be read for reference (e.g. types, shared utilities, contracts), but must **never** be edited directly during task execution.
3. **Spec Files are Immutable During Coding:** Never edit files inside `.specs/` (except your own message file and the task board status) without following the Decision/Proposal protocol.
4. **Pre-Commit Verification:** Run `git status` and `git diff --name-only` before committing. If any modified file is not in `INCLUDED`, revert it immediately:
   ```bash
   git checkout origin/main -- path/to/unauthorized/file
   ```

---

## 2. Shared Code Patterns & Standards

- **TypeScript Strictness:** Never use `any`. Use `unknown` and type guards, or define explicit domain types in module schemas.
- **Layered Architecture:**
  - Routers only bind endpoints to controllers and middleware.
  - Controllers only parse requests, invoke services, and serialize response envelopes.
  - Services contain business logic, calculations, and domain rule checks (DR-NNN).
  - Repositories execute database queries and return domain models.
- **Error Handling:** Always throw specific domain errors from `shared/errors.ts` (`ValidationError`, `DomainRuleError`, `NotFoundError`, `ForbiddenError`). Never throw raw generic errors or return unhandled 500s.
- **Logging:** Use structured JSON logging with `{ timestamp, level, request_id, user_id, action }`. Never log credentials, passwords, or PII.

---

## 3. Dependency Management Guardrails

- **No Unauthorized Packages:** Never run `npm install <new-package>` without documenting the requirement in a proposal. Use existing libraries listed in `package.json`.
- **Environment Variables:** Never reference `process.env.VARIABLE_NAME` directly in business logic. All configuration must be accessed through validated `config/env.ts` as defined in `implementation/infrastructure.md`.
