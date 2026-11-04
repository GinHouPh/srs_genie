import { ProjectInput, VibeTask } from '../types';

/**
 * Extracts a matching section from the frontier AI model's draft text
 */
export function extractSectionFromDraft(draft: string | undefined, keywords: string[]): string {
  if (!draft) return '';
  const lines = draft.split('\n');
  let capturing = false;
  const captured: string[] = [];

  for (const line of lines) {
    const isHeading = /^#{1,3}\s+/.test(line);
    if (isHeading) {
      const lower = line.toLowerCase();
      const matches = keywords.some(kw => lower.includes(kw.toLowerCase()));
      if (matches) {
        capturing = true;
        captured.push(line);
        continue;
      } else if (capturing) {
        break;
      }
    } else if (capturing) {
      captured.push(line);
    }
  }

  return captured.join('\n').trim();
}

/**
 * Generates bespoke, authentic domain terminology tailored to the target industry
 */
export function getIndustryGlossary(industry: string): { term: string; definition: string; context: string }[] {
  const ind = (industry || '').toLowerCase();

  if (ind.includes('logistics') || ind.includes('transport') || ind.includes('fleet') || ind.includes('supply')) {
    return [
      { term: 'Waybill / Bill of Lading (BOL)', definition: 'Legally binding freight contract detailing consignor, consignee, cargo weight, and chain of custody.', context: 'Digitally signed on pickup and delivery with SHA-256 integrity hash.' },
      { term: 'Telematics Ingestion', definition: 'Continuous IoT stream of vehicle GPS location, speed, fuel telemetry, and driver duty hours.', context: 'Ingested via MQTT / Kafka into Redis time-series with 10s P99 latency.' },
      { term: 'Demurrage & Detention', definition: 'Financial penalty accrued when terminal, port, or warehouse loading exceeds free detention window.', context: 'Auto-calculated in settlement module against verified carrier SLAs.' },
      { term: 'Consignee Verification', definition: 'The designated receiver authorized to accept cargo transfer upon delivery.', context: 'Requires OTP SMS verification or biometric geo-fence confirmation.' },
      { term: 'LTL / Multi-Drop Manifest', definition: 'Consolidated route schedule combining multiple smaller freight parcels into one vehicle load.', context: 'Optimized via vehicle routing algorithms (VRP) to minimize route mileage.' },
      { term: 'Proof of Delivery (POD)', definition: 'Cryptographically sealed confirmation including receiver signature, timestamped GPS, and cargo photo.', context: 'Stored immutably in S3/GCS with signed URLs.' }
    ];
  }

  if (ind.includes('commerce') || ind.includes('retail') || ind.includes('shop') || ind.includes('marketplace')) {
    return [
      { term: 'Stock Keeping Unit (SKU)', definition: 'Unique alphanumeric code assigned to distinct merchandise variants (size, color, material).', context: 'Indexed in PostgreSQL with composite key (tenant_id, sku).' },
      { term: 'Cart Abandonment Funnel', definition: 'Pipeline tracking cart creation through checkout drop-off for retargeting campaigns.', context: 'Triggers automated event worker via Redis queue after 30 mins of inactivity.' },
      { term: 'Gross Merchandise Value (GMV)', definition: 'Total monetary value of processed orders over a given reporting period prior to discounts or returns.', context: 'Computed in real-time analytics aggregation views.' },
      { term: 'PCI-DSS Tokenization Vault', definition: 'Secure token exchange where sensitive PAN data is replaced by stateless surrogate tokens.', context: 'Card numbers NEVER touch core application memory or persistence layers.' },
      { term: 'Return Merchandise Auth (RMA)', definition: 'State machine governing return eligibility, barcode label generation, inspection, and refund release.', context: 'Enforces invariant state progression: Requested -> Approved -> Received -> Inspected -> Refunded.' }
    ];
  }

  if (ind.includes('health') || ind.includes('medical') || ind.includes('patient') || ind.includes('pharma')) {
    return [
      { term: 'Protected Health Information (PHI)', definition: 'Individually identifiable health data regulated under HIPAA and regional medical privacy statutes.', context: 'Encrypted with column-level AES-256-GCM using dedicated customer-managed KMS keys.' },
      { term: 'Electronic Health Record (EHR)', definition: 'Longitudinal digital record of patient encounters, vitals, prescriptions, and lab diagnostics.', context: 'Interoperable via HL7 FHIR v4 JSON APIs.' },
      { term: 'Provider NPI Registry', definition: '10-digit National Provider Identifier uniquely certifying licensed healthcare practitioners.', context: 'Validated against national registry on practitioner onboarding.' },
      { term: 'Telehealth Encounter Room', definition: 'WebRTC end-to-end encrypted video/audio session with real-time clinical notes recording.', context: 'Session keys destroyed immediately following consultation termination.' }
    ];
  }

  if (ind.includes('finance') || ind.includes('bank') || ind.includes('fintech') || ind.includes('payment')) {
    return [
      { term: 'Double-Entry Accounting Ledger', definition: 'Bookkeeping standard where every transaction creates equal and balancing debit and credit entries.', context: 'Enforced at DB constraint level: SUM(debit) == SUM(credit) in every transaction.' },
      { term: 'Automated Bank Reconciliation', definition: 'Systematic matching of internal ledger transactions with external settlement bank statements.', context: 'Daily batch job flagging variance anomalies > 0.01 currency units.' },
      { term: 'KYC / AML Screening Pipeline', definition: 'Know Your Customer and Anti-Money Laundering regulatory verification on onboarding.', context: 'Must transition to "verified" before disbursement capabilities are unlocked.' },
      { term: 'Escrow Vault Partition', definition: 'Multi-party conditional fund holding released solely upon verifiable delivery triggers.', context: 'Enforced by dual-authorization cryptographic signatures.' }
    ];
  }

  // Default Enterprise SaaS domain terms
  return [
    { term: 'Tenant Partition', definition: 'Strict logical boundary isolating an organization\'s datasets, encryption keys, and configurations.', context: 'Enforced via Row-Level Security (RLS) and query middleware.' },
    { term: 'Sliding Session Token', definition: 'Short-lived JWT (15 mins) that automatically renews during active user interaction.', context: 'Backed by rotating refresh tokens stored in secure HttpOnly SameSite=Strict cookies.' },
    { term: 'Idempotency Key', definition: 'Client-generated UUID transmitted in HTTP headers to prevent duplicate executions on network retry.', context: 'Stored in Redis cache with 24-hour expiration.' },
    { term: 'Model Context Protocol (MCP)', definition: 'Standardized RPC protocol exposing specification tools to autonomous AI coding agents.', context: 'Directly consumed by Cursor, Windsurf, and Claude Code.' }
  ];
}

