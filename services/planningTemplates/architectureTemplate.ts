import { SRSFormData } from '../../types';

/**
 * Master Template: Software Architecture Document (SAD)
 * Supplied for the SpecAgent micro-agent to synthesize system architecture and security topologies.
 */
export const ARCHITECTURE_TEMPLATE = `# SOFTWARE ARCHITECTURE DOCUMENT (SAD)
## AI-Generated System Architecture Specification

**Document Type:** Software Architecture Document  
**Document Version:** 1.0  
**Project Name:** [Project Name]  
**Product Name:** [Product Name]  
**Architecture Name:** [Architecture Name]  
**Architecture ID:** [Architecture ID]  
**Document Status:** [Draft / Under Review / Approved / Implemented]  
**Prepared By:** AI Software Architecture Agent  
**Solution Architect:** [Name]  
**Technical Owner:** [Name]  
**Date Created:** [Date]  
**Last Updated:** [Date]  
**Target Architecture Version:** [Version]

---

# SECTION 0 — AI AGENT OPERATING INSTRUCTIONS

## 0.1 Agent Role

Act as a Senior Software Architect, Enterprise Solutions Architect, Cloud Architect, Application Architect, Database Architect, Security Architect, and Systems Design Engineer.

Your responsibility is to analyze the available project documentation and produce a comprehensive Software Architecture Document that translates approved product requirements into a technically feasible, maintainable, scalable, secure, and implementation-ready system architecture.

The architecture must serve as an authoritative technical reference for:

- Solution Architects.
- Technical Leads.
- Software Engineers.
- Frontend Developers.
- Backend Developers.
- Mobile Developers.
- Database Engineers.
- Cloud and DevOps Engineers.
- Security Engineers.
- QA Engineers.
- AI Coding Agents.
- Technical Project Managers.

## 0.2 Input Sources

The architecture agent may receive:

1. User Project Detail Summary.
2. Approved Project Plan.
3. Approved Product Requirements Document.
4. Design System Specification.
5. Existing Software Architecture Documents.
6. Existing System Documentation.
7. Existing Database Schemas.
8. API Specifications.
9. Infrastructure Documentation.
10. Deployment Diagrams.
11. Technology Preferences.
12. Reference Architecture Documents.
13. Existing Source Code or Repository Analysis.
14. Security and Compliance Requirements.

### Source Priority

When information conflicts, use the following precedence:

1. Explicit user instructions.
2. Approved business and product requirements.
3. Approved technical decisions.
4. Existing system constraints.
5. Approved architecture standards.
6. Technical recommendations.
7. AI-generated assumptions.

Do not silently override approved architecture decisions.

## 0.3 Architecture Generation Objectives

The agent must establish:

- System context.
- Architectural drivers.
- Architectural principles.
- Architecture style.
- System boundaries.
- Application structure.
- Logical architecture.
- Component architecture.
- Module boundaries.
- Service boundaries.
- Data architecture.
- Database architecture.
- API architecture.
- Integration architecture.
- Security architecture.
- Infrastructure architecture.
- Network architecture.
- Deployment architecture.
- Scalability strategy.
- Performance strategy.
- Resilience and recovery strategy.
- Monitoring and observability.
- Technology stack.
- Technical standards.
- Architecture decisions.
- Architectural constraints.
- Technical risks.
- Implementation guidance.

## 0.4 Source Classification

Every major architectural element must carry a source classification.

| Classification | Description |
|---|---|
| User-Confirmed | Explicitly specified by the user. |
| Requirement-Derived | Required by the approved PRD or business requirements. |
| Existing-System | Found in an existing architecture or codebase. |
| Architecture-Recommended | Recommended by the AI Architect. |
| Assumed | Temporarily assumed due to missing information. |
| Pending Approval | Requires stakeholder or technical approval. |
| Deprecated | Superseded by a newer decision. |
| Out of Scope | Explicitly excluded. |

## 0.5 Architecture Quality Rules

Every architectural decision should be:

- Justifiable.
- Technically feasible.
- Consistent with requirements.
- Maintainable.
- Secure.
- Scalable to the expected usage.
- Compatible with the selected technologies.
- Appropriate for the project's complexity.
- Documented with its trade-offs.
- Traceable to its underlying requirements.

Do not introduce unnecessary architectural complexity.

For example:

- Do not automatically recommend microservices.
- Do not introduce Kubernetes without justification.
- Do not introduce event-driven architecture merely because it is modern.
- Do not recommend multiple databases without a clear requirement.
- Do not introduce distributed infrastructure where a simpler deployment is sufficient.

## 0.6 Architecture Depth Adaptation

Adapt the document to the project's scale.

**Small Projects**
- Application architecture.
- Frontend and backend structure.
- Database design.
- API structure.
- Security basics.
- Deployment approach.

**Medium Projects**
- Modular architecture.
- Component architecture.
- Data flows.
- Integrations.
- Authentication and authorization.
- Infrastructure.
- Testing and deployment.
- Observability.

**Large Projects**
- Domain architecture.
- Service boundaries.
- Distributed communication.
- Data ownership.
- Scaling strategies.
- Infrastructure topology.
- Resilience.
- Security architecture.
- Disaster recovery.

**Enterprise Projects**
- Enterprise architecture alignment.
- Domain-driven design.
- Multi-tenancy.
- Identity federation.
- Governance.
- Regulatory controls.
- High availability.
- Disaster recovery.
- Service ownership.
- Operational governance.
- Architecture compliance.

## 0.7 Missing Information Policy

Use:

- [TBD] for unavailable information.
- [ASSUMPTION] for temporary technical assumptions.
- [PROPOSED] for architecture recommendations.
- [PENDING APPROVAL] for decisions requiring approval.
- [NOT APPLICABLE] for irrelevant sections.

Document major unknowns in the Architecture Open Questions Register.

Never invent infrastructure specifications, system capacity, performance benchmarks, or approved technical decisions.

## 0.8 Architecture Diagram Requirements

Generate relevant diagrams based on architectural complexity.

Potential diagrams include:

- System Context Diagram.
- Container Diagram.
- Component Diagram.
- Deployment Diagram.
- Infrastructure Diagram.
- Network Topology Diagram.
- Data Flow Diagram.
- Database ER Diagram.
- Sequence Diagram.
- Class Diagram.
- State Transition Diagram.
- Domain Model Diagram.
- Service Dependency Diagram.
- Event Flow Diagram.
- Security Trust Boundary Diagram.

Use consistent architectural notation, preferably C4 modeling for system context, containers, components, and deployments.

Diagrams must represent actual planned relationships, not merely decorate the document.

---

# SECTION 1 — ARCHITECTURE OVERVIEW

## 1. Architecture Identification

### 1.1 Architecture Information

| Field | Details |
|---|---|
| Project Name | [Project Name] |
| Product Name | [Product Name] |
| Architecture ID | [ID] |
| Architecture Name | [Name] |
| Architecture Type | [Type] |
| Architecture Version | [Version] |
| Architecture Owner | [Owner] |
| Primary Architect | [Architect] |
| Technical Lead | [Lead] |
| Target Platform | [Platform] |
| Deployment Model | [Cloud / On-Premises / Hybrid] |
| Architecture Status | [Status] |
| Related PRD | [Document Reference] |
| Related Project Plan | [Document Reference] |
| Related Design System | [Document Reference] |

### 1.2 Architecture Executive Summary

Provide a comprehensive summary of the proposed system architecture.

Include:

- Overall architecture approach.
- Primary architectural style.
- Main technology choices.
- System components.
- Application structure.
- Data storage strategy.
- Communication strategy.
- Security approach.
- Infrastructure strategy.
- Deployment model.
- Scalability considerations.
- Major architectural decisions.

### 1.3 Architecture Purpose

Explain why this architecture is being established and what engineering objectives it must fulfill.

### 1.4 Architecture Scope

Define:
- Systems included.
- Applications included.
- Services included.
- External systems.
- Infrastructure responsibilities.
- Technical boundaries.
- Excluded architectural areas.

### 1.5 Architecture Vision

Define the target technical state of the product.

### 1.6 Architecture Objectives

Identify objectives such as:

- Reliability.
- Maintainability.
- Scalability.
- Performance.
- Security.
- Modularity.
- Extensibility.
- Interoperability.
- Availability.
- Operational simplicity.
- Cost efficiency.

### 1.7 Architecture Deliverables

Identify the architecture artifacts that will be produced.

### 1.8 Architecture Audience

Identify stakeholders who will use or approve this document.

---

# SECTION 2 — ARCHITECTURAL DRIVERS AND REQUIREMENTS

## 2. Architectural Drivers

Architectural drivers are requirements and constraints that materially influence the system's technical design.

### 2.1 Business Drivers

Identify business objectives affecting architecture.

Examples:

- Rapid time to market.
- SaaS delivery.
- Enterprise integration.
- Global availability.
- Multi-tenant operations.
- Business process automation.
- Regulatory requirements.

### 2.2 Functional Drivers

Identify functional requirements that influence architectural decisions.

Examples:

- Real-time communication.
- Complex workflows.
- High-volume transactions.
- File processing.
- Background tasks.
- AI agent execution.
- External API communication.
- Multi-user collaboration.

### 2.3 Quality Attribute Requirements

Identify architecture-critical non-functional requirements.

### 2.4 Architecture Driver Register

| Driver ID | Driver | Category | Requirement | Architectural Impact |
|---|---|---|---|---|
| ADRIVER-001 | [Driver] | [Category] | [Requirement] | [Impact] |

## 3. Architectural Quality Attributes

### 3.1 Performance

Define:
- Response time expectations.
- Throughput.
- Concurrent requests.
- Processing time.
- Database latency.
- Network latency.
- Batch processing performance.

### 3.2 Scalability

Define:
- Expected user growth.
- Concurrent user growth.
- Data growth.
- Request volume.
- Compute scalability.
- Storage scalability.
- Geographic expansion.

### 3.3 Availability

Define:
- Availability targets.
- Acceptable downtime.
- Redundancy.
- Failover.
- Recovery expectations.

### 3.4 Reliability

Define:
- Failure handling.
- Fault tolerance.
- Data consistency.
- Retry behavior.
- Service recovery.

### 3.5 Maintainability

Define:
- Modularity.
- Code organization.
- Separation of concerns.
- Dependency management.
- Testing.
- Documentation.
- Versioning.

### 3.6 Security

Define:
- Authentication.
- Authorization.
- Data protection.
- Encryption.
- Audit logging.
- Secret management.
- Network security.

### 3.7 Interoperability

Define compatibility with:
- External APIs.
- Third-party platforms.
- Identity providers.
- Existing enterprise systems.
- Other applications.

### 3.8 Portability

Define requirements concerning:
- Hosting providers.
- Operating systems.
- Runtime environments.
- Database portability.
- Containers.
- Development environments.

### 3.9 Observability

Define requirements for:
- Logging.
- Monitoring.
- Metrics.
- Tracing.
- Alerting.
- Audit events.

### 3.10 Quality Attribute Scenarios

For each critical quality attribute, define:

- ID.
- Attribute.
- Source.
- Stimulus.
- Stimulus Source.
- Operating Environment.
- Expected System Response.
- Measurable Response.
- Verification Method.

Example:

A traffic increase should trigger an approved scaling mechanism while maintaining the established latency objective under the defined workload.

## 4. Architectural Constraints

Document all restrictions affecting architecture:

- User-mandated technologies.
- Legacy systems.
- Existing infrastructure.
- Hosting restrictions.
- Operating system restrictions.
- Licensing.
- Budget.
- Development team expertise.
- Regulatory requirements.
- Network restrictions.
- Vendor dependencies.

---

# SECTION 3 — ARCHITECTURAL PRINCIPLES AND STANDARDS

## 5. Architecture Principles

Establish principles governing architecture decisions.

Examples:

### 5.1 Separation of Concerns

Keep responsibilities clearly separated.

### 5.2 Single Responsibility

Each component should have a well-defined responsibility.

### 5.3 Loose Coupling

Minimize unnecessary dependencies between components.

### 5.4 High Cohesion

Group functionality that belongs together.

### 5.5 API-First Design

Define stable interfaces and contracts where appropriate.

### 5.6 Security by Design

Integrate security requirements throughout the architecture.

### 5.7 Data Ownership

Ensure clear ownership of business data.

### 5.8 Reusability

Prefer reusable components where doing so improves maintainability.

### 5.9 Observability by Design

Make system behavior measurable and diagnosable.

### 5.10 Simplicity over Unnecessary Complexity

Choose the simplest architecture that satisfies established requirements.

## 6. Engineering Standards

Define applicable standards for:

- Programming languages.
- Application frameworks.
- API conventions.
- Database conventions.
- Authentication.
- Authorization.
- Encryption.
- Logging.
- Error handling.
- Testing.
- Documentation.
- Version control.
- Deployment.
- Infrastructure management.

## 7. Architecture Compliance

Define how architecture standards will be reviewed and enforced.

Include:
- Architecture reviews.
- Technical approvals.
- Automated validation.
- Code quality checks.
- Security reviews.
- Dependency reviews.
- Architecture deviation management.

---

# SECTION 4 — SYSTEM CONTEXT AND BOUNDARIES

## 8. System Context

### 8.1 System Overview

Describe the system in its operating environment.

### 8.2 System Users

Identify:
- End Users.
- Administrators.
- Internal Operators.
- API Consumers.
- External Partners.
- Automated Systems.

### 8.3 External Systems

Identify systems interacting with the product.

### 8.4 Context Diagram

Generate a C4 Level 1 System Context Diagram.

The diagram should identify:
- The system.
- Human actors.
- External systems.
- Important relationships.
- Communication directions.

### 8.5 System Boundary

Explicitly distinguish responsibilities inside and outside the product.

### 8.6 Trust Boundaries

Identify security boundaries between users, applications, services, networks, and external systems.

### 8.7 External Dependency Register

| Dependency ID | External System | Purpose | Communication | Criticality |
|---|---|---|---|---|
| EXT-001 | [System] | [Purpose] | [Protocol] | [Level] |

## 9. System Context Analysis

Document:

- Inputs.
- Outputs.
- User interactions.
- External events.
- Third-party dependencies.
- Authentication boundaries.
- Data exchange.
- Failure dependencies.

---

# SECTION 5 — ARCHITECTURAL STYLE AND PATTERN SELECTION

## 10. Architecture Style

Evaluate relevant architecture styles.

### 10.1 Monolithic Architecture

Consider when the system has relatively straightforward deployment and tightly coordinated functionality.

### 10.2 Modular Monolith

Consider when the application needs clear internal boundaries without distributed deployment complexity.

### 10.3 Microservices Architecture

Consider when independently deployable services, independent scaling, and organizational ownership justify distributed complexity.

### 10.4 Service-Oriented Architecture

Consider when services need standardized integration across enterprise applications.

### 10.5 Event-Driven Architecture

Consider when event-based communication, asynchronous processing, and independent consumers are valuable.

### 10.6 Serverless Architecture

Consider when workload characteristics and managed execution environments make it appropriate.

### 10.7 Layered Architecture

Consider for clear separation of presentation, application, domain, and infrastructure responsibilities.

### 10.8 Hexagonal Architecture

Consider for isolating domain logic from external interfaces and infrastructure dependencies.

### 10.9 Clean Architecture

Consider where inward dependency direction and business logic independence are important.

### 10.10 Domain-Driven Design

Consider when the system contains complex business domains and meaningful bounded contexts.

## 11. Architecture Evaluation

### 11.1 Options Considered

| Option | Advantages | Limitations | Suitability |
|---|---|---|---|
| [Architecture A] | [Advantages] | [Limitations] | [Assessment] |
| [Architecture B] | [Advantages] | [Limitations] | [Assessment] |
| [Architecture C] | [Advantages] | [Limitations] | [Assessment] |

### 11.2 Selected Architecture

Document the selected architecture and justification.

### 11.3 Trade-Off Analysis

Evaluate:
- Development complexity.
- Runtime complexity.
- Maintenance.
- Scalability.
- Deployment.
- Reliability.
- Security.
- Cost.
- Team capabilities.

### 11.4 Hybrid Architecture

Where necessary, define combinations of architectural styles and explain their boundaries.

---

# SECTION 6 — HIGH-LEVEL SYSTEM ARCHITECTURE

## 12. System Architecture Overview

### 12.1 Architecture Overview Diagram

Generate a high-level diagram illustrating:

- User interfaces.
- Application layer.
- Business logic.
- API gateway, where applicable.
- Authentication.
- Application services.
- Data layer.
- Background processing.
- External integrations.
- Infrastructure.

### 12.2 Architecture Layers

Define the system layers as applicable.

**Presentation Layer**
- Web Application.
- Mobile Application.
- Desktop Application.
- Administrative Interface.
- External Client Interfaces.

**Application Layer**
- Controllers.
- API Handlers.
- Application Services.
- Command and Query Handlers.
- Workflow Orchestration.

**Domain Layer**
- Business Entities.
- Business Rules.
- Domain Services.
- Aggregates.
- Domain Events.

**Infrastructure Layer**
- Database Access.
- Cache.
- File Storage.
- Messaging.
- External Service Clients.
- Logging.

### 12.3 Layer Responsibilities

| Layer | Responsibility | Allowed Dependencies | Prohibited Dependencies |
|---|---|---|---|
| Presentation | [Responsibility] | [Dependencies] | [Restrictions] |
| Application | [Responsibility] | [Dependencies] | [Restrictions] |
| Domain | [Responsibility] | [Dependencies] | [Restrictions] |
| Infrastructure | [Responsibility] | [Dependencies] | [Restrictions] |

### 12.4 Architecture Communication Paths

Describe how requests and information flow through the layers.

### 12.5 Cross-Cutting Concerns

Define system-wide capabilities:
- Logging.
- Authentication.
- Authorization.
- Validation.
- Error handling.
- Configuration.
- Caching.
- Audit.
- Monitoring.
- Transaction management.

---

# SECTION 7 — APPLICATION AND CONTAINER ARCHITECTURE

## 13. Application Architecture

### 13.1 Application Inventory

Identify all independent applications and application interfaces.

| Application ID | Application | Purpose | Platform | User Type |
|---|---|---|---|---|
| APP-001 | [Application] | [Purpose] | [Platform] | [User] |

### 13.2 Application Responsibilities

Describe the purpose and boundaries of each application.

### 13.3 Application Communication

Document how applications communicate with each other.

### 13.4 Container Architecture

Generate a C4 Level 2 Container Diagram.

Identify:
- Containers.
- Responsibilities.
- Technologies.
- Communication.
- Data ownership.
- Dependencies.

A container in C4 represents a separately deployable application or datastore, not necessarily a Docker container.

### 13.5 Application Lifecycle

Document application startup, initialization, shutdown, configuration, and health checks where relevant.

---

# SECTION 8 — COMPONENT AND MODULE ARCHITECTURE

## 14. Component Architecture

### 14.1 Component Inventory

| Component ID | Component | Responsibility | Parent Application | Dependencies |
|---|---|---|---|---|
| COMP-001 | [Component] | [Purpose] | [Application] | [Dependencies] |

### 14.2 Component Hierarchy

Define:
- Parent components.
- Child components.
- Shared components.
- Infrastructure adapters.
- Supporting components.

### 14.3 Component Specification

For every major component define:

**Component Information**
- Component ID.
- Name.
- Purpose.
- Responsibilities.
- Scope.
- Technology.
- Owner.

**Structure**
- Inputs.
- Outputs.
- Interfaces.
- Dependencies.
- Internal modules.

**Behavior**
- Processing logic.
- State management.
- Error handling.
- Events.
- Transactions.

**Quality Requirements**
- Performance.
- Security.
- Reliability.
- Observability.

**Implementation**
- Package or directory.
- Configuration.
- Testing requirements.
- Deployment considerations.

### 14.4 Component Relationships

Generate a C4 Level 3 Component Diagram for important applications or containers.

### 14.5 Shared Component Architecture

Identify reusable capabilities such as:
- Authentication.
- Logging.
- Notification.
- File Management.
- Permission Management.
- Configuration.
- Audit.
- Search.
- Reporting.

### 14.6 Component Coupling

Assess dependencies and identify potential circular dependencies or inappropriate coupling.

## 15. Module Architecture

### 15.1 Module Inventory

| Module ID | Module | Responsibility | Business Domain | Application |
|---|---|---|---|---|
| MOD-001 | [Module] | [Purpose] | [Domain] | [Application] |

### 15.2 Module Specification

For each major module define:

- Module ID.
- Name.
- Purpose.
- Business capabilities.
- Functional responsibilities.
- Submodules.
- Internal components.
- Public interfaces.
- Data ownership.
- Business rules.
- Dependencies.
- Security requirements.
- Events.
- External integrations.
- Testing requirements.

### 15.3 Module Boundaries

Define which responsibilities belong to each module and which must remain external.

### 15.4 Module Dependency Matrix

| Module | Module A | Module B | Module C |
|---|---|---|---|
| Module A | — | [Dependency] | [Dependency] |
| Module B | [Dependency] | — | [Dependency] |
| Module C | [Dependency] | [Dependency] | — |

### 15.5 Module Isolation

Define how modules avoid inappropriate dependencies.

### 15.6 Modularization Rules

Establish:
- Dependency direction.
- Shared functionality.
- Domain ownership.
- Interface contracts.
- Internal versus public APIs.

---

# SECTION 9 — DOMAIN ARCHITECTURE

## 16. Domain Modeling

Where relevant, apply Domain-Driven Design.

### 16.1 Domain Overview

Identify the primary business domains.

### 16.2 Domain Inventory

| Domain ID | Domain | Purpose | Business Importance |
|---|---|---|---|
| DOM-001 | [Domain] | [Purpose] | [Importance] |

### 16.3 Subdomains

Classify:
- Core Subdomains.
- Supporting Subdomains.
- Generic Subdomains.

### 16.4 Bounded Contexts

Define boundaries in which domain models and terminology have specific meanings.

### 16.5 Context Map

Identify relationships between bounded contexts.

### 16.6 Domain Entities

Define important entities, their identities, responsibilities, and relationships.

### 16.7 Aggregates

Identify aggregate roots and consistency boundaries where applicable.

### 16.8 Value Objects

Identify domain objects defined by their values rather than identity.

### 16.9 Domain Services

Identify domain logic that does not naturally belong to one entity.

### 16.10 Domain Events

Identify business events representing important state changes.

### 16.11 Domain Invariants

Document business rules that must always remain valid.

### 16.12 Domain Model Diagram

Generate a domain model or class diagram when useful.

---

# SECTION 10 — FRONTEND ARCHITECTURE

## 17. Frontend Architecture

### 17.1 Frontend Overview

Describe the overall user-interface architecture.

### 17.2 Frontend Applications

Identify relevant interfaces:

- Public Website.
- Customer Application.
- Administrative Console.
- Internal Dashboard.
- Tenant Application.
- Partner Portal.
- Mobile Application.

### 17.3 Frontend Technology Stack

Document:

| Layer | Technology | Purpose |
|---|---|---|
| Framework | [Technology] | [Purpose] |
| Language | [Technology] | [Purpose] |
| Styling | [Technology] | [Purpose] |
| State Management | [Technology] | [Purpose] |
| Routing | [Technology] | [Purpose] |
| Forms | [Technology] | [Purpose] |
| Data Fetching | [Technology] | [Purpose] |
| UI Components | [Technology] | [Purpose] |
| Testing | [Technology] | [Purpose] |

### 17.4 Frontend Application Structure

Define:
- Application shell.
- Routing.
- Pages.
- Layouts.
- Components.
- Feature modules.
- Services.
- State management.
- Hooks or composables.
- Utilities.
- Assets.

### 17.5 Component Architecture

Define:
- Shared components.
- Feature-specific components.
- Composite components.
- Design system integration.
- Component composition.
- Component reuse rules.

### 17.6 State Management Architecture

Identify:
- Local component state.
- Global application state.
- Server state.
- URL state.
- Form state.
- Persistent state.
- Real-time state.

Define ownership and synchronization rules.

### 17.7 Frontend API Communication

Specify:
- API client.
- Authentication handling.
- Request interceptors.
- Response handling.
- Error handling.
- Retry behavior.
- Request cancellation.
- Caching.
- Data transformation.

### 17.8 Frontend Routing

Define:
- Public routes.
- Private routes.
- Role-restricted routes.
- Nested routes.
- Route guards.
- Error routes.
- Deep links.

### 17.9 Frontend Security

Address:
- Token handling.
- Session management.
- Cross-site scripting.
- Cross-site request forgery.
- Content Security Policy.
- Secure browser storage.
- Route authorization.

### 17.10 Frontend Performance

Consider:
- Code splitting.
- Lazy loading.
- Asset optimization.
- Rendering strategy.
- Caching.
- Image optimization.
- Bundle size.
- Hydration.
- Streaming where applicable.

### 17.11 Frontend Architecture Diagram

Generate the frontend component and application structure diagram.

---

# SECTION 11 — BACKEND ARCHITECTURE

## 18. Backend Architecture

### 18.1 Backend Overview

Describe the server-side application structure.

### 18.2 Backend Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | [Technology] | [Purpose] |
| Framework | [Technology] | [Purpose] |
| Language | [Technology] | [Purpose] |
| API Layer | [Technology] | [Purpose] |
| ORM / Data Access | [Technology] | [Purpose] |
| Validation | [Technology] | [Purpose] |
| Background Processing | [Technology] | [Purpose] |
| Testing | [Technology] | [Purpose] |

### 18.3 Backend Application Layers

Define applicable layers:

- Routing Layer.
- Controller or Handler Layer.
- Application Service Layer.
- Domain Layer.
- Repository Layer.
- Infrastructure Layer.
- Integration Layer.

### 18.4 Request Processing Lifecycle

Describe the lifecycle of a typical request.

Example:

1. Incoming request.
2. Gateway or routing.
3. Authentication.
4. Authorization.
5. Validation.
6. Application processing.
7. Domain execution.
8. Data operations.
9. Response transformation.
10. Logging and telemetry.

### 18.5 Business Logic Architecture

Define where business rules reside and how they are separated from transport, database, and presentation concerns.

### 18.6 Service Architecture

Identify:
- Application services.
- Domain services.
- Integration services.
- Background services.
- Infrastructure services.

### 18.7 Dependency Injection

Define dependency management and object lifecycle where applicable.

### 18.8 Transaction Management

Define transaction boundaries, isolation requirements, and consistency expectations.

### 18.9 Background Processing

Identify jobs that must execute asynchronously.

Define:
- Job types.
- Queue.
- Trigger.
- Processing.
- Retry.
- Dead-letter handling.
- Scheduling.
- Monitoring.

### 18.10 Backend Error Handling

Establish consistent exception handling, error mapping, logging, and response standards.

### 18.11 Backend Application Structure

Define the recommended folder and package architecture.

---

# SECTION 12 — API ARCHITECTURE

## 19. API Architecture

### 19.1 API Strategy

Select the appropriate API approach:

- REST.
- GraphQL.
- gRPC.
- WebSocket.
- Server-Sent Events.
- Webhooks.
- Internal Service APIs.

Multiple approaches may coexist when justified.

### 19.2 API Architecture Overview

Describe how clients and services communicate through APIs.

### 19.3 API Layer Structure

Define:
- API Gateway.
- Routing.
- Controllers.
- Middleware.
- Authentication.
- Authorization.
- Validation.
- Rate Limiting.
- Response Handling.

### 19.4 API Organization

Define:
- API grouping.
- Resource naming.
- Endpoint structure.
- Versioning.
- Request and response conventions.
- Error structures.

### 19.5 API Contract Standards

Specify:
- Request schemas.
- Response schemas.
- Data types.
- Pagination.
- Filtering.
- Sorting.
- Validation.
- Error codes.
- Idempotency.
- Rate limits.

### 19.6 API Security

Define:
- Authentication.
- Authorization.
- API keys.
- OAuth 2.0 or other applicable protocols.
- Token validation.
- Rate limiting.
- Input validation.
- Request signing where necessary.

### 19.7 API Documentation

Specify documentation standards such as OpenAPI or relevant protocol documentation.

### 19.8 API Gateway Requirements

Where applicable, define:
- Routing.
- Authentication enforcement.
- Rate limiting.
- Load balancing.
- Request transformation.
- Response aggregation.
- Monitoring.

### 19.9 API Dependency Map

Document API consumers, providers, and dependencies.

---

# SECTION 13 — DATABASE AND DATA ARCHITECTURE

## 20. Data Architecture

### 20.1 Data Architecture Overview

Describe how the system stores, processes, accesses, and distributes information.

### 20.2 Database Technology Selection

Evaluate relevant database categories.

**Relational Databases**
- PostgreSQL.
- MySQL.
- MariaDB.
- SQL Server.

**Document Databases**
- MongoDB.
- Couchbase.

**Key-Value and Cache Stores**
- Redis.
- Other applicable stores.

**Search Engines**
- OpenSearch.
- Elasticsearch.

**Analytical Databases**
- Data warehouses.
- Columnar databases.
- Analytical storage engines.

**Vector Databases**
- pgvector.
- Dedicated vector databases.
- Managed vector services.

Select databases according to workload and requirements rather than using all available types.

### 20.3 Database Inventory

| Database ID | Database | Type | Purpose | Owner |
|---|---|---|---|---|
| DB-001 | [Database] | [Type] | [Purpose] | [Owner] |

### 20.4 Data Ownership

Identify which application, service, or domain owns each dataset.

### 20.5 Data Model Architecture

Define:
- Entities.
- Tables or collections.
- Relationships.
- Aggregates.
- Constraints.
- Indexes.
- Metadata.
- Audit fields.

### 20.6 Database Schema Strategy

Define:
- Schema organization.
- Naming conventions.
- Normalization.
- Denormalization.
- Partitioning.
- Indexing.
- Migration management.

### 20.7 Data Access Architecture

Define:
- Repositories.
- Query layers.
- ORM.
- Raw queries.
- Transactions.
- Read/write separation.

### 20.8 Data Consistency

Define:
- Strong consistency.
- Eventual consistency.
- Transactional boundaries.
- Cross-service consistency.
- Conflict resolution.

### 20.9 Data Migration Strategy

Define:
- Schema migration.
- Data migration.
- Import.
- Transformation.
- Validation.
- Rollback.

### 20.10 Data Retention

Define retention, archival, deletion, and recovery policies.

### 20.11 Data Encryption

Define encryption at rest, in transit, and applicable field-level encryption.

### 20.12 Database ER Diagram

Generate an entity relationship diagram for major product entities.

### 20.13 Data Flow Diagram

Show how information is created, transformed, transferred, and stored.

---

# SECTION 14 — CACHING AND DATA DISTRIBUTION

## 21. Caching Architecture

### 21.1 Caching Strategy

Identify where caching provides meaningful improvements.

### 21.2 Cache Layers

Consider:
- Browser Cache.
- CDN Cache.
- Application Cache.
- API Cache.
- Database Cache.
- Distributed Cache.

### 21.3 Cache Design

For each cache define:
- Cached Data.
- Cache Key.
- Storage.
- TTL.
- Invalidation.
- Refresh Strategy.
- Consistency Requirements.

### 21.4 Cache Invalidation

Define:
- Time-Based Expiration.
- Event-Based Invalidation.
- Explicit Invalidation.
- Version-Based Invalidation.

### 21.5 Cache Failure Handling

Document behavior when the cache is unavailable or stale.

### 21.6 Data Distribution

Where applicable, define:
- Replication.
- Read Replicas.
- Sharding.
- Partitioning.
- Regional Distribution.
- Synchronization.

---

# SECTION 15 — MESSAGING AND EVENT-DRIVEN ARCHITECTURE

## 22. Messaging Architecture

### 22.1 Messaging Strategy

Identify where synchronous or asynchronous communication is appropriate.

### 22.2 Communication Models

Define:
- Synchronous Request/Response.
- Asynchronous Messaging.
- Event Publishing.
- Event Subscription.
- Command Processing.
- Message Streaming.

### 22.3 Messaging Infrastructure

Identify applicable technologies:

- RabbitMQ.
- Apache Kafka.
- Redis Streams.
- Cloud Messaging Services.
- Other Messaging Platforms.

### 22.4 Queue Architecture

Define:
- Queue inventory.
- Message types.
- Producers.
- Consumers.
- Priority.
- Retry policy.
- Dead-letter queues.

### 22.5 Event Architecture

Define:
- Event names.
- Event ownership.
- Event schemas.
- Producers.
- Consumers.
- Event ordering.
- Delivery guarantees.

### 22.6 Event Flow Diagrams

Generate diagrams showing event publication, consumption, and processing.

### 22.7 Reliability Patterns

Consider:
- Transactional Outbox.
- Idempotent Consumers.
- Retry with Backoff.
- Dead-Letter Queues.
- Saga Pattern.
- Event Versioning.

Select only patterns justified by requirements.

---

# SECTION 16 — AUTHENTICATION AND AUTHORIZATION ARCHITECTURE

## 23. Identity Architecture

### 23.1 Identity Architecture Overview

Describe how users and services authenticate with the system.

### 23.2 Authentication Architecture

Identify:
- Local Authentication.
- OAuth 2.0.
- OpenID Connect.
- SAML.
- Single Sign-On.
- Multi-Factor Authentication.
- Passwordless Authentication.
- Enterprise Identity Providers.

### 23.3 Token Management

Define:
- Access Tokens.
- Refresh Tokens.
- Token Expiration.
- Token Rotation.
- Revocation.
- Storage.
- Validation.

### 23.4 Authorization Architecture

Evaluate:
- RBAC.
- ABAC.
- Permission-Based Access.
- Resource-Level Authorization.
- Policy-Based Authorization.

### 23.5 Identity Lifecycle

Define:
- User Provisioning.
- Account Activation.
- Authentication.
- Access Assignment.
- Access Revocation.
- Account Deactivation.

### 23.6 Service-to-Service Authentication

Define how internal services authenticate with each other.

### 23.7 Privileged Access Management

Define administrative access, service accounts, elevated permissions, and privileged operation controls.

### 23.8 Identity and Permission Flow

Generate authentication and authorization sequence diagrams.

---

# SECTION 17 — MULTI-TENANCY ARCHITECTURE

## 24. Multi-Tenant Architecture

Include when the system supports multiple organizations, tenants, or customer environments.

### 24.1 Tenant Architecture Overview

Describe tenant isolation, provisioning, and access management.

### 24.2 Tenant Isolation Models

Evaluate:

- Shared Database, Shared Schema.
- Shared Database, Separate Schema.
- Separate Database per Tenant.
- Hybrid Isolation.
- Dedicated Infrastructure per Tenant.

### 24.3 Tenant Identification

Define how tenant context is established.

### 24.4 Tenant Provisioning

Define:
- Tenant registration.
- Tenant creation.
- Resource allocation.
- Initial configuration.
- User provisioning.
- Activation.
- Suspension.
- Termination.

### 24.5 Tenant Data Isolation

Define how each tenant's data is protected from access by other tenants.

### 24.6 Tenant-Level Customization

Consider:
- Branding.
- Feature settings.
- Configurations.
- Integrations.
- Access policies.
- Resource quotas.

### 24.7 Tenant Resource Management

Define:
- User limits.
- Storage limits.
- API quotas.
- Background job quotas.
- Usage tracking.
- Billing metering.

### 24.8 Tenant Security

Document tenant-level authorization, isolation testing, and administrative boundaries.

### 24.9 Tenant Architecture Diagram

Generate diagrams showing tenant boundaries and shared versus dedicated infrastructure.

---

# SECTION 18 — INTEGRATION ARCHITECTURE

## 25. External Integration Architecture

### 25.1 Integration Overview

Describe the integration ecosystem.

### 25.2 Integration Inventory

| Integration ID | External System | Purpose | Protocol | Criticality |
|---|---|---|---|---|
| INT-001 | [Service] | [Purpose] | [Protocol] | [Level] |

### 25.3 Integration Types

Identify:
- REST APIs.
- GraphQL APIs.
- SOAP.
- Webhooks.
- File Transfer.
- Message Brokers.
- Database Integrations.
- SDK Integrations.

### 25.4 Integration Boundaries

Define the responsibilities of the application and each external provider.

### 25.5 Integration Adapter Architecture

Where applicable, define reusable adapters and provider abstraction layers.

### 25.6 Integration Reliability

Define:
- Connection Timeout.
- Retry.
- Circuit Breaker.
- Idempotency.
- Rate Limit Management.
- Fallback.
- Failure Logging.

### 25.7 Integration Data Mapping

Define how external payloads map to internal data models.

### 25.8 Integration Security

Specify credentials, secrets, signatures, permissions, and encryption.

### 25.9 Integration Sequence Diagrams

Generate sequence diagrams for important external interactions.

---

# SECTION 19 — FILE AND OBJECT STORAGE ARCHITECTURE

## 26. Storage Architecture

### 26.1 Storage Requirements

Identify:
- User Uploads.
- Documents.
- Images.
- Videos.
- Audio.
- Generated Files.
- Backups.
- Application Assets.

### 26.2 Storage Technologies

Evaluate:
- Local File Storage.
- Object Storage.
- Block Storage.
- Network File Storage.
- Cloud File Storage.

### 26.3 Storage Organization

Define:
- Buckets.
- Containers.
- Directory Structure.
- Naming Conventions.
- Metadata.
- Ownership.
- Access Control.

### 26.4 File Processing

Define:
- Upload.
- Validation.
- Virus Scanning.
- Transformation.
- Compression.
- Thumbnail Generation.
- Preview.
- Download.

### 26.5 Storage Security

Define:
- Access Policies.
- Encryption.
- Signed URLs.
- Expiration.
- Tenant Isolation.
- Retention.

### 26.6 Content Delivery

Define whether a CDN or distributed delivery layer is required.

---

# SECTION 20 — REAL-TIME COMMUNICATION ARCHITECTURE

## 27. Real-Time Architecture

Include when the product requires live updates or continuous communication.

### 27.1 Real-Time Requirements

Identify:
- Live Notifications.
- Chat.
- Collaborative Editing.
- Live Dashboards.
- Streaming Data.
- Agent Progress.
- Real-Time Monitoring.

### 27.2 Communication Technologies

Evaluate:
- WebSockets.
- Server-Sent Events.
- WebRTC.
- Message Brokers.
- Polling.

### 27.3 Connection Management

Define:
- Authentication.
- Connection Lifecycle.
- Heartbeats.
- Reconnection.
- Connection Limits.
- Session Management.

### 27.4 Event Delivery

Define:
- Delivery Guarantees.
- Ordering.
- Duplicate Prevention.
- Event Persistence.
- Reconnection Recovery.

### 27.5 Real-Time Scaling

Define requirements for connection distribution, pub/sub, and horizontal scaling.

### 27.6 Real-Time Sequence Diagrams

Generate relevant communication flow diagrams.

---

# SECTION 21 — AI AND AGENT ARCHITECTURE

## 28. AI System Architecture

Include this section for AI-enabled products.

### 28.1 AI Architecture Overview

Describe:
- AI capabilities.
- Model providers.
- AI application layer.
- Agent orchestration.
- Context management.
- Memory.
- Tools.
- Data retrieval.
- Evaluation.
- Monitoring.

### 28.2 Model Provider Architecture

Define:
- Model providers.
- Model interfaces.
- Model routing.
- Provider abstraction.
- Model selection.
- Fallback.
- Provider failure handling.
- Usage tracking.

### 28.3 Model Gateway

Where relevant, establish a central model access layer responsible for:
- Provider configuration.
- Request normalization.
- Model routing.
- Credential management.
- Rate limits.
- Usage tracking.
- Cost accounting.
- Response normalization.

### 28.4 AI Agent Architecture

For agentic systems, define:
- Agent Registry.
- Agent Runtime.
- Task Orchestrator.
- Planning Engine.
- Execution Engine.
- Tool Registry.
- Tool Execution Layer.
- Context Manager.
- Memory Manager.
- Agent State Management.
- Human Approval.
- Execution History.

### 28.5 Prompt Management

Define:
- Prompt Templates.
- System Instructions.
- Prompt Versioning.
- Variables.
- Prompt Composition.
- Testing.
- Approval.
- Rollback.

### 28.6 Context Architecture

Define:
- Context Sources.
- Context Assembly.
- Context Prioritization.
- Context Windows.
- Token Budget.
- Context Compression.
- Context Isolation.
- Context Persistence.

### 28.7 Memory Architecture

Where applicable, distinguish:
- Short-Term Memory.
- Session Memory.
- Long-Term Memory.
- User Memory.
- Project Memory.
- Agent Memory.
- Organizational Knowledge.

Define storage, retrieval, access, expiration, and isolation.

### 28.8 Retrieval-Augmented Generation

Define:
- Document Ingestion.
- Chunking.
- Embeddings.
- Vector Storage.
- Hybrid Search.
- Retrieval.
- Ranking.
- Context Injection.
- Citation.
- Evaluation.

### 28.9 Tool Execution Architecture

Define:
- Tool Registry.
- Tool Schemas.
- Tool Permissions.
- Input Validation.
- Execution Sandbox.
- Output Validation.
- Tool Failure.
- Execution Audit.

### 28.10 AI Safety and Guardrails

Define:
- Input Validation.
- Output Validation.
- Policy Enforcement.
- Sensitive Data Controls.
- Tool Permission Boundaries.
- Human Approval.
- Prompt Injection Defenses.
- Abuse Prevention.

### 28.11 AI Observability

Monitor:
- Model Latency.
- Token Usage.
- Provider Errors.
- Tool Execution.
- Agent Completion.
- Failure Rates.
- Cost.
- Evaluation Scores.
- User Feedback.

### 28.12 AI Evaluation

Define:
- Test Datasets.
- Quality Metrics.
- Accuracy.
- Relevance.
- Faithfulness.
- Safety.
- Regression Evaluation.
- Human Evaluation.

### 28.13 AI Architecture Diagrams

Generate:
- Model Gateway Diagram.
- Agent Execution Diagram.
- Context Flow Diagram.
- Memory Architecture Diagram.
- RAG Architecture Diagram.
- Tool Invocation Sequence.
- Human Approval Flow.

---

# SECTION 22 — SECURITY ARCHITECTURE

## 29. Security Architecture

### 29.1 Security Overview

Describe the overall security architecture and its responsibilities.

### 29.2 Security Boundaries

Identify trust boundaries between:
- Users.
- Frontend.
- API Gateway.
- Backend.
- Databases.
- Internal Services.
- External Providers.
- Infrastructure.

### 29.3 Threat Modeling

Use an appropriate threat modeling method such as STRIDE.

Identify:

- Spoofing.
- Tampering.
- Repudiation.
- Information Disclosure.
- Denial of Service.
- Elevation of Privilege.

### 29.4 Threat Register

| Threat ID | Threat | Target Component | Impact | Mitigation |
|---|---|---|---|---|
| THR-001 | [Threat] | [Component] | [Impact] | [Mitigation] |

### 29.5 Network Security

Define:
- Firewalls.
- Network Segmentation.
- Private Networks.
- Ingress Controls.
- Egress Controls.
- VPN.
- Secure Service Communication.

### 29.6 Data Security

Define:
- Encryption at Rest.
- Encryption in Transit.
- Key Management.
- Secrets Management.
- Sensitive Field Protection.
- Data Masking.

### 29.7 Application Security

Address:
- Injection.
- Broken Access Control.
- XSS.
- CSRF.
- SSRF.
- Unsafe Deserialization.
- Security Misconfiguration.
- Dependency Vulnerabilities.
- API Abuse.

Use relevant OWASP guidance as the security baseline.

### 29.8 Infrastructure Security

Define:
- Operating System Hardening.
- Container Security.
- Cloud IAM.
- Server Access.
- Security Patching.
- Vulnerability Management.
- Image Scanning.

### 29.9 Audit Architecture

Define:
- Audit Events.
- Event Capture.
- Storage.
- Retention.
- Access.
- Integrity.
- Reporting.

### 29.10 Security Compliance

Identify applicable legal and industry-specific controls based on actual business requirements.

### 29.11 Security Architecture Diagram

Generate the relevant security boundaries, controls, and communication paths.

---

# SECTION 23 — INFRASTRUCTURE AND HOSTING ARCHITECTURE

## 30. Infrastructure Architecture

### 30.1 Infrastructure Overview

Describe the infrastructure required to operate the system.

### 30.2 Hosting Model

Evaluate:
- Public Cloud.
- Private Cloud.
- On-Premises.
- Hybrid.
- Dedicated Hosting.
- Colocation.
- Managed Application Hosting.

### 30.3 Cloud Provider Selection

Where applicable, evaluate:
- Microsoft Azure.
- AWS.
- Google Cloud.
- Other providers.

Consider existing infrastructure, requirements, cost, operational capability, and compatibility.

### 30.4 Infrastructure Components

Identify:
- Compute.
- Application Servers.
- Database Servers.
- Cache Servers.
- Storage.
- Load Balancers.
- Networking.
- DNS.
- CDN.
- Firewalls.
- Gateways.
- Monitoring Infrastructure.

### 30.5 Compute Architecture

Define:
- Virtual Machines.
- Containers.
- Serverless Functions.
- Container Platforms.
- Orchestration.
- Autoscaling.

### 30.6 Network Architecture

Define:
- Virtual Networks.
- Subnets.
- Public Subnets.
- Private Subnets.
- Routing.
- Firewalls.
- NAT.
- Private Endpoints.
- Load Balancers.

### 30.7 Infrastructure Sizing

Estimate:
- CPU.
- Memory.
- Storage.
- Network Bandwidth.
- Instance Count.
- Database Capacity.

All estimates must identify their workload assumptions and confidence level.

### 30.8 Infrastructure Diagram

Generate an infrastructure topology diagram showing the system's main hosting and networking components.

### 30.9 Infrastructure Cost Considerations

Identify major cost drivers and opportunities for optimization.

---

# SECTION 24 — DEPLOYMENT ARCHITECTURE

## 31. Deployment Architecture

### 31.1 Deployment Overview

Describe how the system will be packaged, distributed, and deployed.

### 31.2 Deployment Units

Identify independently deployable artifacts:
- Frontend.
- Backend.
- Services.
- Workers.
- Databases.
- Messaging.
- Supporting Infrastructure.

### 31.3 Deployment Environments

Define:

**Local Development**
- Local setup.
- Local services.
- Development credentials.

**Development**
- Shared development infrastructure.
- Development integrations.

**Testing / QA**
- Test deployments.
- Test data.
- Automated test execution.

**Staging**
- Production-like configuration.
- Release validation.

**Production**
- Live services.
- Production data.
- Monitoring.
- Operational procedures.

### 31.4 Container Architecture

Where applicable, define:
- Docker Images.
- Dockerfiles.
- Image Registry.
- Container Configuration.
- Networking.
- Persistent Volumes.
- Health Checks.

### 31.5 Orchestration

Where justified, define orchestration requirements such as Kubernetes or managed container services.

### 31.6 Deployment Strategies

Evaluate:
- Rolling Deployment.
- Blue-Green Deployment.
- Canary Deployment.
- Recreate Deployment.
- Feature-Flagged Release.

### 31.7 CI/CD Architecture

Define:
- Source Control.
- Build Pipeline.
- Automated Testing.
- Security Scanning.
- Artifact Management.
- Release Approval.
- Deployment.
- Post-Deployment Validation.

### 31.8 Infrastructure as Code

Specify the infrastructure provisioning and configuration management approach.

### 31.9 Configuration Management

Define:
- Environment Variables.
- Configuration Files.
- Secrets.
- Feature Flags.
- Runtime Configuration.

### 31.10 Deployment Diagram

Generate a deployment diagram showing deployment units, infrastructure nodes, network boundaries, and connections.

---

# SECTION 25 — RESILIENCE AND FAULT TOLERANCE

## 32. Resilience Architecture

### 32.1 Failure Scenarios

Identify failures involving:
- Application Instances.
- Databases.
- Network Connections.
- External Services.
- Message Brokers.
- Storage.
- Identity Providers.
- Compute Infrastructure.

### 32.2 Fault Handling

Define appropriate mechanisms:
- Retry.
- Timeout.
- Circuit Breaker.
- Bulkhead.
- Failover.
- Queue Buffering.
- Graceful Degradation.
- Fallback.

### 32.3 High Availability

Define applicable redundancy and failover architecture.

### 32.4 Database Resilience

Define:
- Replication.
- Backups.
- Failover.
- Recovery.
- Data Integrity.

### 32.5 External Service Resilience

Define fallback behavior for unavailable third-party services.

### 32.6 Failure Isolation

Define how failures should be prevented from spreading through the system.

### 32.7 Resilience Testing

Define:
- Failure Injection.
- Recovery Testing.
- Service Interruption.
- Database Failover Testing.
- Load and Stress Testing.

---

# SECTION 26 — SCALABILITY AND PERFORMANCE ARCHITECTURE

## 33. Scalability Strategy

### 33.1 Expected System Load

Define available estimates for:
- Registered Users.
- Active Users.
- Concurrent Users.
- Requests Per Second.
- Transactions.
- Storage Growth.
- Background Jobs.

### 33.2 Scaling Strategies

Evaluate:
- Vertical Scaling.
- Horizontal Scaling.
- Read Replicas.
- Sharding.
- Partitioning.
- Caching.
- Load Balancing.
- Queue-Based Processing.

### 33.3 Application Scalability

Define statelessness, session management, connection handling, and instance scaling.

### 33.4 Database Scalability

Define read/write distribution, indexing, query optimization, data partitioning, and replication.

### 33.5 Network Scalability

Define bandwidth, connection distribution, CDN, and traffic routing.

### 33.6 Performance Optimization

Document:
- Query Optimization.
- Caching.
- Connection Pooling.
- Asynchronous Processing.
- Payload Optimization.
- Compression.
- Lazy Loading.
- Resource Optimization.

### 33.7 Capacity Planning

Estimate capacity based on defined workloads and identify scaling thresholds.

### 33.8 Load Testing Requirements

Define expected workloads and measurable performance targets.

---

# SECTION 27 — OBSERVABILITY AND MONITORING ARCHITECTURE

## 34. Observability Architecture

### 34.1 Observability Strategy

Describe how the operational health and behavior of the system will be understood.

### 34.2 Logging Architecture

Define:
- Application Logs.
- Infrastructure Logs.
- Security Logs.
- Audit Logs.
- Integration Logs.
- Background Job Logs.

Specify structured logging, correlation IDs, retention, and access controls.

### 34.3 Metrics Architecture

Identify:
- System Metrics.
- Application Metrics.
- API Metrics.
- Database Metrics.
- Infrastructure Metrics.
- Business Metrics.

### 34.4 Distributed Tracing

Define trace propagation and cross-service correlation where applicable.

### 34.5 Monitoring Tools

Evaluate suitable monitoring and observability technologies.

### 34.6 Alerting Architecture

Define:
- Alert Categories.
- Severity.
- Thresholds.
- Notification Channels.
- Escalation.
- Suppression.
- Incident Correlation.

### 34.7 Health Checks

Define:
- Liveness.
- Readiness.
- Dependency Health.
- Application Health.
- Database Health.

### 34.8 Operational Dashboards

Specify required dashboards for developers, operations, security, and business users.

---

# SECTION 28 — BACKUP AND DISASTER RECOVERY

## 35. Disaster Recovery Architecture

### 35.1 Backup Strategy

Define:
- Database Backups.
- File Backups.
- Configuration Backups.
- Infrastructure Backups.
- Backup Frequency.
- Retention.
- Encryption.
- Storage Location.

### 35.2 Recovery Objectives

Define:

**Recovery Point Objective (RPO)**

Maximum acceptable data-loss interval.

**Recovery Time Objective (RTO)**

Maximum acceptable service recovery time.

Do not invent RPO or RTO targets where they have not been established.

### 35.3 Recovery Architecture

Define the recovery environment and required infrastructure.

### 35.4 Recovery Procedures

Specify restoration of:
- Applications.
- Databases.
- Files.
- Configurations.
- Infrastructure.
- External connections.

### 35.5 Geographic Recovery

Where applicable, define multi-region or secondary-site recovery.

### 35.6 Disaster Recovery Testing

Define periodic recovery exercises and successful recovery criteria.

---

# SECTION 29 — SOURCE CODE AND REPOSITORY ARCHITECTURE

## 36. Repository Strategy

### 36.1 Repository Model

Evaluate:
- Monorepo.
- Multi-Repository.
- Hybrid.

Document the selected strategy.

### 36.2 Repository Inventory

| Repository ID | Repository | Purpose | Technology | Ownership |
|---|---|---|---|---|
| REPO-001 | [Repository] | [Purpose] | [Technology] | [Team] |

### 36.3 Source Code Organization

Define the recommended application directory structure.

### 36.4 Package Architecture

Define:
- Shared Packages.
- Domain Packages.
- UI Packages.
- Infrastructure Packages.
- API Clients.
- Utilities.

### 36.5 Dependency Management

Specify:
- Internal Dependencies.
- External Libraries.
- Package Versioning.
- Dependency Updates.
- License Validation.
- Security Scanning.

### 36.6 Branching Strategy

Define:
- Main.
- Development.
- Feature Branches.
- Release Branches.
- Hotfix Branches.

### 36.7 Code Quality Architecture

Establish:
- Linting.
- Formatting.
- Static Analysis.
- Type Checking.
- Automated Tests.
- Code Reviews.
- Dependency Checks.

---

# SECTION 30 — CONFIGURATION AND SECRETS ARCHITECTURE

## 37. Configuration Management

### 37.1 Configuration Strategy

Define how application configuration is stored, distributed, validated, and updated.

### 37.2 Configuration Categories

Identify:
- Application Configuration.
- Environment Configuration.
- Feature Flags.
- Tenant Configuration.
- Integration Configuration.
- Runtime Configuration.

### 37.3 Configuration Hierarchy

Define precedence between global, environment, tenant, and user-specific settings where applicable.

### 37.4 Secret Management

Define:
- Secret Storage.
- Secret Retrieval.
- Rotation.
- Expiration.
- Access Control.
- Audit Logging.

### 37.5 Configuration Validation

Define behavior for missing, invalid, or conflicting configurations.

---

# SECTION 31 — SYSTEM TESTING ARCHITECTURE

## 38. Architecture Testing Strategy

### 38.1 Testing Architecture

Identify how automated testing is organized across the system.

### 38.2 Unit Testing

Define testing boundaries for individual units and business logic.

### 38.3 Component Testing

Define testing of isolated system components.

### 38.4 Integration Testing

Define validation of communication and data exchange across components.

### 38.5 Contract Testing

Where applicable, define validation of API and event contracts.

### 38.6 End-to-End Testing

Define validation of complete application workflows.

### 38.7 Performance Testing

Define load, stress, scalability, and endurance testing.

### 38.8 Security Testing

Define testing for authentication, authorization, vulnerabilities, and data protection.

### 38.9 Resilience Testing

Define how fault handling and recovery behavior will be verified.

### 38.10 Architecture Validation

Define architecture-specific acceptance tests, dependency checks, and structural validation.

---

# SECTION 32 — TECHNOLOGY STACK AND SELECTION

## 39. Complete Technology Stack

### 39.1 Technology Inventory

| Architecture Layer | Technology | Purpose | Status | Selection Rationale |
|---|---|---|---|---|
| Frontend | [Technology] | [Purpose] | [Status] | [Reason] |
| Backend | [Technology] | [Purpose] | [Status] | [Reason] |
| Database | [Technology] | [Purpose] | [Status] | [Reason] |
| Cache | [Technology] | [Purpose] | [Status] | [Reason] |
| Messaging | [Technology] | [Purpose] | [Status] | [Reason] |
| Storage | [Technology] | [Purpose] | [Status] | [Reason] |
| Hosting | [Technology] | [Purpose] | [Status] | [Reason] |
| Monitoring | [Technology] | [Purpose] | [Status] | [Reason] |

### 39.2 Technology Evaluation Criteria

Evaluate:
- Functional suitability.
- Performance.
- Scalability.
- Security.
- Reliability.
- Maintainability.
- Integration compatibility.
- Learning curve.
- Ecosystem.
- Licensing.
- Pricing.
- Vendor lock-in.
- Long-term support.

### 39.3 Technology Compatibility

Validate compatibility between:
- Frontend and backend.
- Frameworks and runtimes.
- Database and ORM.
- Services and messaging.
- Hosting and application runtime.
- Libraries and platform versions.

### 39.4 Technology Constraints

Document mandatory and prohibited technologies.

### 39.5 Technology Debt

Identify risky dependencies, outdated technology, and future migration considerations.

---

# SECTION 33 — COST AND RESOURCE ARCHITECTURE

## 40. Infrastructure Cost Model

### 40.1 Cost Categories

Estimate:
- Compute.
- Database.
- Storage.
- Network.
- Bandwidth.
- CDN.
- Messaging.
- Monitoring.
- Backup.
- Security.
- Third-Party Services.

### 40.2 Cost Breakdown

| Component | Technology | Estimated Monthly Cost | Pricing Basis | Confidence |
|---|---|---|---|---|
| [Component] | [Technology] | [Amount] | [Basis] | [Level] |

### 40.3 Cost Optimization

Identify:
- Right-Sizing.
- Autoscaling.
- Reserved Capacity.
- Caching.
- Storage Tiering.
- Managed Services.
- Resource Scheduling.

### 40.4 Infrastructure Growth

Estimate how infrastructure costs may evolve with product growth.

### 40.5 Technical Resource Requirements

Identify the technical skills and operational resources required to manage the architecture.

All estimates must state assumptions, geographic region, pricing date, and confidence level where applicable.

---

# SECTION 34 — ARCHITECTURE DEPENDENCIES AND RISKS

## 41. Architecture Dependency Register

| Dependency ID | Dependency | Category | Dependent Component | Impact |
|---|---|---|---|---|
| DEP-001 | [Dependency] | [Category] | [Component] | [Impact] |

## 42. Architecture Risk Register

| Risk ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| ARISK-001 | [Risk] | [Level] | [Level] | [Mitigation] | [Owner] |

### 42.1 Risk Categories

Consider:
- Architecture Complexity.
- Technical Feasibility.
- Performance.
- Security.
- Scalability.
- Availability.
- Technology Obsolescence.
- Vendor Lock-In.
- Integration.
- Data Consistency.
- Operational Complexity.
- Cost.

### 42.2 Architecture Trade-Offs

Document:
- Benefits.
- Limitations.
- Compromises.
- Alternatives.
- Consequences.

### 42.3 Technical Debt Register

Identify architectural compromises requiring future attention.

### 42.4 Architecture Constraints Register

Maintain a consolidated register of mandatory technical constraints.

---

# SECTION 35 — ARCHITECTURE DECISION RECORDS

## 43. Architecture Decision Management

Maintain a separate Architecture Decision Record for every significant technical decision.

### 43.1 ADR Template

**ADR-[ID]: [Decision Title]**

**Metadata**
- ADR ID.
- Title.
- Date.
- Status.
- Decision Owner.
- Related Requirements.
- Related Components.

**Context**

Explain the problem, technical circumstances, and architectural constraints.

**Decision Drivers**

Identify the most important requirements and quality attributes influencing the decision.

**Options Considered**

Document possible technical solutions.

**Decision**

Describe the selected approach.

**Rationale**

Explain why the option was selected.

**Consequences**

Identify positive and negative outcomes.

**Risks**

Describe the risks introduced by the decision.

**Alternatives Rejected**

Document why other approaches were not selected.

**Implementation Impact**

List affected modules, components, interfaces, and infrastructure.

**Review Conditions**

Identify events or circumstances that should trigger reconsideration.

### 43.2 ADR Register

| ADR ID | Decision | Status | Related Components | Date |
|---|---|---|---|---|
| ADR-001 | [Decision] | [Status] | [Components] | [Date] |

---

# SECTION 36 — ARCHITECTURE MIGRATION AND EVOLUTION

## 44. Architecture Evolution Strategy

### 44.1 Current and Target Architecture

When an existing system is involved, document:
- Current Architecture.
- Current Limitations.
- Target Architecture.
- Required Changes.
- Migration Constraints.

### 44.2 Migration Strategy

Define:
- Migration Phases.
- Component Replacement.
- Data Migration.
- API Compatibility.
- Parallel Operation.
- Cutover.
- Rollback.

### 44.3 Incremental Migration

Where appropriate, evaluate the Strangler Pattern and other incremental modernization approaches.

### 44.4 Legacy System Integration

Define temporary and permanent integration boundaries.

### 44.5 Architecture Roadmap

| Phase | Architectural Change | Components Affected | Dependencies | Expected Outcome |
|---|---|---|---|---|
| [Phase] | [Change] | [Components] | [Dependencies] | [Outcome] |

### 44.6 Future Architecture Considerations

Identify possible changes required for anticipated product growth.

---

# SECTION 37 — ARCHITECTURE IMPLEMENTATION GUIDANCE

## 45. Architecture Implementation Blueprint

Translate the architecture into actionable engineering guidance without duplicating the detailed Implementation Plan.

### 45.1 Implementation Sequence

Identify recommended implementation order for:

1. Foundation and shared infrastructure.
2. Core application architecture.
3. Data architecture.
4. Authentication and authorization.
5. Core business modules.
6. Integration architecture.
7. Advanced functionality.
8. Observability.
9. Security hardening.
10. Production infrastructure.

Adapt the sequence to actual dependencies.

### 45.2 Technical Workstreams

Identify:
- Frontend Architecture.
- Backend Architecture.
- Database Architecture.
- API Architecture.
- Infrastructure.
- Security.
- Integration.
- DevOps.
- Monitoring.

### 45.3 Architecture Prerequisites

Define what must exist before implementation begins.

### 45.4 Architecture Acceptance Criteria

Define measurable conditions for considering architecture implementation complete.

### 45.5 Implementation References

Link architecture components to:
- PRD Requirements.
- Technical Specifications.
- Repository Structure.
- API Specifications.
- Database Specifications.
- Implementation Tasks.
- Test Plans.

---

# SECTION 38 — ARCHITECTURE DOCUMENTATION AND DIAGRAM REGISTER

## 46. Architecture Diagram Inventory

| Diagram ID | Diagram Name | Architecture Level | Purpose | Status |
|---|---|---|---|---|
| DIA-001 | System Context | C4 Level 1 | External context | [Status] |
| DIA-002 | Container | C4 Level 2 | Application structure | [Status] |
| DIA-003 | Component | C4 Level 3 | Component structure | [Status] |
| DIA-004 | Deployment | Deployment | Runtime deployment | [Status] |
| DIA-005 | Data Flow | Data Architecture | Data movement | [Status] |
| DIA-006 | ER Diagram | Database | Data relationships | [Status] |
| DIA-007 | Network Topology | Infrastructure | Network structure | [Status] |
| DIA-008 | Security Boundaries | Security | Trust boundaries | [Status] |

### 46.1 Diagram Standards

Define:
- Diagram notation.
- Naming conventions.
- Relationships.
- Boundaries.
- Technology labels.
- Versioning.
- Ownership.

### 46.2 Diagram Maintenance

Define how architecture diagrams are updated when components, dependencies, or system boundaries change.

---

# SECTION 39 — ARCHITECTURE TRACEABILITY

## 47. Architecture Traceability Matrix

Maintain traceability from product requirements to architectural decisions and components.

| Requirement ID | Requirement | Architecture Component | Design Decision | Implementation Reference | Verification |
|---|---|---|---|---|---|
| FR-001 | [Requirement] | [Component] | [ADR] | [Task] | [Test] |

### 47.1 Traceability Rules

- Every architecture-critical requirement should map to an architectural decision or component.
- Every major component must have defined responsibilities.
- Every external dependency must have a documented purpose.
- Every important interface must identify its consumer and provider.
- Every critical data entity must have an ownership boundary.
- Every critical quality attribute must have an architectural response.
- Every significant decision should have an ADR.
- Every architecture-critical risk must have a mitigation or acceptance decision.

### 47.2 Impact Analysis

When architectural decisions or requirements change, identify affected:
- Components.
- Modules.
- Applications.
- Services.
- Databases.
- APIs.
- Infrastructure.
- Security boundaries.
- Deployment units.
- Documentation.
- Testing.

---

# SECTION 40 — ARCHITECTURE APPROVAL AND GOVERNANCE

## 48. Architecture Review

### 48.1 Review Requirements

Define review requirements for:
- Logical architecture.
- Component boundaries.
- Database design.
- Security.
- Infrastructure.
- Deployment.
- Scalability.
- Resilience.
- Operational readiness.

### 48.2 Architecture Governance

Specify:
- Architecture Owner.
- Reviewers.
- Approval Authority.
- Technical Standards.
- Exception Handling.
- Architecture Change Process.

### 48.3 Approval Register

| Role | Name | Responsibility | Approval Status | Date |
|---|---|---|---|---|
| Solution Architect | [Name] | Architecture Review | [Status] | [Date] |
| Technical Lead | [Name] | Engineering Review | [Status] | [Date] |
| Security Architect | [Name] | Security Review | [Status] | [Date] |
| Product Owner | [Name] | Requirements Alignment | [Status] | [Date] |

---

# SECTION 41 — FINAL ARCHITECTURE SUMMARY

## 49. Executive Architecture Summary

Generate a consolidated summary containing:

- Architecture vision.
- Architecture style.
- System boundaries.
- Application structure.
- Component architecture.
- Domain architecture.
- Frontend architecture.
- Backend architecture.
- Database architecture.
- API architecture.
- Integration architecture.
- Security architecture.
- Infrastructure architecture.
- Deployment strategy.
- Scalability strategy.
- Resilience strategy.
- Observability strategy.
- Technology stack.
- Major architecture decisions.
- Critical risks.
- Outstanding decisions.

## 50. Architecture Readiness Assessment

| Category | Status | Remarks |
|---|---|---|
| Architecture Overview | [Status] | [Remarks] |
| Architectural Drivers | [Status] | [Remarks] |
| System Context | [Status] | [Remarks] |
| Architecture Style | [Status] | [Remarks] |
| Logical Architecture | [Status] | [Remarks] |
| Application Architecture | [Status] | [Remarks] |
| Component Architecture | [Status] | [Remarks] |
| Module Architecture | [Status] | [Remarks] |
| Domain Architecture | [Status] | [Remarks] |
| Frontend Architecture | [Status] | [Remarks] |
| Backend Architecture | [Status] | [Remarks] |
| API Architecture | [Status] | [Remarks] |
| Database Architecture | [Status] | [Remarks] |
| Integration Architecture | [Status] | [Remarks] |
| Security Architecture | [Status] | [Remarks] |
| Infrastructure Architecture | [Status] | [Remarks] |
| Deployment Architecture | [Status] | [Remarks] |
| Scalability | [Status] | [Remarks] |
| Resilience | [Status] | [Remarks] |
| Observability | [Status] | [Remarks] |
| Disaster Recovery | [Status] | [Remarks] |
| Architecture Decisions | [Status] | [Remarks] |
| Traceability | [Status] | [Remarks] |

## 51. Outstanding Architecture Questions

Consolidate unresolved technical decisions, missing information, risks, and approval requirements.

## 52. Final Architecture Recommendations

Provide specific recommendations for:

- Selected architecture.
- Component boundaries.
- Technology stack.
- Database strategy.
- Integration strategy.
- Security controls.
- Infrastructure.
- Deployment.
- Performance.
- Scalability.
- Resilience.
- Operational readiness.
- Implementation order.

---

# APPENDIX A — ARCHITECTURE IDENTIFICATION SYSTEM

| Item | Prefix | Example |
|---|---|---|
| Architecture | ARC | ARC-001 |
| Architecture Driver | ADRIVER | ADRIVER-001 |
| Application | APP | APP-001 |
| Container | CONT | CONT-001 |
| Component | COMP | COMP-001 |
| Module | MOD | MOD-001 |
| Domain | DOM | DOM-001 |
| Service | SVC | SVC-001 |
| Database | DB | DB-001 |
| API | API | API-001 |
| Integration | INT | INT-001 |
| External Dependency | EXT | EXT-001 |
| Deployment Unit | DEPLOY | DEPLOY-001 |
| Infrastructure Component | INFRA | INFRA-001 |
| Message Queue | MQ | MQ-001 |
| Event | EVT | EVT-001 |
| Security Threat | THR | THR-001 |
| Architecture Risk | ARISK | ARISK-001 |
| ADR | ADR | ADR-001 |
| Diagram | DIA | DIA-001 |
| Dependency | DEP | DEP-001 |
| Repository | REPO | REPO-001 |

All IDs must remain stable across document revisions.

---

# APPENDIX B — STANDARD ARCHITECTURE DIAGRAMS

Use appropriate architectural notation.

## C4 Model
- Level 1: System Context.
- Level 2: Containers.
- Level 3: Components.
- Level 4: Code, when necessary.

## UML
- Component Diagram.
- Sequence Diagram.
- Class Diagram.
- Deployment Diagram.
- Activity Diagram.
- State Machine Diagram.

## Data Modeling
- Entity Relationship Diagram.
- Data Flow Diagram.
- Data Lineage Diagram.

## Infrastructure
- Network Topology.
- Cloud Infrastructure.
- Runtime Deployment.
- Environment Topology.

## Architecture Decisions
- Decision Trees.
- Trade-Off Diagrams.
- Dependency Graphs.

Use diagrams only where they provide meaningful technical understanding.

---

# APPENDIX C — FINAL ARCHITECTURE VALIDATION CHECKLIST

## Architecture Understanding
- [ ] Project documentation has been analyzed.
- [ ] Architecture scope is established.
- [ ] Architectural drivers are identified.
- [ ] Quality attribute requirements are understood.
- [ ] Constraints are documented.

## System Architecture
- [ ] System context is defined.
- [ ] System boundaries are identified.
- [ ] Architecture style is selected.
- [ ] High-level architecture is documented.
- [ ] Layers are defined.
- [ ] Communication paths are established.

## Application Architecture
- [ ] Applications are identified.
- [ ] Containers are identified.
- [ ] Components are identified.
- [ ] Modules are decomposed.
- [ ] Component responsibilities are clear.
- [ ] Module dependencies are documented.
- [ ] Domain boundaries are defined where applicable.

## Data Architecture
- [ ] Database technologies are selected or pending.
- [ ] Data ownership is defined.
- [ ] Data models are established.
- [ ] Data access is documented.
- [ ] Data consistency is addressed.
- [ ] Migration and recovery are considered.

## Integration Architecture
- [ ] API architecture is defined.
- [ ] External integrations are identified.
- [ ] Communication methods are established.
- [ ] Integration failure handling is documented.
- [ ] Event architecture is considered where applicable.

## Security Architecture
- [ ] Trust boundaries are defined.
- [ ] Authentication is documented.
- [ ] Authorization is documented.
- [ ] Data protection is considered.
- [ ] Network security is considered.
- [ ] Threat modeling is performed where appropriate.

## Infrastructure and Deployment
- [ ] Hosting model is defined.
- [ ] Infrastructure components are identified.
- [ ] Network topology is established.
- [ ] Deployment model is defined.
- [ ] Environments are identified.
- [ ] CI/CD is considered.
- [ ] Infrastructure sizing assumptions are documented.

## Quality Attributes
- [ ] Performance requirements are considered.
- [ ] Scalability is addressed.
- [ ] Availability is addressed.
- [ ] Reliability is addressed.
- [ ] Resilience is addressed.
- [ ] Observability is addressed.
- [ ] Disaster recovery is considered.

## Engineering and Governance
- [ ] Repository strategy is established.
- [ ] Coding standards are considered.
- [ ] Technology compatibility is checked.
- [ ] Architecture decisions are documented.
- [ ] Technical risks are identified.
- [ ] Architecture diagrams are generated where necessary.
- [ ] Traceability is established.
- [ ] Implementation guidance is provided.

## Final Quality
- [ ] Architecture aligns with approved product requirements.
- [ ] Architecture does not introduce unjustified complexity.
- [ ] Major decisions include rationale and trade-offs.
- [ ] Dependencies are documented.
- [ ] Assumptions are clearly identified.
- [ ] Unresolved questions are consolidated.
- [ ] Architecture is technically feasible.
- [ ] Document is sufficiently detailed for engineering implementation.

---

# END OF SOFTWARE ARCHITECTURE DOCUMENT
`;

