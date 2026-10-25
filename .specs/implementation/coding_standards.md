---
tier: 4
role: coding-standards
depends-on: foundation/brief.md · architecture/system_design.md
feeds-into: all code generation
owner: human-owned
scope: global — applies to all generated and human-written code
updated: YYYY-MM-DD
---

# Coding standards

> AI instruction: Check this file before generating any code. Match every naming
> convention, import style, and formatting rule exactly. This file takes precedence
> over your default code style preferences.

---

## Language and runtime

| Setting | Value |
|---------|-------|
| Language | TypeScript (strict mode) |
| Node.js | v20+ |
| tsconfig | `"strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true` |
| Module system | ESM (`"type": "module"` in package.json) |

---

## Naming conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | kebab-case | `user-profile.service.ts` |
| Components | PascalCase | `UserProfileCard.tsx` |
| Functions | camelCase | `createUserProfile()` |
| Variables | camelCase | `userProfile` |
| Constants | SCREAMING_SNAKE | `MAX_UPLOAD_SIZE_MB` |
| Types / Interfaces | PascalCase | `UserProfile`, `CreateUserDto` |
| DB tables | snake_case | `user_profiles` |
| DB columns | snake_case | `created_at` |
| API routes | kebab-case | `/user-profiles/:id` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL` |
| Test files | `[name].test.ts` | `user.service.test.ts` |

---

## Import order

```typescript
// 1. Node built-ins
import { randomUUID } from 'crypto';

// 2. External packages
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// 3. Internal modules (absolute paths via tsconfig paths)
import { db } from '@/config/database';
import { AppError } from '@/shared/errors';

// 4. Relative imports (siblings and children only)
import { userRepository } from './user.repository';
```

---

## Formatting

**Tool:** Prettier + ESLint
**Config:** committed to repo as `.prettierrc` and `.eslintrc`

| Rule | Value |
|------|-------|
| Indent | 2 spaces |
| Quotes | single |
| Trailing comma | all |
| Semicolons | yes |
| Line length | 100 chars |
| Arrow functions | always parentheses |

---

## TypeScript rules

- No `any` — use `unknown` and narrow, or define the type
- No non-null assertion (`!`) — use proper null checks
- All function parameters and return types explicitly typed
- DTOs are `type`, not `interface` (easier to compose)
- Zod schemas are the source of truth for runtime + compile-time type safety

---

## Function rules

- Max function length: 40 lines — extract helpers if over
- Max parameters: 3 — use an options object beyond 3
- No nested callbacks — use async/await
- Pure functions preferred — side effects in services/repositories only

---

## Comments

- Comment the *why*, never the *what* (the code explains what)
- JSDoc on all exported functions
- `// TODO: [task-id]` for deferred work — reference the tasks.md ID
- `// FIXME: [issue-id]` for known bugs — reference known_issues.md ID

---

## Git conventions

**Branch naming:** `[type]/[short-description]` — e.g. `feat/user-auth`, `fix/login-redirect`

**Commit message format:**
```
[type]([scope]): [short description]

[optional body: why, not what]

[optional footer: references DR-NNN, US-NNN, closes #issue]
```

**Types:** `feat` · `fix` · `refactor` · `test` · `docs` · `chore` · `perf`

**PR rules:**
- PR must reference at least one task ID from tasks.md
- CI must pass before merge (no exceptions)
- At least one approval required for production-impacting changes

---

## What the AI must never generate

- `console.log` in production code (use the logger from backend_guide.md)
- Hardcoded secrets or connection strings
- `process.env.X` outside `config/env.ts`
- `any` types
- Synchronous file I/O
- Direct DB queries in controllers or route handlers
