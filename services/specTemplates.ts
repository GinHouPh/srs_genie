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
  recordFileCallback?: (path: string, tier: string, title: string, content: string) => void
): Record<string, string> {
  const files: Record<string, string> = {};
  const recordFile = (path: string, tier: string, title: string, content: string) => {
    files[path] = content;
    if (recordFileCallback) {
      recordFileCallback(path, tier, title, content);
    }
  };

  const fd = input.formData || {};
  const projectName = input.name || (fd['project_overview']?.['project_name'] as string) || 'Modern Web Application';
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
  const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
  const projectSummary = (fd['project_overview']?.['project_summary'] as string) || '';
  const attachedFileName = (fd['project_overview']?.['project_summary_file_name'] as string) || '';
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

  // 0. AGENTS.md (Root Universal Manifest)
  recordFile('AGENTS.md', 'Root', 'Universal Agent Directives & Universal Manifest', `# AGENTS.md — Autonomous Agent Directives & Universal Manifest: ${projectName}

> **Mandatory Reading for All AI Agents:**  
> This repository operates under a cross-platform, multi-agent engineering specification system.
> Before taking any action, inspecting code, or making edits, you MUST read and follow the master navigation index at \`.specs/_index.md\` and the coordination protocol at \`.specs/coordination/protocol.md\`.

---

## 1. Core Operating Principles
1. **Never Infer Unstated Requirements:** Authoritative truth flows strictly from \`.specs/foundation/brief.md\` and downstream tier specifications.
2. **Never Write Without a Confirmed Lease:** You must claim an unblocked task on \`.specs/coordination/task_board.md\` and announce it in your session stream before modifying any file.
3. **Respect File Scope Boundaries:** Only touch files explicitly declared under your task's \`Scope boundary: INCLUDED\` list. Modifying files outside your boundary is a critical protocol violation.
4. **Isolate Concurrent Work:** Always work inside an independent Git worktree (\`agent/{session_id}\`). Never edit directly on the shared \`main\` trunk.
5. **Evidence-Based Completion:** Never mark a task \`done\` without providing reproducible test commands, test logs, and acceptance verification in your completion report.

---

## 2. Fast Bootstrap Commands
- **Install Dependencies:** \`npm install\` (Use clean install: \`npm ci --prefer-offline\`)
- **Lint & Static Typecheck:** \`npm run lint\` && \`npx tsc --noEmit\`
- **Unit & Integration Tests:** \`npm test\`
- **Build Production Bundle:** \`npm run build\`
- **Local Sandbox Server:** \`npm run dev\`

---

## 3. Specification Navigation Index
- **Master Index & Cascade Rules:** \`.specs/_index.md\`
- **Agent Onboarding Guide:** \`.specs/agents/onboarding.md\`
- **Multi-Agent Coordination Protocol:** \`.specs/coordination/protocol.md\`
- **Active Task Board:** \`.specs/coordination/task_board.md\`
- **Agent Session Registry:** \`.specs/coordination/agent_registry.md\`
- **Current System State:** \`.specs/state/current_state.md\`
- **Architectural Decision Records (ADRs):** \`.specs/state/decisions_log.md\`
`);

  // 1. _index.md
  recordFile('_index.md', 'Entry', 'Project Index & Navigation Manifest', `---
tier: entry
role: multi-agent-navigation-manifest
read: every session, before any other file
updated: ${dateStr}
---

# Project Index & Multi-Agent Runbook: ${projectName}

> **Autonomous AI Agent Instruction:**  
> Read this file first (or \`AGENTS.md\` at repository root). Do not read any other file until you have parsed the full file table below.
> Next, read \`coordination/protocol.md\` and check \`coordination/task_board.md\` before claiming or modifying any work.
> Always read \`state/current_state.md\` immediately after this file to understand active session streams.

---

## Executive Project Summary

**${projectName}** is an enterprise-grade ${projectType.toLowerCase()} engineered for the **${industry}** sector.
It provides ${targetUsers} with high-throughput workflows, real-time collaboration, and bulletproof security isolation.
${projectSummary.trim() ? `\n> **Authoritative Build Vision:**  \n> ${projectSummary.trim().replace(/\n+/g, ' ').slice(0, 320)}${projectSummary.trim().length > 320 ? '...' : ''}\n` : ''}
- **Architecture Classification:** ${archPattern}
- **API Standard:** ${apiStyle}
- **Core Technology Stack:** ${backend} · ${database} · ${frontend}
- **Hosting & Infrastructure:** ${hosting}
- **Target Release Timeline:** ${timeline} | **Budget Scope:** ${budget}
- **Dynamic Task Backlog:** ${dynamicTasks.length} atomic implementation tasks formulated

---

## Spec File Map

| File | Tier | Contains | When to read |
|------|------|----------|--------------|
| \`foundation/brief.md\` | 0 | Product vision, constraints, non-negotiables | Always — first spec read |
| \`foundation/glossary.md\` | 0 | Canonical terms and definitions | Before writing any spec or code |
| \`domain/user_stories.md\` | 1 | User roles, stories, acceptance criteria | When generating tasks or tests |
| \`domain/domain_rules.md\` | 1 | Business invariants and logic constraints | Before generating business logic |
| \`architecture/system_design.md\` | 2 | Component map, patterns, communication style | When designing or debugging architecture |
| \`architecture/data_model.md\` | 2 | Canonical entities, fields, relationships | Before touching schema or API |
| \`architecture/security_model.md\` | 2 | Auth strategy, roles, permission matrix | Before generating auth code or endpoints |
| \`contracts/api_contracts.md\` | 3 | Endpoint definitions, request/response schemas | When generating backend routes or frontend calls |
| \`contracts/database_schema.md\` | 3 | Table definitions, indexes, migrations | When generating DB code or migrations |
| \`contracts/ui_contracts.md\` | 3 | Component props, state, events, routes | When generating frontend components |
| \`implementation/backend_guide.md\` | 4 | Folder layout, service patterns, code conventions | When writing backend code |
| \`implementation/frontend_guide.md\` | 4 | Component structure, routing, state management | When writing frontend code |
| \`implementation/infrastructure.md\` | 4 | Cloud, environments, CI/CD, env vars | When writing deploy configs |
| \`implementation/testing_strategy.md\` | 4 | Coverage targets, test patterns, mocking rules | When writing tests |
| \`implementation/coding_standards.md\` | 4 | Naming, formatting, PR process | Before writing any code |
| \`execution/tasks.md\` | 5 | Master canonical task list with multi-agent scope & leases | When planning work breakdown |
| \`execution/dependency_graph.md\` | 5 | Task dependency map & parallel groups | When determining task ordering |
| \`execution/sprint_plan.md\` | 5 | Multi-agent sprint allocations and active milestones | When starting a sprint milestone |
| \`coordination/protocol.md\` | coord | Multi-agent collaboration protocol & claiming rules | Mandatory before claiming any task |
| \`coordination/task_board.md\` | coord | Live task board with active leases & claimants | When picking an unblocked task |
| \`coordination/agent_registry.md\` | coord | Ledger of active and historical agent sessions | At session start, heartbeat, and exit |
| \`coordination/messages/\` | coord | Append-only message streams per agent session | When announcing claims, handoffs, or milestones |
| \`agents/onboarding.md\` | runbook | Step-by-step agent bootstrap and worktree setup | When initializing a new agent session |
| \`agents/lifecycle.md\` | runbook | 6-phase agent lifecycle from bootstrap to completion | To follow standard execution phases |
| \`agents/task_execution.md\` | runbook | Bounded implementation and scope enforcement rules | During active task implementation |
| \`agents/communication.md\` | runbook | Message schemas and cross-agent event standards | When posting messages or handoffs |
| \`agents/verification.md\` | runbook | Evidence-based completion and peer review guide | When validating work before PR submission |
| \`agents/conflict_resolution.md\` | runbook | Concurrency, collision, and contract drift recovery | When resolving conflicts or stale state |
| \`state/current_state.md\` | state | Multi-session workstreams, health, confirmed state | Every session — read after this file |
| \`state/decisions_log.md\` | state | Architecture Decision Records (append-only with attribution) | Before making any architectural change |
| \`state/known_issues.md\` | state | Bugs, tech debt, deferred decisions | Before touching affected areas |

---

## Regeneration rules

> If an upstream specification file changes, regenerate all files that depend on it. Do not edit derived files directly.

\`\`\`
brief.md changed          → regenerate everything below Tier 0
glossary.md changed       → review all files for term consistency
data_model.md changed     → regenerate database_schema.md + api_contracts.md + ui_contracts.md
api_contracts.md changed  → regenerate ui_contracts.md + update testing_strategy.md + notify frontend/backend agents
user_stories.md changed   → regenerate tasks.md + testing_strategy.md + update task_board.md
\`\`\`

---

## Multi-Agent Session Protocol

1. Read \`AGENTS.md\` (root) and \`_index.md\` (this file).
2. Execute onboarding: generate \`session_id\`, spin up isolated Git worktree (\`agent/{session_id}\`), and register in \`coordination/agent_registry.md\`.
3. Read \`state/current_state.md\` and check active sessions.
4. Scan \`coordination/task_board.md\` and select an unblocked \`todo\` task matching your capabilities.
5. Secure lease via atomic commit/push; announce \`TASK_CLAIMED\` in your message stream (\`coordination/messages/{session_id}.messages.md\`).
6. Read the tier files listed in your task's \`Spec refs\`.
7. Execute implementation strictly within the task's \`Scope boundary: INCLUDED\` files.
8. Validate implementation: run tests, verify acceptance criteria, compile completion evidence.
9. Publish \`TASK_COMPLETED\` with evidence, submit PR to \`main\`, and update \`state/current_state.md\`.
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

${projectSummary.trim() ? `### User-Provided Build Specification & Project Summary
${attachedFileName ? `> *Source Document: Attached file \`${attachedFileName}\`*\n\n` : ''}${projectSummary.trim()}

` : ''}### Core Value Drivers:
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
**Status:** ${t.status || 'todo'}  
**Complexity:** ${t.complexity || 'M'}  
**Governs:** ${t.governs || 'US-001 · DR-001'}  
**Spec refs:** ${(t.specRefs && t.specRefs.length > 0) ? t.specRefs.map(r => `\`${r}\``).join(' · ') : '`implementation/coding_standards.md` · `contracts/api_contracts.md`'}  
**Depends on:** ${t.dependsOn || '—'}  
**Required capabilities:** ${(t.requiredCapabilities && t.requiredCapabilities.length > 0) ? t.requiredCapabilities.map(c => `\`${c}\``).join(', ') : '`backend`'}  
**Claimed by:** ${t.claimedBy || '—'}  
**Claimed at:** ${t.claimedAt || '—'}  
**Lease expires:** ${t.leaseExpires || '—'}  
**Scope boundary:**  
- **INCLUDED:** ${(t.scopeIncluded && t.scopeIncluded.length > 0) ? t.scopeIncluded.map(p => `\`${p}\``).join(', ') : `\`${t.fileContext || 'src/'}\``}  
- **EXCLUDED:** ${(t.scopeExcluded && t.scopeExcluded.length > 0) ? t.scopeExcluded.map(p => `\`${p}\``).join(', ') : '`.specs/**`'}  
**Verification target:** ${t.verificationTarget || 'npm test and npm run build succeed with 0 errors.'}  
**Review required:** ${t.reviewRequired ? 'yes' : 'no'}  
**Reviewer:** ${t.reviewer || '—'}  
**Completion evidence:** ${t.completionEvidence || '—'}  
${t.notes ? `**Notes:** ${t.notes}  \n` : ''}
**Description:**
${t.description}

