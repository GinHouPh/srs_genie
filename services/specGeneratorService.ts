import JSZip from 'jszip';
import { ProjectInput, GeneratedContent, VibeTask, SpecFileItem } from '../types';
import { GoogleGenAI } from '@google/genai';
import { saasStore } from './saasStore';

/**
 * Metadata table of all 22 canonical spec files in the .specs hierarchy
 */
export const SPEC_TIERS: { tier: string; name: string; category: string; description: string; files: { path: string; title: string; desc: string }[] }[] = [
  {
    tier: 'Entry',
    name: 'Navigation & Root Manifest',
    category: 'entry',
    description: 'Entrypoint parsed by AI Agents before touching any source code',
    files: [
      { path: '_index.md', title: 'Project Index & Navigation Manifest', desc: 'AI agent roadmap and regeneration rules' }
    ]
  },
  {
    tier: 'Tier 0',
    name: 'Foundation & Vision',
    category: 'foundation',
    description: 'Root source of truth: vision, boundary constraints, vocabulary',
    files: [
      { path: 'foundation/brief.md', title: 'Product Brief', desc: 'Scope, user roles, non-negotiables, success criteria' },
      { path: 'foundation/glossary.md', title: 'Domain Glossary', desc: 'Canonical vocabulary and definitions' }
    ]
  },
  {
    tier: 'Tier 1',
    name: 'Domain & Business Logic',
    category: 'domain',
    description: 'User stories, acceptance criteria, and invariant domain rules',
    files: [
      { path: 'domain/user_stories.md', title: 'User Stories & Acceptance Criteria', desc: 'Gherkin scenarios and user permissions' },
      { path: 'domain/domain_rules.md', title: 'Business Rules & Invariants', desc: 'Validation constraints and business logic' }
    ]
  },
  {
    tier: 'Tier 2',
    name: 'Architecture & System Design',
    category: 'architecture',
    description: 'High-level component diagrams, data models, and RBAC security matrices',
    files: [
      { path: 'architecture/system_design.md', title: 'System Design & Components', desc: 'Layered architecture and data flow' },
      { path: 'architecture/data_model.md', title: 'Canonical Data Model', desc: 'Entities, attributes, and relationship constraints' },
      { path: 'architecture/security_model.md', title: 'Security & Auth Model', desc: 'Auth flow, RBAC matrix, and token policies' }
    ]
  },
  {
    tier: 'Tier 3',
    name: 'Contracts & Interfaces',
    category: 'contracts',
    description: 'Machine-verifiable API endpoints, SQL schema, and UI component contracts',
    files: [
      { path: 'contracts/api_contracts.md', title: 'REST / GraphQL API Contracts', desc: 'Request/response payloads and error schemas' },
      { path: 'contracts/database_schema.md', title: 'Database Schema & Migrations', desc: 'PostgreSQL/MySQL DDL, indexes, and triggers' },
      { path: 'contracts/ui_contracts.md', title: 'UI Component & State Contracts', desc: 'Routes, props, state machines, and UX states' }
    ]
  },
  {
    tier: 'Tier 4',
    name: 'Implementation Guides',
    category: 'implementation',
    description: 'Backend, frontend, infrastructure, testing, and coding standards',
    files: [
      { path: 'implementation/backend_guide.md', title: 'Backend Engineering Guide', desc: 'Folder structure, service patterns, and error handling' },
      { path: 'implementation/frontend_guide.md', title: 'Frontend Engineering Guide', desc: 'Component hierarchy, state stores, and styling' },
      { path: 'implementation/infrastructure.md', title: 'Infrastructure & Deployment', desc: 'Docker, CI/CD, cloud environments, and env vars' },
      { path: 'implementation/testing_strategy.md', title: 'QA & Testing Strategy', desc: 'Unit, integration, E2E, and coverage gates' },
      { path: 'implementation/coding_standards.md', title: 'Coding Standards & Style', desc: 'TypeScript rules, linting, and git conventions' }
    ]
  },
  {
    tier: 'Tier 5',
    name: 'Execution & Tasks',
    category: 'execution',
    description: 'Atomic tasks, dependency graph, and sprint roadmaps ready for AI agents',
    files: [
      { path: 'execution/tasks.md', title: 'Atomic Task Backlog', desc: 'TASK-001..NNN with complexity, specs, and outputs' },
      { path: 'execution/dependency_graph.md', title: 'Task Dependency Graph', desc: 'Mermaid graph and unblocked task queue' },
      { path: 'execution/sprint_plan.md', title: 'Sprint Roadmap', desc: 'Sprint 1 through Launch milestone plan' }
    ]
  },
  {
    tier: 'State',
    name: 'Dynamic Agent State',
    category: 'state',
    description: 'Session state, append-only architecture decision records, and known debt',
    files: [
      { path: 'state/current_state.md', title: 'Current System State', desc: 'Live build status and immediate next actions' },
      { path: 'state/decisions_log.md', title: 'Architecture Decision Records (ADR)', desc: 'Historical architectural rationale' },
      { path: 'state/known_issues.md', title: 'Known Issues & Tech Debt', desc: 'Workarounds, deferred items, and bug backlog' }
    ]
  }
];

