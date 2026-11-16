import { SRSFormData } from '../types';
import {
  PARENT_PROJECT_PLAN_TEMPLATE,
  PRD_TEMPLATE,
  DESIGNS_TEMPLATE,
  ARCHITECTURE_TEMPLATE,
  TECHNICAL_SPECIFICATION_TEMPLATE,
  ROADMAP_TEMPLATE
} from './planningTemplates';

export type StrategicPlanDocumentId =
  | 'project_plan'
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
    id: 'project_plan',
    filename: 'project_plan.md',
    title: 'Parent Project Plan (Master Blueprint)',
    role: 'Principal Enterprise Solutions Architect & Lead Project Planner',
    description: 'Comprehensive 26-part software development project plan with business analysis, scope, WBS, risk, cost, operations, and traceability.',
    downstreamSpecs: ['foundation/brief.md', 'foundation/glossary.md', 'execution/tasks.md', 'state/decisions_log.md']
  },
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
- Absolutely NO placeholders like "[TBD]", "[Add details later]", or "TODO" when actionable facts are available or can be logically derived.
- Classify information rigorously: Confirmed, Derived, Proposed, Assumed, Pending, Out of Scope, Not Applicable.
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

  // Attach master template reference if available
  const templateReference = planId === 'project_plan'
    ? `\n\nAUTHORITATIVE PARENT PROJECT PLAN TEMPLATE STRUCTURE TO ADHERE TO:\n${PARENT_PROJECT_PLAN_TEMPLATE}\n`
    : planId === 'prd'
    ? `\n\nAUTHORITATIVE PRD TEMPLATE STRUCTURE TO ADHERE TO:\n${PRD_TEMPLATE}\n`
    : planId === 'designs'
    ? `\n\nAUTHORITATIVE DESIGN SYSTEM TEMPLATE STRUCTURE TO ADHERE TO:\n${DESIGNS_TEMPLATE}\n`
    : planId === 'architecture'
    ? `\n\nAUTHORITATIVE SOFTWARE ARCHITECTURE TEMPLATE STRUCTURE TO ADHERE TO:\n${ARCHITECTURE_TEMPLATE}\n`
    : planId === 'tech_spec'
    ? `\n\nAUTHORITATIVE TECHNICAL SPECIFICATION TEMPLATE STRUCTURE TO ADHERE TO:\n${TECHNICAL_SPECIFICATION_TEMPLATE}\n`
    : planId === 'roadmap'
    ? `\n\nAUTHORITATIVE PROJECT ROADMAP TEMPLATE STRUCTURE TO ADHERE TO:\n${ROADMAP_TEMPLATE}\n`
    : '';

  return `
${SPEC_AGENT_SYSTEM_DIRECTIVE}

Act as the ${role}.
Synthesize the authoritative, production-ready document "${title}" (${plan?.filename}) for the project "${projectName}".

INPUT SRS REQUIREMENTS:
${formattedInputs}

DOCUMENT MANDATORY REQUIREMENTS:
${getPlanSpecificRequirements(planId, projectName)}
${templateReference}
Output in structured, clean GitHub-flavored Markdown. Do not include meta commentary or introductory remarks.
`;
}

