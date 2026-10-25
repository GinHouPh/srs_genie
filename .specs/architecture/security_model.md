---
tier: 2
role: auth-and-permissions
depends-on: architecture/system_design.md · domain/user_stories.md · domain/domain_rules.md
feeds-into: contracts/api_contracts.md · implementation/backend_guide.md · implementation/testing_strategy.md
owner: AI-generated · human-reviewed (mandatory)
updated: YYYY-MM-DD
---

# Security model

> AI instruction: Every endpoint in api_contracts.md must reference an auth requirement
> defined here. Do not add auth logic to generated code that is not defined in this file.
> If a new permission is needed, add it here first, then reference it from the endpoint.

---

## Authentication strategy

**Method:** [e.g. JWT / Session cookie / OAuth2 / API key]
**Provider:** [e.g. Built-in / Auth0 / Supabase Auth / Firebase Auth]
**Token storage:** [e.g. HttpOnly cookie / localStorage — and why]
**Token lifetime:** Access: [e.g. 15 min] · Refresh: [e.g. 7 days]
**Refresh strategy:** [e.g. Silent refresh via refresh token rotation]

---

## User roles

| Role | Description | How assigned |
|------|-------------|-------------|
| [role_name] | [What this role represents] | [e.g. set on registration / admin-assigned] |
| [role_name] | [Description] | [How assigned] |

---

## Permission matrix

> ✅ allowed  ❌ forbidden  🔒 allowed only on own resource  👑 admin only

| Resource | Action | [Role A] | [Role B] | [Role C] |
|----------|--------|----------|----------|----------|
| [Resource] | create | ✅ | ❌ | 👑 |
| [Resource] | read | ✅ | ✅ | ✅ |
| [Resource] | update | 🔒 | ❌ | 👑 |
| [Resource] | delete | ❌ | ❌ | 👑 |
| [Resource] | list-all | ❌ | ❌ | 👑 |

---

## Ownership rules

> "Own resource" conditions — referenced by 🔒 above.

- A [role] may only update/delete a [resource] if `[resource].[owner_field] = current_user.id`
- [Additional ownership condition]

---

## Public endpoints

> Endpoints that require NO authentication.

- `POST /auth/register`
- `POST /auth/login`
- `GET /health`
- [Any other public route]

---

## Security requirements

### Input validation
- All string inputs sanitized for [XSS / SQL injection] at [layer]
- File uploads: allowed types [list], max size [MB], scanned for [malware / type spoofing]

### Rate limiting
| Endpoint group | Limit | Window | Action on exceed |
|---------------|-------|--------|-----------------|
| Auth endpoints | [e.g. 10 req] | [1 min] | [429 + lock for 15 min] |
| Public API | [e.g. 100 req] | [1 min] | [429] |
| Authenticated API | [e.g. 1000 req] | [1 min] | [429] |

### Data protection
- PII fields: [list fields] — [how they are protected: encrypted at rest / hashed / masked in logs]
- Logging rule: Never log [list: passwords, tokens, card numbers, etc.]

### CORS policy
**Allowed origins:** [list, or * for public API]
**Credentials:** [yes/no]
