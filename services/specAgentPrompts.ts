import { SRSFormData } from '../types';

export type StrategicPlanDocumentId =
  | 'prd'
  | 'designs'
  | 'architecture'
  | 'tech_spec'
  | 'roadmap'
  | 'risk'
  | 'qa'
  | 'deployment';

export interface StrategicPlanDefinition {
  id: StrategicPlanDocumentId;
  filename: string;
  title: string;
  role: string;
  description: string;
  downstreamSpecs: string[];
}

export const STRATEGIC_PLAN_DEFINITIONS: StrategicPlanDefinition[] = [
  {
    id: 'prd',
    filename: 'PRD.md',
    title: 'Product Requirements Document (PRD)',
    role: 'Principal Product Manager',
    description: 'Executive vision, user personas, problem scope, functional specifications, and Gherkin user flows.',
    downstreamSpecs: ['foundation/brief.md', 'foundation/glossary.md', 'domain/user_stories.md']
  },
  {
    id: 'designs',
    filename: 'designs.md',
    title: 'UI/UX & Design Systems Specification',
    role: 'Lead UI/UX Systems Designer & Frontend Architect',
    description: 'Design system tokens, complete application route table, component hierarchy, and interactive UX states.',
    downstreamSpecs: ['contracts/ui_contracts.md', 'implementation/frontend_guide.md']
  },
  {
    id: 'architecture',
    filename: 'architecture.md',
    title: 'System Architecture & Security Topology',
    role: 'Chief Enterprise Architect',
    description: 'End-to-end system topology Mermaid chart, layered clean architecture, session caching, and zero-trust security.',
    downstreamSpecs: ['architecture/system_design.md', 'architecture/security_model.md']
  },
  {
    id: 'tech_spec',
    filename: 'tech_spec.md',
    title: 'Technical Specification & Data Contracts',
    role: 'Principal Backend & Database Architect',
    description: 'Relational entity model, executable PostgreSQL DDL, machine-verifiable OpenAPI 3.1 endpoints, and domain invariants.',
    downstreamSpecs: ['domain/domain_rules.md', 'architecture/data_model.md', 'contracts/database_schema.md', 'contracts/api_contracts.md', 'implementation/backend_guide.md']
  },
  {
    id: 'roadmap',
    filename: 'roadmap_resourceplan.md',
    title: 'Execution Roadmap & Dynamic Task Backlog',
    role: 'Technical Program Manager & Agile Delivery Lead',
    description: '15-25+ dynamic atomic tasks, Mermaid dependency DAG, and 4-sprint milestone roadmap.',
    downstreamSpecs: ['execution/tasks.md', 'execution/dependency_graph.md', 'execution/sprint_plan.md']
  },
  {
    id: 'risk',
    filename: 'risk_management.md',
    title: 'Risk Register, Threat Model & Compliance',
    role: 'CISO & Compliance Officer',
    description: 'OWASP Top 10 threat modeling, regulatory compliance (GDPR/SOC2), failure modes, and Architecture Decision Records (ADRs).',
    downstreamSpecs: ['architecture/security_model.md', 'state/decisions_log.md', 'state/known_issues.md']
  },
  {
    id: 'qa',
    filename: 'qa.md',
    title: 'Quality Assurance & Automated Test Strategy',
    role: 'QA Lead & Test Automation Architect',
    description: 'Test automation pyramid, Vitest unit standards, Supertest API test matrix, and Playwright E2E browser flows.',
    downstreamSpecs: ['implementation/testing_strategy.md']
  },
  {
    id: 'deployment',
    filename: 'deployment_releaseplan.md',
    title: 'DevOps, CI/CD & Release Engineering',
    role: 'Staff DevOps & Site Reliability Engineer',
    description: 'Multi-stage Dockerfiles, docker-compose.yml, GitHub Actions CI/CD pipeline, and environment secret matrix.',
    downstreamSpecs: ['implementation/infrastructure.md', 'implementation/coding_standards.md', 'state/current_state.md']
  }
];

export const SPEC_AGENT_SYSTEM_DIRECTIVE = `
You are an Elite Staff Principal Solutions Architect, Product Strategist & AI Specification Engineer.
Your mission is to transform user SRS questionnaire inputs into production-grade, authoritative engineering specifications.
Standards:
- Output must be technical, comprehensive, and exhaustive.
- Absolutely NO placeholders like "[TBD]", "[Add details later]", or "TODO".
- Provide concrete schemas, exact tables, explicit routes, real DDL, and actionable code prompts.
- Strictly adhere to industry best practices, multi-tenant isolation, and zero-trust security.
`;

/**
 * Builds the customized prompt for a specific strategic planning document
 */
export function buildStrategicPlanPrompt(
  planId: StrategicPlanDocumentId,
  projectName: string,
  formattedInputs: string
): string {
  const plan = STRATEGIC_PLAN_DEFINITIONS.find(p => p.id === planId);
  const role = plan?.role || 'Principal Solutions Architect';
  const title = plan?.title || 'Technical Plan';

  return `
${SPEC_AGENT_SYSTEM_DIRECTIVE}

Act as the ${role}.
Synthesize the authoritative, production-ready document "${title}" (${plan?.filename}) for the project "${projectName}".

INPUT SRS REQUIREMENTS:
${formattedInputs}

DOCUMENT MANDATORY REQUIREMENTS:
${getPlanSpecificRequirements(planId, projectName)}

Output in structured, clean GitHub-flavored Markdown. Do not include meta commentary or introductory remarks.
`;
}

