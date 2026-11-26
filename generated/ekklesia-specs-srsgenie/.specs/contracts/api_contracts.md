---
tier: 3
role: api-contracts
depends-on: architecture/data_model.md · architecture/security_model.md
updated: 2026-11-24
---

# REST API Contracts & Endpoint Specifications: Ekklesia

> **Global API Protocol:** All endpoints return standard JSON envelopes formatted as:  
> `{ "success": boolean, "data"?: any, "error"?: { "code": string, "message": string }, "meta"?: any }`

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "StrongPassword123!",
  "companyName": "Acme Logistics"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "b3e944a1-0001", "email": "jane@company.com", "role": "admin" },
    "tenant": { "id": "t7a109c4-0001", "name": "Acme Logistics", "plan": "pro" },
    "token": "eyJhbGciOiJSUzI1NiIs..."
  }
}
```

---

### `POST /api/v1/auth/login`
- **Request Body:**
```json
{
  "email": "jane@company.com",
  "password": "StrongPassword123!"
}
```
- **Response (200 OK):** Returns authenticated user profile and JWT bearer token.

---

## 2. Domain Resource Endpoints

### `GET /api/v1/resources`
- **Headers:** `Authorization: Bearer <token>`, `X-Tenant-ID: <uuid>`
- **Query Params:** `page=1&limit=20&status=active&search=query`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "res_84920482",
      "title": "Production Workstream",
      "status": "active",
      "version": 2,
      "updatedAt": "2026-11-24T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### `POST /api/v1/resources`
- **Headers:** `Authorization: Bearer <token>`, `Idempotency-Key: <uuid>`
- **Request Body:** `{ "title": "New Operational Batch", "data": { "category": "primary" } }`
- **Response (201 Created):** Created resource record.


---

## Frontier Model API Contracts

# SECTION 10 — UI/UX AND INTERFACE REQUIREMENTS

