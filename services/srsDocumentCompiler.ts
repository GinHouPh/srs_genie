import { GeneratedContent, ProjectInput, SRSFormData } from '../types';

/**
 * Compiles the entire specification package into a formal, consolidated IEEE 830-compliant SRS Document.
 */
export function compileConsolidatedIeee830SRS(
  content: GeneratedContent,
  projectInput?: ProjectInput
): string {
  const specs = content.specsHierarchy || {};
  const plans = content.strategicPlans || {};
  const meta = content.projectMeta;
  const fd: SRSFormData = projectInput?.formData || {};

  const projectName = meta?.projectName || projectInput?.name || 'Enterprise System';
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
  const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const techStack = meta?.techStack?.join(', ') || 'Node.js, PostgreSQL, React 19, Tailwind CSS';

  // Extract relevant sections from specs or provide structured fallbacks
  const brief = specs['foundation/brief.md'] || '';
  const glossary = specs['foundation/glossary.md'] || '';
  const userStories = specs['domain/user_stories.md'] || '';
  const domainRules = specs['domain/domain_rules.md'] || '';
  const systemDesign = specs['architecture/system_design.md'] || '';
  const dataModel = specs['architecture/data_model.md'] || '';
  const securityModel = specs['architecture/security_model.md'] || '';
  const apiContracts = specs['contracts/api_contracts.md'] || '';
  const dbSchema = specs['contracts/database_schema.md'] || '';
  const uiContracts = specs['contracts/ui_contracts.md'] || '';
  const backendGuide = specs['implementation/backend_guide.md'] || '';
  const frontendGuide = specs['implementation/frontend_guide.md'] || '';
  const infrastructure = specs['implementation/infrastructure.md'] || '';
  const testingStrategy = specs['implementation/testing_strategy.md'] || '';
  const codingStandards = specs['implementation/coding_standards.md'] || '';
  const sprintPlan = specs['execution/sprint_plan.md'] || '';

  return `# Software Requirements Specification (SRS)
## For **${projectName}**
### Standard: IEEE Std 830-1998 Compliant

---

| Document Attribute | Specification Detail |
| :--- | :--- |
| **System Title** | ${projectName} |
| **Industry / Domain** | ${industry} |
| **Project Nature** | ${projectType} |
| **Document Version** | 1.0.0 (Baselined Specification) |
| **Date of Issue** | ${dateStr} |
| **Status** | Approved & Ready for Autonomous Engineering |
| **Technology Stack** | ${techStack} |
| **Primary Architecture** | Micro-Agent Specification Architecture (SRS Genie™) |

---

## Document Control & Revision History

| Version | Date | Author / Agent | Summary of Changes |
| :--- | :--- | :--- | :--- |
| 1.0.0 | ${dateStr} | SRS Genie™ Autonomous Spec Engine | Initial IEEE 830 baselined specification synthesized from multi-tier domain questionnaire. |

---

## Table of Contents

1. [1. Introduction](#1-introduction)
   - 1.1 [Purpose](#11-purpose)
   - 1.2 [Document Conventions](#12-document-conventions)
   - 1.3 [Intended Audience & Reading Suggestions](#13-intended-audience--reading-suggestions)
   - 1.4 [Project Scope & Boundary Constraints](#14-project-scope--boundary-constraints)
   - 1.5 [Domain Glossary & Definitions](#15-domain-glossary--definitions)
2. [2. Overall System Description](#2-overall-system-description)
   - 2.1 [Product Perspective](#21-product-perspective)
   - 2.2 [User Classes and Personas](#22-user-classes-and-personas)
   - 2.3 [Operating Environment & Infrastructure](#23-operating-environment--infrastructure)
   - 2.4 [Design & Implementation Constraints](#24-design--implementation-constraints)
   - 2.5 [Assumptions and Dependencies](#25-assumptions-and-dependencies)
3. [3. System Features & Domain Invariants](#3-system-features--domain-invariants)
   - 3.1 [Core Business Rules & Invariants](#31-core-business-rules--invariants)
   - 3.2 [User Stories & Acceptance Criteria (Gherkin)](#32-user-stories--acceptance-criteria-gherkin)
4. [4. External Interface Requirements & System Architecture](#4-external-interface-requirements--system-architecture)
   - 4.1 [System Design & Component Topology](#41-system-design--component-topology)
   - 4.2 [Canonical Data Model](#42-canonical-data-model)
   - 4.3 [API Contracts & Interface Payload Schemas](#43-api-contracts--interface-payload-schemas)
   - 4.4 [Database Schema & Migrations DDL](#44-database-schema--migrations-ddl)
   - 4.5 [UI Component & State Contracts](#45-ui-component--state-contracts)
5. [5. Non-Functional Requirements & Security Qualities](#5-non-functional-requirements--security-qualities)
   - 5.1 [Security, Authentication & RBAC Matrix](#51-security-authentication--rbac-matrix)
   - 5.2 [Performance, Scalability & Telemetry](#52-performance-scalability--telemetry)
   - 5.3 [Software Quality Attributes](#53-software-quality-attributes)
6. [6. Verification, Testing & Implementation Roadmap](#6-verification-testing--implementation-roadmap)
   - 6.1 [Quality Assurance & Testing Strategy](#61-quality-assurance--testing-strategy)
   - 6.2 [Sprint Roadmap & Release Checkpoints](#62-sprint-roadmap--release-checkpoints)
   - 6.3 [Coding Standards & Engineering Guidelines](#63-coding-standards--engineering-guidelines)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the definitive functional and non-functional requirements for the development of **${projectName}**. It defines the architectural invariants, interface contracts, security parameters, and execution roadmap intended for autonomous AI coding agents (Cursor, Claude Code, Windsurf, Antigravity) and human software engineering teams.

### 1.2 Document Conventions
- **RFC 2119 Key Words:** The terms **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **RECOMMENDED**, and **OPTIONAL** are to be interpreted as described in RFC 2119.
- **Traceability:** Requirements and tasks carry explicit alphanumeric identifiers (e.g. \`DR-001\` for domain rules, \`US-001\` for user stories, \`TASK-001\` for tasks).

### 1.3 Intended Audience & Reading Suggestions
- **AI Coding Agents:** Parse Section 4 (Contracts) and Section 3 (Invariants) before generating code.
- **Engineering Leads & Architects:** Review Section 2 and Section 4.1 for component boundaries.
- **QA & Test Engineers:** Reference Section 3.2 and Section 6.1 for acceptance test matrices.
- **Product Stakeholders:** Review Section 1.4, Section 2.2, and Section 6.2 for milestone delivery.

### 1.4 Project Scope & Boundary Constraints
${brief ? brief.replace(/^#+.*$/gm, '#### $&') : `The system delivers high-throughput capabilities for ${projectName} in the ${industry} domain.`}

### 1.5 Domain Glossary & Definitions
${glossary ? glossary.replace(/^#+.*$/gm, '#### $&') : `Canonical terminology documented in .specs/foundation/glossary.md.`}

---

## 2. Overall System Description

### 2.1 Product Perspective
${projectName} operates as an enterprise-grade cloud system engineered with modern distributed microservices and clean architectural patterns.

### 2.2 User Classes and Personas
${(fd['target_audience']?.['primary_persona'] as string) ? `**Primary Persona:** ${fd['target_audience']['primary_persona']}` : `The platform accommodates administrative operators, authenticated clients, and automated API agents.`}

### 2.3 Operating Environment & Infrastructure
${infrastructure ? infrastructure.replace(/^#+.*$/gm, '#### $&') : `Containerized deployment via Docker and production Kubernetes/ECS clusters.`}

### 2.4 Design & Implementation Constraints
- Strict multi-tenant isolation enforced at the database and application levels.
- Mandatory schema migrations and versioned database changes.
- Stateless authentication with zero-trust RBAC token verification.

### 2.5 Assumptions and Dependencies
- Cloud relational database availability with SSL/TLS encryption in transit and at rest.
- External payment gateway and AI provider availability adhering to defined SLAs.

---

## 3. System Features & Domain Invariants

### 3.1 Core Business Rules & Invariants
${domainRules ? domainRules.replace(/^#+.*$/gm, '#### $&') : `Domain invariants enforce business logic constraints and data validation rules.`}

### 3.2 User Stories & Acceptance Criteria (Gherkin)
${userStories ? userStories.replace(/^#+.*$/gm, '#### $&') : `User stories and Gherkin scenarios define acceptance test criteria.`}

---

## 4. External Interface Requirements & System Architecture

### 4.1 System Design & Component Topology
${systemDesign ? systemDesign.replace(/^#+.*$/gm, '#### $&') : `Component architecture diagram and dataflow models.`}

### 4.2 Canonical Data Model
${dataModel ? dataModel.replace(/^#+.*$/gm, '#### $&') : `Entity relationship model and relational attributes.`}

### 4.3 API Contracts & Interface Payload Schemas
${apiContracts ? apiContracts.replace(/^#+.*$/gm, '#### $&') : `RESTful OpenAPI endpoints and payload schemas.`}

### 4.4 Database Schema & Migrations DDL
${dbSchema ? dbSchema.replace(/^#+.*$/gm, '#### $&') : `Relational database DDL and table definitions.`}

### 4.5 UI Component & State Contracts
${uiContracts ? uiContracts.replace(/^#+.*$/gm, '#### $&') : `UI component hierarchy, route map, and UX states.`}

---

## 5. Non-Functional Requirements & Security Qualities

### 5.1 Security, Authentication & RBAC Matrix
${securityModel ? securityModel.replace(/^#+.*$/gm, '#### $&') : `Authentication, token lifecycle, and role-based access control matrix.`}

### 5.2 Performance, Scalability & Telemetry
- Sub-200ms p95 latency on standard read API endpoints.
- High-concurrency query execution with caching layers.
- Centralized audit logging capturing actor, timestamp, action, and resource identifiers.

### 5.3 Software Quality Attributes
- **Maintainability:** Modular architecture with high cohesion and loose coupling.
- **Reliability:** Automated health endpoints, graceful degradation, and structured error handling.
- **Portability:** Containerized microservices deployable across Docker, VPS, and cloud environments.

---

## 6. Verification, Testing & Implementation Roadmap

### 6.1 Quality Assurance & Testing Strategy
${testingStrategy ? testingStrategy.replace(/^#+.*$/gm, '#### $&') : `Unit, integration, and end-to-end testing guidelines.`}

### 6.2 Sprint Roadmap & Release Checkpoints
${sprintPlan ? sprintPlan.replace(/^#+.*$/gm, '#### $&') : `Milestone roadmap and sprint schedule.`}

### 6.3 Coding Standards & Engineering Guidelines
${codingStandards ? codingStandards.replace(/^#+.*$/gm, '#### $&') : `TypeScript strict-mode coding conventions and linting rules.`}

---
*End of IEEE Std 830-1998 Software Requirements Specification for ${projectName}.*
`;
}