/**
 * Synthesizes the complete 22-file .specs suite tailored to the user's project input.
 */
export function synthesizeSpecsSuite(input: ProjectInput): Record<string, string> {
  const fd = input.formData;
  const projectName = input.name || (fd['project_overview']?.['project_name'] as string) || 'Modern Web Application';
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
  const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
  const appTypes = Array.isArray(fd['system_type']?.['application_type'])
    ? (fd['system_type']?.['application_type'] as string[]).join(', ')
    : (fd['system_type']?.['application_type'] as string) || 'Web Application (React + Node.js)';
  const targetUsers = Array.isArray(fd['project_overview']?.['target_users'])
    ? (fd['project_overview']?.['target_users'] as string[]).join(', ')
    : (fd['project_overview']?.['target_users'] as string) || 'End Users, Administrators';
  const timeline = (fd['project_overview']?.['expected_timeline'] as string) || '3-4 months';
  const budget = (fd['project_overview']?.['budget_range'] as string) || '$25,000 - $50,000';

  // Core features selected
  const userMgmt = Array.isArray(fd['core_features']?.['user_management'])
    ? (fd['core_features']?.['user_management'] as string[]).join(', ')
    : 'Registration, JWT Auth, Role-based Access Control';
  const ecom = Array.isArray(fd['core_features']?.['ecommerce_features'])
    ? (fd['core_features']?.['ecommerce_features'] as string[]).join(', ')
    : 'Stripe Subscriptions, Invoicing';
  const comms = Array.isArray(fd['core_features']?.['communication_features'])
    ? (fd['core_features']?.['communication_features'] as string[]).join(', ')
    : 'In-app Notifications, Email Alerts';
  const security = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'GDPR, OWASP Top 10, SOC 2 Type II';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'AWS (ECS / Aurora PostgreSQL)';

  const dateStr = new Date().toISOString().split('T')[0];

  const files: Record<string, string> = {};

  // 1. _index.md
  files['_index.md'] = `---
tier: entry
role: navigation-manifest
read: every session, before any other file
updated: ${dateStr}
---

# Project index: ${projectName}

> AI instruction: Read this file first. Do not read any other file until you have parsed
> the full file table below. Then read only the files relevant to your current task.
> Always read \`/state/current_state.md\` immediately after this file.

## Project summary

**${projectName}** — An enterprise-grade ${projectType.toLowerCase()} built for the ${industry} industry.
Empowers ${targetUsers} with automated workflows, real-time collaboration, and bulletproof security.

**Stack:** ${backend} · ${database} · ${frontend} · Hosted on ${hosting}
**Target Timeline:** ${timeline} | **Budget Scope:** ${budget}

---

## Spec file map

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
| \`execution/tasks.md\` | 5 | Atomic task list with status | When picking the next task |
| \`execution/dependency_graph.md\` | 5 | Task dependency map | When determining task order |
| \`execution/sprint_plan.md\` | 5 | Current sprint scope and priorities | When starting a work session |
| \`state/current_state.md\` | state | What's built, what's broken, next action | Every session — read after this file |
| \`state/decisions_log.md\` | state | Architecture Decision Records (append-only) | Before making any architectural decision |
| \`state/known_issues.md\` | state | Bugs, tech debt, deferred decisions | Before touching affected areas |

---

## Regeneration rules

\`\`\`
brief.md changed          → regenerate everything below Tier 0
glossary.md changed       → review all files for term consistency
data_model.md changed     → regenerate database_schema.md + api_contracts.md + ui_contracts.md
api_contracts.md changed  → regenerate ui_contracts.md + update testing_strategy.md
user_stories.md changed   → regenerate tasks.md + testing_strategy.md
\`\`\`
`;

  // 2. foundation/brief.md
  files['foundation/brief.md'] = `---
tier: 0
role: source-of-truth
owner: human
triggers-regen: all tiers below
updated: ${dateStr}
---

# Product brief: ${projectName}

> AI instruction: This is the root source of truth. Do not infer requirements not stated here.
> Every downstream spec derives from this file.

---

## What it is

**Product name:** ${projectName}
**Industry / Domain:** ${industry}
**Application Types:** ${appTypes}

**Description:**
${projectName} is a modern software platform engineered to deliver reliable, high-performance operations for ${targetUsers}.
It integrates ${userMgmt}, ${ecom}, and ${comms} into a unified, responsive interface backed by resilient cloud infrastructure.

---

## Who uses it

| Role | Core need |
|------|-----------|
| Standard User / Customer | Seamless self-service, intuitive navigation, fast transactions |
| Team Administrator | Role-based member management, audit logs, billing controls |
| Super Admin | Global telemetry, revenue metrics, user moderation, system configs |

---

## Non-negotiable constraints

- [x] Sub-200ms API response latency on all P95 core transactions
- [x] Strict compliance adherence: ${security}
- [x] Zero-trust security model: AES-256 at rest, TLS 1.3 in transit
- [x] High availability target: 99.9% uptime SLA

---

## Tech stack decisions

| Layer | Choice | Reason |
|-------|--------|--------|
| Backend | ${backend} | Type-safety, performance, and rich ecosystem |
| Database | ${database} | Relational integrity, ACID compliance, and query performance |
| Frontend | ${frontend} | Component reactivity, modern DX, and snappy performance |
| Deployment | ${hosting} | Scalable container orchestration and managed services |

---

## Out of scope (v1)

- Legacy desktop native installers (Windows 7 / legacy macOS)
- Multi-region geo-replication (deferred to v2)
- Custom physical hardware or proprietary embedded sensors
`;

  // 3. foundation/glossary.md
  files['foundation/glossary.md'] = `---
tier: 0
role: canonical-vocabulary
owner: human
triggers-regen: consistency check across all specs
updated: ${dateStr}
---

# Domain glossary: ${projectName}

| Term | Definition | Context & Notes |
|:---|:---|:---|
| **Tenant** | An isolated workspace or customer organization. | Multi-tenant DB isolation via \`tenant_id\` |
| **RBAC** | Role-Based Access Control matrix. | Admin, Staff, Member, Viewer |
| **API Contract** | OpenAPI 3.1 schema defining client-server messages. | Strictly typed with Zod / TypeScript |
| **MCP** | Model Context Protocol. | Live context server for autonomous AI coding agents |
| **Audit Log** | Immutable append-only log of security and billing events. | Retained for 365 days for compliance |
`;

  // 4. domain/user_stories.md
  files['domain/user_stories.md'] = `---
tier: 1
role: user-stories
depends-on: foundation/brief.md
updated: ${dateStr}
---

# User stories & Acceptance criteria: ${projectName}

### US-001: User Authentication & Role Assignment
**As a** new customer  
**I want to** register via email/password or OAuth (Google, GitHub)  
**So that** I receive a secure workspace with appropriate permissions.

**Acceptance Criteria:**
- GIVEN a valid registration payload, WHEN submitted, THEN create tenant and send verification email.
- GIVEN invalid credentials, WHEN attempting login, THEN return HTTP 401 with rate-limit counter.
- Password must contain min 10 chars, uppercase, digit, and symbol.

---

### US-002: Core Workspace Dashboard
**As an** authenticated user  
**I want to** view my project metrics, active records, and recent notifications  
**So that** I have immediate situational awareness.

---

### US-003: Administrative Billing & Quota Management
**As a** team administrator  
**I want to** upgrade our subscription plan, add payment methods, and download VAT invoices  
**So that** our operations continue without hitting quota limits.
`;

  // 5. domain/domain_rules.md
  files['domain/domain_rules.md'] = `---
tier: 1
role: business-invariants
depends-on: foundation/brief.md
updated: ${dateStr}
---

# Domain rules: ${projectName}

- **DR-001 (Tenant Isolation):** Every database query MUST include a \`tenant_id\` where clause. Cross-tenant leakage is a critical P0 violation.
- **DR-002 (Idempotent Payments):** All payment and charge transactions must supply a unique \`idempotency_key\` to prevent double billing.
- **DR-003 (Immutable Audit Trails):** Audit logs cannot be deleted or mutated by any user, including Super Admins.
- **DR-004 (Quota Enforcement):** When a tenant reaches their plan quota, the API must return \`402 Payment Required\` with upgrade links.
`;

  // 6. architecture/system_design.md
  files['architecture/system_design.md'] = `---
tier: 2
role: system-architecture
depends-on: foundation/brief.md · domain/domain_rules.md
updated: ${dateStr}
---

# System design: ${projectName}

\`\`\`mermaid
flowchart TD
    Client["Client Web / Mobile UI (${frontend})"]
    CDN["Cloud CDN / WAF"]
    API["API Gateway / Backend (${backend})"]
    DB[("Primary Database (${database})")]
    Cache[("Redis Cache & Sessions")]
    Workers["Background Queue Workers"]
    MCP["Model Context Protocol Server"]

    Client --> CDN
    CDN --> API
    API --> DB
    API --> Cache
    API --> Workers
    Workers --> DB
    MCP --> DB
\`\`\`

## Architecture Patterns
- **Clean Layered Architecture:** Presentation -> Controller -> Service Layer -> Repository -> Database.
- **Stateless API:** JWT tokens with short-lived access (15m) and sliding refresh tokens (7d).
- **Event-Driven Workers:** Long-running exports, emails, and AI generation tasks run via BullMQ / Redis queues.
`;

  // 7. architecture/data_model.md
  files['architecture/data_model.md'] = `---
tier: 2
role: canonical-data-model
depends-on: domain/user_stories.md · domain/domain_rules.md
updated: ${dateStr}
---

# Data model: ${projectName}

### Entity: \`Tenant\`
- \`id\`: UUID (Primary Key)
- \`name\`: VARCHAR(100)
- \`plan\`: ENUM('free', 'pro', 'team', 'enterprise')
- \`created_at\`: TIMESTAMP WITH TIME ZONE

### Entity: \`User\`
- \`id\`: UUID (Primary Key)
- \`tenant_id\`: UUID (Foreign Key -> Tenant.id)
- \`email\`: VARCHAR(255) UNIQUE
- \`password_hash\`: VARCHAR(255)
- \`role\`: ENUM('admin', 'staff', 'member', 'viewer')
- \`status\`: ENUM('active', 'suspended', 'invited')

### Entity: \`ProjectSpecification\`
- \`id\`: UUID (Primary Key)
- \`tenant_id\`: UUID (Foreign Key)
- \`name\`: VARCHAR(150)
- \`specs_json\`: JSONB
- \`version\`: VARCHAR(20)
- \`status\`: ENUM('draft', 'generated', 'archived')
`;

  // 8. architecture/security_model.md
  files['architecture/security_model.md'] = `---
tier: 2
role: security-and-auth
depends-on: domain/user_stories.md
updated: ${dateStr}
---

# Security & Auth model: ${projectName}

## RBAC Permission Matrix

| Role | Read Specs | Create/Edit Specs | Manage Billing | Invite Staff | Admin Telemetry |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Member** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Super Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

- **Password Hashing:** Argon2id with 64MB memory cost.
- **CSRF & CORS:** Strict SameSite cookie policies and whitelisted CORS origins.
`;

  // 9. contracts/api_contracts.md
  files['contracts/api_contracts.md'] = `---
tier: 3
role: api-contracts
depends-on: architecture/data_model.md · architecture/security_model.md
updated: ${dateStr}
---

# API contracts: ${projectName}

### \`POST /api/v1/auth/register\`
\`\`\`json
// Request
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "company": "Acme Corp"
}

// Response (201 Created)
{
  "user": { "id": "uuid", "email": "user@example.com", "role": "admin" },
  "token": "jwt_token_string"
}
\`\`\`

### \`GET /api/v1/specs/:id\`
\`\`\`json
// Response (200 OK)
{
  "id": "uuid",
  "name": "${projectName}",
  "status": "generated",
  "hierarchy": { ... }
}
\`\`\`
`;

  // 10. contracts/database_schema.md
  files['contracts/database_schema.md'] = `---
tier: 3
role: database-schema
depends-on: architecture/data_model.md
updated: ${dateStr}
---

# Database schema: ${projectName}

\`\`\`sql
-- Extension setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    plan VARCHAR(30) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
\`\`\`
`;

  // 11. contracts/ui_contracts.md
  files['contracts/ui_contracts.md'] = `---
tier: 3
role: ui-contracts
depends-on: architecture/system_design.md
updated: ${dateStr}
---

# UI contracts: ${projectName}

### Route Table
| Route | Page Component | Access |
|:---|:---|:---|
| \`/\` | \`LandingPage\` | Public |
| \`/login\` | \`AuthModal\` | Public |
| \`/dashboard\` | \`DashboardView\` | Authenticated |
| \`/wizard\` | \`WizardForm\` | Authenticated |
| \`/specs/:id\` | \`DocumentPreview\` | Authenticated |
| \`/admin\` | \`AdminConsole\` | Role: Admin / Staff |
| \`/mcp\` | \`McpHubView\` | Authenticated |
`;

  // 12. implementation/backend_guide.md
  files['implementation/backend_guide.md'] = `---
tier: 4
role: backend-guide
depends-on: architecture/system_design.md
updated: ${dateStr}
---

# Backend implementation guide: ${projectName}

## Recommended Directory Structure
\`\`\`
src/
├── modules/
│   ├── auth/          # controller, service, repository, dto
│   ├── specs/         # spec generation, markdown synthesizer, zip packager
│   ├── billing/       # stripe hooks, invoice generator, plan quotas
│   └── mcp/           # MCP protocol server, tools handler, live session stream
├── shared/
│   ├── database/      # connection pool, migrations, models
│   ├── middleware/    # auth, rbac, rate-limiting, error handler
│   └── utils/
└── app.ts
\`\`\`
`;

  // 13. implementation/frontend_guide.md
  files['implementation/frontend_guide.md'] = `---
tier: 4
role: frontend-guide
depends-on: contracts/ui_contracts.md
updated: ${dateStr}
---

# Frontend implementation guide: ${projectName}

- **State Management:** React 19 State / Custom Hooks + LocalStorage sync.
- **Styling:** Tailored Tailwind dark palette (\`bg-slate-950\`, \`indigo-600\`, \`cyan-400\`).
- **Performance:** Dynamic imports for heavy renderers (Markdown, Prism, JSZip).
- **Responsive:** Mobile-first layout with collapsible sidebars and touch-friendly controls.
`;

  // 14. implementation/infrastructure.md
  files['implementation/infrastructure.md'] = `---
tier: 4
role: infrastructure
depends-on: architecture/system_design.md
updated: ${dateStr}
---

# Infrastructure & Deployment: ${projectName}

- **Containerization:** Multi-stage Dockerfile based on \`node:24-alpine\`.
- **CI/CD:** GitHub Actions workflow executing lint, unit tests, integration tests, and preview deploys.
- **Cloud Provider:** ${hosting}.
- **Environment Variables:**
  - \`GEMINI_API_KEY\`: Google GenAI token
  - \`DATABASE_URL\`: Managed PostgreSQL connection string
  - \`REDIS_URL\`: Cache & queue connection
  - \`STRIPE_SECRET_KEY\`: Payment gateway key
`;

  // 15. implementation/testing_strategy.md
  files['implementation/testing_strategy.md'] = `---
tier: 4
role: testing-strategy
depends-on: domain/user_stories.md
updated: ${dateStr}
---

# Testing strategy: ${projectName}

- **Unit Testing:** Vitest for utility algorithms, serialization logic, and validation schema.
- **Integration Testing:** Supertest against API controllers with test PostgreSQL containers.
- **E2E Testing:** Playwright testing authentication, form wizard submission, and zip download flows.
- **Target Coverage:** Minimum 85% code coverage on core business domains.
`;

  // 16. implementation/coding_standards.md
  files['implementation/coding_standards.md'] = `---
tier: 4
role: coding-standards
updated: ${dateStr}
---

# Coding standards: ${projectName}

- Strictly typed TypeScript (\`noImplicitAny: true\`).
- ESLint + Prettier format enforcement on git pre-commit hooks via Husky.
- Conventional Commits: \`feat:\`, \`fix:\`, \`refactor:\`, \`docs:\`, \`test:\`.
`;

  // 17. execution/tasks.md
  files['execution/tasks.md'] = `---
tier: 5
role: atomic-task-list
depends-on: domain/user_stories.md · architecture/system_design.md
updated: ${dateStr}
---

# Tasks: ${projectName}

### TASK-001: Initialize Repository & Tooling
**Status:** done
**Complexity:** XS
**Output:** Vite + React 19 + TypeScript 5.8 repository with Tailwind CSS and build scripts.

---

### TASK-002: Implement SaaS Admin Console & Business Metrics
**Status:** in-progress
**Complexity:** M
**Spec refs:** architecture/security_model.md · contracts/ui_contracts.md
**Output:** Full Admin Console managing users, staff, billing, subscriptions, and metrics.

---

### TASK-003: Build Hierarchical .specs Suite Generator & ZIP Exporter
**Status:** in-progress
**Complexity:** L
**Spec refs:** foundation/brief.md · execution/tasks.md
**Output:** Complete 22-file .specs generator with JSZip client-side packaging.

---

### TASK-004: Implement MCP Server & AI Agent Connectors
**Status:** in-progress
**Complexity:** M
**Spec refs:** contracts/api_contracts.md
**Output:** Live MCP server protocol handlers for Cursor, Claude Desktop, and autonomous agents.

---

### TASK-005: Integrate Stripe Billing & Webhook Handlers
**Status:** todo
**Complexity:** M
**Spec refs:** domain/domain_rules.md · contracts/api_contracts.md
**Output:** Real-time customer subscription checkout and invoice generation.
`;

  // 18. execution/dependency_graph.md
  files['execution/dependency_graph.md'] = `---
tier: 5
role: dependency-graph
depends-on: execution/tasks.md
updated: ${dateStr}
---

# Dependency graph: ${projectName}

\`\`\`mermaid
flowchart LR
    T001[TASK-001: Init Repo] --> T002[TASK-002: Admin Console]
    T001 --> T003[TASK-003: .specs Generator]
    T003 --> T004[TASK-004: MCP Server]
    T002 --> T005[TASK-005: Stripe Billing]
\`\`\`
`;

  // 19. execution/sprint_plan.md
  files['execution/sprint_plan.md'] = `---
tier: 5
role: sprint-plan
depends-on: execution/tasks.md
updated: ${dateStr}
---

# Sprint plan: ${projectName}

- **Sprint 1 (Foundation & Specs):** TASK-001, TASK-002, TASK-003. Deliverable: Working spec generator + admin dashboard.
- **Sprint 2 (MCP & Agent Sync):** TASK-004. Deliverable: Real-time MCP connectivity for Cursor & Claude.
- **Sprint 3 (Monetization & Launch):** TASK-005. Deliverable: Production payment gate and customer onboarding.
`;

  // 20. state/current_state.md
  files['state/current_state.md'] = `---
tier: state
role: live-state
read: every session, after _index.md
updated: ${dateStr}
---

# Current state: ${projectName}

- **What's built:**
  - 15-step comprehensive SRS questionnaire.
  - SaaS Admin Console (Users, Staff, Plans, Billing, MCP Key Manager).
  - 22-file .specs suite generation engine.
  - Client-side ZIP export for Cursor, Claude Code, Windsurf.
- **What's broken / in progress:**
  - Connecting live webhooks for automated invoice PDF delivery.
- **Next immediate action:**
  - Connect Cursor or Claude Desktop to the local MCP server live endpoint.
`;

  // 21. state/decisions_log.md
  files['state/decisions_log.md'] = `---
tier: state
role: decisions-log
updated: ${dateStr}
---

# Architecture Decision Records: ${projectName}

### ADR-001: Adoption of 6-Tier .specs Framework
- **Date:** ${dateStr}
- **Status:** Accepted
- **Context:** Single monolithic markdown documents overflow context windows of AI agents.
- **Decision:** Split specifications into 22 atomic, hierarchical files across 6 tiers.
- **Consequences:** AI agents can load only relevant tier specs (e.g. only \`contracts/api_contracts.md\`), reducing hallucination and token waste.

### ADR-002: Model Context Protocol (MCP) Live Synchronization
- **Date:** ${dateStr}
- **Status:** Accepted
- **Decision:** Expose a native MCP server so autonomous coding agents can query specs via tools.
`;

  // 22. state/known_issues.md
  files['state/known_issues.md'] = `---
tier: state
role: tech-debt-and-bugs
updated: ${dateStr}
---

# Known issues & Tech debt: ${projectName}

1. **Gemini API 503 Demand Spikes:** External Google AI endpoints occasionally experience peak load. Deterministic fallback synthesizer guarantees zero downtime for users.
2. **Local Storage Limits:** Very large project suites (>5MB) should eventually persist in SQLite / PostgreSQL rather than browser LocalStorage.
`;

  return files;
}

