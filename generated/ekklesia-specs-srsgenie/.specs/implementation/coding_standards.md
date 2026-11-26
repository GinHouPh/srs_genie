---
tier: 4
role: coding-standards
updated: 2026-11-24
---

# Coding Standards & Engineering Hygiene: Ekklesia

- **Strict TypeScript:** `noImplicitAny: true`, `strictNullChecks: true`.
- **Formatting:** Prettier with 2 spaces, single quotes, and trailing commas.
- **Git Commit Convention:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
- **Error Handling:** Never swallow caught exceptions; always log structured context or bubble via custom `AppError`.