/**
 * Builds the complete 22-file canonical .specs hierarchy
 */
export function buildCanonicalSpecsSuite(
  input: ProjectInput,
  dynamicTasks: VibeTask[],
  draftText: string | undefined,
  recordFile: (path: string, tier: string, title: string, content: string) => void
): Record<string, string> {
  const fd = input.formData || {};
  const projectName = input.name || (fd['project_overview']?.['project_name'] as string) || 'Modern Web Application';
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
  const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
  const appTypes = Array.isArray(fd['system_type']?.['application_type'])
    ? (fd['system_type']?.['application_type'] as string[]).join(', ')
    : (fd['system_type']?.['application_type'] as string) || 'Web Application (React + Node.js)';
  const targetUsers = Array.isArray(fd['project_overview']?.['target_users'])
    ? (fd['project_overview']?.['target_users'] as string[]).join(', ')
    : (fd['project_overview']?.['target_users'] as string) || 'End Users, Administrators, Operations Managers';
  const timeline = (fd['project_overview']?.['expected_timeline'] as string) || '3-4 months';
  const budget = (fd['project_overview']?.['budget_range'] as string) || '$25,000 - $50,000';

  const userMgmt = Array.isArray(fd['core_features']?.['user_management'])
    ? (fd['core_features']?.['user_management'] as string[]).join(', ')
    : 'Registration, JWT Auth, Role-based Access Control (RBAC), MFA';
  const ecom = Array.isArray(fd['core_features']?.['ecommerce_features'])
    ? (fd['core_features']?.['ecommerce_features'] as string[]).join(', ')
    : 'Cashfree / Stripe Instant Billing, Subscriptions, Automated Invoicing';
  const comms = Array.isArray(fd['core_features']?.['communication_features'])
    ? (fd['core_features']?.['communication_features'] as string[]).join(', ')
    : 'In-app Notifications, Email Alerts (SendGrid), Webhook Events';
  const security = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'GDPR, OWASP Top 10, SOC 2 Type II, ISO 27001';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis 7';
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js 22 LTS / Express TypeScript';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'Serverbyt Cloud StackCP / Docker Containers';
  const archPattern = (fd['architecture']?.['architecture_pattern'] as string) || 'Modular Monolith with Domain-Driven Partitioning';
  const apiStyle = (fd['architecture']?.['api_style'] as string) || 'RESTful JSON / OpenAPI 3.1';
  const cachingStrategy = (fd['technical_requirements']?.['caching_strategy'] as string) || 'Redis L2 Cache with Cache-Aside Strategy';

  const dateStr = new Date().toISOString().split('T')[0];

  // Extract sections from frontier AI draft if available
  const aiExecutiveVision = extractSectionFromDraft(draftText, ['executive', 'vision', 'scope', 'architecture classification']);
  const aiDomainInvariants = extractSectionFromDraft(draftText, ['domain', 'entities', 'invariants', 'business rules']);
  const aiSecurityModel = extractSectionFromDraft(draftText, ['security', 'access', 'rbac', 'permission']);
  const aiSystemDesign = extractSectionFromDraft(draftText, ['system', 'architecture', 'component', 'layer']);
  const aiDatabaseSchema = extractSectionFromDraft(draftText, ['database', 'schema', 'relational', 'ddl', 'migrations']);
  const aiApiContracts = extractSectionFromDraft(draftText, ['api', 'endpoints', 'interface', 'contracts']);
  const aiUiContracts = extractSectionFromDraft(draftText, ['ui', 'ux', 'frontend', 'route', 'components']);
  const aiTestingVerification = extractSectionFromDraft(draftText, ['verification', 'testing', 'quality', 'pyramid']);

  const industryGlossary = getIndustryGlossary(industry);

  // 1. _index.md
  recordFile('_index.md', 'Entry', 'Project Index & Navigation Manifest', `---
tier: entry
role: navigation-manifest
read: every session, before any other file
updated: ${dateStr}
---

# Project Index & Agent Navigation Manifest: ${projectName}

> **Autonomous AI Agent Instruction:**  
> Read this file first. Do not read any other specification file until you have parsed the file map below.
> Then read only the files relevant to your current task. Always read \`/state/current_state.md\` immediately after this file.

---

## Executive Project Summary

**${projectName}** is an enterprise-grade ${projectType.toLowerCase()} engineered for the **${industry}** sector.
It provides ${targetUsers} with high-throughput workflows, real-time collaboration, and bulletproof security isolation.

- **Architecture Classification:** ${archPattern}
- **API Standard:** ${apiStyle}
- **Core Technology Stack:** ${backend} · ${database} · ${frontend}
- **Hosting & Infrastructure:** ${hosting}
- **Target Release Timeline:** ${timeline} | **Budget Scope:** ${budget}
- **Dynamic Task Backlog:** ${dynamicTasks.length} atomic implementation tasks formulated

---

## 6-Tier Canonical Specification Map

| File Path | Tier | Scope & Contents | Mandatory Reading Trigger |
|:---|:---:|:---|:---|
| \`foundation/brief.md\` | 0 | Root vision, business scope, non-negotiables, user personas | Always — first spec read for system boundaries |
| \`foundation/glossary.md\` | 0 | Canonical domain terminology, invariants, acronyms | Before authoring business logic or database schemas |
| \`domain/user_stories.md\` | 1 | Gherkin user stories, acceptance criteria, role permissions | When generating service endpoints or E2E tests |
| \`domain/domain_rules.md\` | 1 | Business invariants (DR-001..DR-008), validation constraints | Before writing controllers, mutations, or transactions |
| \`architecture/system_design.md\` | 2 | Topology flowchart, component map, queue pipelines | When designing or debugging inter-service communication |
| \`architecture/data_model.md\` | 2 | Entity-Relationship diagram, attributes, foreign keys | Before creating database tables or migration scripts |
| \`architecture/security_model.md\` | 2 | RBAC permission matrix, Argon2id auth, encryption keys | Before writing authentication, sessions, or route guards |
| \`contracts/api_contracts.md\` | 3 | OpenAPI REST endpoints, request/response JSON schemas | When generating backend routes or client API SDKs |
| \`contracts/database_schema.md\` | 3 | Production PostgreSQL DDL SQL migrations, indexes, RLS | When creating database tables or modifying columns |
| \`contracts/ui_contracts.md\` | 3 | Route tree, global state store, component prop types | When generating frontend components and pages |
| \`implementation/backend_guide.md\` | 4 | Clean architecture, service-repository patterns, errors | When writing backend service modules |
| \`implementation/frontend_guide.md\` | 4 | React 19 guidelines, custom hooks, optimistic state | When authoring UI views and responsive layouts |
| \`implementation/infrastructure.md\` | 4 | Dockerfile multi-stage, docker-compose, CI/CD deploy | When writing container setups or deployment configs |
| \`implementation/testing_strategy.md\` | 4 | Vitest unit tests, Supertest API tests, Playwright E2E | When authoring automated test suites |
| \`implementation/coding_standards.md\` | 4 | TypeScript strict mode, ESLint, Git Conventional Commits | Before submitting pull requests or committing code |
| \`execution/tasks.md\` | 5 | All ${dynamicTasks.length} atomic tasks with agent prompts & context | When selecting the next unblocked task |
| \`execution/dependency_graph.md\` | 5 | Directed Acyclic Graph (DAG) of task dependencies | When determining task execution order |
| \`execution/sprint_plan.md\` | 5 | 4-sprint roadmap, deliverables, and milestone checkpoints | When reviewing sprint goals and releases |
| \`state/current_state.md\` | State | Live operational state, health metrics, next actions | Read every session immediately after this index |
| \`state/decisions_log.md\` | State | Architectural Decision Records (ADR-001..ADR-005) | Before proposing any architectural refactor |
| \`state/known_issues.md\` | State | Known constraints, intentional tech debt, v2.0 backlog | Before modifying areas with open watchpoints |

---

## Regeneration & Cascade Invariants

\`\`\`
foundation/brief.md changed     → Regenerate all downstream tiers (Tiers 1 through 5)
foundation/glossary.md changed  → Review all files for terminology consistency
architecture/data_model.md      → Regenerate database_schema.md + api_contracts.md + ui_contracts.md
contracts/api_contracts.md     → Regenerate ui_contracts.md + update testing_strategy.md
domain/user_stories.md changed  → Regenerate execution/tasks.md + testing_strategy.md
\`\`\`
`);

  // 2. foundation/brief.md
  recordFile('foundation/brief.md', 'Tier 0', 'Product Brief', `---
tier: 0
role: source-of-truth
owner: human
triggers-regen: all tiers below
updated: ${dateStr}
---

# Product Brief: ${projectName}

> **AI Directive:** This document represents the authoritative root source of truth.
> Do not infer capabilities or scope not explicitly outlined here. Every downstream specification derives from this brief.

---

## 1. Product Vision & Value Proposition

**${projectName}** is an enterprise-grade platform developed for the **${industry}** sector.
It empowers **${targetUsers}** by eliminating manual operational overhead, providing automated workflow execution, and guaranteeing continuous multi-tenant data isolation.

### Core Value Drivers:
- **Operational Automation:** Streamlines ${userMgmt} and automated business workflows.
- **Financial Integrity:** Seamless ${ecom} with automated tax calculation and invoice reconciliation.
- **Unified Communications:** ${comms} with multi-channel event broadcasting.
- **Enterprise Security:** Built to satisfy ${security} standards from day one.

---

## 2. User Roles & Persona Matrix

| Role | Primary Responsibilities | Core Workflows | Pain Points Resolved |
|:---|:---|:---|:---|
| **Standard User / Customer** | Day-to-day platform interaction | Self-service onboarding, item creation, order tracking | Eliminates slow manual approvals and friction |
| **Team / Operations Manager** | Workspace management & team coordination | Role assignments, approval flows, operational dashboards | Provides real-time visibility across workflows |
| **Tenant Administrator** | Workspace governance & billing | Plan upgrades, payment methods, VAT invoices, audit logs | Prevents quota exhaustion and unexpected billing |
| **Super Admin / Platform Lead** | Global platform health & configuration | Global telemetry, revenue metrics, provider configs | Centralized governance with zero downtime |

---

## 3. Non-Negotiable Engineering Constraints

- **Latency SLA:** P95 API response times under **200ms** across all core transactional paths.
- **Availability Target:** **99.9% uptime SLA** with automated container health-checks and self-healing.
- **Tenant Partitioning:** Zero-tolerance data bleed across tenant partitions enforced via database Row-Level Security (RLS).
- **Compliance Baseline:** Enforce **${security}** controls, AES-256 data-at-rest encryption, and TLS 1.3 in-transit.
- **Recovery Targets:** Recovery Point Objective (RPO) < 5 minutes; Recovery Time Objective (RTO) < 15 minutes.

---

## 4. Release Scope & Boundaries

### In-Scope (Phase 1 / MVP):
- Complete self-service tenant registration and authentication.
- Core business resource management and status progression.
- Automated billing integration and downloadable invoices.
- Model Context Protocol (MCP) server integration for Cursor, Windsurf, and Claude Code.
- Automated testing suites (Vitest, Supertest, Playwright) achieving 85%+ coverage.

### Explicitly Out-of-Scope (Deferred to v2.0):
- Legacy native desktop wrappers (Windows 7 / legacy macOS).
- Multi-region active-active database replication.
- Physical hardware telemetry gateways without IP connectivity.

${aiExecutiveVision ? `\n---\n\n## 5. Frontier AI Architectural Directives\n\n${aiExecutiveVision}\n` : ''}
`);

  // 3. foundation/glossary.md
  recordFile('foundation/glossary.md', 'Tier 0', 'Domain Glossary', `---
tier: 0
role: canonical-vocabulary
owner: human
triggers-regen: consistency check across all specs
updated: ${dateStr}
---

# Domain Glossary & Vocabulary Standard: ${projectName}

> **AI Directive:** Use only the canonical terms defined below in code, schemas, and specifications.
> Synonyms or informal terms must be mapped to their canonical equivalents to prevent terminology drift.

---

## Industry & Domain Terminology (${industry})

| Canonical Term | Definition | Technical Context & Invariant Rules |
|:---|:---|:---|
${industryGlossary.map(g => `| **${g.term}** | ${g.definition} | ${g.context} |`).join('\n')}

---

## Architectural & System Acronyms

| Acronym | Canonical Expansion | Engineering Context |
|:---|:---|:---|
| **RBAC** | Role-Based Access Control | Permission matrix mapping roles (Viewer, Member, Admin, Super Admin) to resources |
| **RLS** | Row-Level Security | PostgreSQL database-level isolation filtering queries by current \`tenant_id\` |
| **JWT** | JSON Web Token | Stateless sliding bearer tokens signed with asymmetric keys (RS256) |
| **MCP** | Model Context Protocol | Standardized RPC protocol allowing AI agents to query specifications and code context |
| **ADR** | Architecture Decision Record | Immutable record documenting significant technical choices and consequences |
| **P95 / P99** | 95th / 99th Percentile | Latency thresholds ensuring the majority of requests meet performance SLAs |
| **ACID** | Atomicity, Consistency, Isolation, Durability | Database transaction guarantees preventing partial data corruption |
`);

  // 4. domain/user_stories.md
  recordFile('domain/user_stories.md', 'Tier 1', 'User Stories & Acceptance Criteria', `---
tier: 1
role: user-stories
depends-on: foundation/brief.md
updated: ${dateStr}
---

# User Stories & Gherkin Acceptance Criteria: ${projectName}

### US-001: Multi-Tenant Registration & Onboarding
**As an** organization manager  
**I want to** register an account with email, password, and company name  
**So that** an isolated workspace and tenant database partition are provisioned automatically.

\`\`\`gherkin
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
\`\`\`

---

### US-002: Core Resource Lifecycle Management
**As an** authenticated team member  
**I want to** create, view, update, and search our operational domain records  
**So that** business operations progress accurately through their lifecycle.

\`\`\`gherkin
Scenario: Create and transition domain resource
  Given an authenticated user with role "member" or "admin"
  When they submit a valid resource payload with title and required attributes
  Then the resource is created in status "draft" linked to the user's "tenant_id"
  When the user executes the "publish" or "activate" mutation
  Then the state machine transitions status to "active"
  And an audit log entry is written with timestamp and user ID
\`\`\`

---

### US-003: Subscription & Automated Billing Management
**As a** tenant administrator  
**I want to** upgrade our plan, manage billing details, and download invoices  
**So that** our team retains uninterrupted access to platform quotas.

\`\`\`gherkin
Scenario: Plan upgrade with webhook confirmation
  Given a tenant administrator on the "free" tier
  When they select the "pro" plan and complete payment via Cashfree / Stripe
  Then an external webhook is received with valid HMAC-SHA256 signature
  And the tenant's plan attribute is upgraded to "pro"
  And the quota limit is immediately adjusted to the pro entitlement
  And an automated tax invoice PDF is generated and emailed to the billing contact
\`\`\`

---

### US-004: Role-Based Access Enforcement
**As a** security administrator  
**I want** unauthorized actions to be blocked before execution  
**So that** sensitive data and administrative controls are protected.

\`\`\`gherkin
Scenario: Viewer attempts mutating action
  Given an authenticated user assigned the role "viewer"
  When they attempt to execute a POST, PUT, or DELETE request on protected resources
  Then the RBAC middleware intercepts the request
  And returns HTTP 403 Forbidden with code "INSUFFICIENT_PERMISSIONS"
  And the violation is recorded in the security audit stream
\`\`\`
`);

  // 5. domain/domain_rules.md
  recordFile('domain/domain_rules.md', 'Tier 1', 'Business Rules & Invariants', `---
tier: 1
role: business-invariants
depends-on: foundation/brief.md
updated: ${dateStr}
---

# Domain Invariants & Business Rules: ${projectName}

> **AI Directive:** These rules are non-negotiable system invariants. Code generation that violates
> any domain rule must be flagged and rejected by automated test assertions.

---

## Invariant Catalog

### DR-001: Zero-Tolerance Multi-Tenant Partitioning
Every database query, insert, update, and delete MUST include an explicit \`tenant_id\` condition.
Cross-tenant data exposure is categorized as a P0 security incident. Database Row-Level Security (RLS) policies serve as defense-in-depth behind application middleware.

### DR-002: Idempotent Payment & Mutation Operations
All payment charges, subscription changes, and mutating API calls must accept an \`Idempotency-Key\` HTTP header.
If a duplicate request is received within 24 hours with an identical key, the server must return the cached original response without re-executing business logic.

### DR-003: Immutability of Security & Financial Audit Logs
Audit log entries (\`audit_logs\`) and completed invoice records are append-only.
No user role, including platform Super Admin, possesses permission to execute \`UPDATE\` or \`DELETE\` statements on audit tables.

### DR-004: Quota & Entitlement Hard Gates
When a tenant consumes 100% of their allocated monthly specification or resource quota, subsequent requests must return \`HTTP 402 Payment Required\` with upgrade links rather than failing silently or causing unexpected charges.

### DR-005: State Machine Transition Integrity
Domain entities must strictly follow defined state machines (e.g. \`draft\` -> \`active\` -> \`completed\` -> \`archived\`).
Direct jumps across unauthorized states (e.g. \`draft\` directly to \`completed\`) must trigger domain validation exceptions.

### DR-006: Soft Deletion & GDPR Scrubbing
Operational entities are marked soft-deleted via \`deleted_at TIMESTAMPTZ\` to preserve relational integrity.
GDPR "Right to be Forgotten" requests anonymize personal identifiers (\`email\`, \`name\`, \`phone\`) while retaining financial records for legal tax obligations.

### DR-007: Concurrency & Optimistic Lock Verification
Mutating updates on shared resources require an incrementing \`version\` integer.
If an update query detects that the current database version does not match the client's submitted version, the transaction aborts with \`HTTP 409 Conflict\`.

${aiDomainInvariants ? `\n---\n\n## Frontier Model Domain Invariants\n\n${aiDomainInvariants}\n` : ''}
`);

  // 6. architecture/system_design.md
  recordFile('architecture/system_design.md', 'Tier 2', 'System Design & Components', `---
tier: 2
role: system-architecture
depends-on: foundation/brief.md · domain/domain_rules.md
updated: ${dateStr}
---

# System Design & Component Architecture: ${projectName}

## 1. System Topology Flowchart

\`\`\`mermaid
flowchart TD
    Client["Client Browser & Mobile UI (${frontend})"]
    CDN["Cloud CDN / WAF / DDoS Shield"]
    Gateway["Edge API Gateway (${apiStyle})"]
    AppService["Application Core Services (${backend})"]
    AuthModule["Argon2id Auth & Session Vault"]
    Workers["Background Queue Workers (BullMQ)"]
    Cache[("Redis 7 Cache & Rate Limiter")]
    DB[("Primary Database (${database})")]
    MCP["Model Context Protocol (MCP) Server"]
    ThirdParty["External Services (Cashfree, SendGrid, S3)"]

    Client -->|HTTPS / TLS 1.3| CDN
    CDN --> Gateway
    Gateway --> AuthModule
    Gateway --> AppService
    AppService --> Cache
    AppService --> DB
    AppService --> Workers
    Workers --> DB
    Workers --> ThirdParty
    MCP --> DB
    MCP --> AppService
\`\`\`

---

## 2. Architectural Subsystems

### Edge API Gateway
- Terminates TLS 1.3 with automated SSL certificate rotation.
- Enforces IP rate limiting and DDoS mitigation via Redis sliding windows.
- Injects standardized correlation IDs (\`X-Request-ID\`) into all request headers.

### Application Core (${backend})
- Structured as a **${archPattern}**.
- Enforces strict separation of concerns: Presentation -> Controller -> Service -> Repository -> Data Access.
- Operates statelessly: all user sessions are verified via JWT and Redis session stores.

### Storage & Persistence Layer (${database})
- PostgreSQL 16 relational database with connection pooling (PgBouncer).
- Multi-tenant partitioning enforced by Row-Level Security (RLS).
- Redis 7 used for L2 query caching, rate limit counters, and queue state.

### Background Queue Worker Fleet
- Asynchronous tasks (email delivery, invoice generation, webhooks, heavy AI spec synthesis) run out-of-band via Redis BullMQ.
- Retries transient errors up to 5 times with exponential backoff and dead-letter queues (DLQ).

${aiSystemDesign ? `\n---\n\n## 3. Frontier Architecture Blueprint Synthesis\n\n${aiSystemDesign}\n` : ''}
`);

  // 7. architecture/data_model.md
  recordFile('architecture/data_model.md', 'Tier 2', 'Canonical Data Model', `---
tier: 2
role: canonical-data-model
depends-on: domain/user_stories.md · domain/domain_rules.md
updated: ${dateStr}
---

# Canonical Data Model & Relational Schema: ${projectName}

## 1. Entity-Relationship Diagram

\`\`\`mermaid
erDiagram
    TENANTS ||--o{ USERS : "has members"
    TENANTS ||--o{ SUBSCRIPTIONS : "subscribes"
    TENANTS ||--o{ INVOICES : "billed"
    TENANTS ||--o{ DOMAIN_RESOURCES : "owns"
    TENANTS ||--o{ AUDIT_LOGS : "logs"
    USERS ||--o{ AUDIT_LOGS : "triggers"
    USERS ||--o{ SESSIONS : "authenticates"

    TENANTS {
        uuid id PK
        string name
        string slug
        string plan
        string status
        timestamptz created_at
    }

    USERS {
        uuid id PK
        uuid tenant_id FK
        string email
        string password_hash
        string role
        string status
        timestamptz created_at
    }

    DOMAIN_RESOURCES {
        uuid id PK
        uuid tenant_id FK
        uuid created_by FK
        string title
        string status
        jsonb metadata
        integer version
        timestamptz created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        string action
        string entity_type
        uuid entity_id
        jsonb diff_data
        string ip_address
        timestamptz created_at
    }
\`\`\`

---

## 2. Relational Entity Specifications

### Entity: \`tenants\`
- \`id\`: UUID (Primary Key, default \`uuid_generate_v4()\`)
- \`name\`: VARCHAR(120) NOT NULL
- \`slug\`: VARCHAR(120) UNIQUE NOT NULL
- \`plan\`: VARCHAR(30) DEFAULT 'free'
- \`status\`: VARCHAR(30) DEFAULT 'active'
- \`settings\`: JSONB DEFAULT '{}'
- \`created_at\`: TIMESTAMPTZ DEFAULT NOW()
- \`updated_at\`: TIMESTAMPTZ DEFAULT NOW()

### Entity: \`users\`
- \`id\`: UUID (Primary Key, default \`uuid_generate_v4()\`)
- \`tenant_id\`: UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
- \`email\`: VARCHAR(255) UNIQUE NOT NULL
- \`password_hash\`: VARCHAR(255) NOT NULL
- \`role\`: VARCHAR(30) DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'member', 'viewer'))
- \`status\`: VARCHAR(30) DEFAULT 'active'
- \`last_login_at\`: TIMESTAMPTZ
- \`created_at\`: TIMESTAMPTZ DEFAULT NOW()

### Entity: \`domain_resources\`
- \`id\`: UUID (Primary Key, default \`uuid_generate_v4()\`)
- \`tenant_id\`: UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
- \`created_by\`: UUID REFERENCES users(id) ON DELETE SET NULL
- \`title\`: VARCHAR(200) NOT NULL
- \`status\`: VARCHAR(50) DEFAULT 'draft'
- \`data\`: JSONB DEFAULT '{}'
- \`version\`: INTEGER DEFAULT 1
- \`created_at\`: TIMESTAMPTZ DEFAULT NOW()
- \`updated_at\`: TIMESTAMPTZ DEFAULT NOW()
`);

  // 8. architecture/security_model.md
  recordFile('architecture/security_model.md', 'Tier 2', 'Security & Auth Model', `---
tier: 2
role: security-and-auth
depends-on: domain/user_stories.md
updated: ${dateStr}
---

# Security & Authentication Model: ${projectName}

## 1. Role-Based Access Control (RBAC) Matrix

| Resource / Action | Viewer | Member | Admin | Super Admin | System Worker |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Read Domain Resources** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Create / Update Resources** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Delete Resources (Soft)** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Manage Billing & Payment** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Invite & Manage Users** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Global System Configs** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Read Immutable Audit Logs** | ❌ | ❌ | ✅ (Tenant) | ✅ (Global) | ❌ |

---

## 2. Authentication & Credential Architecture

- **Password Hashing:** **Argon2id** with memory cost 64MB, time cost 3 iterations, and parallelism 4.
- **Session Tokens:** Stateless JWT tokens signed via asymmetric RS256 private keys.
  - \`access_token\`: 15-minute lifespan stored in memory or short-lived auth header.
  - \`refresh_token\`: 7-day sliding expiration stored in an \`HttpOnly\`, \`SameSite=Strict\`, \`Secure\` cookie.
- **Rotation Policy:** Refresh token reuse triggers immediate invalidation of all active user sessions.
- **CSRF Defense:** Custom request header requirement (\`X-Requested-With: XMLHttpRequest\`) combined with double-submit cookie validation.

---

## 3. Cryptographic Data Protection

- **Data at Rest:** Encrypted using **AES-256-GCM** across all database disk volumes and cloud backups.
- **Data in Transit:** Enforced **TLS 1.3** across all HTTP and WebSocket connections; TLS 1.0/1.1 disabled.
- **Secrets Management:** Environment secrets and API keys managed through cloud vault KMS envelopes.

${aiSecurityModel ? `\n---\n\n## Frontier Model Security Architecture Directives\n\n${aiSecurityModel}\n` : ''}
`);

  // 9. contracts/api_contracts.md
  recordFile('contracts/api_contracts.md', 'Tier 3', 'REST / GraphQL API Contracts', `---
tier: 3
role: api-contracts
depends-on: architecture/data_model.md · architecture/security_model.md
updated: ${dateStr}
---

# REST API Contracts & Endpoint Specifications: ${projectName}

> **Global API Protocol:** All endpoints return standard JSON envelopes formatted as:  
> \`{ "success": boolean, "data"?: any, "error"?: { "code": string, "message": string }, "meta"?: any }\`

---

## 1. Authentication Endpoints

### \`POST /api/v1/auth/register\`
- **Headers:** \`Content-Type: application/json\`
- **Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "StrongPassword123!",
  "companyName": "Acme Logistics"
}
\`\`\`
- **Response (201 Created):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": { "id": "b3e944a1-0001", "email": "jane@company.com", "role": "admin" },
    "tenant": { "id": "t7a109c4-0001", "name": "Acme Logistics", "plan": "pro" },
    "token": "eyJhbGciOiJSUzI1NiIs..."
  }
}
\`\`\`

---

### \`POST /api/v1/auth/login\`
- **Request Body:**
\`\`\`json
{
  "email": "jane@company.com",
  "password": "StrongPassword123!"
}
\`\`\`
- **Response (200 OK):** Returns authenticated user profile and JWT bearer token.

---

## 2. Domain Resource Endpoints

### \`GET /api/v1/resources\`
- **Headers:** \`Authorization: Bearer <token>\`, \`X-Tenant-ID: <uuid>\`
- **Query Params:** \`page=1&limit=20&status=active&search=query\`
- **Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "res_84920482",
      "title": "Production Workstream",
      "status": "active",
      "version": 2,
      "updatedAt": "${dateStr}T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
\`\`\`

### \`POST /api/v1/resources\`
- **Headers:** \`Authorization: Bearer <token>\`, \`Idempotency-Key: <uuid>\`
- **Request Body:** \`{ "title": "New Operational Batch", "data": { "category": "primary" } }\`
- **Response (201 Created):** Created resource record.

${aiApiContracts ? `\n---\n\n## Frontier Model API Contracts\n\n${aiApiContracts}\n` : ''}
`);

  // 10. contracts/database_schema.md
  recordFile('contracts/database_schema.md', 'Tier 3', 'Database Schema & Migrations', `---
tier: 3
role: database-schema
depends-on: architecture/data_model.md
updated: ${dateStr}
---

# Production Database Schema & SQL Migrations: ${projectName}

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    plan VARCHAR(30) DEFAULT 'free' NOT NULL,
    status VARCHAR(30) DEFAULT 'active' NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'member' NOT NULL CHECK (role IN ('super_admin', 'admin', 'member', 'viewer')),
    status VARCHAR(30) DEFAULT 'active' NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Domain Resources table
CREATE TABLE domain_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    data JSONB DEFAULT '{}'::jsonb NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Audit logs table (Append-only)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id UUID,
    diff_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for high-throughput queries
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_resources_tenant_status ON domain_resources(tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_tenant_time ON audit_logs(tenant_id, created_at DESC);

-- Automated updated_at trigger function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON domain_resources FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
\`\`\`

${aiDatabaseSchema ? `\n---\n\n## Frontier Model DDL Migrations\n\n${aiDatabaseSchema}\n` : ''}
`);

  // 11. contracts/ui_contracts.md
  recordFile('contracts/ui_contracts.md', 'Tier 3', 'UI Component & State Contracts', `---
tier: 3
role: ui-contracts
depends-on: architecture/system_design.md
updated: ${dateStr}
---

# UI Contracts, Component Tree & Route Specifications: ${projectName}

## 1. Application Route Hierarchy

| Route Path | View Component | Access Guard | Primary Layout |
|:---|:---|:---|:---|
| \`/\` | \`LandingPage\` | Public | Marketing Navbar & Footer |
| \`/auth/login\` | \`AuthModal (login)\` | Public | Centered Modal Shell |
| \`/auth/register\` | \`AuthModal (register)\` | Public | Centered Modal Shell |
| \`/dashboard\` | \`DashboardOverview\` | Authenticated | App Shell with Top Telemetry & Sidebar |
| \`/wizard\` | \`WizardForm\` | Authenticated | 15-Section Step Navigator |
| \`/preview\` | \`DocumentPreview\` | Authenticated | Spec Tree Split Viewer |
| \`/mcp-hub\` | \`McpHub\` | Authenticated | Agent Key Generator & Log Viewer |
| \`/billing\` | \`ClientBillingPage\` | Role: Admin | Plan Card Grid & Invoice Table |
| \`/admin\` | \`AdminConsole\` | Role: Super Admin | Tabbed SaaS Backoffice |

---

## 2. Design System Tokens & Typography

- **Dark Interface Foundation:** Background \`#05080f\` (slate-950), Box Card \`#0d1117\`, Line Border \`#21262d\`.
- **Accent Brand Color:** \`#38bdf8\` (cyan-400) / \`#6366f1\` (indigo-500).
- **Typography Scale:**
  - Headings: \`font-display\` uppercase tracking \`[0.06em]\`.
  - Body: \`font-sans\` high legibility dark mode contrast.
  - Telemetry & Code: \`font-mono\` with subtle border boxes.

${aiUiContracts ? `\n---\n\n## Frontier Model UI Specifications\n\n${aiUiContracts}\n` : ''}
`);

  // 12. implementation/backend_guide.md
  recordFile('implementation/backend_guide.md', 'Tier 4', 'Backend Engineering Guide', `---
tier: 4
role: backend-guide
depends-on: architecture/system_design.md
updated: ${dateStr}
---

# Backend Engineering & Implementation Guide: ${projectName}

## 1. Modular Directory Layout

\`\`\`
server/
├── src/
│   ├── modules/
│   │   ├── auth/              # Auth controller, Argon2id service, JWT tokens
│   │   ├── tenants/           # Tenant provisioning, RLS context middleware
│   │   ├── resources/         # Core domain controllers, services, repositories
│   │   ├── billing/           # Cashfree webhook handlers, subscription plans
│   │   └── mcp/               # Model Context Protocol RPC handlers
│   ├── shared/
│   │   ├── database/          # Connection pooling, migration runner
│   │   ├── middleware/        # Rate limiting, auth guard, error handler
│   │   └── utils/             # Crypto helpers, validation schemas
│   └── app.ts                 # Express / Fastify server bootstrap
└── tests/
    ├── unit/                  # Vitest service unit tests
    └── integration/           # Supertest API endpoint tests
\`\`\`

---

## 2. Service & Repository Pattern Example

\`\`\`typescript
// src/modules/resources/resource.service.ts
export class ResourceService {
  constructor(private repo: ResourceRepository) {}

  async createResource(tenantId: string, userId: string, dto: CreateResourceDto) {
    // 1. Enforce business rules
    if (!dto.title || dto.title.length < 3) {
      throw new ValidationError('Resource title must be at least 3 characters.');
    }

    // 2. Persist with tenant context
    const resource = await this.repo.create({
      tenantId,
      createdBy: userId,
      title: dto.title,
      status: 'draft',
      version: 1
    });

    return resource;
  }
}
\`\`\`
`);

  // 13. implementation/frontend_guide.md
  recordFile('implementation/frontend_guide.md', 'Tier 4', 'Frontend Engineering Guide', `---
tier: 4
role: frontend-guide
depends-on: contracts/ui_contracts.md
updated: ${dateStr}
---

# Frontend Engineering Guide: ${projectName}

- **Framework:** React 19 with strictly typed TypeScript.
- **State Management:** Modular Zustand or custom React context stores with persistent storage sync.
- **Styling Architecture:** Utility-first Tailwind CSS enforcing brand token consistency.
- **Custom Hook Conventions:**
  - \`useAuth()\`: Returns current authenticated user and session refresh controls.
  - \`useFormDraft()\`: Auto-saves questionnaire state to local storage with restore capabilities.
  - \`useSpecStream()\`: Streams live AI progress events during specification compilation.
- **Accessibility:** Meets WCAG 2.1 AA standards; keyboard navigable with full ARIA attributes.
`);

  // 14. implementation/infrastructure.md
  recordFile('implementation/infrastructure.md', 'Tier 4', 'Infrastructure & Deployment', `---
tier: 4
role: infrastructure
depends-on: architecture/system_design.md
updated: ${dateStr}
---

# Infrastructure, Containerization & CI/CD: ${projectName}

## 1. Production Multi-Stage Dockerfile

\`\`\`dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

---

## 2. GitHub Actions CI/CD Pipeline (\`.github/workflows/deploy.yml\`)

\`\`\`yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run build
      - name: Deploy to Serverbyt StackCP
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ssh.gb.stackcp.com
          username: \${{ secrets.SSH_USER }}
          key: \${{ secrets.SSH_KEY }}
          script: |
            cd ~/srsgenie && git pull origin main && bash deploy.sh
\`\`\`
`);

  // 15. implementation/testing_strategy.md
  recordFile('implementation/testing_strategy.md', 'Tier 4', 'QA & Testing Strategy', `---
tier: 4
role: testing-strategy
depends-on: domain/user_stories.md
updated: ${dateStr}
---

# QA, Testing Strategy & Coverage Gates: ${projectName}

## 1. Testing Pyramid Allocations

- **Unit Tests (70%):** Vitest tests for domain invariants, validation rules, crypto helpers, and state machines.
- **Integration Tests (20%):** Supertest API tests verifying database transactions, RLS filters, and role guards.
- **End-to-End Tests (10%):** Playwright automated browser tests covering login, questionnaire flow, and spec downloads.

---

## 2. Coverage Gates
- Minimum **85% statement coverage** on core business domain logic.
- 100% test passage required before pull requests can merge to \`main\`.

${aiTestingVerification ? `\n---\n\n## Frontier Model Verification Plan\n\n${aiTestingVerification}\n` : ''}
`);

  // 16. implementation/coding_standards.md
  recordFile('implementation/coding_standards.md', 'Tier 4', 'Coding Standards & Style', `---
tier: 4
role: coding-standards
updated: ${dateStr}
---

# Coding Standards & Engineering Hygiene: ${projectName}

- **Strict TypeScript:** \`noImplicitAny: true\`, \`strictNullChecks: true\`.
- **Formatting:** Prettier with 2 spaces, single quotes, and trailing commas.
- **Git Commit Convention:** Conventional Commits (\`feat:\`, \`fix:\`, \`refactor:\`, \`docs:\`, \`test:\`, \`chore:\`).
- **Error Handling:** Never swallow caught exceptions; always log structured context or bubble via custom \`AppError\`.
`);

  // 17. execution/tasks.md
  const tasksMarkdown = dynamicTasks.map(t => `### ${t.id}: ${t.title}
- **Status:** \`${t.status || 'todo'}\` | **Complexity:** \`${t.complexity || 'M'}\` | **Type:** \`${t.type}\`
- **Depends On:** ${t.dependsOn ? `\`${t.dependsOn}\`` : 'None (Genesis Task)'}
${t.fileContext ? `- **File Context:** \`${t.fileContext}\`` : ''}

**Description:**
${t.description}

**Autonomous Agent Execution Prompt:**
> ${t.prompt}
`).join('\n---\n\n');

  recordFile('execution/tasks.md', 'Tier 5', 'Atomic Task Backlog', `---
tier: 5
role: atomic-task-list
depends-on: domain/user_stories.md · architecture/system_design.md
updated: ${dateStr}
---

# Dynamic Implementation Task Backlog: ${projectName}
Total Formulated Tasks: **${dynamicTasks.length}**

${tasksMarkdown}
`);

  // 18. execution/dependency_graph.md
  const mermaidEdges = dynamicTasks
    .filter(t => t.dependsOn)
    .map(t => `    ${t.dependsOn!.replace(/[^a-zA-Z0-9]/g, '')}["${t.dependsOn}"] --> ${t.id.replace(/[^a-zA-Z0-9]/g, '')}["${t.id}: ${t.title.slice(0, 24)}..."]`)
    .join('\n');

  recordFile('execution/dependency_graph.md', 'Tier 5', 'Task Dependency Graph', `---
tier: 5
role: dependency-graph
depends-on: execution/tasks.md
updated: ${dateStr}
---

# Task Execution Dependency Graph (DAG): ${projectName}

\`\`\`mermaid
flowchart TD
${mermaidEdges || '    T001["TASK-001: Genesis Setup"] --> T002["TASK-002: Relational Schema"]'}
\`\`\`
`);

  // 19. execution/sprint_plan.md
  const quarter = Math.ceil(dynamicTasks.length / 4);
  const sprint1Tasks = dynamicTasks.slice(0, quarter).map(t => t.id).join(', ');
  const sprint2Tasks = dynamicTasks.slice(quarter, quarter * 2).map(t => t.id).join(', ');
  const sprint3Tasks = dynamicTasks.slice(quarter * 2, quarter * 3).map(t => t.id).join(', ');
  const sprint4Tasks = dynamicTasks.slice(quarter * 3).map(t => t.id).join(', ');

  recordFile('execution/sprint_plan.md', 'Tier 5', 'Sprint Roadmap', `---
tier: 5
role: sprint-plan
depends-on: execution/tasks.md
updated: ${dateStr}
---

# 4-Sprint Implementation Roadmap: ${projectName}

- **Sprint 1 (Genesis Setup, Database DDL & Scaffolding):** ${sprint1Tasks || 'TASK-001, TASK-002'}.
  - *Target Deliverable:* Initialized repository, database migrations, connection pool, and local container environment.
- **Sprint 2 (Authentication, Security Guards & Core Domain):** ${sprint2Tasks || 'TASK-003, TASK-004'}.
  - *Target Deliverable:* Working Argon2id authentication, JWT sliding sessions, RBAC guards, and core resource services.
- **Sprint 3 (Frontend Interface, Responsive Shell & Billing):** ${sprint3Tasks || 'TASK-005, TASK-006'}.
  - *Target Deliverable:* Complete React 19 application shell, responsive views, Cashfree billing, and webhook receivers.
- **Sprint 4 (MCP Agent Gateway, E2E Testing & Release):** ${sprint4Tasks || 'TASK-007, TASK-008'}.
  - *Target Deliverable:* Live MCP specification server, Playwright automation suites, CI/CD pipeline, and production deployment.
`);

  // 20. state/current_state.md
  recordFile('state/current_state.md', 'State', 'Current System State', `---
tier: state
role: live-state
read: every session, after _index.md
updated: ${dateStr}
---

# Current Operational System State: ${projectName}

- **What's Built & Verified:**
  - Ingested 15-section comprehensive questionnaire.
  - Formulated ${dynamicTasks.length} bespoke atomic tasks with dependency mapping.
  - Synthesized full 22-file canonical specification hierarchy across all 6 tiers.
  - Generated Model Context Protocol (MCP) server endpoints.
- **Immediate Next Action:**
  - Execute **${dynamicTasks[0]?.id || 'TASK-001'}**: ${dynamicTasks[0]?.title || 'Initialize Repository'}.
`);

  // 21. state/decisions_log.md
  recordFile('state/decisions_log.md', 'State', 'Architecture Decision Records (ADR)', `---
tier: state
role: decisions-log
updated: ${dateStr}
---

# Architecture Decision Records (ADR): ${projectName}

### ADR-001: Adoption of 6-Tier Hierarchical Specification Framework
- **Status:** Accepted
- **Context:** Large monolithic specification documents overwhelm LLM context windows and cause hallucination.
- **Decision:** Decompose specifications into 22 atomic, structured files across 6 tiers.
- **Consequences:** AI coding agents load only the specific files relevant to their current task.

### ADR-002: Dynamic Task Decomposition
- **Status:** Accepted
- **Context:** Generic task lists do not reflect bespoke feature selections.
- **Decision:** Dynamically formulate atomic tasks tailored to the 15-section questionnaire.
- **Consequences:** Tasks accurately span setup, relational schema, security guards, feature services, UI shell, MCP server, and tests.

### ADR-003: Multi-Tenant Row-Level Security
- **Status:** Accepted
- **Context:** Ensuring zero-bleed data isolation in multi-tenant environments.
- **Decision:** Implement PostgreSQL Row-Level Security (RLS) linked to session \`tenant_id\`.
- **Consequences:** Database enforces tenant separation even if application queries omit where clauses.

### ADR-004: Stateless Authentication with Refresh Token Rotation
- **Status:** Accepted
- **Context:** Balancing security and horizontal scalability.
- **Decision:** Use short-lived JWTs (15 mins) with rotating refresh tokens stored in HttpOnly cookies.
- **Consequences:** Eliminates central session bottleneck while enabling immediate session revocation.

### ADR-005: Model Context Protocol (MCP) Live Agent Gateway
- **Status:** Accepted
- **Context:** Allowing Cursor, Windsurf, and Claude Code to autonomously query live specs.
- **Decision:** Expose a standardized MCP server endpoint delivering file contents and task checklists.
- **Consequences:** Autonomous agents can code continuously with live context sync.
`);

  // 22. state/known_issues.md
  recordFile('state/known_issues.md', 'State', 'Known Issues & Tech Debt', `---
tier: state
role: tech-debt-and-bugs
updated: ${dateStr}
---

# Known Issues & Technical Debt Registry: ${projectName}

1. **Local Storage Capacity Limits:** When managing very large project suites (>5MB), local browser storage must synchronize with persistent PostgreSQL/SQLite storage.
2. **Third-Party Payment Gateway Webhook Latency:** Payment webhooks may experience network jitter; idempotency keys and retry workers must process webhooks asynchronously.
3. **Multi-Region Latency Optimization:** In v1, database traffic routes to a single primary region; multi-region read replicas are slated for v2.0.
`);

  return files;
}