/**
 * Packages the entire .specs hierarchy into a downloadable .zip file
 */
export async function downloadSpecsZip(specs: Record<string, string>, projectName: string = 'project') {
  const zip = new JSZip();
  const root = zip.folder('.specs');

  if (!root) throw new Error('Failed to create zip folder');

  for (const [filePath, content] of Object.entries(specs)) {
    root.file(filePath, content);
  }

  // Also include a root README.md for the developer
  zip.file('README_FOR_AI_AGENTS.md', `# ${projectName} - Agent-Executable Specification Suite

This repository contains a full **.specs/** directory generated by **SRS Genie**.

## How to use with your AI Agent:
1. **Cursor IDE:** Point Cursor to \`.specs/_index.md\` or configure your Cursor MCP settings.
2. **Claude Code / Desktop:** Add the MCP server configuration provided in the SRS Genie MCP Hub.
3. **Windsurf / Antigravity:** Instruct the agent:
   > "Read \`.specs/_index.md\` first, followed by \`.specs/state/current_state.md\`. Work through unblocked tasks in \`.specs/execution/tasks.md\`."
`);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  a.href = url;
  a.download = `${sanitizedName}-specs.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Master generator function called on form submission
 */
export async function generateComprehensiveSpecPackage(input: ProjectInput): Promise<GeneratedContent> {
  const synthesized = synthesizeSpecsSuite(input);
  saasStore.recordSpecGeneration(28500);

  // Extract vibe tasks from execution/tasks.md
  const tasks: VibeTask[] = [
    {
      id: 'TASK-001',
      title: 'Initialize Project Repository & Configuration',
      description: 'Set up base framework, linters, tsconfig, and containerization configs.',
      prompt: 'Initialize the repository using the patterns defined in .specs/implementation/coding_standards.md and .specs/implementation/infrastructure.md.',
      type: 'setup',
      status: 'done',
      complexity: 'XS'
    },
    {
      id: 'TASK-002',
      title: 'Configure Database & Run Initial Migrations',
      description: 'Create database tables, indexes, triggers, and migrations from database_schema.md.',
      prompt: 'Execute the SQL migration schema specified in .specs/contracts/database_schema.md. Ensure multi-tenant indexes are configured.',
      type: 'database',
      status: 'todo',
      complexity: 'S',
      dependsOn: 'TASK-001'
    },
    {
      id: 'TASK-003',
      title: 'Implement Authentication & RBAC Middleware',
      description: 'Build JWT registration, login, and permission verification guards.',
      prompt: 'Implement auth routes per .specs/contracts/api_contracts.md following the security matrix in .specs/architecture/security_model.md.',
      type: 'backend',
      status: 'todo',
      complexity: 'M',
      dependsOn: 'TASK-002'
    },
    {
      id: 'TASK-004',
      title: 'Implement Core Business Logic & Domain Rules',
      description: 'Develop resource CRUD services while enforcing all domain invariants.',
      prompt: 'Build service handlers enforcing domain rules from .specs/domain/domain_rules.md with comprehensive unit test coverage.',
      type: 'backend',
      status: 'todo',
      complexity: 'L',
      dependsOn: 'TASK-003'
    },
    {
      id: 'TASK-005',
      title: 'Construct UI Component Hierarchy & Routing',
      description: 'Build frontend pages and reactive state stores matching UI contracts.',
      prompt: 'Implement UI components per .specs/contracts/ui_contracts.md using design tokens from .specs/implementation/frontend_guide.md.',
      type: 'frontend',
      status: 'todo',
      complexity: 'M',
      dependsOn: 'TASK-004'
    },
    {
      id: 'TASK-006',
      title: 'End-to-End Testing & Production Deployment',
      description: 'Run integration test suite and deploy containerized services to cloud hosting.',
      prompt: 'Run test pipelines as specified in .specs/implementation/testing_strategy.md and configure CI/CD in .specs/implementation/infrastructure.md.',
      type: 'deployment',
      status: 'todo',
      complexity: 'M',
      dependsOn: 'TASK-005'
    }
  ];

  // Try calling Gemini to enrich if available, else use synthesized suite
  let customMarkdown = synthesized['_index.md'];
  if (process.env.API_KEY && process.env.API_KEY !== 'PLACEHOLDER_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Refine this executive summary for ${input.name}:\n${synthesized['foundation/brief.md']}`;
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      if (res.text) {
        synthesized['foundation/brief.md'] = res.text;
      }
    } catch (e) {
      console.warn('Gemini enrichment skipped (using deterministic suite):', e);
    }
  }

  return {
    srsMarkdown: synthesized['foundation/brief.md'] + '\n\n' + synthesized['architecture/system_design.md'],
    agentContext: synthesized['_index.md'],
    implementationTasks: tasks,
    specsHierarchy: synthesized,
    projectMeta: {
      projectName: input.name,
      description: `Production specification suite for ${input.name}`,
      techStack: ['Node.js', 'PostgreSQL', 'React 19', 'Tailwind CSS', 'Docker'],
      timeline: (input.formData['project_overview']?.['expected_timeline'] as string) || '3-4 months',
      budget: (input.formData['project_overview']?.['budget_range'] as string) || '$25,000 - $50,000'
    }
  };
}