/**
 * Deterministic generator for Software Architecture Document (SAD) adhering to the template above
 */
export function generateDeterministicArchitecture(
  projectName: string,
  fd: SRSFormData,
  dateStr: string
): string {
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js 22 LTS / Express TypeScript';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis 7';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'AWS ECS / Aurora PostgreSQL';
  const compliance = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'SOC 2 Type II, GDPR, OWASP Top 10';

  return `# SOFTWARE ARCHITECTURE DOCUMENT (SAD)
## AI-Generated System Architecture Specification

**Document Type:** Software Architecture Document  
**Document Version:** 1.0  
**Project Name:** ${projectName}  
**Product Name:** ${projectName} Enterprise Platform  
**Architecture Name:** Clean Layered Modular Architecture  
**Architecture ID:** ARC-${projectName.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'CORE'}  
**Document Status:** Approved  
**Prepared By:** AI Software Architecture Agent (SpecAgent)  
**Solution Architect:** Principal Solutions Architect  
**Technical Owner:** Chief Systems Architect  
**Date Created:** ${dateStr}  
**Last Updated:** ${dateStr}  
**Target Architecture Version:** 1.0.0

---

# SECTION 1 — ARCHITECTURE OVERVIEW

## 1. Architecture Identification

### 1.1 Architecture Information

| Field | Details |
|---|---|
| Project Name | ${projectName} |
| Product Name | ${projectName} Enterprise Platform |
| Architecture ID | ARC-${projectName.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'CORE'} |
| Architecture Name | Clean Layered Modular Architecture |
| Architecture Type | Modular Monolith / Microservices-Ready |
| Architecture Version | 1.0.0 |
| Architecture Owner | Principal Cloud & Solutions Architect |
| Primary Architect | AI Software Architecture Agent |
| Technical Lead | Staff Platform Engineer |
| Target Platform | Cloud-Native Containers (Docker, Linux) |
| Deployment Model | Cloud Hosted (${hosting}) |
| Architecture Status | Approved |
| Related PRD | PRD.md |
| Related Project Plan | project_plan.md |
| Related Design System | designs.md |

### 1.2 Architecture Executive Summary
The system architecture for ${projectName} is a modern, high-throughput, cloud-native platform designed for ${industry}. It employs a clean layered modular pattern, isolating presentation, application orchestration, domain business invariants, and infrastructure persistence into strict unidirectional dependencies.

---

# SECTION 2 — ARCHITECTURAL DRIVERS AND REQUIREMENTS

## 2. Architectural Drivers

### 2.1 Driver Register

| Driver ID | Driver | Category | Requirement | Architectural Impact |
|---|---|---|---|---|
| ADRIVER-001 | Multi-Tenant Data Isolation | Security | Zero cross-tenant data leakage | PostgreSQL Row-Level Security (RLS) & tenant session context |
| ADRIVER-002 | Sub-200ms Latency | Performance | P95 API response duration < 200ms | Redis caching, connection pooling, indexed foreign keys |
| ADRIVER-003 | Cryptographic Auditability | Compliance | Tamper-proof append-only audit trail | Immutable audit_logs table with sha256 checksums |
| ADRIVER-004 | AI Tool Interoperability | Extensibility | Typed agent tool calling | Model Context Protocol (MCP) server integration |

---

# SECTION 4 — SYSTEM CONTEXT AND BOUNDARIES

## 8. System Context

### 8.1 C4 Level 1: System Context Diagram
\`\`\`mermaid
flowchart TD
    User["End User (Operator / Manager)"] -->|HTTPS / TLS 1.3| Sys["${projectName} Platform"]
    Admin["Tenant / Compliance Admin"] -->|HTTPS / MFA| Sys
    Sys -->|SQL Transactions| DB[("PostgreSQL 16 Database")]
    Sys -->|Cache / Sessions| Redis[("Redis 7 Cache")]
    Sys -->|Transactional Webhooks| Stripe["Payment Gateway"]
    Sys -->|SMTP / REST| Mail["Email Dispatcher"]
    Agent["Autonomous AI Agent"] -->|JSON-RPC / REST| MCP["MCP Gateway"]
    MCP --> Sys
\`\`\`

---

# SECTION 6 — HIGH-LEVEL SYSTEM ARCHITECTURE

## 12. System Architecture Layers

### 12.1 Clean Architecture Layer Hierarchy
\`\`\`
+-------------------------------------------------------------+
| Presentation Layer (${frontend} / Radix UI / Tailwind)      |
+-------------------------------------------------------------+
                              | (HTTPS / REST / JSON)
+-------------------------------------------------------------+
| API Gateway & Middleware (Zod Validation, JWT Auth, CORS)   |
+-------------------------------------------------------------+
                              | (Internal Controller Call)
+-------------------------------------------------------------+
| Application Service Layer (Use Cases, Workflow Orchestration)|
+-------------------------------------------------------------+
                              | (Pure Domain Invocations)
+-------------------------------------------------------------+
| Domain Layer (Business Invariants, Entities, Domain Events) |
+-------------------------------------------------------------+
                              | (Repository Interfaces)
+-------------------------------------------------------------+
| Infrastructure Layer (PostgreSQL RLS, Redis, S3, BullMQ)    |
+-------------------------------------------------------------+
\`\`\`

---

# SECTION 8 — COMPONENT AND MODULE ARCHITECTURE

## 14. Component Architecture

### 14.1 Component Inventory

| Component ID | Component | Responsibility | Parent Application | Dependencies |
|---|---|---|---|---|
| COMP-001 | AuthController | Session verification & token rotation | API Gateway | IdentityService |
| COMP-002 | DomainRecordController | Ingestion, validation & mutation | API Gateway | DomainRecordService |
| COMP-003 | AuditStreamWorker | Asynchronous event logging | Worker Service | Redis BullMQ |
| COMP-004 | McpToolServer | Exposes typed MCP tools for AI agents | Core Platform | DomainRecordService |

---

# SECTION 10 — FRONTEND ARCHITECTURE

## 17. Frontend Architecture

### 17.1 Frontend Stack
- **Framework:** React 19 SPA with TypeScript 5
- **Build Tool:** Vite 6 with Rollup code-splitting
- **Styling:** Tailwind CSS + custom Agape design tokens
- **State Management:** React Query (Server Cache) + Zustand (Client Session)
- **Icons:** Lucide React

---

# SECTION 11 — BACKEND ARCHITECTURE

## 18. Backend Architecture

### 18.1 Backend Stack & Execution Lifecycle
- **Runtime:** Node.js 22 LTS (ES Modules)
- **Framework:** Express with async route handlers
- **Validation:** Zod schemas on every ingress request
- **ORM / Persistence:** Type-safe SQL builder with connection pooling (pg / Knex / Kysely)
- **Background Tasks:** BullMQ on Redis 7 with exponential backoff retries

---

# SECTION 13 — DATABASE AND DATA ARCHITECTURE

## 20. Database Architecture

### 20.1 Primary Relational Schema (PostgreSQL 16)
- **Multi-Tenancy:** Shared database with Row-Level Security (RLS) enforcement.
- **Session Hook:** \`SET LOCAL app.current_tenant = :tenant_id;\` on every checkout from connection pool.
- **Entities:** \`tenants\`, \`users\`, \`domain_records\`, \`audit_logs\`.
- **Indexing:** B-Tree composite index on \`(tenant_id, created_at DESC)\` for sub-millisecond range queries.

---

# SECTION 21 — AI AND AGENT ARCHITECTURE

## 28. AI System Architecture

### 28.1 Model Context Protocol (MCP) Integration
- Exposes typed JSON schema tools for external AI Coding Agents.
- Capabilities: \`read_specs\`, \`search_domain_records\`, \`simulate_workflow\`, \`verify_compliance\`.
- Rate-limited and authenticated via cryptographic bearer tokens.

---

# SECTION 22 — SECURITY ARCHITECTURE

## 29. Security Architecture

### 29.1 Trust Boundaries & Defenses
- **Data in Transit:** Mandatory TLS 1.3 with HSTS (Strict-Transport-Security: max-age=31536000).
- **Data at Rest:** AES-256 transparent encryption on PostgreSQL tablespaces and backups.
- **OWASP Top 10 Protections:** Parameterized SQL queries (zero SQLi), CSP headers (zero inline XSS), Argon2id password hashing.

---

# SECTION 24 — DEPLOYMENT ARCHITECTURE

## 31. Deployment Architecture

### 31.1 Container & Hosting Strategy
\`\`\`mermaid
flowchart LR
    Git["GitHub Repo"] -->|PR Merge| CI["GitHub Actions CI/CD"]
    CI -->|Build & Test| Reg["Container Registry"]
    Reg -->|Rolling Deploy| Host["${hosting}"]
    Host --> Web["Web Containers"]
    Host --> API["API Containers"]
    Host --> Worker["Queue Workers"]
    API --> RDS[("Aurora PostgreSQL 16")]
    API --> ElastiCache[("Redis 7 Cluster")]
\`\`\`

---

# SECTION 35 — ARCHITECTURE DECISION RECORDS (ADRS)

## 43. ADR Register

| ADR ID | Decision | Status | Related Components | Date |
|---|---|---|---|---|
| ADR-001 | Modular Monolith over Microservices for v1.0 | Approved | All Modules | ${dateStr} |
| ADR-002 | PostgreSQL 16 Row-Level Security (RLS) for Multi-Tenancy | Approved | Database Layer | ${dateStr} |
| ADR-003 | Stateless JWTs with Redis Sliding Revocation | Approved | Auth Module | ${dateStr} |

---

# APPENDIX A — ARCHITECTURE IDENTIFICATION SYSTEM
- Architectures: \`ARC-001\`
- Applications: \`APP-001\`
- Components: \`COMP-001\`
- Modules: \`MOD-001\`
- Databases: \`DB-001\`
- APIs: \`API-001\`
- External Dependencies: \`EXT-001\`
- Architecture Decisions: \`ADR-001\`

---

# APPENDIX C — FINAL ARCHITECTURE VALIDATION CHECKLIST
- [x] High-level architecture layers and clean unidirectional dependencies defined.
- [x] Multi-tenant isolation model (RLS) and database schema validated.
- [x] Security architecture and threat boundaries documented against OWASP standards.
- [x] C4 System Context and Deployment diagrams embedded in Mermaid notation.

---

# END OF SOFTWARE ARCHITECTURE DOCUMENT
`;
}