function getPlanSpecificRequirements(planId: StrategicPlanDocumentId, projectName: string): string {
  switch (planId) {
    case 'prd':
      return `
1. Executive Vision & Value Proposition (Scope, primary users, core problem solved).
2. Detailed User Persona Matrix (Role, responsibilities, permissions, pain points, daily jobs-to-be-done).
3. Release Scope Boundaries (Explicit In-Scope for v1.0 vs Deferred to v2.0).
4. Functional Feature Specifications (Every core feature broken down by inputs, trigger logic, and outputs).
5. User Journeys & Gherkin Scenarios (High-priority flows in strict Given/When/Then syntax).
6. Non-Negotiable Success Metrics & SLAs (Latency P95 < 200ms, 99.9% availability, security standards).
`;

    case 'designs':
      return `
1. Design System & Visual Palette (Dark theme hex codes, typography scale, spacing tokens, WCAG 2.1 AA accessibility).
2. Complete Application Route Table (Path, page component, access level: Public/Auth/Admin, layout wrapper).
3. Component Hierarchy & Prop Contracts (Key components, inputs, outputs, modal states).
4. Interactive UX States (Empty states, loading skeletons, error banners, optimistic mutation updates).
5. Responsive Breakpoint Adaptations (Mobile <640px, Tablet 640-1024px, Desktop >1024px).
`;

    case 'architecture':
      return `
1. End-to-End System Topology (Complete Mermaid flowchart showing Client, CDN, API Gateway, DB, Redis, Queue Workers, MCP server).
2. Architectural Pattern & Clean Layering (Presentation -> Controller -> Service -> Repository -> Persistence).
3. Session & Authentication Lifecycle (Stateless JWTs, sliding refresh tokens, Redis token revocation blacklist, cookie security flags).
4. Asynchronous Queue Architecture (BullMQ/Redis event queues, dead-letter policies, idempotent worker retries).
5. Zero-Trust Security Strategy (AES-256 at rest, TLS 1.3 in transit, CORS whitelist, CSRF prevention, rate limiting).
`;

    case 'tech_spec':
      return `
1. Canonical Entity-Relationship Model (All entities, primary keys UUIDv4, foreign keys, relationships).
2. Executable Database DDL (Production PostgreSQL SQL with CREATE TABLE, CREATE INDEX on tenant_id, triggers, Row-Level Security).
3. Machine-Verifiable API Endpoints (OpenAPI 3.1 REST contracts with headers, request schemas, 200/201 response schemas, and 4xx/5xx error models).
4. System Business Invariants (DR-001 tenant isolation, DR-002 payment idempotency, DR-003 immutable audit trails, DR-004 hard quota gates).
5. Third-Party Integration Specifications (Payment gateway webhooks with HMAC-SHA256 signature verification, cloud storage presigned URLs).
`;

    case 'roadmap':
      return `
1. Dynamic Atomic Task Backlog (15 to 25+ numbered tasks TASK-001..NNN derived from the technical architecture, each with complexity XS/S/M/L/XL, type, dependencies, and autonomous agent prompt).
2. Task Dependency Directed Acyclic Graph (Mermaid flowchart linking all task dependencies).
3. 4-Sprint Milestone Roadmap (Sprint 1 Foundation/Schema, Sprint 2 Auth/Security/Domain, Sprint 3 UI/Integrations, Sprint 4 MCP/QA/Deploy).
4. Milestone Deliverables & Technical Definition of Done (DoD).
`;

    case 'risk':
      return `
1. Threat Modeling & Attack Surface (OWASP Top 10 vulnerabilities: SQLi, XSS, SSRF, BOLA, and concrete code mitigations).
2. Regulatory Compliance Checklist (Specific controls for GDPR, SOC 2 Type II, HIPAA data anonymization).
3. Failure Modes & System Resilience (DB failover, external API circuit breakers, queue backpressure handling).
4. Initial Architecture Decision Records (ADR-001 through ADR-003 with context, decision, and consequences).
5. Known Technical Debt Backlog (Deferred optimizations with mitigation workarounds).
`;

    case 'qa':
      return `
1. Test Automation Pyramid (70% Unit, 20% Integration, 10% End-to-End).
2. Unit Testing Standards (Vitest test conventions, mocking rules, and mandatory 85%+ branch coverage gates).
3. API Integration Test Matrix (Supertest scenarios covering happy paths, validation errors, auth rejection, multi-tenant boundaries).
4. End-to-End User Journeys (Playwright browser automation specs for registration, core domain mutations, and data exports).
5. Load & Latency Testing Strategy (Performance assertions verifying P95 < 200ms under expected user scale).
`;

    case 'deployment':
      return `
1. Multi-Stage Container Specification (Production-hardened Dockerfile with non-root security user).
2. Multi-Container Orchestration (Complete docker-compose.yml for application, PostgreSQL, Redis, and health checks).
3. CI/CD Automation Pipeline (GitHub Actions deploy workflow executing lint, typecheck, unit tests, integration tests, and preview deploy).
4. Environment Variable & Secret Specification (Complete .env.example matrix with variable name, description, and security level).
5. Rollback Strategy & Disaster Recovery (Zero-downtime rolling deploys, database migration rollbacks, automated snapshot schedule).
`;
  }
}