**Autonomous Agent Execution Prompt:**
> ${t.prompt}
`).join('\n---\n\n');

  const taskIndexTable = dynamicTasks.map(t => `| ${t.id} | ${t.title.slice(0, 36)} | ${t.type} | ${t.status || 'todo'} | ${t.complexity || 'M'} | ${t.dependsOn || '—'} | ${(t.requiredCapabilities || ['backend']).map(c => `\`${c}\``).join(', ')} |`).join('\n');

  recordFile('execution/tasks.md', 'Tier 5', 'Master Canonical Task Backlog', `---
tier: 5
role: canonical-task-list
depends-on: all Tier 4 guides · domain/user_stories.md
feeds-into: execution/sprint_plan.md · coordination/task_board.md · state/current_state.md
owner: AI-generated · human-curated priorities
updated: ${dateStr}
---

# Master Task List & Work Breakdown: ${projectName}

> AI instruction: This is the canonical work breakdown for the project.
> For active execution and claiming, refer to \`.specs/coordination/task_board.md\`.
> Never start a task whose dependencies are not marked \`done\`.
> Every task must be executed strictly within its declared \`Scope boundary: INCLUDED\` files.

---

## Status Values
\`todo\` · \`claimed\` · \`in-progress\` · \`review\` · \`done\` · \`blocked\` · \`abandoned\`

## Complexity Values
\`XS\` (< 1h) · \`S\` (1–3h) · \`M\` (3–6h) · \`L\` (1–2d) · \`XL\` (2–5d — must be decomposed)

---

## Detailed Task Manifests (${dynamicTasks.length} Formulated Tasks)

${tasksMarkdown}

---

## Task Index

| ID | Title | Phase | Status | Complexity | Depends on | Required Capabilities |
|----|-------|:---:|:---:|:---:|:---:|:---:|
${taskIndexTable}
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
  const sprint1List = dynamicTasks.slice(0, Math.min(quarter, 6));
  const sprint2List = dynamicTasks.slice(quarter, quarter + Math.min(quarter, 6));
  const sprint1Rows = sprint1List.map(t => `| \`${t.id}\` | ${t.title.slice(0, 32)} | P0 | ${(t.requiredCapabilities || ['devops']).map(c => `\`${c}\``).join(', ')} | — | — | ${t.status || 'todo'} |`).join('\n');

  recordFile('execution/sprint_plan.md', 'Tier 5', 'Sprint Roadmap', `---
