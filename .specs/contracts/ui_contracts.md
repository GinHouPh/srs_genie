---
tier: 3
role: frontend-component-contracts
depends-on: contracts/api_contracts.md · domain/user_stories.md · architecture/data_model.md
feeds-into: implementation/frontend_guide.md · implementation/testing_strategy.md
owner: AI-generated from api_contracts.md — never edited directly
sync-rule: Regenerate when api_contracts.md changes.
updated: YYYY-MM-DD
---

# UI contracts

> AI instruction: Every component here maps to one or more user stories and consumes
> endpoints defined in api_contracts.md. Do not invent props not derivable from the
> API response shapes. Do not create components for routes not defined here.
> This file tells the AI exactly what to build — no guessing prop shapes.

---

## Route map

| Route | Component | Auth required | User story |
|-------|-----------|--------------|------------|
| `/` | `[ComponentName]` | no | US-00X |
| `/login` | `LoginPage` | no | US-001 |
| `/dashboard` | `DashboardPage` | yes | US-00X |
| `/[resource]` | `[Resource]ListPage` | yes | US-00X |
| `/[resource]/:id` | `[Resource]DetailPage` | yes | US-00X |
| `/[resource]/new` | `[Resource]FormPage` | yes + role:[role] | US-00X |

---

## Component format

```
### [ComponentName]
Route: [path or "no route — used inside [ParentComponent]"]
User story: US-NNN
API calls: [METHOD endpoint from api_contracts.md]

Props:
[propName]: [type] — [description]

State:
[stateName]: [type] — [what it holds]

Events emitted:
[eventName] → [what triggers it, what it passes to parent]

Loading state: [yes/no — what to show]
Error state: [yes/no — what to show]
Empty state: [yes/no — what to show]
```

---

## Pages

### LoginPage
**Route:** `/login`
**User story:** US-001
**API calls:** `POST /auth/login`

**Props:** none (page-level, no props)

**State:**
- `email`: string — controlled input
- `password`: string — controlled input
- `loading`: boolean — true while API call in flight
- `error`: string | null — error message from API

**Events emitted:** none (redirects on success via router)

**Loading state:** Submit button disabled + spinner
**Error state:** Inline error below form (message from API)
**Empty state:** n/a

---

### [Resource]ListPage
**Route:** `/[resource]`
**User story:** US-00X
**API calls:** `GET /[resource]`

**Props:** none

**State:**
- `items`: `[EntityName][]` — fetched list
- `loading`: boolean
- `error`: string | null
- `page`: integer — current pagination page
- `total`: integer — total item count from API

**Events emitted:** none (navigates to detail on row click)

**Loading state:** Skeleton list (same row height as real items)
**Error state:** Error banner with retry button
**Empty state:** Illustration + "No [items] yet" + CTA button

---

### [Resource]FormPage
**Route:** `/[resource]/new` · `/[resource]/:id/edit`
**User story:** US-00X
**API calls:** `POST /[resource]` (new) · `PATCH /[resource]/:id` (edit) · `GET /[resource]/:id` (pre-fill on edit)

**Props:**
- `mode`: `'create' | 'edit'`
- `resourceId`: string | null — null on create

**State:**
- `form`: `Partial<[EntityName]>` — form values
- `errors`: `Record<string, string>` — per-field validation errors
- `loading`: boolean
- `submitError`: string | null

**Events emitted:**
- `onSuccess` → navigates to detail page with new/updated ID

**Loading state:** Full-page spinner while fetching existing data (edit mode)
**Error state:** Per-field inline error messages + global submit error
**Empty state:** n/a

---

## Shared components

### [ComponentName]
**Route:** no route — used inside [ParentComponent]
**User story:** US-00X
**API calls:** none (receives data via props)

**Props:**
- `[propName]`: `[TypeName]` — [description]
- `onAction`: `(id: string) => void` — [what triggers it]

**State:** none (stateless display component)

---

## Data type reference

> TypeScript types derived from data_model.md entity fields.

```typescript
type [EntityName] = {
  id: string;
  created_at: string; // ISO 8601
  updated_at: string;
  [field_name]: string;
  [field_name]: number;
  [field_name]: '[val1]' | '[val2]'; // enum
  [fk_field_id]: string;
};
```
