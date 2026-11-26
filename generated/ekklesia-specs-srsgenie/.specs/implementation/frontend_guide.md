---
tier: 4
role: frontend-guide
depends-on: contracts/ui_contracts.md
updated: 2026-11-24
---

# Frontend Engineering Guide: Ekklesia

- **Framework:** React 19 with strictly typed TypeScript.
- **State Management:** Modular Zustand or custom React context stores with persistent storage sync.
- **Styling Architecture:** Utility-first Tailwind CSS enforcing brand token consistency.
- **Custom Hook Conventions:**
  - `useAuth()`: Returns current authenticated user and session refresh controls.
  - `useFormDraft()`: Auto-saves questionnaire state to local storage with restore capabilities.
  - `useSpecStream()`: Streams live AI progress events during specification compilation.
- **Accessibility:** Meets WCAG 2.1 AA standards; keyboard navigable with full ARIA attributes.