tier: 5
role: current-sprint-scope
depends-on: execution/tasks.md · execution/dependency_graph.md · coordination/task_board.md
feeds-into: state/current_state.md
owner: human-curated · AI-drafted
updated: ${dateStr}
---

# Sprint Plan (Multi-Agent Scope): ${projectName}

> AI instruction: When asked "what should I work on next?", check this file and \`coordination/task_board.md\`.
> Only claim tasks listed as In Scope below. If a task not in this sprint is needed
> to complete a sprint task, flag it via a message rather than pulling it in silently.

---

## Current Sprint

**Sprint:** Sprint 1 — MVP Foundation  
**Start:** ${dateStr}  
**Goal:** Establish repository infrastructure, database containerization, initial migration, and secure authentication endpoints.

---

## In Scope

| Task ID | Title | Priority | Required Capabilities | Claimed By (Session ID) | Worktree Branch | Status |
|:--- |:--- |:---:|:--- |:--- |:--- |:---:|
${sprint1Rows}

---

## Out of Scope this Sprint

> Explicitly excluded — do not start these even if time allows.

- Feature tasks beyond Sprint 1 (${sprint2List.map(t => `\`${t.id}\``).join(', ')}) — Deferred to Sprint 2
- Production deployment scripts — Deferred to Release Sprint

---

## Sprint Notes

- Multi-agent teams must adhere to \`.specs/coordination/protocol.md\`.
- \`${dynamicTasks[0]?.id || 'TASK-001'}\` must be completed and merged before subsequent tasks can be claimed.
- Core features begin once foundations pass verification gates.

---

## Multi-Agent Definition of Done

- [ ] All in-scope tasks marked \`done\` in \`coordination/task_board.md\`.
- [ ] Every completed task includes verified completion evidence per \`agents/verification.md\`.
- [ ] Peer reviews executed and approved for all Tier 2/3 impacted tasks.
- [ ] CI pipeline passes on \`main\` branch with zero regressions.
`);

  // 20. coordination/protocol.md
  recordFile('coordination/protocol.md', 'Coordination', 'Multi-Agent Coordination Protocol', `---
tier: coordination
role: multi-agent-collaboration-protocol
read: mandatory before claiming or executing any task
updated: ${dateStr}
---

# Multi-Agent Coordination Protocol: ${projectName}

> AI instruction: This document defines the non-negotiable rules of engagement for all AI coding agents working on this project.
> No agent is permitted to write or edit source code without an active, confirmed task claim secured through this protocol.
> Violation of scope boundaries or silent contract alteration will result in automated rejection during peer review and CI integration.

---

## 1. Identity & Session Conventions

### 1.1 Agent Identity vs. Session Identity
- **Platform Identity:** The vendor or runtime executing the code (e.g. \`codex\`, \`claude-code\`, \`cursor\`, \`windsurf\`, \`gemini-cli\`, \`copilot\`, \`antigravity\`).
- **Session Identity (\`session_id\`):** A unique, deterministic string generated at startup representing this specific execution instance.
  
Format:
\`\`\`
{platform_short}-{YYYYMMDD}-{HHMMSS}
\`\`\`
Platform Prefix Map:
- \`cx\` = OpenAI Codex CLI / Desktop
- \`cc\` = Claude Code (Anthropic)
- \`cr\` = Cursor IDE Agent
- \`ws\` = Windsurf / Cascade (Codeium)
- \`gm\` = Google Gemini CLI / Jules
- \`cp\` = GitHub Copilot Coding Agent
- \`ag\` = Google Antigravity Agent
- \`xx\` = Generic / Custom Coding Agent

*Example:* \`cc-20261123-143022\`

---

## 2. Workspace Isolation: Git Worktrees

To prevent filesystem conflicts, \`index.lock\` collisions, and partial file reads between concurrent agents:
1. Every session **must** create its own isolated Git worktree:
   \`\`\`bash
   git fetch origin main
   git worktree add -b agent/{session_id} ../wt-{session_id} origin/main
   \`\`\`
2. The agent executes all commands, edits, and test runs strictly inside its dedicated worktree directory (\`../wt-{session_id}\`).
3. The main working directory and \`main\` branch are strictly read-only trunks merged only via Pull Requests.

---

## 3. Task Claiming & Lease Protocol

### 3.1 Eligibility Check
Before claiming a task from \`.specs/coordination/task_board.md\`, the agent must verify:
- Task status is \`todo\`.
- All prerequisite tasks listed under \`Depends on\` are marked \`done\` on \`main\`.
- The task's \`Required Capabilities\` match the agent's declared skills.
- The task's \`Scope boundary: INCLUDED\` does not intersect with any actively running task's included files.

### 3.2 Atomic Push Claim
To guarantee distributed, race-condition-free claiming without requiring a centralized database:
1. Agent edits \`.specs/coordination/task_board.md\` setting:
   - \`Status: claimed\`
   - \`Claimed by: {session_id}\`
   - \`Claimed at: {UTC ISO timestamp}\`
   - \`Lease expires: {Claimed at + 4 hours}\`
2. Agent commits and attempts to push to the coordination tracking branch:
   \`\`\`bash
   git commit -m "chore(claim): TASK-NNN by {session_id}"
   git push origin agent/{session_id}
   \`\`\`
3. If the push or subsequent PR fails due to a concurrent write collision:
   - Run \`git pull --rebase\`.
   - If another agent has claimed the target task, abort your claim immediately, revert your local board change, and pick another unblocked task.

### 3.3 Lease Durations & Heartbeats
- **Default Lease:** 4 hours from the claim timestamp.
- **Heartbeat Requirement:** Agents working on long tasks should publish a \`SESSION_HEARTBEAT\` message every 30–60 minutes in their message stream.
- **Stale Claim Reclaim:** If a task remains \`claimed\` or \`in-progress\` for > 4 hours with no active heartbeat or PR activity, any newly joined agent may reclaim the task by logging a \`TASK_RECLAIMED\` notice and resetting the lease.

---

## 4. Scope Boundary Enforcement

Every task defines strict scope boundaries:
- **\`Scope boundary: INCLUDED\`:** The exact files and directories the agent is authorized to create or edit.
- **\`Scope boundary: EXCLUDED\`:** Files the agent must NEVER modify directly (e.g. shared configs, database schemas, API contracts, specification files).

> **Enforcement Rule:** A Pull Request that modifies files outside the task's \`INCLUDED\` boundary will fail independent peer review and will be rejected with \`REVISION_REQUIRED\`.

---

## 5. Contract Change Protocol

If an agent discovers that implementing its assigned task requires changing an approved shared contract (e.g. \`api_contracts.md\`, \`database_schema.md\`, \`data_model.md\`):
1. **Never edit the contract silently.**
2. Post a \`CONTRACT_CHANGE_PROPOSED\` message in your session message stream detailing:
   - The exact proposed change.
   - The architectural justification.
   - Which other tasks/agents are impacted.
3. Pause implementation of the affected interface until a human or designated architecture agent approves the change and updates the authoritative spec.

---

## 6. Communication & Logging Standards

- Agents communicate exclusively through append-only markdown streams in \`.specs/coordination/messages/\`.
- Every agent writes **only** to \`.specs/coordination/messages/{session_id}.messages.md\`.
- No agent ever edits or overwrites another agent's message file.
- All messages follow the schemas specified in \`.specs/agents/communication.md\`.
`);

  // 21. coordination/task_board.md
  const todoCount = dynamicTasks.filter(t => !t.status || t.status === 'todo').length;
  const claimedCount = dynamicTasks.filter(t => t.status === 'claimed').length;
  const inProgressCount = dynamicTasks.filter(t => t.status === 'in-progress').length;
  const reviewCount = dynamicTasks.filter(t => t.status === 'review').length;
  const doneCount = dynamicTasks.filter(t => t.status === 'done').length;
  const blockedCount = dynamicTasks.filter(t => t.status === 'blocked').length;

  const taskBoardRows = dynamicTasks.map(t =>
    `| \`${t.id}\` | ${t.title.slice(0, 36)} | ${t.status || 'todo'} | ${t.complexity || 'M'} | ${t.claimedBy || '—'} | ${t.leaseExpires || '—'} | ${t.dependsOn ? `\`${t.dependsOn}\`` : '—'} | ${t.reviewer || '—'} |`
  ).join('\n');

  const taskManifestsBoard = dynamicTasks.map(t => `### ${t.id}: ${t.title}
