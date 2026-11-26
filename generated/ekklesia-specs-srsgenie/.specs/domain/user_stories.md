---
tier: 1
role: user-stories
depends-on: foundation/brief.md
updated: 2026-11-24
---

# User Stories & Gherkin Acceptance Criteria: Ekklesia

### US-001: Multi-Tenant Registration & Onboarding
**As an** organization manager  
**I want to** register an account with email, password, and company name  
**So that** an isolated workspace and tenant database partition are provisioned automatically.

```gherkin
Scenario: Successful organization registration
  Given a visitor submits a valid registration payload with email "lead@company.com" and password
  When the registration endpoint is executed
  Then a new Tenant record with status "active" is provisioned
  And a User record with role "admin" is linked to the tenant
  And a verification email containing a secure one-time token is dispatched
  And an HTTP 201 Created status with session tokens is returned

Scenario: Duplicate email rejection
  Given a user with email "lead@company.com" already exists in the system
  When another registration request with the same email is submitted
  Then the system returns HTTP 409 Conflict with code "EMAIL_ALREADY_REGISTERED"
  And no duplicate records or tenant workspaces are created
```

---

### US-002: Core Resource Lifecycle Management
**As an** authenticated team member  
**I want to** create, view, update, and search our operational domain records  
**So that** business operations progress accurately through their lifecycle.

```gherkin
Scenario: Create and transition domain resource
  Given an authenticated user with role "member" or "admin"
  When they submit a valid resource payload with title and required attributes
  Then the resource is created in status "draft" linked to the user's "tenant_id"
  When the user executes the "publish" or "activate" mutation
  Then the state machine transitions status to "active"
  And an audit log entry is written with timestamp and user ID
```

---

### US-003: Subscription & Automated Billing Management
**As a** tenant administrator  
**I want to** upgrade our plan, manage billing details, and download invoices  
**So that** our team retains uninterrupted access to platform quotas.

```gherkin
Scenario: Plan upgrade with webhook confirmation
  Given a tenant administrator on the "free" tier
  When they select the "pro" plan and complete payment via Cashfree / Stripe
  Then an external webhook is received with valid HMAC-SHA256 signature
  And the tenant's plan attribute is upgraded to "pro"
  And the quota limit is immediately adjusted to the pro entitlement
  And an automated tax invoice PDF is generated and emailed to the billing contact
```

---

### US-004: Role-Based Access Enforcement
**As a** security administrator  
**I want** unauthorized actions to be blocked before execution  
**So that** sensitive data and administrative controls are protected.

```gherkin
Scenario: Viewer attempts mutating action
  Given an authenticated user assigned the role "viewer"
  When they attempt to execute a POST, PUT, or DELETE request on protected resources
  Then the RBAC middleware intercepts the request
  And returns HTTP 403 Forbidden with code "INSUFFICIENT_PERMISSIONS"
  And the violation is recorded in the security audit stream
```
