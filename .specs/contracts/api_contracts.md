---
tier: 3
role: api-contract
depends-on: architecture/data_model.md · architecture/security_model.md · domain/domain_rules.md
feeds-into: implementation/backend_guide.md · contracts/ui_contracts.md · implementation/testing_strategy.md
owner: AI-generated from data_model.md — never edited directly
sync-rule: If data_model.md changes, regenerate this file. Then regenerate ui_contracts.md.
updated: YYYY-MM-DD
---

# API contracts

> AI instruction: Every field in request/response schemas must exist in data_model.md.
> Every endpoint must have an auth requirement from security_model.md.
> Do not add endpoints not traceable to a user story in user_stories.md.
> This file is the contract — backend implements it, frontend consumes it. Both sides
> must match this file exactly. Drift here causes runtime failures.

---

## Conventions

**Base URL:** `[e.g. /api/v1]`
**Content-Type:** `application/json`
**Date format:** ISO 8601 UTC — `YYYY-MM-DDTHH:mm:ssZ`
**ID format:** UUID v4 string
**Pagination:** `?page=[n]&limit=[n]` — response includes `{ data, pagination: { total, page, limit, pages } }`
**Error envelope:** `{ error: { code: string, message: string, details?: object } }`

---

## Standard error codes

| HTTP | Code string | Meaning |
|------|-------------|---------|
| 400 | VALIDATION_ERROR | Request schema invalid |
| 401 | UNAUTHENTICATED | No valid session |
| 403 | FORBIDDEN | Valid session, insufficient permission |
| 404 | NOT_FOUND | Resource does not exist |
| 409 | CONFLICT | State conflict (e.g. duplicate, wrong status) |
| 422 | DOMAIN_RULE_VIOLATION | Passed validation, failed a domain rule (DR-NNN) |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected server error |

---

## Endpoint format

```
### [METHOD] [path]
**Description:** [What this endpoint does in one sentence]
**Auth:** [none / bearer-token / bearer-token + role:X]
**Domain rules:** [DR-NNN list, or —]
**User story:** [US-NNN]

Request body / Query params:
[field]: [type] (required/optional) — [note]

Response 200:
[field]: [type] — [note]

Errors:
- 400 VALIDATION_ERROR — [when]
- 403 FORBIDDEN — [when]
- 422 DOMAIN_RULE_VIOLATION — [which rule, DR-NNN]
```

---

## Auth endpoints

### POST /auth/register
**Description:** Create a new user account.
**Auth:** none
**Domain rules:** —
**User story:** US-001

**Request body:**
```json
{
  "email": "string (required, valid email, max 255)",
  "password": "string (required, min 8 chars)",
  "name": "string (required, max 100)"
}
```

**Response 201:**
```json
{
  "user": { "id": "uuid", "email": "string", "name": "string", "role": "string" },
  "access_token": "string (JWT)",
  "expires_at": "timestamp"
}
```

**Errors:**
- 400 VALIDATION_ERROR — missing/invalid fields
- 409 CONFLICT — email already registered

---

### POST /auth/login
**Description:** Authenticate and receive access token.
**Auth:** none
**Domain rules:** —
**User story:** US-001

**Request body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response 200:**
```json
{
  "user": { "id": "uuid", "email": "string", "name": "string", "role": "string" },
  "access_token": "string",
  "expires_at": "timestamp"
}
```

**Errors:**
- 401 UNAUTHENTICATED — wrong credentials
- 429 RATE_LIMITED — too many failed attempts

---

## [Resource name] endpoints

### GET /[resource]
**Description:**
**Auth:** bearer-token
**Domain rules:** —
**User story:** US-00X

**Query params:**
- `page`: integer (optional, default 1)
- `limit`: integer (optional, default 20, max 100)
- `[filter_field]`: string (optional) — filters by [field]

**Response 200:**
```json
{
  "data": [{ "[field]": "[type]" }],
  "pagination": { "total": 0, "page": 1, "limit": 20, "pages": 0 }
}
```

---

### POST /[resource]
**Description:**
**Auth:** bearer-token
**Domain rules:** DR-00X
**User story:** US-00X

**Request body:**
```json
{}
```

**Response 201:**
```json
{}
```

**Errors:**
- 422 DOMAIN_RULE_VIOLATION — DR-00X: [description]

---

### GET /[resource]/:id
**Description:**
**Auth:** bearer-token
**Domain rules:** —
**User story:** US-00X

**Response 200:**
```json
{}
```

**Errors:**
- 404 NOT_FOUND

---

### PATCH /[resource]/:id
**Description:**
**Auth:** bearer-token + ownership check (security_model.md)
**Domain rules:** DR-00X
**User story:** US-00X

**Request body:** [All fields optional — only send fields to update]
```json
{}
```

**Response 200:**
```json
{}
```

---

### DELETE /[resource]/:id
**Description:**
**Auth:** bearer-token + role:[role]
**Domain rules:** DR-00X
**User story:** US-00X

**Response 204:** (no body)

**Errors:**
- 403 FORBIDDEN — insufficient role
- 422 DOMAIN_RULE_VIOLATION — DR-00X