- **Status:** ${t.status || 'todo'}
- **Complexity:** ${t.complexity || 'M'}
- **Governs:** ${t.governs || 'US-001 · DR-001'}
- **Spec refs:** ${(t.specRefs && t.specRefs.length > 0) ? t.specRefs.map(r => `\`${r}\``).join(' · ') : '`implementation/coding_standards.md` · `contracts/api_contracts.md`'}
- **Depends on:** ${t.dependsOn || '—'}
- **Required capabilities:** ${(t.requiredCapabilities && t.requiredCapabilities.length > 0) ? t.requiredCapabilities.map(c => `\`${c}\``).join(', ') : '`backend`'}
- **Claimed by:** ${t.claimedBy || '—'}
- **Claimed at:** ${t.claimedAt || '—'}
- **Lease expires:** ${t.leaseExpires || '—'}
- **Scope boundary:**
  - **INCLUDED:**
${(t.scopeIncluded || ['src/**']).map(p => `    - \`${p}\``).join('\n')}
  - **EXCLUDED:**
${(t.scopeExcluded || ['.specs/**']).map(p => `    - \`${p}\``).join('\n')}
- **Verification target:** ${t.verificationTarget || 'npm test and npm run build succeed with zero errors.'}
- **Review required:** ${t.reviewRequired ? 'yes' : 'no'}
- **Reviewer:** ${t.reviewer || '—'}
- **Completion evidence:** ${t.completionEvidence || '—'}
${t.notes ? `- **Notes:** ${t.notes}\n` : ''}`).join('\n---\n\n');

  recordFile('coordination/task_board.md', 'Coordination', 'Live Task Board & Active Leases', `---
tier: coordination
role: live-task-board
read: before selecting or claiming any task
updated: ${dateStr}
---

# Live Task Board: ${projectName}