function getPlanSpecificRequirements(planId: StrategicPlanDocumentId, projectName: string): string {
  switch (planId) {
    case 'project_plan':
      return `
1. Strictly follow the 26-part Parent Project Plan template structure:
   - PART 1: Project Overview (Identification, Description, Background, Vision, Mission, Value Proposition)
   - PART 2: Business Analysis & Objectives (Problem Statement, Objectives, Requirements BR-001.., Expected Outcomes, KPIs, Constraints, Assumptions, Dependencies)
   - PART 3: Project Scope (Scope Statement, In-Scope, Out-of-Scope, Future Scope, Boundaries, Scope Change Management)
   - PART 4: Stakeholder & User Analysis (Register STK-001.., Responsibilities, Communication, User Categories, Personas, User Journey, Access & Lifecycle)
   - PART 5: Product Requirements (Overview, Goals, Capabilities, Differentiators, Release Strategy)
   - PART 6: Functional Requirements & Feature Breakdown (Feature Inventory FEAT-001.., FR-001.. Register, Modules & Submodules, Specifications, Business Rules BRULE-001.., Workflows, User Stories US-001.., Use Cases)
   - PART 7: Non-Functional Requirements (Performance, Scalability, Availability, Security, Privacy, Usability, Maintainability, Compatibility, Data Integrity, NFR-001.. Register)
   - PART 8: Technical Architecture (Overview, Style, Component Register ARC-001.., Frontend/Backend/Database/API/Integration/Infra Architecture, Mermaid Topology Diagram, ADRs)
   - PART 9: Technology Stack & Tooling (Selected Tech Stack table, Evaluation, Development Tools, Coding Standards)
   - PART 10: Database & Data Management (Data Requirements, Entity Inventory ENT-001.., ER Planning, DDL Schema, Data Flow, Migration, Backup, Governance)
   - PART 11: UI/UX & Design Planning (Design Objectives, Design System, Navigation, Screen Inventory UI-001.., Screen Specs, Interaction, Accessibility, Deliverables)
   - PART 12: Integrations & External Services (Integration Inventory INT-001.., Specs, Webhooks, Dependencies, Testing)
   - PART 13: Security & Compliance (Architecture, IAM, AppSec OWASP baseline, Data/Infra Security, Compliance, Testing)
   - PART 14: Development Methodology & Work Breakdown (Methodology selection, Lifecycle, WBS, Work Packages, Task Register TASK-001.., Workstreams, Standards, DoR, DoD)
   - PART 15: Project Phases & Milestones (Phase 1-10 Planning, Milestone Register MS-001.., Release Roadmap, Critical Path, Schedule Constraints)
   - PART 16: Team & Resource Planning (Roles, Resource Allocation, RACI Matrix, Skills, Constraints)
   - PART 17: Testing & Quality Assurance (QA Objectives, Scope, Levels, Types, Environments, Test Case Register TC-001.., Defect Management, Quality Gates, Metrics)
   - PART 18: DevOps, Deployment & Release (Environments, CI/CD, Containerization, IaC, Deployment Strategy, Release Mgmt, Production Readiness Checklist)
   - PART 19: Operations & Maintenance (Observability, Operational Procedures, SLOs, Disaster Recovery, Maintenance, Escalation)
   - PART 20: Cost & Budget Planning (Development, Infra, Third-Party, Licenses, Operational, Budget Summary table)
   - PART 21: Risk & Issue Management (Risk Register RISK-001.., Analysis, Issues, Blockers, Change Management)
   - PART 22: Documentation & Deliverables (Planning, Design, Dev, Test, Deploy, Ops Docs, Deliverable Register DEL-001..)
   - PART 23: Project Acceptance & Closure (Completion, Functional/Technical/Operational Acceptance, Sign-Off, Closure)
   - PART 24: Future Enhancements (Register ENH-001.., Scalability, Product Expansion, Technical Debt, Long-Term Maintenance)
   - PART 25: Requirements Traceability (RTM Table: REQ-001.. mapping Objective, Feature, Task, Test Case, Acceptance Status, Change Impact)
   - PART 26: Project Plan Summary (Executive Summary, Project Health Snapshot table, Outstanding Decisions DEC-001.., Final Planning Recommendations)
   - APPENDIX A: Standard Project Enumerations
   - APPENDIX B: Document Generation Validation Checklist
2. Adhere to Information Classification Rules (Confirmed, Derived, Proposed, Assumed, Pending, Out of Scope, Not Applicable).
3. Populate all tables and sections with concrete project-specific engineering content.
`;

    case 'prd':
      return `
1. Strictly follow the 27-section PRD template structure:
   - SECTION 1: Product Foundation (Product Information table, Detailed Description, Background, Vision Statement, Mission, Value Proposition table, Positioning)
   - SECTION 2: Problem Definition & Business Objectives (Primary/Secondary Problems, Current Limitations, Consequences, Objectives, Success Criteria OBJ-001.. table, KPIs)
   - SECTION 3: Target Users & Personas (Primary/Secondary Audience, Segmentation, Persona Tables PERSONA-001.. with Goals/Needs/Pain Points/Technical Proficiency, Motivations, Environment)
   - SECTION 4: Product Scope (Scope Statement, In-Scope, Out-of-Scope, Future Scope, Boundaries, Scope Constraints)
   - SECTION 5: Product Structure & Information Architecture (Area Inventory AREA-001.., Module Inventory MOD-001.., Submodules SUB-001.., Feature Inventory FEAT-001.., Navigation, Information Architecture)
   - SECTION 6: Functional Requirements (Register FR-001.. with Detailed Specification: Actor, Trigger, Preconditions, Inputs, Processing Logic, Expected Response, Error States, Acceptance Criteria; MoSCoW prioritization, Feature Decomposition, CRUD)
   - SECTION 7: User Stories & Use Cases (User Stories US-001.. with Given/When/Then acceptance criteria; Use Cases UC-001.. with main & alternative flows)
   - SECTION 8: Business Logic & Rules (Business Rule Register RULE-001.., Validation Rules, Conditional Logic, Calculation Rules, State Machine & Status Management, Approval Workflows)
   - SECTION 9: User Workflows & Process Flows (Workflow Inventory WF-001.., Step-by-Step Flow, Mermaid sequence or flowchart diagrams, Cross-Module Workflows)
   - SECTION 10: UI/UX & Interface Requirements (Design Vision, Tokens, Screen Inventory SCR-001.. with layout/components/states, Navigation, Forms, Search/Filter, Notifications)
   - SECTION 11: Product Data Requirements (Data Overview, Entity Inventory DATA-001.., Attributes, Relationships, Lifecycle, Import/Export, Audit & Retention)
   - SECTION 12: API & Integration Requirements (API Inventory API-001.., Endpoints, Methods, Schemas; External Integrations INT-001.., Webhooks)
   - SECTION 13: Non-Functional Requirements (Quality Attributes: Performance P95 latency, Scalability, Availability 99.9%, Reliability, Security, Privacy, Compatibility, NFR-001.. Register)
   - SECTION 14: Authentication, Authorization & Permissions (Auth methods, Account Lifecycle, Role Inventory ROLE-001.., Permission Matrix)
   - SECTION 15: Analytics & Reporting (Product Analytics, Event Tracking EVT-001.., Reporting Requirements, KPI Dashboards)
   - SECTION 16: Notifications & Communication (Channels, Notification Inventory NOTIF-001.., Preferences, Templates)
   - SECTION 17: Platform-Specific Requirements (Web/Mobile/SaaS/API requirements, Multi-tenancy, Subscription/Entitlements)
   - SECTION 18: Specialized Product Requirements (Domain-specific rules: AI/Agents, E-Commerce, Financial, Healthcare, or Collaboration)
   - SECTION 19: Content & File Management (Upload/Download, formats, storage limits, retention)
   - SECTION 20: System States, Errors & Exception Handling (Entity States, Error Categories, Error Specs, Recovery & Retry)
   - SECTION 21: Security, Privacy & Compliance (Controls, Sensitive Data, Encryption, Audit, Compliance Standards)
   - SECTION 22: Configuration & Customization (Global/Tenant/User settings, Custom fields/workflows)
   - SECTION 23: Product Release & Acceptance (MVP Scope table v1.0 vs v1.1 vs v2.0, Acceptance Criteria, Quality Gates)
   - SECTION 24: Dependencies & Constraints (Dependency Register DEP-001.., Constraints, Assumptions ASM-001.., Risk Register RISK-001..)
   - SECTION 25: Requirements Traceability (RTM Matrix mapping Objective -> Need -> Feature -> FR ID -> User Story -> Acceptance Criteria)
   - SECTION 26: Open Questions & Decisions (Open Questions Q-001.., Product Decision Register DEC-001..)
   - SECTION 27: PRD Summary & Approval (Executive Summary, Health Check table, Approval Sign-Off table)
   - APPENDIX A: Standard Identification System (AREA, MOD, SUB, FEAT, FR, NFR, RULE, US, UC, WF, SCR, DATA, API, INT, NOTIF, EVT, ROLE, DEP, ASM, RISK, Q, DEC)
   - APPENDIX B: Standard Enumerations
   - APPENDIX C: Final PRD Validation Checklist (all checkboxes verified)
2. Use Source Classifications: User-Confirmed, Stakeholder-Confirmed, Derived, Proposed, Assumed, Pending Confirmation, Out of Scope, Not Applicable.
3. Every requirement must be clear, specific, atomic, testable, and traceable.
`;

    case 'designs':
      return `
1. Strictly follow the 30-section Design System template structure:
   - SECTION 1: Design System Overview (Identification table DS-001, Purpose, Vision, Objectives, Scope, Boundaries, Supported Products PROD-001 table)
   - SECTION 2: Design Philosophy & Principles (Overall Philosophy, Visual Personality, Core Design Principles, UX Principles, Visual Principles, Direction, References REF-001 table)
   - SECTION 3: Brand Identity & Visual Identity (Brand Overview, Attributes, Voice, Logo System, Usage Rules, Brand Colors, Typography, Brand Assets, Brand-to-Product Translation)
   - SECTION 4: Design Token Architecture (Multi-layer Architecture: Layer 1 Primitive, Layer 2 Semantic, Layer 3 Component; Naming Convention category.property.variant.state, Token Metadata table, Dependency Mapping, Platform Mapping, Export Formats JSON/CSS/Tailwind)
   - SECTION 5: Color System (Philosophy, Categories: Brand, Neutral, Semantic, Surface, Text, Border; Palette Specification table with HEX/RGB/HSL, Semantic Color Mapping table Light vs Dark, Interaction States, Contrast WCAG 2.1 AA/AAA, Usage Rules, Themes)
   - SECTION 6: Typography System (Font Families: Primary, Secondary, Display, Monospace; Usage, Type Scale table Display/Heading/Body/Label/Caption/Code with sizes/weights/line-heights, Heading Hierarchy, Formatting, Responsiveness, Accessibility)
   - SECTION 7: Spacing & Dimension System (Philosophy 4px/8px grid, Spacing Scale table Space-0..9, Categories, Sizing System, Control Sizes, Layout Dimensions, Density Modes)
   - SECTION 8: Borders, Radii, Shadows & Elevation (Borders, Border Radius Scale table Radius None..Full, Shadow System table Shadow XS..XL, Elevation Levels, Outline System)
   - SECTION 9: Iconography & Visual Assets (Philosophy, Library Lucide React, Categories, Icon Sizing table Icon XS..XL, Usage Rules; Illustrations, Photography, Product Images, Empty-States, Asset Management)
   - SECTION 10: Layout & Grid System (Philosophy, Grid System, Responsive Breakpoints table Mobile/Tablet/Laptop/Desktop/Wide, Container System, Application Shell, Layout Templates, Responsive Adaptation, Scroll Behavior)
   - SECTION 11: Motion & Animation System (Philosophy, Principles, Duration Scale table Motion Instant..Deliberate, Easing Functions, Animation Categories, Component Motion Specs, Reduced Motion, Performance)
   - SECTION 12: Layering & Overlay System (Z-Index Scale table Z-Base..Z-Top, Overlay Types Modal/Drawer/Popover/Tooltip/Dropdown, Overlay Behavior)
   - SECTION 13: Component Architecture (Philosophy, Hierarchy: Foundation, Primitive, Basic, Composite, Complex, Application Patterns; Component Identification table CMP-001.., Classification, Reusability, Naming Conventions, Dependencies)
   - SECTION 14: Individual Component Specification Template (Identification, Anatomy, Variants, Sizes, States, Properties table, Behavior, Content, Accessibility, Responsive Behavior, Do's & Don'ts, Examples, Acceptance Criteria)
   - SECTION 15: Component Library Inventory (Foundation, Buttons & Actions CMP-001.., Forms, Navigation, Data Display, Feedback, Overlay, Media, Data Visualization, Utility)
   - SECTION 16: Reusable Design Patterns (Pattern Identification, Pattern Inventory table PAT-001.., Common Patterns, Pattern Specs, Interaction Standards)
   - SECTION 17: Page & Screen Templates (Page Template Inventory table PAGE-001.., Standard Templates: Dashboard, Listing, Details, Form, Settings, Editor, Auth; Page Template Rules, Screen-to-Component Mapping)
   - SECTION 18: Application Shell & Navigation (Shell Structure, Header, Sidebar, Main Content, Footer, Navigation Behavior)
   - SECTION 19: Content Design & Microcopy (Philosophy, Writing Style, Microcopy Guidelines, Error Message Guidelines, Empty-State Guidelines, Localization, Terminology Dictionary table TERM-001..)
   - SECTION 20: Data Visualization System (Visualization Principles, Chart Types, Color System, Chart Components, Numeric Formatting, Chart Accessibility, Data Density)
   - SECTION 21: Responsive & Platform-Specific Design (Responsive Philosophy, Layout Rules, Mobile Interaction, Tablet Adaptation, Desktop Adaptation, Platform-Specific Design, Cross-Platform Consistency)
   - SECTION 22: Theme & Customization System (Theming Architecture: Light/Dark/System/High Contrast, Theme Token Mapping, Switching, Custom Branding, Customization Boundaries)
   - SECTION 23: Accessibility & Inclusive Design (Target WCAG 2.1 Level AA, Visual, Keyboard, Screen Reader, Cognitive, Motor, Accessibility Testing)
   - SECTION 24: Design Implementation Specification (Design-to-Code Architecture, Technology Mapping table with React 19 / Tailwind CSS, Token Implementation, Component Implementation, Component API Standards, Styling Standards, Framework Integration, Design Tool Integration, Consistency)
   - SECTION 25: Design Documentation & Handoff (Component Docs, Pattern Docs, Guidelines, Designer Handoff, Developer Handoff, Documentation Platform)
   - SECTION 26: Quality Assurance & Design Validation (Validation Objectives, Visual Testing, Interaction Testing, Accessibility Validation, Cross-Browser/Cross-Device, Design Consistency Audit, Component Acceptance Criteria)
   - SECTION 27: Design System Governance (Ownership, Contribution Guidelines, Review Process, Component Lifecycle, Change Management, Versioning SemVer, Deprecation Policy, Release Notes)
   - SECTION 28: Future Enhancements (Design System Roadmap, Maturity Assessment, Technical Debt)
   - SECTION 29: Design System Registers (Master Token Register TOK-001.., Master Component Register CMP-001.., Master Pattern Register PAT-001.., Design Decision Register DDEC-001.., Design Issue Register DISS-001..)
   - SECTION 30: Final Design System Summary (Executive Design Summary, Design System Readiness Assessment table, Outstanding Decisions, Final Recommendations)
   - APPENDIX A: Standard Identification System (DS, PROD, REF, TOK, CMP, PAT, PAGE, ICON, ASSET, DDEC, DISS)
   - APPENDIX B: Design System Enumerations (Status, Component Status, Source, Theme, Platform)
   - APPENDIX C: Final Design System Validation Checklist (all checkboxes verified)
2. Use Information Classifications: User-Confirmed, Brand-Confirmed, PRD-Derived, Design-Recommended, Assumed, Pending Approval, Out of Scope, Not Applicable.
3. Concrete token values, real hex codes, Tailwind classes, and accessibility ratios must be provided.
`;

    case 'architecture':
      return `
1. Strictly follow the 41-section Software Architecture Document (SAD) template structure:
   - SECTION 1: Architecture Overview & Context (Architecture ID ARC-001, Purpose, Vision, Scope, Boundaries, Architecture Classification, Supported Platforms)
   - SECTION 2: Architecture Drivers (Quality Attributes, Functional Drivers, Technical Constraints, Business Drivers, Architectural Assumptions, Driver Register ADRIVER-001..)
   - SECTION 3: System Context & Boundaries (Context Narrative, Context Diagram Mermaid, Actors & External Systems, System Invariants, Boundary Exclusions)
   - SECTION 4: Architecture Principles & Styles (Core Principles, Architectural Style, Style Trade-offs, Architectural Patterns, Antipatterns Avoided)
   - SECTION 5: High-Level System Architecture (System Architecture Overview, Top-Level Architecture Diagram Mermaid, High-Level Subsystems SUB-001.., Cross-Cutting Concerns)
   - SECTION 6: Component & Module Architecture (Component Breakdown CMP-001.., Module Structure, Component Interactions, Component Responsibility Matrix, Component Decoupling)
   - SECTION 7: Domain & Business Logic Architecture (Domain Model, Domain Boundaries / Bounded Contexts, Domain Entities & Aggregates, Domain Services & Business Rules, State Machines)
   - SECTION 8: Data Architecture & Persistence (Data Strategy, Storage Technologies, Conceptual Data Model, Logical Data Model, Relational Schema & Tables, Document & Key-Value Schemas, Caching Architecture Redis, Data Lifecycle, Migrations, Backup/DR)
   - SECTION 9: Multi-Tenancy Architecture (Tenant Model, Isolation Strategy RLS / Schema / DB, Tenant Lifecycle, Routing, Resource Governance, Cross-Tenant Protection)
   - SECTION 10: Application Layer Architecture (Application Architecture, Layering Model Presentation -> Application -> Domain -> Infrastructure, Controller & Route Design, Service Layer Design, Middleware Architecture)
   - SECTION 11: Frontend & Client Architecture (Frontend Overview React 19 / Vite, Client Architecture, Component Organization, State Management Zustand/TanStack Query, Routing, Asset Strategy)
   - SECTION 12: Backend & Service Architecture (Backend Overview Node.js/TypeScript, Service Decomposition, API Implementation, Background Workers & Schedulers BullMQ, Health Checks)
   - SECTION 13: API & Interface Architecture (API Strategy REST / GraphQL / gRPC / MCP, Endpoint Conventions, Contracts, Error Model RFC 7807, Rate Limiting & Throttling, Versioning, API Gateway)
   - SECTION 14: Integration & Messaging Architecture (Integration Strategy, Messaging BullMQ / Kafka, Event Schema & Contracts, Message Broker Architecture, Dead Letter Queues, Third-Party Integrations)
   - SECTION 15: Security Architecture (Security Posture Zero-Trust, AuthN & AuthZ stateless JWTs / refresh tokens / RBAC / ABAC, Data Protection at rest AES-256 / in transit TLS 1.3, Secret Management, Vulnerability & Threat Mitigations OWASP Top 10)
   - SECTION 16: Infrastructure & Cloud Architecture (Hosting Strategy, Compute, Network, Storage, DNS / CDN / Edge, Environments Dev/Staging/Prod)
   - SECTION 17: Containerization & Orchestration Architecture (Container Strategy Docker, Base Images, Container Security non-root, Docker Compose / Orchestration, Image Lifecycle)
   - SECTION 18: Observability, Logging & Monitoring (Observability Strategy, Logging Standards Pino / structured JSON, Metrics OpenTelemetry / Prometheus, Distributed Tracing, Alerting, Health Dashboards)
   - SECTION 19: Performance & Scalability Architecture (Performance Targets P95 < 200ms, Scaling Strategy horizontal / vertical, Caching Hierarchy, DB Optimization indexes / pooling, Bottleneck Analysis)
   - SECTION 20: Resilience, Fault Tolerance & High Availability (Availability Targets 99.9%, Redundancy, Circuit Breakers & Retries, Graceful Degradation, Disaster Recovery RTO / RPO)
   - SECTION 21: Configuration & Environment Management (Config Strategy, Env Var Hierarchy, Feature Flags, Drift Detection)
   - SECTION 22: Deployment & Release Architecture (Deployment Strategy zero-downtime rolling / blue-green, CI/CD Pipeline Architecture, Database Migration Strategy, Rollback Procedures)
   - SECTION 23: Development & Local Environment Architecture (Local Dev Setup Docker Compose, Tooling, Mocking, DX)
   - SECTION 24: Testing & Quality Architecture (Test Strategy, Test Automation Architecture, Test Data Management, Quality Gates)
   - SECTION 25: AI & Agent Integration Architecture (AI System Overview, Model Integration Gemini / Claude, Agent Architecture & Orchestration, Prompt Engineering & Templates, Context Management & Vector RAG, Guardrails, AI Observability)
   - SECTION 26: Compliance, Governance & Audit Architecture (Regulatory Compliance GDPR / SOC 2 / HIPAA, Audit Logging Architecture, Governance Framework)
   - SECTION 27: Cost Architecture & Resource Optimization (Cost Model, FinOps Strategy, Resource Sizing, Cost Optimization Controls)
   - SECTION 28: Architecture Decision Records (ADR-001 through ADR-005 with Context, Decision, Consequences, Alternatives)
   - SECTION 29: Architecture Risks & Technical Debt (Risk Register ARISK-001.., Known Technical Debt, Mitigation Strategies)
   - SECTION 30: System Evolution & Architecture Roadmap (Evolutionary Roadmap Phase 1-4, Sunsetting & Deprecation, Future-Proofing)
   - SECTION 31: Traceability & Requirements Mapping (Requirements-to-Architecture Traceability Matrix FR -> Architecture Component -> ADR)
   - SECTION 32: Operational Architecture & Runbook Fundamentals (Operational Model, Incident Management, Maintenance Procedures)
   - SECTION 33: Directory & Codebase Structure (Standard Project Layout, Source Tree, Monorepo / Polyrepo)
   - SECTION 34: Dependency Management Architecture (Dependency Strategy, Core Dependencies, Supply Chain Security)
   - SECTION 35: File & Content Management Architecture (Upload Pipeline, Object Storage S3 / GCS / Cloudflare R2, Media Processing, CDN Delivery)
   - SECTION 36: Internationalization & Localization Architecture (i18n Architecture, Timezone & Currency, Localization Pipeline)
   - SECTION 37: Analytics & Telemetry Architecture (Product Analytics, Event Pipeline, Data Warehouse Export)
   - SECTION 38: Search & Discovery Architecture (Search Architecture Full-Text / pg_trgm / Elasticsearch / Meilisearch, Indexing Pipeline, Query Processing)
   - SECTION 39: Notification & Communication Architecture (Notification Architecture BullMQ / WebSockets / Email / SMS, Delivery Reliability, Template Engine)
   - SECTION 40: System State & Lifecycle Architecture (State Machine Specifications, Entity Lifecycles, Session Management)
   - SECTION 41: Architecture Approval & Sign-Off (Executive Architecture Summary, Architecture Readiness Scorecard, Approval Sign-Off)
   - APPENDIX A: Architecture Identification Registers (ARC, ADRIVER, APP, CONT, COMP, MOD, DOM, SVC, DB, API, INT, EXT, DEPLOY, INFRA, MQ, EVT, THR, ARISK, ADR, DIA, DEP, REPO)
   - APPENDIX B: Architecture Enumeration Standards
   - APPENDIX C: Final Architecture Validation Checklist (all checkboxes verified)
2. Use Information Classifications: User-Confirmed, Requirements-Derived, Architecture-Standard, Assumed, Pending Confirmation, Out of Scope, Not Applicable.
3. Include production-grade technical specifics: Mermaid diagrams, actual port bindings, zero-trust policies, and explicit multi-tenant RLS schema DDL.
`;

    case 'tech_spec':
      return `
1. Strictly follow the 28-section Technical Specification Document (TSD) template structure:
   - SECTION 1: Specification Overview (Document Information table, Purpose, Scope, Objectives, Boundaries, Dependencies DEP-001..)
   - SECTION 2: Requirement References (Related PRD Requirements FR-001.., User Stories US-001.., Use Cases, Architecture Components, ADR References, Design System References)
   - SECTION 3: Technical Component Identification (Component Information table TCMP-001.., Purpose, Responsibilities, Boundaries, Dependencies, Interfaces, Lifecycle, Component Interaction Diagram Mermaid)
   - SECTION 4: Detailed Functional Technical Specifications (Feature Identification FEAT-001.., Feature Purpose, Functional Behavior, Feature Operations OP-001.., Operation Specification with Preconditions/Inputs/Processing/Output/Exceptions, Primary Flow, Alternative Flow, Exception Flow, Technical Business Rules, Dependencies)
   - SECTION 5: Application and Code Structure (Repository Reference, Existing Codebase Analysis, Folder Structure apps/ packages/ services/, File and Module Specification table, Naming Conventions, Dependency Management, Code Organization Rules, Reusability Requirements)
   - SECTION 6: Frontend Technical Specification (Frontend Component Information, Frontend Structure, Component Anatomy, Component Properties table, Variants, States, User Interaction, Form Handling, Frontend State Management Zustand/TanStack Query, API Integration, Routing, Responsive Behavior, Accessibility WCAG 2.1 AA, Acceptance Criteria)
   - SECTION 7: Backend Technical Specification (Backend Component, Backend Layer Structure Presentation/Controller/Service/Repository, Request Lifecycle Sequence Diagram Mermaid, Controller/Handler Specification, Service Specification, Repository Specification, Middleware Specification, Background Processing BullMQ, Backend State and Transactions, Acceptance Criteria)
   - SECTION 8: API Technical Specification (API Overview, API Identification table API-001.., Request Specification, Request Example JSON, Response Specification, Response Example JSON, Error Response Specification RFC 7807, API Authorization, API Validation Zod, API Behavior Idempotency/Pagination, API Versioning, API Test Requirements, OpenAPI 3.1 YAML snippet)
   - SECTION 9: Database Technical Specification (Database Identification, Entity Specification ENT-001.., Field Specification table FIELD-001.., Relationship Specification, Database Operations, Query Specifications, Indexing Strategy, Transaction Requirements, Migration Specification, Data Integrity RLS policies, Database Security)
   - SECTION 10: Data Contracts and Serialization (Data Contract Inventory table DC-001.., Data Transfer Objects DTOs TypeScript/Zod, Internal Data Models, Serialization Rules UTC/JSON, Data Mapping, Contract Compatibility)
   - SECTION 11: Business Logic and Algorithm Specification (Logic Inventory LOGIC-001.., Logic Specification, Algorithm Specification, Language-Independent Pseudocode, Formula Specification, Decision Logic, Concurrency Considerations, Deterministic Behavior)
   - SECTION 12: Workflow and State Machine Specification (Workflow Identification WF-001.., Workflow Steps, Workflow State Machine Mermaid stateDiagram-v2, Workflow Retry, Workflow Persistence, Workflow Sequence Diagram Mermaid, Acceptance Criteria)
   - SECTION 13: State Management and Data Synchronization (State Inventory, State Ownership, State Initialization, State Updates, State Persistence, Synchronization, Concurrent State Changes, State Recovery)
   - SECTION 14: Integration Technical Specifications (Integration Identification INT-001.., Connection Specification, Request/Response Mapping, Auth/Credentials, Retry & Failure Handling, Rate Limiting, Webhook Specifications HMAC-SHA256, Integration Monitoring)
   - SECTION 15: Authentication and Authorization Specification (Authentication Specification JWT/Argon2id, Authorization Specification RBAC/Permission Matrix, Permission Enforcement, Session Management, Service Authentication, Authentication Failure Behavior, Security Acceptance Criteria)
   - SECTION 16: Error Handling and Exception Specification (Error Classification, Error Register table ERR-001.., Error Specification, Error Propagation, Logging Requirements Pino/Structured, Fallback Behavior, Recovery Requirements)
   - SECTION 17: Validation and Data Integrity (Validation Layers Client/API/Domain/DB, Input Validation, Business Validation, Cross-Field Validation, Duplicate Prevention, Data Integrity)
   - SECTION 18: Performance and Security Requirements (Performance Targets table API P95 < 200ms, Performance Optimization, Security Controls OWASP Top 10, Sensitive Data Handling AES-256/TLS 1.3, Input/Output Security, Secrets Handling, Audit Requirements, Security Testing)
   - SECTION 19: Real-Time and Background Processing (Asynchronous Processing BullMQ/Redis, Real-Time Communication WebSocket/SSE, Scheduled Processing Cron)
   - SECTION 20: File and Media Processing (Upload Presigned S3/GCS, Processing Sharp/Compression, Download and Preview, Storage Lifecycle)
   - SECTION 21: Technical Configuration Specification (Configuration Inventory table CFG-001.., Environment Configuration Dev/Staging/Prod, Feature Flags, Secret Configuration, Configuration Validation)
   - SECTION 22: Testing and Verification Specification (Unit Testing Vitest >=85%, Component Testing, Integration Testing Supertest, API Testing, Database Testing, End-to-End Testing Playwright, Performance Testing k6, Security Testing, Regression Testing, Test Case Specification table TC-001.., Acceptance Criteria)
   - SECTION 23: Implementation and Code Quality Requirements (Coding Standards, Code Quality Zero Any, Git Standards Conventional Commits, Documentation Requirements, Definition of Done)
   - SECTION 24: Deployment and Runtime Specification (Deployment Unit Docker, Runtime Requirements Node 20 LTS, Environment Variables, Startup & Shutdown Graceful SIGTERM, Health Checks /health/live /health/ready, Deployment Dependencies, Rollback, Runtime Monitoring)
   - SECTION 25: Technical Dependencies and Compatibility (Dependency Inventory table PKG-001.., Dependency Compatibility, Dependency Security, External Dependency Failure, Technical Compatibility Matrix)
   - SECTION 26: Technical Risk and Change Management (Technical Risk Register table TRISK-001.., Technical Issue Register, Technical Debt Register, Change Impact Analysis)
   - SECTION 27: Implementation Task Breakdown (Task Inventory table TECH-TASK-001.., Task Specification, Implementation Sequence, Parallelization Opportunities, Critical Dependencies, AI Coding Agent Instructions)
   - SECTION 28: Final Specification Summary (Technical Summary, Technical Readiness Assessment table, Outstanding Technical Questions table TQ-001.., Technical Decisions TDEC-001.., Final Technical Recommendations)
   - APPENDIX A: Standard Identification System (TS, TCMP, OP, LOGIC, API, END, ENT, FIELD, DC, WF, STATE, ERR, CFG, DEP, TC, TECH-TASK, TRISK, TQ, TDEC)
   - APPENDIX B: Standard Technical Enumerations
   - APPENDIX C: Final Technical Specification Validation (all checkboxes verified)
2. Use Source Classifications: Requirement-Derived, Architecture-Derived, User-Confirmed, Existing-System, Engineering-Recommended, Assumed, Pending Approval, Out of Scope, Deprecated.
3. Every specification must be technically executable: real production SQL DDL with RLS, complete OpenAPI 3.1 YAML, concrete Zod schemas, and precise BullMQ worker definitions.
`;

    case 'roadmap':
      return `
1. Strictly follow the 20-section Project Roadmap Document template structure:
   - SECTION 1: Roadmap Overview (Project Information table, Purpose, Vision, Objectives, Scope & Boundaries, Success Criteria)
   - SECTION 2: Project Baseline and Planning Assumptions (Scope/Requirements/Architecture baselines, Delivery Constraints, Planning Assumptions table ASM-001.., Planning Dependencies, Estimation Confidence)
   - SECTION 3: Roadmap Structure (Hierarchy, Phase Inventory table PH-001.., Detailed Phase Specifications 1-11: Discovery, Design, Architecture, Foundation, Core Dev, Advanced Dev, Testing, UAT, Prod Readiness, Launch, Stabilization)
   - SECTION 4: Roadmap Workstreams (Workstream Register table WS-001.., Parallel vs Sequential Workstreams, Cross-Workstream Dependencies)
   - SECTION 5: Product Feature Roadmap (Feature Inventory table FEAT-001.., MoSCoW Prioritization, MVP Definition vs Deferred v1.1/v2.0 Scope, Feature Dependency Mapping)
   - SECTION 6: Release Roadmap (Release Strategy, Release Register table REL-001.., Release Specifications, Entry/Exit Criteria, Dependencies, Release Notes, Rollback)
   - SECTION 7: Milestone Planning (Milestone Register table MS-001.., Milestone Specifications, Critical Path Milestones, Milestone Approval)
   - SECTION 8: Timeline and Scheduling (Scheduling Baseline, Timeline Register table ROAD-001.., Scheduling Rules, Gantt Roadmap Mermaid diagram, Calendar Roadmap, Time Horizons)
   - SECTION 9: Dependency and Critical Path Management (Dependency Register table DEP-001.. FS/SS/FF, Critical Path Analysis Mermaid flowchart, Critical Path Register table, Risks & Resolution)
   - SECTION 10: Work Breakdown and Delivery Planning (WBS Hierarchy, WBS Register table WBS-001.., Work Package Specifications, Deliverable Mapping, Atomic Task Backlog TASK-001.. with autonomous agent prompts)
   - SECTION 11: Effort and Duration Estimation (Estimation Strategy Three-Point, Estimate Register table, Complexity Factors, Confidence, Contingency)
   - SECTION 12: Delivery Approval Gates (Stage Gates table GATE-001.., Entry/Exit Criteria, Gate Failure Handling)
   - SECTION 13: Agile and Iteration Planning (Scrum/Kanban Methodology, 4-Sprint Configuration table, Sprint Backlog table, Sprint Objectives, Dependencies, Acceptance)
   - SECTION 14: Quality and Testing Roadmap (Testing Workstreams, Testing Timeline table, Quality Gates, Defect Resolution Windows)
   - SECTION 15: Deployment and Release Roadmap (Deployment Phases, Environment Readiness, Deployment Activities, Deployment Milestones table DEPLOY-001.., Launch Strategy)
   - SECTION 16: Roadmap Progress and Performance (Progress Register table ROAD-001.., Measurement, Delivery Metrics, Schedule Variance, Health)
   - SECTION 17: Risk and Contingency Planning (Roadmap Risk Register table RRISK-001.., Categories, Response, Contingency Buffers, Scenario Planning Best/Expected/Worst)
   - SECTION 18: Roadmap Change Management (Governance, Change Request Register table RC-001.., Impact Analysis, Approval Workflow, Baseline Management)
   - SECTION 19: Roadmap Visualization (Executive, Product, Development, Timeline, Release, and Dependency Views)
   - SECTION 20: Final Roadmap Summary (Executive Summary, Roadmap Readiness Assessment table, Final Delivery Recommendations)
   - APPENDIX A: Roadmap Identification System (PH, WS, REL, MS, ROAD, WBS, DEP, GATE, TASK, DEPLOY, RRISK, RC)
   - APPENDIX B: Standard Enumerations
   - APPENDIX C: Final Roadmap Validation Checklist (all checkboxes verified)
2. Use Roadmap Classifications: Confirmed, Proposed, Estimated, Assumed, Pending, Deferred, Cancelled.
3. Every atomic task (TASK-001..NNN) must contain: Complexity (XS/S/M/L/XL), Type (Setup/Database/Backend/Frontend/QA/DevOps), Dependencies, and an explicit Autonomous Agent Prompt.
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