> AI instruction: Use this board to identify unblocked tasks, check current ownership, and manage task leases.
> Before starting work on any task, secure your claim following \`.specs/coordination/protocol.md\` §3.
> Always check that \`Blocked by\` dependencies are marked \`done\` before claiming.

---

## 1. Task Summary Metrics

| Total Tasks | Todo | Claimed | In Progress | In Review | Done | Blocked |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ${dynamicTasks.length} | ${todoCount} | ${claimedCount} | ${inProgressCount} | ${reviewCount} | ${doneCount} | ${blockedCount} |

---

## 2. Active Task Table

| Task ID | Title | Status | Complexity | Claimed By | Lease Expires (UTC) | Blocked By | Reviewer |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
${taskBoardRows}

---

## 3. Detailed Task Manifests

${taskManifestsBoard}
`);

  // 22. coordination/agent_registry.md
  recordFile('coordination/agent_registry.md', 'Coordination', 'Agent Session Registry', `---
tier: coordination
role: agent-session-registry
read: start and end of every session
updated: ${dateStr}
---

# Agent Session Registry: ${projectName}

> AI instruction: Every agent session must register itself in the table below upon initialization.
> Format your \`Session ID\` as \`{platform}-{YYYYMMDD}-{HHMMSS}\` (see \`.specs/coordination/protocol.md\` §1).
> Update your \`Last Heartbeat\` and \`Status\` during execution, and mark your session \`completed\` before exiting.

---

## Active & Historical Sessions

| Session ID | Platform | Agent Role | Worktree Branch | Status | Started At (UTC) | Last Heartbeat (UTC) | Current Task |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| \`example-session-001\` | Antigravity | orchestrator | \`main\` | completed | ${dateStr}T10:00:00Z | ${dateStr}T10:45:00Z | — |

---

## Session Status Definitions
- \`active\`: Session is actively computing, editing, or executing tests.
- \`idle\`: Session is initialized or waiting on peer review / contract decision.
- \`completed\`: Session has finished all claimed work, submitted PRs, and exited cleanly.
- \`abandoned\`: Session exceeded the 4-hour lease threshold with no heartbeat or activity.

---

## Heartbeat & Recovery Guidelines
1. **Heartbeat Cadence:** Update your \`Last Heartbeat\` timestamp every 30 to 60 minutes if working on long-running tasks.
2. **Crash Detection:** If an agent session has no heartbeat update for > 4 hours and holds an active task claim, any newly initializing agent may mark that session \`abandoned\` and reclaim the task per \`.specs/coordination/protocol.md\` §3.3.
`);

  // 23. coordination/messages/.gitkeep
  recordFile('coordination/messages/.gitkeep', 'Coordination', 'Message Stream Directory Marker', `# Directory for per-session append-only agent message logs (.specs/coordination/messages/{session_id}.messages.md)\n`);

  // 24. agents/onboarding.md
  recordFile('agents/onboarding.md', 'Agents', 'Agent Onboarding Runbook', `---
tier: agents
role: agent-onboarding-runbook
read: first action of any new agent joining the repository
updated: ${dateStr}
---

# Agent Onboarding Runbook: ${projectName}

> AI instruction: Follow this exact 5-step checklist whenever you start a new session or join this project repository.
> Do not begin inspecting code or editing files until Step 5 is completed.

---

## Step 1: Establish Your Session Identity
Generate your unique \`session_id\` using the platform prefix and UTC timestamp:
\`\`\`text
{platform_prefix}-{YYYYMMDD}-{HHMMSS}
\`\`\`
*Platform Prefixes:*
\`cx\` (Codex), \`cc\` (Claude Code), \`cr\` (Cursor), \`ws\` (Windsurf), \`gm\` (Gemini CLI), \`cp\` (Copilot), \`ag\` (Antigravity), \`xx\` (Other).

*Example:* \`cc-20261123-143022\`

---

## Step 2: Create Your Isolated Git Worktree
Never work directly in the root repository directory or on the \`main\` branch.
Run the following shell commands:
\`\`\`bash
# Fetch latest repository state
git fetch origin main

# Create a clean worktree on a new branch named after your session
git worktree add -b agent/{session_id} ../wt-{session_id} origin/main

# Change directory into your worktree
cd ../wt-{session_id}

# Install dependencies offline/cached
npm ci --prefer-offline
\`\`\`

---

## Step 3: Register in the Agent Session Registry
Open \`.specs/coordination/agent_registry.md\` and append your session entry to the **Active & Historical Sessions** table:
\`\`\`markdown
| \`{session_id}\` | {Platform Name} | {Role/Specialization} | \`agent/{session_id}\` | active | {UTC Start Time} | {UTC Start Time} | — |
\`\`\`

---

## Step 4: Initialize Your Message Stream
Create a dedicated append-only message file at:
\`\`\`text
.specs/coordination/messages/{session_id}.messages.md
\`\`\`
Add the header block and emit your initial \`SESSION_STARTED\` message:
\`\`\`markdown
# Session Message Stream: {session_id}
**Platform:** {Platform Name}  
**Started:** {UTC Start Time}  
**Worktree:** agent/{session_id}  

---

## MSG-001: SESSION_STARTED
- **Timestamp:** {UTC Start Time}
- **Task:** none
- **Priority:** info
- **Payload:**
  Agent session initialized on branch \`agent/{session_id}\`. Worktree created. Onboarding completed.
\`\`\`

---

## Step 5: Read Current State & Select Task
1. Read \`.specs/_index.md\` and \`.specs/state/current_state.md\`.
2. Open \`.specs/coordination/task_board.md\` and claim an unblocked task per \`.specs/coordination/protocol.md\` §3.
`);

  // 25. agents/lifecycle.md
  recordFile('agents/lifecycle.md', 'Agents', 'Agent Session Lifecycle', `---
tier: agents
role: agent-lifecycle-runbook
read: during every stage of session execution
updated: ${dateStr}
---

# Agent Session Lifecycle: ${projectName}

> AI instruction: All agents must execute their tasks following the 6 sequential phases defined below.
> Never skip phases or advance to task completion without satisfying verification gates.

---

## Lifecycle Overview

\`\`\`
Phase 1: Bootstrap & Orient  ──►  Phase 2: Task Claiming  ──►  Phase 3: Bounded Implementation
             ▲                                                               │
             │ (Recovery/Rebase)                                             ▼
Phase 6: Rebase & Recover    ◄──  Phase 5: Evidence & Done  ◄──  Phase 4: Verification & Audit
\`\`\`

---

## Phase 1: Bootstrap & Orient
1. Execute \`.specs/agents/onboarding.md\` steps (generate \`session_id\`, create worktree, register session, create message log).
2. Read \`.specs/_index.md\`, \`.specs/coordination/protocol.md\`, and \`.specs/state/current_state.md\`.
3. Check \`.specs/state/decisions_log.md\` for past architectural decisions (ADRs) that constrain the project.

---

## Phase 2: Task Selection & Claiming
1. Inspect \`.specs/coordination/task_board.md\`.
2. Filter for tasks with \`Status: todo\` whose \`Blocked by\` dependencies are marked \`done\`.
3. Select a task matching your capabilities (\`Required capabilities\`).
4. Secure the lease:
   - Edit \`.specs/coordination/task_board.md\` setting status to \`claimed\`, your \`session_id\`, and \`lease_expires\` (+4 hours).
   - Commit and push to \`agent/{session_id}\`.
   - If a merge/push conflict occurs because another agent claimed first, pull rebase and pick another unblocked task.
5. Emit \`TASK_CLAIMED\` in your message stream.

---

## Phase 3: Bounded Implementation
1. Read all specification files cited under the task's \`Spec refs\` field.
2. Formulate an internal implementation plan.
3. Review the task's \`Scope boundary: INCLUDED\` and \`EXCLUDED\` lists.
4. Modify and create files **strictly within** the \`INCLUDED\` boundary.
5. Never edit \`EXCLUDED\` files. If a shared contract change is needed, emit \`CONTRACT_CHANGE_PROPOSED\` and wait for sign-off.
6. Post a \`PROGRESS_UPDATE\` message when reaching major milestones.

---

## Phase 4: Verification & Audit
1. Run local test suites:
   \`\`\`bash
   npm test
   npm run lint
   npx tsc --noEmit
   \`\`\`
2. Check that the task's specific \`Verification target\` is completely met.
3. Verify that all domain rules (DR-NNN) and acceptance criteria (AC-NNN) governed by the task pass without regressions.
4. Compile the mandatory **Completion Evidence Block** (see \`.specs/agents/verification.md\`).

---

## Phase 5: Completion & Handoff
1. Publish \`TASK_COMPLETED\` with full evidence block to your message stream.
2. Update \`.specs/coordination/task_board.md\` setting status to \`done\` (or \`review\` if review is required).
3. Update \`.specs/state/current_state.md\` recording completed work in your active session workstream.
4. Push your branch and open a Pull Request targeting \`main\`.
5. If exiting session, update \`.specs/coordination/agent_registry.md\` setting status to \`completed\`.

---

## Phase 6: Conflict Recovery & Rebase
If PR integration or lease check encounters a collision:
- Follow \`.specs/agents/conflict_resolution.md\` to rebase cleanly or release lease.
`);

  // 26. agents/task_execution.md
  recordFile('agents/task_execution.md', 'Agents', 'Bounded Task Execution Guide', `---
tier: agents
role: task-execution-guide
read: during Phase 3 implementation
updated: ${dateStr}
---

# Bounded Task Execution Guide: ${projectName}

> AI instruction: This guide governs the code writing process.
> Adhere strictly to scope boundaries, follow coding standards, and avoid unauthorized architectural changes.

---

## 1. Scope Boundary Invariants

Every task in \`.specs/coordination/task_board.md\` contains an explicit scope boundary definition.

\`\`\`markdown
**Scope boundary:**
  - INCLUDED: [Explicit file/directory allowlist]
  - EXCLUDED: [Explicit read-only allowlist]
\`\`\`

### The 4 Boundary Rules:
1. **Zero Out-of-Scope Writes:** You may only create, modify, or delete files matching the patterns under \`INCLUDED\`.
2. **Read-Only Context:** Files under \`EXCLUDED\` may be read for reference (e.g. types, shared utilities, contracts), but must **never** be edited directly during task execution.
3. **Spec Files are Immutable During Coding:** Never edit files inside \`.specs/\` (except your own message file and the task board status) without following the Decision/Proposal protocol.
4. **Pre-Commit Verification:** Run \`git status\` and \`git diff --name-only\` before committing. If any modified file is not in \`INCLUDED\`, revert it immediately:
   \`\`\`bash
   git checkout origin/main -- path/to/unauthorized/file
   \`\`\`

---

## 2. Shared Code Patterns & Standards

- **TypeScript Strictness:** Never use \`any\`. Use \`unknown\` and type guards, or define explicit domain types in module schemas.
- **Layered Architecture:**
  - Routers only bind endpoints to controllers and middleware.
  - Controllers only parse requests, invoke services, and serialize response envelopes.
  - Services contain business logic, calculations, and domain rule checks (DR-NNN).
  - Repositories execute database queries and return domain models.
- **Error Handling:** Always throw specific domain errors from \`shared/errors.ts\` (\`ValidationError\`, \`DomainRuleError\`, \`NotFoundError\`, \`ForbiddenError\`). Never throw raw generic errors or return unhandled 500s.
- **Logging:** Use structured JSON logging with \`{ timestamp, level, request_id, user_id, action }\`. Never log credentials, passwords, or PII.

---

## 3. Dependency Management Guardrails

- **No Unauthorized Packages:** Never run \`npm install <new-package>\` without documenting the requirement in a proposal. Use existing libraries listed in \`package.json\`.
- **Environment Variables:** Never reference \`process.env.VARIABLE_NAME\` directly in business logic. All configuration must be accessed through validated \`config/env.ts\` as defined in \`implementation/infrastructure.md\`.
`);

  // 27. agents/communication.md
  recordFile('agents/communication.md', 'Agents', 'Cross-Agent Communication Standard', `---
tier: agents
role: cross-agent-communication-standard
read: when formatting or parsing messages
updated: ${dateStr}
---

# Cross-Agent Communication Standard: ${projectName}

> AI instruction: All communication between agents is persisted in \`.specs/coordination/messages/{session_id}.messages.md\`.
> Every entry must follow the standardized markdown message format defined below.

---

## 1. Universal Message Envelope Format

\`\`\`markdown
---

## MSG-{sequence_number}: {MESSAGE_TYPE}
- **Timestamp:** {ISO 8601 UTC Timestamp}
- **Task:** {TASK-NNN or "none" or "general"}
- **Priority:** info | action-required | urgent
- **Payload:**
  {Structured description, evidence, proposal, or handoff details}
\`\`\`

---

## 2. Standard Message Types & Templates

### 2.1 \`SESSION_STARTED\`
Emitted upon completing onboarding.
\`\`\`markdown
## MSG-001: SESSION_STARTED
- **Timestamp:** ${dateStr}T14:30:25Z
- **Task:** none
- **Priority:** info
- **Payload:**
  Agent session initialized on branch \`agent/cc-auth\`. Clean worktree created from \`origin/main\`. Read \`_index.md\` and \`protocol.md\`. Ready to evaluate tasks.
\`\`\`

### 2.2 \`TASK_CLAIMED\`
Emitted immediately upon updating \`.specs/coordination/task_board.md\`.
\`\`\`markdown
## MSG-002: TASK_CLAIMED
- **Timestamp:** ${dateStr}T14:32:00Z
- **Task:** TASK-003
- **Priority:** action-required
- **Payload:**
  Claimed TASK-003 (Auth Endpoints). Prerequisite TASK-002 confirmed done. Lease active for 4 hours.
\`\`\`

### 2.3 \`PROGRESS_UPDATE\`
Emitted at key implementation milestones.
\`\`\`markdown
## MSG-003: PROGRESS_UPDATE
- **Timestamp:** ${dateStr}T15:15:00Z
- **Task:** TASK-003
- **Priority:** info
- **Payload:**
  Implemented JWT signing service and Argon2id password hasher. Passing unit tests.
\`\`\`

### 2.4 \`CONTRACT_CHANGE_PROPOSED\`
Emitted when an agent discovers a schema or contract deficiency.
\`\`\`markdown
## MSG-004: CONTRACT_CHANGE_PROPOSED
- **Timestamp:** ${dateStr}T15:45:00Z
- **Task:** TASK-003
- **Priority:** urgent
- **Payload:**
  Propose adding 'mfa_enabled' boolean column to users table in contracts/database_schema.md.
\`\`\`

### 2.5 \`TASK_COMPLETED\`
Emitted upon completing implementation and satisfying verification gates.
\`\`\`markdown
## MSG-005: TASK_COMPLETED
- **Timestamp:** ${dateStr}T16:30:00Z
- **Task:** TASK-003
- **Priority:** action-required
- **Payload:**
  Completed implementation of TASK-003. Verification evidence included. PR opened for review.
\`\`\`
`);

  // 28. agents/verification.md
  recordFile('agents/verification.md', 'Agents', 'Evidence-Based Verification Standard', `---
tier: agents
role: verification-and-review-standard
read: during Phase 4 and Phase 5
updated: ${dateStr}
---

# Evidence-Based Verification & Peer Review Standard: ${projectName}

> AI instruction: An agent must never mark a task \`done\` or \`review\` without providing deterministic proof of correctness.
> Claims such as "implemented successfully" or "tests passed" without supporting command outputs and file lists are treated as unverified.

---

## 1. Mandatory Completion Evidence Format

Every completed task must produce this standardized markdown evidence block in its Pull Request description and in its session message log:

\`\`\`markdown
### Verification Evidence: TASK-NNN
- **Executed By:** {session_id}
- **Execution Date:** {ISO Timestamp}
- **Files Created:**
  - \`path/to/created_file.ts\`
- **Files Modified (Within Scope):**
  - \`path/to/modified_file.ts\`
- **Files Modified Outside Scope:** NONE (Verified clean via git diff)
- **Deterministic Test Results:**
  - Command: \`npm test path/to/test.ts\`
  - Output: \`PASS (N tests, 100% assertions met, 0 failures)\`
  - Branch Coverage: \`XX.X%\` (Minimum target: 80% for services, 90% for utils)
- **Invariant & Rule Verification:**
  - \`DR-001\` (Rule Name): Verified via test case \`file.test.ts#L45\`
- **Acceptance Criteria Checklist:**
  - [x] AC-1: [Exact condition verified]
  - [x] AC-2: [Exact condition verified]
- **Known Assumptions & Limitations:**
  - [Any assumptions or "none"]
\`\`\`

---

## 2. Peer Review Checklist (For Reviewer Agents)

When an agent is requested to review another agent's completed work (\`TASK-NNN\` with status \`review\`):

### 1. Scope Boundary Verification
- Run \`git diff origin/main...agent/{claimant_session} --name-only\`.
- Confirm that **every single modified file** is explicitly listed in the task's \`Scope boundary: INCLUDED\` list.
- If ANY unauthorized file is modified: **REJECT** immediately with \`REVISION_REQUIRED\`.

### 2. Independent Test Execution
- Check out the PR branch in an isolated reviewer worktree:
  \`\`\`bash
  git fetch origin agent/{claimant_session}
  npm test
  npm run lint
  npx tsc --noEmit
  \`\`\`
- Verify all automated checks pass with zero warnings or errors.
`);

  // 29. agents/conflict_resolution.md
  recordFile('agents/conflict_resolution.md', 'Agents', 'Conflict Resolution & Recovery Guide', `---
tier: agents
role: conflict-resolution-and-recovery-guide
read: when encountering concurrency errors, merge conflicts, or stale state
updated: ${dateStr}
---

# Conflict Resolution & Recovery Guide: ${projectName}

> AI instruction: Use this runbook when an operation fails due to concurrency collisions, stale claims, broken merges, or crashes.
> Follow the deterministic resolution algorithms below.

---

## 1. Simultaneous Task Claim Collision

### Symptom:
You updated \`.specs/coordination/task_board.md\` to claim \`TASK-NNN\`, but your Git push was rejected with \`[rejected - non-fast-forward]\`.

### Recovery Algorithm:
1. Fetch latest remote state:
   \`\`\`bash
   git fetch origin main
   \`\`\`
2. Inspect the latest \`coordination/task_board.md\` on \`origin/main\`.
3. If another agent successfully committed a claim to \`TASK-NNN\` first:
   - Revert your local task board change:
     \`\`\`bash
     git checkout origin/main -- .specs/coordination/task_board.md
     \`\`\`
   - Log \`MSG-XXX: CLAIM_COLLISION_RESOLVED\` in your session stream:
     *"Task TASK-NNN was claimed by {competing_session}. Releasing local attempt."*
   - Return to \`coordination/task_board.md\` and claim the next available unblocked task.
4. If the conflict was merely an unrelated message or file edit:
   - Run \`git rebase origin/main\`.
   - Re-push your claim.

---

## 2. Crashed Agent / Expired Lease Reclaim

### Symptom:
A task is marked \`claimed\` or \`in-progress\`, but its \`lease_expires\` timestamp has passed (> 4 hours), or the owning agent session in \`agent_registry.md\` has no heartbeat for > 4 hours.

### Recovery Algorithm:
1. Verify that no open Pull Request exists from the claimant's branch.
2. In your session stream, post \`TASK_RECLAIM_ANNOUNCED\`:
   *"Task TASK-NNN lease expired at {timestamp} with no activity. Reclaiming task."*
3. Update \`.specs/coordination/agent_registry.md\` marking the old session as \`abandoned\`.
4. Update \`.specs/coordination/task_board.md\`:
   - Reset task status to \`claimed\`.
   - Set \`Claimed by\` to your own \`session_id\`.
   - Set \`Lease expires\` to current UTC time + 4 hours.
5. Commit and push the reclaim.

---

## 3. Git Merge Conflicts on Feature Integration

### Symptom:
When rebasing your worktree branch on \`origin/main\`, Git halts with merge conflicts.

### Recovery Algorithm:
1. If the conflict is inside your task's \`Scope boundary: INCLUDED\` files:
   - Inspect upstream changes from \`origin/main\`.
   - Resolve conflict preserving both upstream contract compliance and your task's implementation.
   - Run \`npm test\` to verify zero regressions.
   - Run \`git add <file>\` and \`git rebase --continue\`.
2. If the conflict is inside an \`EXCLUDED\` file (e.g. a shared config or schema modified by another merged PR):
   - **Do NOT manually resolve the conflict.**
   - Abort rebase: \`git rebase --abort\`.
   - Check if the upstream contract change invalidates your implementation.
   - Post a \`CONTRACT_DRIFT_DETECTED\` message in your stream and request peer coordination.
`);

  // 30. state/current_state.md
  recordFile('state/current_state.md', 'State', 'Multi-Session Handoff Ledger', `---
role: multi-session-handoff-ledger
read: start of EVERY session (immediately after _index.md)
write: end of EVERY session
owner: AI writes · human reviews
format: append-and-prune multi-session ledger
updated: ${dateStr}
---

# Current State & Multi-Session Runtime Ledger: ${projectName}

> AI instruction: Read this at the start of every session before reading any spec.
> Write to this at the END of every session.
> Do NOT overwrite other agents' active session workstreams. Update your own session block.

---

## ⚡ Quick Context (Read First)

**Active Milestone:** Sprint 1 — MVP Foundation  
**Trunk Status:** \`main\` branch passing all lint and test gates  
**Active Workstreams:** No active external claims; all Sprint 1 tasks currently available  
**Next Recommended Action:** Claim \`${dynamicTasks[0]?.id || 'TASK-001'}\` (${dynamicTasks[0]?.title || 'Initialize project repository'}) on \`.specs/coordination/task_board.md\`  

---

## Active Session Workstreams

<!-- Agents add and update their active session blocks here. Prune once merged to main. -->

*(No active sessions currently running. Ready for agent onboarding.)*

---

## Persistent State

### What's Working (Confirmed)
- System 2 multi-agent specification architecture fully formulated (${dynamicTasks.length} bespoke tasks across Tiers 0–5 + Coordination + Agents + State).
- Universal agent entrypoint established at \`AGENTS.md\`.

### What's Broken or Incomplete
- Source code implementation not yet begun (all Phase 0 tasks in \`todo\` status).
- Tracked issues: None currently open (see \`state/known_issues.md\`).

### Active Constraints
- Git worktree isolation is mandatory for all parallel agent sessions.
- Zero out-of-scope modifications allowed during task execution.

---

## Pending Cross-Agent Decisions & Proposals

*(None pending).*
`);

  // 31. state/decisions_log.md
  recordFile('state/decisions_log.md', 'State', 'Architecture Decision Records (ADR)', `---
tier: state
role: decisions-log
read: scan at session start · read fully before making architectural decisions
owner: AI appends · human reviews
updated: ${dateStr}
---

# Architecture Decisions Log (ADR): ${projectName}

> AI instruction: Before making any architectural decision, scan this log.
> If a relevant past decision exists, follow it — do not relitigate it.
> If you make a new decision during a session, append it here immediately.
> Every ADR must declare session/agent attribution (\`Decided by\` and \`Proposed in\`).
> Never edit or delete past entries. Mark superseded decisions as [SUPERSEDED by ADR-NNN].

---

## ADR-001: Modular Monolith over Microservices for v1
**Date:** ${dateStr}  
**Status:** accepted  
**Decided by:** Human Architect  
**Proposed in:** Project Scaffolding  
**Reviewers:** Human Team  

**Context:** Team is small (1–3 engineers or parallel AI sessions). Splitting into distributed microservices would add deployment, network, and operational complexity before domain boundaries stabilize.

**Options considered:**
- A. Microservices — independent deployment, but high operational overhead and network latency.
- B. Modular monolith — single deployable artifact, strict module boundaries enforced by directory layout.
- C. Fully flat monolith — simple to start, but difficult to refactor or untangle later.

**Decision:** Option B (Modular Monolith). Clean module boundaries enforced via folder structure (\`src/modules/[resource]\`) make future service splits tractable while keeping CI/CD, local testing, and Docker setup simple.

**Consequences:** Simplifies CI/CD and local development. Agents must strictly enforce module boundaries — no cross-module imports except through defined public interfaces and shared types.

**Affects:** \`architecture/system_design.md\` · \`implementation/backend_guide.md\`

---

## ADR-002: Cross-Platform Multi-Agent Collaboration Protocol (System 2 Architecture)
**Date:** ${dateStr}  
**Status:** accepted  
**Decided by:** Antigravity Architect  
**Proposed in:** Specification Reengineering Master Initiative  
**Reviewers:** Lead Project Architect  

**Context:** The project requires coordination among multiple independent AI coding platforms (Codex, Claude Code, Cursor, Windsurf, Copilot, Gemini CLI) without relying on a proprietary central AI orchestrator.

**Options considered:**
- A. Pure shared markdown files — zero isolation, high write collisions and merge conflicts.
- B. Central custom orchestration server — high operational complexity and non-baseline requirement.
- C. Hybrid Specification + Git Worktrees + Append-Only Message Streams — repository-native, zero custom infrastructure, strict filesystem isolation via Git worktrees, atomic claiming, and independent peer review.

**Decision:** Option C (Hybrid Specification + Git Worktrees + Append-Only Message Streams). Leverages the \`AGENTS.md\` open standard as universal entry point, Git worktrees for filesystem safety, and lock-free append-only message logs for communication.

**Consequences:** Enables vendor-neutral parallel development. Requires agents to follow the 6-phase lifecycle, respect scope boundaries, and provide reproducible test evidence before marking tasks complete.

**Affects:** \`AGENTS.md\` · \`.specs/_index.md\` · \`.specs/coordination/**\` · \`.specs/agents/**\` · \`.specs/execution/tasks.md\` · \`.specs/state/current_state.md\`

---

## ADR-003: Multi-Tenant Row-Level Security
**Date:** ${dateStr}  
**Status:** accepted  
**Decided by:** Lead Security Architect  
**Proposed in:** Database Security Baseline  
**Reviewers:** Backend Engineering Team  

**Context:** Ensuring zero-bleed data isolation in multi-tenant environments.
**Decision:** Implement PostgreSQL Row-Level Security (RLS) linked to session \`tenant_id\`.
**Consequences:** Database enforces tenant separation even if application queries omit where clauses.
**Affects:** \`architecture/security_model.md\` · \`contracts/database_schema.md\`

---

## ADR-004: Stateless Authentication with Refresh Token Rotation
**Date:** ${dateStr}  
**Status:** accepted  
**Decided by:** Backend Engineering Lead  
**Proposed in:** Authentication Design Review  
**Reviewers:** Security Review Board  

**Context:** Balancing security and horizontal scalability.
**Decision:** Use short-lived JWTs (15 mins) with rotating refresh tokens stored in HttpOnly cookies.
**Consequences:** Eliminates central session bottleneck while enabling immediate session revocation.
**Affects:** \`architecture/security_model.md\` · \`contracts/api_contracts.md\`

---

## ADR-005: Model Context Protocol (MCP) Live Agent Gateway
**Date:** ${dateStr}  
**Status:** accepted  
**Decided by:** Principal AI Systems Engineer  
**Proposed in:** Agent Tooling Initiative  
**Reviewers:** Developer Experience Team  

**Context:** Allowing Cursor, Windsurf, and Claude Code to autonomously query live specs.
**Decision:** Expose a standardized MCP server endpoint delivering file contents and task checklists.
**Consequences:** Autonomous agents can code continuously with live context sync.
**Affects:** \`public/api/mcp.php\` · \`mcp/**\`
`);

  // 32. state/known_issues.md
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
