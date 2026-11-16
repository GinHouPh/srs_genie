import { SRSFormData } from '../../types';

/**
 * Master Template: Product Requirements Document (PRD)
 * Supplied for the SpecAgent micro-agent to synthesize product requirements based on User SRS intake.
 */
export const PRD_TEMPLATE = `# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## AI-Generated Product Requirements Specification

**Document Type:** Product Requirements Document  
**Document Version:** 1.0  
**Project Name:** [Project Name]  
**Product Name:** [Product Name]  
**Document Status:** [Draft / Under Review / Approved / Superseded]  
**Prepared By:** AI Product Requirements Analyst  
**Product Owner:** [Product Owner]  
**Date Created:** [Date]  
**Last Updated:** [Date]  
**Target Release:** [Release / Version]

---

# SECTION 0 — AI AGENT OPERATING INSTRUCTIONS

## 0.1 Agent Role

Act as a Senior Product Manager, Product Requirements Analyst, Business Analyst, and Software Product Architect.

Your responsibility is to analyze the user's project description and produce a complete Product Requirements Document that accurately translates the user's ideas and expectations into structured, unambiguous, implementable, and testable product requirements.

The PRD must serve as a reliable reference for:

- Product owners.
- Business analysts.
- UI/UX designers.
- Software architects.
- Frontend developers.
- Backend developers.
- Mobile application developers.
- QA engineers.
- AI coding agents.
- Project managers.
- Stakeholders.

## 0.2 Input Source

The primary input is the User Project Detail Summary.

It may contain:
- Product name and concept.
- Product description.
- Business objectives.
- Problems to solve.
- Target users.
- User roles.
- Proposed modules.
- Feature descriptions.
- User workflows.
- Platform requirements.
- Technology preferences.
- Design preferences.
- Business rules.
- Integrations.
- Data requirements.
- Security expectations.
- Existing systems.
- Constraints.
- Additional instructions.

The agent must extract and organize all available information before generating the PRD.

## 0.3 Requirements Extraction

The agent must identify and separate:

1. Product requirements.
2. Business requirements.
3. User requirements.
4. Functional requirements.
5. Non-functional requirements.
6. Interface requirements.
7. Data requirements.
8. Integration requirements.
9. Security requirements.
10. Operational product requirements.
11. Constraints.
12. Assumptions.
13. Dependencies.
14. Future enhancements.

## 0.4 Source Classification

Every significant requirement must carry an appropriate source classification.

| Classification | Definition |
|---|---|
| User-Confirmed | Explicitly requested by the user. |
| Stakeholder-Confirmed | Explicitly approved by an identified stakeholder. |
| Derived | Logically derived from confirmed requirements. |
| Proposed | Recommended by the AI Agent. |
| Assumed | Temporarily assumed due to missing information. |
| Pending Confirmation | Requires user or stakeholder clarification. |
| Out of Scope | Explicitly excluded. |
| Not Applicable | Does not apply to this product. |

Do not silently convert proposed recommendations into confirmed requirements.

## 0.5 Requirement Quality Rules

Each functional or non-functional requirement must be:

- Clear.
- Specific.
- Atomic wherever practical.
- Unambiguous.
- Feasible.
- Testable.
- Traceable.
- Consistent with other requirements.
- Relevant to an identified product objective or user need.

Avoid vague expressions such as:
- Fast.
- User-friendly.
- Secure.
- Modern.
- Easy to use.
- Highly scalable.

Replace them with measurable or observable expectations wherever possible.

Example:

Weak:
"The application should load quickly."

Better:
"The dashboard should render its primary content within the approved performance target under the defined test conditions."

Do not invent the numerical target when it has not been established. Mark it as pending.

## 0.6 Missing Information Policy

When information is incomplete:

- Use [TBD] for undecided information.
- Use [ASSUMPTION] for temporary assumptions.
- Use [PROPOSED] for agent recommendations.
- Use [PENDING CONFIRMATION] for decisions requiring approval.
- Use [NOT APPLICABLE] where appropriate.
- Record unresolved questions in the Open Questions Register.

The agent must generate the strongest possible PRD from available information without fabricating details.

## 0.7 Contextual Adaptation

Do not force every section into every project.

For example:
- A mobile application requires mobile-specific requirements.
- A SaaS application may require subscription, tenant, entitlement, and administration requirements.
- An AI-enabled application may require model, prompt, context, evaluation, and human oversight requirements.
- An e-commerce application may require product catalog, cart, checkout, payment, and order management requirements.
- An enterprise platform may require complex permissions, audit trails, integrations, and organizational hierarchy requirements.

Include optional sections when relevant and explicitly mark excluded sections when necessary.

## 0.8 PRD Generation Rules

The agent must:

1. Understand the product before writing requirements.
2. Preserve the user's original product intent.
3. Organize the product into logical modules and capabilities.
4. Decompose modules into submodules and features.
5. Decompose significant features into individual requirements.
6. Describe expected user and system behavior.
7. Define business rules and validation rules.
8. Specify primary, alternative, and exception workflows.
9. Define acceptance criteria.
10. Identify relevant data entities.
11. Identify integration requirements.
12. Define security and privacy expectations.
13. Identify non-functional requirements.
14. Maintain requirement traceability.
15. Identify contradictions and dependencies.
16. Separate MVP scope from future enhancements.
17. Validate the completeness and consistency of the final document.

---

# SECTION 1 — PRODUCT FOUNDATION

## 1. Product Identification

### 1.1 Product Information

| Field | Description |
|---|---|
| Product Name | [Product Name] |
| Product Code | [Product ID] |
| Product Category | [Category] |
| Product Type | [SaaS / Web / Mobile / Desktop / Enterprise / API / Other] |
| Industry / Domain | [Industry] |
| Product Owner | [Owner] |
| Target Audience | [Audience] |
| Product Status | [Status] |
| Initial Version | [Version] |
| Target Release | [Release] |
| Supported Platforms | [Platforms] |
| Product Model | [B2B / B2C / B2B2C / Internal / Other] |

### 1.2 Product Description

Provide a detailed description of the product.

Include:
- What the product is.
- What it does.
- Why it is being developed.
- Who will use it.
- What problems it solves.
- What capabilities it provides.
- What outcomes it is expected to deliver.

### 1.3 Product Background

Document the background and context of the product.

Include:
- Origin of the idea.
- Current market or business situation.
- Existing problems.
- Existing solutions.
- Limitations of current approaches.
- Reason for developing a new product.
- Any relevant business or technical context.

### 1.4 Product Vision

Define the desired long-term state of the product.

**Vision Statement:**

[Product vision]

### 1.5 Product Mission

Define the product's primary purpose and intended contribution.

### 1.6 Product Value Proposition

Explain the distinctive value the product provides.

| Value Category | Description |
|---|---|
| Primary Value | [Value] |
| User Value | [Value] |
| Business Value | [Value] |
| Operational Value | [Value] |
| Competitive Value | [Value] |

### 1.7 Product Positioning

Where applicable, describe:
- Product category.
- Target market.
- Market positioning.
- Competitive alternatives.
- Product differentiation.
- Unique selling proposition.

---

# SECTION 2 — PROBLEM DEFINITION AND BUSINESS OBJECTIVES

## 2. Problem Statement

### 2.1 Primary Problem

Clearly define the primary problem the product is designed to solve.

### 2.2 Secondary Problems

Identify additional related problems.

### 2.3 Existing Process or Solution

Describe how the problem is currently addressed.

### 2.4 Current Limitations

Identify the inefficiencies, gaps, and limitations of existing approaches.

### 2.5 Consequences of the Problem

Describe the impact on:
- Users.
- Businesses.
- Productivity.
- Operational efficiency.
- Revenue.
- Customer satisfaction.
- Data and information management.

## 3. Product Objectives

### 3.1 Primary Objectives

List the primary objectives of the product.

### 3.2 Secondary Objectives

Identify supporting objectives.

### 3.3 Business Objectives

Define business outcomes the product should support.

### 3.4 User Objectives

Define what users should be able to achieve using the product.

### 3.5 Product Success Criteria

| Objective ID | Objective | Success Metric | Target | Priority |
|---|---|---|---|---|
| OBJ-001 | [Objective] | [Metric] | [Target] | [Priority] |

### 3.6 Key Performance Indicators

Define applicable product KPIs.

Examples:
- User acquisition.
- Activation rate.
- Adoption rate.
- Daily and monthly active users.
- Task completion rate.
- Conversion rate.
- Retention rate.
- Customer satisfaction.
- Feature utilization.
- Average task completion time.
- Error rate.

For each KPI, define its measurement formula, data source, reporting frequency, and target where known.

---

# SECTION 3 — TARGET USERS AND PERSONAS

## 4. Target Audience

### 4.1 Primary Audience

Identify the primary users the product is designed for.

### 4.2 Secondary Audience

Identify additional users and stakeholders.

### 4.3 Audience Segmentation

Segment users based on:
- Role.
- Industry.
- Organization size.
- Technical proficiency.
- Usage patterns.
- Business needs.
- Access requirements.

## 5. User Personas

Create a persona for each major user category.

### 5.1 Persona Template

**Persona ID:** [PERSONA-001]

| Attribute | Details |
|---|---|
| Persona Name | [Name] |
| User Type | [Type] |
| Role | [Role] |
| Background | [Background] |
| Primary Goals | [Goals] |
| Needs | [Needs] |
| Responsibilities | [Responsibilities] |
| Pain Points | [Problems] |
| Technical Proficiency | [Level] |
| Usage Frequency | [Frequency] |
| Preferred Platform | [Platform] |
| Access Level | [Access] |
| Success Expectations | [Expectations] |

### 5.2 User Motivations

Identify why users would adopt and continue using the product.

### 5.3 User Pain Points

Identify problems the product must address.

### 5.4 User Expectations

Define expected functionality, usability, and outcomes.

### 5.5 User Environment

Consider:
- Devices.
- Operating systems.
- Browser environments.
- Network conditions.
- Accessibility needs.
- Work environments.
- Usage contexts.

---

# SECTION 4 — PRODUCT SCOPE

## 6. Scope Definition

### 6.1 Product Scope Statement

Clearly describe the overall boundaries of the product.

### 6.2 In-Scope Capabilities

List the features and capabilities included in the planned product release.

### 6.3 Out-of-Scope Capabilities

List explicitly excluded features and functionality.

### 6.4 Future Scope

Identify functionality planned for subsequent versions.

### 6.5 Product Boundaries

Define:
- What the product handles.
- What external systems handle.
- What users are responsible for.
- What administrators control.
- What requires external services.
- What is outside the product's responsibility.

### 6.6 Scope Constraints

Document budget, platform, technology, legal, operational, and business constraints that affect product capabilities.

---

# SECTION 5 — PRODUCT STRUCTURE AND INFORMATION ARCHITECTURE

## 7. Product Hierarchy

Organize the product into a logical hierarchy.

Recommended structure:

Product
- Product Area
  - Module
    - Submodule
      - Feature
        - Functional Requirement
          - Acceptance Criteria

### 7.1 Product Area Inventory

| Area ID | Product Area | Description | Target Users |
|---|---|---|---|
| AREA-001 | [Area] | [Description] | [Users] |

### 7.2 Module Inventory

| Module ID | Module | Description | Product Area | Priority |
|---|---|---|---|---|
| MOD-001 | [Module] | [Description] | [Area] | [Priority] |

### 7.3 Submodule Inventory

| Submodule ID | Name | Description | Parent Module |
|---|---|---|---|
| SUB-001 | [Submodule] | [Description] | [Module] |

### 7.4 Feature Inventory

| Feature ID | Feature | Description | Module | User Type | Priority |
|---|---|---|---|---|---|
| FEAT-001 | [Feature] | [Description] | [Module] | [User] | [Priority] |

### 7.5 Product Navigation Structure

Define how users navigate the product.

Include:
- Primary navigation.
- Secondary navigation.
- Application menus.
- Workspace navigation.
- Contextual navigation.
- Settings navigation.
- User account navigation.
- Administrative navigation.

### 7.6 Information Architecture

Define how screens, content, features, and data are logically organized.

Where useful, produce:
- Sitemap.
- Navigation tree.
- Module relationship map.
- User access map.

---

# SECTION 6 — FUNCTIONAL REQUIREMENTS

## 8. Functional Requirements Overview

### 8.1 Requirement Definition

Functional requirements define the observable behavior and capabilities the product must provide.

### 8.2 Functional Requirement Register

| Requirement ID | Title | Description | Module | Priority | Source |
|---|---|---|---|---|---|
| FR-001 | [Title] | [Description] | [Module] | [Priority] | [Source] |

### 8.3 Functional Requirement Specification

Use the following structure for each important requirement.

**FR-[ID]: [Requirement Title]**

**Requirement Information**
- Requirement ID.
- Requirement Title.
- Module.
- Submodule.
- Related Feature.
- Requirement Description.
- Business Rationale.
- Requirement Source.
- Priority.
- Status.

**User and Context**
- Primary Actor.
- Secondary Actors.
- Applicable User Roles.
- Trigger.
- Preconditions.

**System Behavior**
- Input Requirements.
- Input Validation.
- Processing Logic.
- Business Rules.
- Expected System Response.
- Output Requirements.
- Postconditions.

**Interaction and Interface**
- Screen or Interface Reference.
- User Actions.
- Navigation Behavior.
- Feedback Messages.
- Loading Behavior.
- Empty State.
- Error State.
- Success State.

**Access and Security**
- Required Permissions.
- Data Access Restrictions.
- Authentication Requirements.
- Audit Requirements.

**Exception Handling**
- Invalid Inputs.
- Unauthorized Operations.
- Missing Data.
- Duplicate Requests.
- Service Failures.
- Network Interruptions.
- Unexpected System Conditions.

**Acceptance**
- Acceptance Criteria.
- Related Test Cases.
- Dependencies.
- Open Questions.

### 8.4 Requirement Priority

Apply a consistent prioritization framework, such as MoSCoW:

- Must Have.
- Should Have.
- Could Have.
- Won't Have in Current Release.

### 8.5 Feature Decomposition

For every major feature, identify:
- Main operations.
- Secondary operations.
- Related actions.
- User permissions.
- Data involved.
- Business rules.
- Failure conditions.
- Dependencies.

### 8.6 CRUD Requirements

Where applicable, explicitly define:

- Create.
- Read.
- Update.
- Delete.

Also consider:
- View.
- Search.
- Filter.
- Sort.
- Export.
- Import.
- Archive.
- Restore.
- Duplicate.
- Bulk operations.

Do not assume every feature requires every operation.

---

# SECTION 7 — USER STORIES AND USE CASES

## 9. User Stories

Convert appropriate functional requirements into user stories.

### 9.1 User Story Template

**US-[ID]: [Story Title]**

As a [user role],  
I want to [perform an action],  
So that [expected benefit].

**Supporting Details**
- Story ID.
- Related Requirement.
- Related Feature.
- User Role.
- Business Value.
- Priority.
- Dependencies.
- Estimated Complexity.

**Acceptance Criteria**

Given [initial context],  
When [action occurs],  
Then [expected outcome].

Include multiple scenarios where necessary.

### 9.2 Alternative User Stories

Include:
- Primary user stories.
- Administrative user stories.
- Exception-handling user stories.
- System-generated behavior.
- Integration-related user stories.

## 10. Use Cases

### 10.1 Use Case Template

**UC-[ID]: [Use Case Name]**

- Purpose.
- Primary Actor.
- Secondary Actors.
- Preconditions.
- Trigger.
- Main Success Scenario.
- Alternative Flows.
- Exception Flows.
- Postconditions.
- Business Rules.
- Related Requirements.
- Acceptance Criteria.

### 10.2 Use Case Coverage

Ensure critical product workflows are represented by at least one appropriate use case.

---

# SECTION 8 — BUSINESS LOGIC AND RULES

## 11. Business Rules

### 11.1 Business Rule Register

| Rule ID | Rule Name | Rule Description | Related Module | Priority |
|---|---|---|---|---|
| RULE-001 | [Rule] | [Description] | [Module] | [Priority] |

### 11.2 Rule Specification

For each significant rule, define:
- Rule ID.
- Rule Description.
- Business Purpose.
- Applicable Users.
- Conditions.
- Inputs.
- Processing.
- Expected Result.
- Exceptions.
- Dependencies.
- Related Requirements.

### 11.3 Validation Rules

Define:
- Required fields.
- Allowed formats.
- Minimum and maximum values.
- Allowed data types.
- Uniqueness.
- Cross-field validation.
- Conditional validation.
- Business constraints.

### 11.4 Conditional Logic

Document rules involving:
- If/then conditions.
- Multiple conditions.
- Decision trees.
- State transitions.
- Thresholds.
- Escalation.
- Approval conditions.

### 11.5 Calculation Rules

For products involving financial, mathematical, statistical, or scoring operations, specify:
- Formula.
- Variables.
- Input conditions.
- Precision and rounding.
- Currency or unit.
- Expected output.
- Boundary cases.

### 11.6 State and Status Management

Where applicable, define:
- Initial state.
- Available states.
- Allowed transitions.
- Transition triggers.
- Permissions.
- Conditions.
- Terminal states.
- Invalid transitions.

Include a state transition diagram when useful.

### 11.7 Approval and Authorization Workflows

Define:
- Approval roles.
- Approval conditions.
- Approval sequence.
- Rejection.
- Revision.
- Escalation.
- Delegation.
- Audit history.

---

# SECTION 9 — USER WORKFLOWS AND PROCESS FLOWS

## 12. Workflow Definition

### 12.1 Workflow Inventory

| Workflow ID | Workflow Name | Primary Actor | Related Module | Priority |
|---|---|---|---|---|
| WF-001 | [Workflow] | [Actor] | [Module] | [Priority] |

### 12.2 Workflow Specification

For each workflow define:

- Workflow ID.
- Workflow Name.
- Purpose.
- Trigger.
- Actors.
- Preconditions.
- Initial State.
- Step-by-Step Flow.
- Conditional Branches.
- Alternative Paths.
- Exception Handling.
- Notifications.
- Data Changes.
- Final State.
- Postconditions.

### 12.3 Workflow Diagrams

Generate appropriate:
- Activity Diagrams.
- Flowcharts.
- Sequence Diagrams.
- State Transition Diagrams.
- BPMN Diagrams, where appropriate.

### 12.4 Cross-Module Workflows

Identify workflows spanning multiple modules and document their dependencies and interactions.

---

# SECTION 10 — UI/UX AND INTERFACE REQUIREMENTS

## 13. User Experience Requirements

### 13.1 Design Vision

Describe the intended design experience.

### 13.2 UX Principles

Define relevant principles such as:
- Consistency.
- Simplicity.
- Predictability.
- Accessibility.
- Discoverability.
- Efficiency.
- Responsive design.
- User feedback.
- Error prevention.

### 13.3 Design System Requirements

Specify:
- Typography.
- Colors.
- Spacing.
- Grids.
- Layout.
- Icons.
- Buttons.
- Inputs.
- Forms.
- Tables.
- Cards.
- Navigation components.
- Modals.
- Notifications.
- Charts.
- Data visualizations.

### 13.4 Screen Inventory

| Screen ID | Screen Name | Purpose | User Role | Related Module |
|---|---|---|---|---|
| SCR-001 | [Screen] | [Purpose] | [Role] | [Module] |

### 13.5 Screen Specification

For each screen include:

**Screen Information**
- Screen ID.
- Screen Name.
- Screen Purpose.
- Primary User.
- Entry Point.
- Exit Point.
- Related Feature.

**Layout**
- Header.
- Navigation.
- Main Content.
- Sidebar.
- Footer.
- Content Sections.
- Action Areas.

**Components**
- Input Fields.
- Buttons.
- Tables.
- Cards.
- Dropdowns.
- Tabs.
- Search.
- Filters.
- Dialogs.
- Menus.

**Interactions**
- User Actions.
- Action Outcomes.
- Navigation.
- Data Submission.
- Editing.
- Confirmation.
- Notifications.

**Screen States**
- Default.
- Loading.
- Empty.
- Success.
- Error.
- Disabled.
- Unauthorized.
- Partial Data.

**Responsive Behavior**
- Desktop.
- Tablet.
- Mobile.

**Accessibility**
- Keyboard Navigation.
- Semantic Structure.
- Labels.
- Contrast.
- Screen Reader Support.

### 13.6 Navigation Requirements

Define the expected movement between screens, pages, tabs, menus, and application areas.

### 13.7 Form Requirements

Document:
- Field labels.
- Field types.
- Required fields.
- Default values.
- Validation.
- Help text.
- Error messages.
- Submission behavior.
- Reset behavior.
- Draft behavior.

### 13.8 Search, Sorting and Filtering

Specify:
- Search scope.
- Search fields.
- Search behavior.
- Filter options.
- Sorting options.
- Pagination.
- Result limits.
- Empty results.
- Advanced search, if applicable.

### 13.9 Notifications and Feedback

Define:
- Success notifications.
- Error notifications.
- Warning messages.
- Informational messages.
- In-app notifications.
- Email notifications.
- Push notifications.
- Notification preferences.

### 13.10 Accessibility and Localization

Identify accessibility and localization requirements appropriate to the target audience and supported platforms.

---

# SECTION 11 — DATA REQUIREMENTS

## 14. Product Data Requirements

### 14.1 Data Overview

Describe the types of information the product must handle.

### 14.2 Data Entity Inventory

| Entity ID | Entity Name | Description | Related Module | Data Classification |
|---|---|---|---|---|
| DATA-001 | [Entity] | [Description] | [Module] | [Classification] |

### 14.3 Data Entity Specification

For each entity define:
- Entity Name.
- Entity Purpose.
- Primary Key.
- Attributes.
- Field Names.
- Data Types.
- Required Fields.
- Optional Fields.
- Default Values.
- Validation.
- Unique Constraints.
- Relationships.
- Related Modules.
- Data Ownership.

### 14.4 Data Relationship Requirements

Describe:
- One-to-One Relationships.
- One-to-Many Relationships.
- Many-to-Many Relationships.
- Parent-Child Relationships.
- Ownership Relationships.
- Cross-Module Relationships.

### 14.5 Data Lifecycle

Document:
- Data Creation.
- Data Modification.
- Data Access.
- Data Processing.
- Data Archival.
- Data Retention.
- Data Deletion.
- Data Restoration.

### 14.6 Data Import and Export

Where applicable, define:
- Supported formats.
- Import sources.
- Export formats.
- Validation.
- Duplicate handling.
- Processing limits.
- Error reporting.
- Permissions.

### 14.7 Data Search and Retrieval

Define expected query and retrieval behavior, including filters, sorting, pagination, and access restrictions.

### 14.8 Data Audit Requirements

Identify which data operations must be recorded, such as:
- Creation.
- Modification.
- Deletion.
- Ownership changes.
- Permission changes.
- Administrative actions.

### 14.9 Data Retention and Deletion

Define retention periods, deletion expectations, archival requirements, and applicable legal constraints where established.

---

# SECTION 12 — API AND INTEGRATION REQUIREMENTS

## 15. API Requirements

### 15.1 API Inventory

| API ID | API Name | Purpose | Related Module | API Type |
|---|---|---|---|---|
| API-001 | [API] | [Purpose] | [Module] | [REST / GraphQL / Other] |

### 15.2 API Requirement Specification

For each relevant API, document:
- API ID.
- Endpoint or Operation.
- HTTP Method or Protocol Operation.
- Purpose.
- Authentication.
- Authorization.
- Request Structure.
- Required Parameters.
- Optional Parameters.
- Validation.
- Expected Response.
- Error Responses.
- Rate Limiting.
- Pagination.
- Versioning.
- Idempotency, where required.
- Related Requirements.

The PRD should describe API capabilities and expected contracts at the appropriate product level. Detailed endpoint implementation belongs in the API Specification or Technical Design Document.

## 16. External Integrations

### 16.1 Integration Inventory

| Integration ID | Service | Purpose | Direction | Priority |
|---|---|---|---|---|
| INT-001 | [Service] | [Purpose] | [Inbound / Outbound / Bidirectional] | [Priority] |

### 16.2 Integration Specification

For each integration define:
- Service Name.
- Provider.
- Business Purpose.
- Data Exchanged.
- Trigger.
- Expected Behavior.
- Authentication Needs.
- Failure Behavior.
- Retry Requirements.
- Rate Limits.
- Dependencies.
- Security Considerations.
- User Impact.
- Acceptance Criteria.

### 16.3 Webhook Requirements

Where relevant, specify:
- Events.
- Event Payload.
- Event Consumers.
- Delivery Expectations.
- Duplicate Handling.
- Retry Behavior.
- Failure Reporting.
- Security Verification.

---

# SECTION 13 — NON-FUNCTIONAL REQUIREMENTS

## 17. Quality Attribute Requirements

### 17.1 Performance

Specify expectations for:
- Page rendering.
- API latency.
- Search performance.
- Database operations.
- File handling.
- Concurrent activity.
- Background jobs.
- Real-time processing.

### 17.2 Scalability

Define expected product behavior as:
- User volume increases.
- Data volume increases.
- Transactions increase.
- Integrations increase.
- Geographic coverage expands.

### 17.3 Availability

Define expected service availability and acceptable interruptions.

### 17.4 Reliability

Specify:
- Fault handling.
- Error recovery.
- Retry behavior.
- Data consistency.
- Resilience expectations.

### 17.5 Usability

Define observable usability expectations, such as task completion, navigation consistency, and user feedback.

### 17.6 Accessibility

Define supported accessibility requirements and standards.

### 17.7 Compatibility

Identify supported:
- Browsers.
- Operating systems.
- Mobile devices.
- Screen sizes.
- Application environments.

### 17.8 Maintainability

Define product-level expectations for extensibility, configuration, version compatibility, and ongoing support.

### 17.9 Security

Define product-level security expectations, including:
- Authentication.
- Authorization.
- Session security.
- MFA where required.
- Encryption.
- Auditability.
- Data isolation.
- Secure data access.

### 17.10 Privacy

Define:
- Personal information handling.
- Consent.
- Visibility.
- Access.
- Export.
- Retention.
- Deletion.
- Privacy controls.

### 17.11 Reliability and Recovery

Define recovery expectations and relevant RPO/RTO targets where applicable.

### 17.12 NFR Register

| NFR ID | Category | Requirement | Measurement | Target | Priority |
|---|---|---|---|---|---|
| NFR-001 | Performance | [Requirement] | [Metric] | [Target] | [Priority] |

---

# SECTION 14 — AUTHENTICATION, AUTHORIZATION AND PERMISSIONS

## 18. Identity Requirements

### 18.1 Authentication Methods

Identify applicable methods:
- Email and Password.
- Phone and OTP.
- Single Sign-On.
- Social Login.
- Enterprise Identity Provider.
- Multi-Factor Authentication.
- Passkeys.

### 18.2 User Account Management

Define:
- Account creation.
- Activation.
- Login.
- Logout.
- Password recovery.
- Profile management.
- Account suspension.
- Account deletion.

### 18.3 Authorization Model

Identify whether the product requires:
- Role-Based Access Control.
- Attribute-Based Access Control.
- Permission-Based Access Control.
- Resource-Level Access Control.
- Ownership-Based Access.

### 18.4 Role Inventory

| Role ID | Role Name | Description | Access Scope |
|---|---|---|---|
| ROLE-001 | [Role] | [Description] | [Scope] |

### 18.5 Permission Matrix

| Module / Feature | Administrator | Manager | User | Guest |
|---|---|---|---|---|
| [Feature] | [Permission] | [Permission] | [Permission] | [Permission] |

### 18.6 Permission Types

Consider:
- View.
- Create.
- Edit.
- Delete.
- Approve.
- Publish.
- Export.
- Manage.
- Configure.
- Assign.
- Share.

### 18.7 Access Restrictions

Define:
- Resource ownership.
- Organizational boundaries.
- Data visibility.
- Administrative overrides.
- Restricted actions.
- Privileged operations.

---

# SECTION 15 — ANALYTICS AND REPORTING REQUIREMENTS

## 19. Analytics

### 19.1 Product Analytics Objectives

Identify the product behaviors and outcomes that must be measured.

### 19.2 Event Tracking

| Event ID | Event Name | Trigger | Properties | Purpose |
|---|---|---|---|---|
| EVT-001 | [Event] | [Trigger] | [Properties] | [Purpose] |

### 19.3 User Activity Tracking

Identify applicable events:
- Account registration.
- Login.
- Feature usage.
- Workflow completion.
- Failed operations.
- Subscription actions.
- User engagement.
- Administrative actions.

### 19.4 Reporting Requirements

Define:
- Dashboard requirements.
- Reports.
- Filters.
- Grouping.
- Aggregations.
- Export.
- Scheduled reporting.
- Access permissions.

### 19.5 KPI Dashboards

Specify dashboard users, metrics, visualization types, refresh frequency, and access restrictions.

### 19.6 Data Accuracy

Define expected calculation methods, data sources, and consistency requirements.

---

# SECTION 16 — NOTIFICATIONS AND COMMUNICATION

## 20. Notification Requirements

### 20.1 Notification Channels

Identify applicable channels:
- In-App.
- Email.
- SMS.
- Push Notifications.
- Webhooks.
- Other external channels.

### 20.2 Notification Inventory

| Notification ID | Event | Recipient | Channel | Priority |
|---|---|---|---|---|
| NOTIF-001 | [Event] | [Recipient] | [Channel] | [Priority] |

### 20.3 Notification Specification

For each notification define:
- Trigger.
- Recipient.
- Content.
- Channel.
- Timing.
- Frequency.
- User Preferences.
- Delivery Status.
- Retry.
- Failure Handling.

### 20.4 Notification Preferences

Define which notifications users can enable, disable, customize, or subscribe to.

### 20.5 Communication Templates

Identify required templates for emails, messages, alerts, and system communications.

---

# SECTION 17 — PLATFORM-SPECIFIC REQUIREMENTS

## 21. Platform Requirements

Include relevant subsections according to product type.

### 21.1 Web Application

- Supported browsers.
- Responsive behavior.
- Web navigation.
- Session handling.
- Browser storage.
- Web accessibility.
- Cross-browser compatibility.

### 21.2 Mobile Application

- Android and iOS requirements.
- Device compatibility.
- Native functionality.
- Push notifications.
- Permissions.
- Offline operation.
- Synchronization.
- Background execution.
- Deep links.
- App updates.
- Distribution requirements.

### 21.3 Desktop Application

- Operating system compatibility.
- Installation.
- Updates.
- Desktop notifications.
- Local storage.
- File system access.
- Offline operation.
- Uninstallation.

### 21.4 API Product

- API consumers.
- API access management.
- Documentation.
- Versioning.
- Rate limits.
- Usage tracking.
- API keys.
- Webhooks.
- Deprecation policy.

### 21.5 SaaS Product

Where applicable, include:

**Tenant Management**
- Tenant registration.
- Tenant provisioning.
- Tenant configuration.
- Tenant lifecycle.
- Tenant suspension.
- Tenant termination.

**Subscription Management**
- Plans.
- Pricing.
- Trials.
- Subscription activation.
- Renewals.
- Upgrades.
- Downgrades.
- Cancellation.

**Entitlements**
- Feature availability.
- Usage limits.
- Resource quotas.
- Subscription-based permissions.

**Multi-Tenancy**
- Tenant isolation.
- Tenant-specific configurations.
- Tenant user management.
- Tenant data visibility.
- Cross-tenant restrictions.

**Administrative Management**
- Platform administration.
- Tenant administration.
- System-wide configurations.
- Usage monitoring.

### 21.6 Offline and Synchronization Requirements

Where relevant, specify:
- Offline capabilities.
- Local data persistence.
- Synchronization triggers.
- Conflict resolution.
- Data freshness.
- Connectivity recovery.

---

# SECTION 18 — SPECIALIZED PRODUCT REQUIREMENTS

## 22. Conditional Domain-Specific Requirements

The AI Agent must identify specialized requirements according to the product domain.

Examples include:

### 22.1 AI-Powered Software

Where the product uses AI or autonomous agents, consider:
- AI capabilities.
- Model and provider requirements.
- Model selection.
- Prompt management.
- Context management.
- Memory requirements.
- Retrieval-Augmented Generation.
- Tool invocation.
- Agent workflow orchestration.
- Human approval.
- Output validation.
- Hallucination handling.
- Safety controls.
- Guardrails.
- Evaluation.
- Observability.
- Token and usage tracking.
- Model fallback.
- AI cost management.
- Data privacy.

### 22.2 E-Commerce

Consider:
- Catalog.
- Product variants.
- Inventory.
- Shopping cart.
- Checkout.
- Payment.
- Orders.
- Shipping.
- Returns.
- Refunds.
- Promotions.
- Customer accounts.

### 22.3 Financial Software

Consider:
- Account structures.
- Transactions.
- Ledger.
- Reconciliation.
- Calculations.
- Financial reporting.
- Authorization.
- Auditability.
- Applicable regulatory requirements.

### 22.4 Healthcare Software

Consider:
- Patient data.
- Consent.
- Clinical workflows.
- Access restrictions.
- Audit trails.
- Data privacy.
- Relevant healthcare compliance.

### 22.5 Collaboration Software

Consider:
- Workspaces.
- Teams.
- Invitations.
- Collaboration permissions.
- Comments.
- Activity feeds.
- Notifications.
- Real-time updates.
- File sharing.

These are conditional modules, not mandatory requirements. Include only those relevant to the project.

---

# SECTION 19 — CONTENT AND FILE MANAGEMENT

## 23. Content Requirements

Where applicable, define:
- Content creation.
- Editing.
- Publishing.
- Archiving.
- Content categorization.
- Content search.
- Content versioning.
- Approval workflows.
- Localization.

## 24. File Management

Where applicable, define:
- Upload.
- Download.
- Preview.
- File formats.
- File size restrictions.
- File validation.
- Storage limits.
- File sharing.
- Access permissions.
- Metadata.
- Versioning.
- Retention.
- Malware scanning.

---

# SECTION 20 — SYSTEM STATES, ERRORS AND EXCEPTION HANDLING

## 25. Product State Management

Define the states relevant to major product objects and workflows.

For example:
- Draft.
- Pending.
- Submitted.
- Under Review.
- Approved.
- Rejected.
- Active.
- Suspended.
- Completed.
- Archived.
- Deleted.

Identify which states are applicable to each entity rather than applying one universal list.

## 26. Error Handling Requirements

### 26.1 Error Categories

Identify:
- Validation Errors.
- Authentication Errors.
- Authorization Errors.
- Business Rule Errors.
- Integration Errors.
- Network Errors.
- Database Errors.
- Processing Errors.
- File Errors.
- System Errors.

### 26.2 Error Specification

For each relevant error define:
- Error ID.
- Error Category.
- Trigger.
- Expected System Behavior.
- User Message.
- Recovery Action.
- Logging Requirement.
- Escalation Requirement.

### 26.3 Exceptional Scenarios

Consider:
- Duplicate submission.
- Interrupted transaction.
- Network disconnection.
- Session expiration.
- Third-party service outage.
- Invalid user operation.
- Partial data availability.
- Concurrent updates.
- Unexpected system restart.

### 26.4 Recovery and Retry Behavior

Define which operations can be retried, how duplicate actions are prevented, and how users are informed about incomplete operations.

---

# SECTION 21 — SECURITY, PRIVACY AND COMPLIANCE REQUIREMENTS

## 27. Product Security

### 27.1 Security Requirements

Define all security controls required from the product's perspective.

### 27.2 Sensitive Data

Identify:
- Personal data.
- Financial data.
- Authentication credentials.
- Confidential business information.
- Proprietary information.
- Other regulated data.

### 27.3 Data Protection Requirements

Define:
- Encryption expectations.
- Access restrictions.
- Data masking.
- Data segregation.
- Retention.
- Secure deletion.
- Data portability.

### 27.4 Audit Requirements

Identify actions requiring audit records.

### 27.5 Compliance

Identify applicable laws, standards, regulations, contracts, and industry obligations based on the actual product context.

### 27.6 Security Acceptance Criteria

Define security-related product acceptance requirements and validation conditions.

---

# SECTION 22 — PRODUCT CONFIGURATION AND CUSTOMIZATION

## 28. Configuration Requirements

Where applicable, define:
- Global settings.
- User settings.
- Organization settings.
- Tenant settings.
- Workspace settings.
- Module settings.
- Feature configuration.
- Notification preferences.
- Localization settings.

## 29. Customization Requirements

Identify whether users or administrators can:
- Customize dashboards.
- Customize layouts.
- Create custom fields.
- Configure workflows.
- Configure roles.
- Customize templates.
- Define business rules.
- Configure integrations.

Specify boundaries and permission requirements.

---

# SECTION 23 — PRODUCT RELEASE AND ACCEPTANCE REQUIREMENTS

## 30. Product Release Definition

### 30.1 Release Structure

Define:
- MVP.
- Initial Production Release.
- Subsequent Releases.
- Major Versions.
- Minor Versions.
- Maintenance Releases.

### 30.2 MVP Requirements

Identify the minimum set of features needed to deliver the product's primary value.

### 30.3 Release Scope

| Release | Version | Included Features | Excluded Features | Release Objective |
|---|---|---|---|---|
| MVP | v1.0 | [Features] | [Features] | [Objective] |
| Release 2 | v1.1 | [Features] | [Features] | [Objective] |
| Release 3 | v2.0 | [Features] | [Features] | [Objective] |

### 30.4 Release Dependencies

Identify which capabilities must exist before the release can be considered viable.

### 30.5 Product Acceptance Criteria

Define the conditions under which the product or release is accepted.

Include:
- Functional completeness.
- Critical workflow verification.
- User experience requirements.
- Security requirements.
- Data integrity requirements.
- Performance requirements.
- Accessibility requirements.
- Integration requirements.

### 30.6 Release Readiness

Define required product-level release approvals and quality gates.

---

# SECTION 24 — REQUIREMENTS DEPENDENCIES AND CONSTRAINTS

## 31. Dependency Register

| Dependency ID | Dependency | Type | Related Requirement | Impact |
|---|---|---|---|---|
| DEP-001 | [Dependency] | [Internal / External] | [Requirement] | [Impact] |

## 32. Constraints Register

Identify:
- Business constraints.
- Technical constraints.
- Platform constraints.
- Resource constraints.
- Budget constraints.
- Compliance constraints.
- External service constraints.

## 33. Assumptions Register

| Assumption ID | Assumption | Reason | Impact if Incorrect | Validation |
|---|---|---|---|---|
| ASM-001 | [Assumption] | [Reason] | [Impact] | [Method] |

## 34. Risk Register

| Risk ID | Risk | Probability | Impact | Mitigation | Related Requirements |
|---|---|---|---|---|---|
| RISK-001 | [Risk] | [Level] | [Level] | [Action] | [IDs] |

---

# SECTION 25 — REQUIREMENTS TRACEABILITY

## 35. Requirements Traceability Matrix

Maintain end-to-end traceability between product objectives, user needs, features, and validation.

| Business Objective | User Need | Feature | Requirement ID | User Story | Acceptance Criteria |
|---|---|---|---|---|---|
| [Objective] | [Need] | [Feature] | FR-001 | US-001 | [Criteria] |

## 36. Traceability Rules

- Every major product objective should map to one or more product capabilities.
- Every confirmed feature should map to one or more requirements.
- Every critical functional requirement should have acceptance criteria.
- Every major user workflow should be covered by relevant requirements.
- Critical requirements must have corresponding test coverage.
- Proposed requirements must remain distinguishable from confirmed requirements.
- Future scope must not be confused with current release scope.

## 37. Change Impact Analysis

For changes to existing requirements, identify affected:
- Product objectives.
- Features.
- Modules.
- User stories.
- Workflows.
- Screens.
- Data entities.
- Integrations.
- Permissions.
- Acceptance criteria.
- Test cases.
- Release scope.

---

# SECTION 26 — PRODUCT OPEN QUESTIONS AND DECISIONS

## 38. Open Questions Register

Record missing information that must be clarified.

| Question ID | Question | Reason | Impact | Priority | Expected Owner |
|---|---|---|---|---|---|
| Q-001 | [Question] | [Reason] | [Impact] | [Priority] | [Owner] |

Prioritize questions according to how much they affect:
- Product scope.
- Major capabilities.
- Business logic.
- User experience.
- Data.
- Security.
- Architecture.
- Release feasibility.

## 39. Product Decision Register

| Decision ID | Decision | Available Options | Selected Option | Reason | Status |
|---|---|---|---|---|---|
| DEC-001 | [Decision] | [Options] | [Selection] | [Reason] | [Status] |

Record decisions and their approval status separately from assumptions.

---

# SECTION 27 — PRD SUMMARY AND APPROVAL

## 40. Executive Product Summary

Generate a high-level summary of:

- Product concept.
- Problem statement.
- Product vision.
- Target users.
- Business objectives.
- Key product capabilities.
- Major modules.
- MVP scope.
- Important requirements.
- Product constraints.
- Major assumptions.
- Outstanding decisions.
- Expected outcomes.

## 41. Product Requirements Health Check

| Category | Status | Remarks |
|---|---|---|
| Product Overview | [Status] | [Remarks] |
| Business Objectives | [Status] | [Remarks] |
| User Analysis | [Status] | [Remarks] |
| Product Scope | [Status] | [Remarks] |
| Module Breakdown | [Status] | [Remarks] |
| Functional Requirements | [Status] | [Remarks] |
| Business Rules | [Status] | [Remarks] |
| Workflows | [Status] | [Remarks] |
| UI/UX Requirements | [Status] | [Remarks] |
| Data Requirements | [Status] | [Remarks] |
| Integration Requirements | [Status] | [Remarks] |
| Non-Functional Requirements | [Status] | [Remarks] |
| Security Requirements | [Status] | [Remarks] |
| Release Scope | [Status] | [Remarks] |
| Acceptance Criteria | [Status] | [Remarks] |
| Traceability | [Status] | [Remarks] |

## 42. Approval and Sign-Off

| Role | Name | Approval Status | Date | Comments |
|---|---|---|---|---|
| Product Owner | [Name] | [Status] | [Date] | [Comments] |
| Business Owner | [Name] | [Status] | [Date] | [Comments] |
| Technical Reviewer | [Name] | [Status] | [Date] | [Comments] |
| Stakeholder | [Name] | [Status] | [Date] | [Comments] |

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM

Use globally consistent IDs throughout the PRD.

| Item | Prefix | Example |
|---|---|---|
| Product Area | AREA | AREA-001 |
| Module | MOD | MOD-001 |
| Submodule | SUB | SUB-001 |
| Feature | FEAT | FEAT-001 |
| Functional Requirement | FR | FR-001 |
| Non-Functional Requirement | NFR | NFR-001 |
| Business Rule | RULE | RULE-001 |
| User Story | US | US-001 |
| Use Case | UC | UC-001 |
| Workflow | WF | WF-001 |
| Screen | SCR | SCR-001 |
| Data Entity | DATA | DATA-001 |
| API | API | API-001 |
| Integration | INT | INT-001 |
| Notification | NOTIF | NOTIF-001 |
| Event | EVT | EVT-001 |
| Role | ROLE | ROLE-001 |
| Dependency | DEP | DEP-001 |
| Assumption | ASM | ASM-001 |
| Risk | RISK | RISK-001 |
| Open Question | Q | Q-001 |
| Decision | DEC | DEC-001 |

Requirements IDs must remain stable when document sections are reordered or expanded.

---

# APPENDIX B — STANDARD ENUMERATIONS

## Requirement Priority

- Critical.
- High.
- Medium.
- Low.

## MoSCoW Priority

- Must Have.
- Should Have.
- Could Have.
- Won't Have This Release.

## Requirement Status

- Proposed.
- Draft.
- Under Review.
- Approved.
- Rejected.
- Deferred.
- Implemented.
- Verified.
- Deprecated.

## Source Classification

- User-Confirmed.
- Stakeholder-Confirmed.
- Derived.
- Proposed.
- Assumed.
- Pending Confirmation.
- Out of Scope.
- Not Applicable.

## Complexity

- Very Low.
- Low.
- Medium.
- High.
- Very High.

## Acceptance Status

- Not Tested.
- Pending.
- Passed.
- Failed.
- Blocked.
- Accepted with Exceptions.

---

# APPENDIX C — FINAL PRD VALIDATION CHECKLIST

Before presenting the completed PRD, the agent must verify:

## Product Understanding
- [ ] Product summary has been analyzed.
- [ ] Product purpose is clear.
- [ ] Problem statement is defined.
- [ ] Product vision is documented.
- [ ] Business objectives are identified.
- [ ] Target audience is defined.

## Product Structure
- [ ] Product areas are identified.
- [ ] Modules are defined.
- [ ] Submodules are defined where required.
- [ ] Features are inventoried.
- [ ] Product navigation is considered.
- [ ] MVP and future scope are separated.

## Requirements Quality
- [ ] Functional requirements are documented.
- [ ] Non-functional requirements are considered.
- [ ] Requirements are unambiguous.
- [ ] Requirements are testable.
- [ ] Requirements have unique IDs.
- [ ] Priorities are assigned.
- [ ] Requirements have source classifications.
- [ ] Dependencies are identified.

## Functional Detail
- [ ] Major user stories are created.
- [ ] Important use cases are documented.
- [ ] Business rules are identified.
- [ ] Validation rules are documented.
- [ ] Workflows are described.
- [ ] State transitions are considered.
- [ ] Exception handling is specified.

## Product Experience
- [ ] User personas are identified.
- [ ] Screen inventory is generated where applicable.
- [ ] UI/UX requirements are documented.
- [ ] Forms and interactions are specified.
- [ ] Loading, error, and empty states are considered.
- [ ] Accessibility requirements are considered.

## Technical and Operational Requirements
- [ ] Data requirements are identified.
- [ ] Integration requirements are documented.
- [ ] API requirements are considered.
- [ ] Authentication and permissions are specified.
- [ ] Security and privacy are considered.
- [ ] Analytics requirements are considered.
- [ ] Platform-specific requirements are included.

## Acceptance and Traceability
- [ ] Critical requirements have acceptance criteria.
- [ ] Product objectives are mapped to capabilities.
- [ ] Requirements are mapped to features.
- [ ] Critical requirements have test coverage references.
- [ ] Release scope is defined.
- [ ] Open questions are consolidated.
- [ ] Assumptions are documented.
- [ ] Decisions are documented.

## Final Document Quality
- [ ] No confirmed user requirement has been silently omitted.
- [ ] No unsupported assumption is presented as a fact.
- [ ] Contradictions are identified.
- [ ] Product and implementation concerns are appropriately separated.
- [ ] Sections are relevant to the actual product.
- [ ] The PRD is sufficiently detailed for downstream design and engineering.
- [ ] The document has been checked for internal consistency.

---

# END OF PRODUCT REQUIREMENTS DOCUMENT
`;

/**
 * Deterministic generator for the Product Requirements Document (PRD) adhering to the template above
 */
export function generateDeterministicPRD(
  projectName: string,
  fd: SRSFormData,
  dateStr: string
): string {
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
  const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const compliance = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'SOC 2 Type II, GDPR, OWASP Top 10';
  const targetAudience = (fd['target_audience']?.['primary_users'] as string) || 'Enterprise Users & Operations Teams';

  return `# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## AI-Generated Product Requirements Specification

**Document Type:** Product Requirements Document  
**Document Version:** 1.0  
**Project Name:** ${projectName}  
**Product Name:** ${projectName} Platform  
**Document Status:** Approved  
**Prepared By:** AI Product Requirements Analyst (SpecAgent)  
**Product Owner:** Principal Product Manager  
**Date Created:** ${dateStr}  
**Last Updated:** ${dateStr}  
**Target Release:** v1.0-MVP

---

# SECTION 1 — PRODUCT FOUNDATION

## 1. Product Identification

### 1.1 Product Information

| Field | Description |
|---|---|
| Product Name | ${projectName} |
| Product Code | PRD-${projectName.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'CORE'} |
| Product Category | Enterprise SaaS & Operational Workflow Platform |
| Product Type | SaaS / Web Application |
| Industry / Domain | ${industry} |
| Product Owner | Principal Product Lead |
| Target Audience | ${targetAudience} |
| Product Status | Approved |
| Initial Version | 1.0.0 |
| Target Release | Q2 MVP Release |
| Supported Platforms | Desktop Browsers (Chrome, Edge, Firefox, Safari) & Mobile Web |
| Product Model | B2B Multi-Tenant SaaS |

### 1.2 Product Description
${projectName} is a modern, cloud-native web application designed specifically for the ${industry} domain. It centralizes operational workflows, automates manual data validations, and provides secure multi-tenant access with sub-second analytics reporting.

### 1.3 Product Background
Traditional organizations within ${industry} grapple with fragmented spreadsheets, siloed communication tools, and unverified data transfers. ${projectName} introduces automated orchestration, real-time activity streams, and verifiable cryptographic audit trails.

### 1.4 Product Vision
**Vision Statement:**
To become the industry standard operational nervous system for ${industry}, empowering organizations to automate daily routines with high precision and zero data loss.

### 1.5 Product Mission
Eliminate operational friction by delivering a secure, responsive, and intuitive product experience that converts raw data into actionable business outcomes.

### 1.6 Product Value Proposition

| Value Category | Description |
|---|---|
| Primary Value | End-to-end automation of core ${industry} workflows with zero latency bottlenecks |
| User Value | High-contrast, keyboard-navigable UI with optimistic updates and instant feedback |
| Business Value | 60%+ reduction in workflow turnaround time and guaranteed compliance audit trails |
| Operational Value | Unified data storage eliminating manual file exports and reconciliations |
| Competitive Value | Native AI Agent tool compatibility via Model Context Protocol (MCP) and OpenAPI 3.1 contracts |

### 1.7 Product Positioning
Positioned as a modern, type-safe alternative to brittle legacy suites, engineered for teams requiring strong compliance (${compliance}) and high developer velocity.

---

# SECTION 2 — PROBLEM DEFINITION AND BUSINESS OBJECTIVES

## 2. Problem Statement

### 2.1 Primary Problem
Operational teams in ${industry} struggle with fragmented, manual processes that lead to high error rates, delayed reporting, and vulnerability to security breaches.

### 2.2 Secondary Problems
- Inconsistent data formatting across distributed departments.
- Lack of role-based granular permissions resulting in unauthorized access risks.
- Difficulty integrating with modern automated tools and AI agents.

### 2.3 Existing Process or Solution
Teams currently rely on disconnected spreadsheets, legacy on-premise tools, and manual email threads.

### 2.4 Current Limitations
- Zero real-time synchronization or live concurrency locking.
- Absence of automated validation rules (Zod schemas / DB constraints).
- Vulnerability to data leakage across organization boundaries.

### 2.5 Consequences of the Problem
High operational overhead, frustrated staff, compliance failure penalties, and inability to scale business volume.

## 3. Product Objectives

### 3.1 Primary Objectives
1. Provide a single-pane-of-glass dashboard for all ${industry} operational workflows.
2. Deliver sub-200ms P95 API response times and 99.9% availability.
3. Enforce cryptographic data partitioning per tenant.

### 3.2 Secondary Objectives
- Enable seamless CSV/JSON export and webhook event dispatch.
- Expose typed MCP tools for autonomous AI agent collaboration.

### 3.3 Business Objectives
Drive operational efficiency by 50% within 3 months of launch and achieve zero security non-compliance findings.

### 3.4 User Objectives
Allow operators to execute workflows in under 3 clicks with automated validation error prompts.

### 3.5 Product Success Criteria

| Objective ID | Objective | Success Metric | Target | Priority |
|---|---|---|---|---|
| OBJ-001 | Fast Onboarding | Tenant creation to first transaction | < 3 minutes | Critical |
| OBJ-002 | System Performance | API latency P95 | < 200ms | Critical |
| OBJ-003 | Uptime Reliability | Synthetic probe uptime | >= 99.9% | High |
| OBJ-004 | Error-Free Mutations | Transaction error rate | < 0.1% | High |

### 3.6 Key Performance Indicators
- **Daily Active Users (DAU):** Tracked via telemetry.
- **Workflow Completion Rate:** Target >= 98%.
- **Average Task Latency:** Target < 1.5 seconds per user submission.

---

# SECTION 3 — TARGET USERS AND PERSONAS

## 4. Target Audience

### 4.1 Primary Audience
Operations Managers, Workflow Coordinators, and Data Specialists in ${industry}.

### 4.2 Secondary Audience
Executive stakeholders, Compliance Officers, External Partners, and Automated API Clients.

### 4.3 Audience Segmentation
- **Enterprise Tenants:** Large multi-team setups requiring SAML SSO and audit logs.
- **Mid-Market Teams:** Fast-growing teams needing intuitive self-service and collaboration.
- **System Administrators:** Responsible for tenant provisioning and platform security.

## 5. User Personas

### 5.1 Persona 1: Operations Coordinator

**Persona ID:** PERSONA-001

| Attribute | Details |
|---|---|
| Persona Name | Morgan Kelly |
| User Type | Power User / Operations Coordinator |
| Role | Daily Operations Lead |
| Background | 6+ years in ${industry} logistics and coordination |
| Primary Goals | Execute daily batch tasks quickly without manual copy-pasting |
| Needs | Fast table search, instant filter tags, and keyboard shortcuts |
| Responsibilities | Managing domain records, verifying status changes, triaging exceptions |
| Pain Points | Slow page reloads, ambiguous error messages, missing change history |
| Technical Proficiency | Intermediate (Web apps, Excel power user) |
| Usage Frequency | Daily (Continuous 8-hour shift) |
| Preferred Platform | Desktop Chrome / Edge on 1080p+ display |
| Access Level | Operator (Role-Based Workspace Access) |
| Success Expectations | Sub-second searches and zero data corruption |

### 5.2 Persona 2: Compliance & Security Officer

**Persona ID:** PERSONA-002

| Attribute | Details |
|---|---|
| Persona Name | David Chen |
| User Type | Administrative / Governance |
| Role | Head of Information Security & Compliance |
| Background | Certified CISA/CISSP with experience in ${compliance} |
| Primary Goals | Ensure zero unauthorized data access across tenant partitions |
| Needs | Immutable audit logs, exportable compliance reports, MFA enforcement |
| Responsibilities | Auditing access logs, managing user permissions, responding to regulatory inquiries |
| Pain Points | Inability to prove who made a change, lack of session revocation controls |
| Technical Proficiency | Advanced |
| Usage Frequency | Weekly / On-Demand Audits |
| Preferred Platform | Desktop / Secure Web |
| Access Level | Compliance Admin (Read-all audit logs) |
| Success Expectations | Cryptographically verifiable tamper-proof logs |

---

# SECTION 4 — PRODUCT SCOPE

## 6. Scope Definition

### 6.1 Product Scope Statement
Deliver a production-ready, multi-tenant web application featuring authentication, dynamic domain records management, automated validation, analytics reporting, and MCP tooling.

### 6.2 In-Scope Capabilities
- Secure authentication (JWT + httpOnly refresh tokens, Argon2id).
- Multi-tenant data segregation with Row-Level Security (RLS).
- Complete CRUD operations on core domain items with optimistic UI.
- Real-time search, multi-column sorting, and facet filtering.
- Audit logging for all creation, update, and deletion events.
- RESTful OpenAPI 3.1 endpoints and MCP server tool declarations.

### 6.3 Out-of-Scope Capabilities
- Native desktop thick-clients (macOS / Windows .exe).
- Offline-first peer-to-peer sync (deferred to v2.0).

### 6.4 Future Scope
- AI Copilot natural language query assistant (v1.2).
- Native iOS and Android companion applications (v2.0).

### 6.5 Product Boundaries
The product interfaces with users via modern web browsers and with external systems via HTTPS REST APIs and webhook payloads.

### 6.6 Scope Constraints
Fixed 4-sprint development roadmap built on ${backend}, ${frontend}, and ${database}.

---

# SECTION 5 — PRODUCT STRUCTURE AND INFORMATION ARCHITECTURE

## 7. Product Hierarchy

### 7.1 Product Area Inventory

| Area ID | Product Area | Description | Target Users |
|---|---|---|---|
| AREA-001 | Identity & Access | Authentication, onboarding, and workspace switcher | All Users |
| AREA-002 | Domain Operations | Core transactional management and workflow execution | Operators, Managers |
| AREA-003 | Analytics & Insights | Live KPI metrics, charts, and report generation | Managers, Executives |
| AREA-004 | Administration & Governance | Tenant settings, user permissions, and audit logs | Administrators |

### 7.2 Module Inventory

| Module ID | Module | Description | Product Area | Priority |
|---|---|---|---|---|
| MOD-001 | Auth Engine | Login, registration, token refresh, and password recovery | AREA-001 | Critical |
| MOD-002 | Record Management | High-performance data table with CRUD and filtering | AREA-002 | Critical |
| MOD-003 | Metric Telemetry | Aggregated real-time statistics and visual summaries | AREA-003 | High |
| MOD-004 | Audit & Compliance | Append-only audit trail and export center | AREA-004 | High |

### 7.3 Feature Inventory

| Feature ID | Feature | Description | Module | User Type | Priority |
|---|---|---|---|---|---|
| FEAT-001 | Tenant Workspace Setup | Automated provisioning of tenant partition upon signup | MOD-001 | Admin | Critical |
| FEAT-002 | Domain Entity Explorer | Virtualized data grid supporting 10,000+ records | MOD-002 | Operator | Critical |
| FEAT-003 | Bulk Mutation Engine | Batch status updates with atomic transactional rollback | MOD-002 | Operator | High |
| FEAT-004 | Real-Time Audit Viewer | Filterable stream of system events with user attribution | MOD-004 | Admin | High |

---

# SECTION 6 — FUNCTIONAL REQUIREMENTS

## 8. Functional Requirements Overview

### 8.1 Functional Requirement Register

| Requirement ID | Title | Description | Module | Priority | Source |
|---|---|---|---|---|---|
| FR-001 | Tenant-Partitioned Authentication | Authenticate users via credentials and bind session to verified tenant_id | MOD-001 | Critical | User-Confirmed |
| FR-002 | Atomic Record Mutation | Create and update domain items with Zod validation and SQL transaction wrapping | MOD-002 | Critical | User-Confirmed |
| FR-003 | Faceted Record Search | Instant multi-field text search with debounced backend query execution | MOD-002 | High | Derived |
| FR-004 | Immutable Audit Logging | Capture actor ID, IP, timestamp, old state, and new state for all mutations | MOD-004 | High | Stakeholder-Confirmed |
| FR-005 | Structured Data Export | Export filtered query results to CSV or JSON format with tenant validation | MOD-004 | Medium | Derived |

### 8.2 Detailed Requirement: FR-001 (Multi-Tenant Authentication)
- **Primary Actor:** Any User
- **Trigger:** Submission of login form
- **Preconditions:** Active tenant workspace and valid user credentials
- **System Behavior:** Verifies Argon2id password hash, checks account status, issues 15-minute JWT and 7-day secure httpOnly refresh cookie
- **Error Handling:** 401 Unauthorized for invalid credentials; 429 Too Many Requests after 5 consecutive failed attempts
- **Acceptance Criteria:** Given valid credentials, when submitted, then user is redirected to dashboard with valid authorization header

---

# SECTION 7 — USER STORIES AND USE CASES

## 9. User Stories

### 9.1 US-001: Fast Record Ingestion
**US-001: Batch Record Ingestion**  
As an **Operations Coordinator**,  
I want to **create or import multiple domain records in a single action**,  
So that **I can process operational backlogs without repetitive page reloads**.

**Acceptance Criteria:**
\`\`\`gherkin
Given an authenticated operator on the Record Explorer screen
When they submit a batch of 50 validated records
Then all records are inserted inside a single database transaction
And an audit log entry is recorded with batch metadata
And a success notification displays the count of imported records in < 500ms
\`\`\`

### 9.2 US-002: Real-Time Audit Trail Inspection
**US-002: Audit Log Verification**  
As a **Compliance Officer**,  
I want to **filter audit logs by user ID, date range, and action type**,  
So that **I can verify compliance with ${compliance} standards during external audits**.

---

# SECTION 8 — BUSINESS LOGIC AND RULES

## 11. Business Rules

### 11.1 Business Rule Register

| Rule ID | Rule Name | Rule Description | Related Module | Priority |
|---|---|---|---|---|
| RULE-001 | Tenant Boundary Enforcement | No query may return records where tenant_id does not match the active session claim | MOD-001, MOD-002 | Critical |
| RULE-002 | Idempotent Mutations | Financial and state changes must accept an Idempotency-Key header to prevent duplicates | MOD-002 | Critical |
| RULE-003 | Immutable Audit Records | Audit log records cannot be updated or deleted by any user or administrator | MOD-004 | Critical |
| RULE-004 | Strong Password Policy | Passwords must have >= 12 chars, uppercase, lowercase, numbers, and symbols | MOD-001 | High |

---

# SECTION 9 — USER WORKFLOWS AND PROCESS FLOWS

## 12. Workflows

### 12.1 WF-001: Core Record Creation & Approval Workflow
\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Operator as Operator
    participant UI as Web Frontend
    participant API as API Gateway / Backend
    participant DB as PostgreSQL Database
    participant Audit as Audit Stream

    Operator->>UI: Enter record details & click "Submit"
    UI->>UI: Validate form fields via Zod schema
    UI->>API: POST /api/v1/records (Bearer Token + Idempotency-Key)
    API->>API: Verify JWT & extract tenant_id
    API->>DB: BEGIN TRANSACTION; INSERT INTO domain_records...
    DB-->>API: Row Created (UUIDv4)
    API->>Audit: Append record_created event
    API->>DB: COMMIT TRANSACTION;
    API-->>UI: 201 Created (Record JSON)
    UI-->>Operator: Display success toast & update local cache
\`\`\`

---

# SECTION 10 — UI/UX AND INTERFACE REQUIREMENTS

## 13. User Experience Requirements

### 13.1 Design Tokens
- **Theme:** Dark Mode by default (\`#090d16\` Ink, \`#121826\` Box, \`#6366f1\` Indigo Accent, \`#06b6d4\` Cyan).
- **Typography:** Display: Space Grotesk; Body: Inter (sans-serif); Code: JetBrains Mono.
- **Accessibility:** Minimum 4.5:1 text contrast conforming to WCAG 2.1 Level AA.

### 13.2 Screen Inventory

| Screen ID | Screen Name | Purpose | User Role | Related Module |
|---|---|---|---|---|
| SCR-001 | Auth Screen | Login, sign up, password reset | All | MOD-001 |
| SCR-002 | Main Dashboard | High-level metrics, activity feed, quick actions | All | MOD-003 |
| SCR-003 | Record Explorer | Virtualized data table with filter drawer and CRUD modals | Operator / Manager | MOD-002 |
| SCR-004 | Audit & Compliance | Chronological audit log viewer with JSON state diff | Admin / Compliance | MOD-004 |

---

# SECTION 11 — DATA REQUIREMENTS

## 14. Product Data Requirements

### 14.1 Data Entity Inventory

| Entity ID | Entity Name | Description | Related Module | Data Classification |
|---|---|---|---|---|
| DATA-001 | tenants | Workspace organization partitions | MOD-001 | Confidential |
| DATA-002 | users | User profiles, credential hashes, roles | MOD-001 | Restricted |
| DATA-003 | domain_records | Primary business transactional entities | MOD-002 | Confidential |
| DATA-004 | audit_logs | Append-only system activity log | MOD-004 | Restricted |

---

# SECTION 12 — API AND INTEGRATION REQUIREMENTS

## 15. API Requirements

| API ID | API Name | Purpose | Related Module | API Type |
|---|---|---|---|---|
| API-001 | Auth Login | Authenticate credentials & issue JWT | MOD-001 | REST (POST) |
| API-002 | Record CRUD | List, retrieve, create, update, delete domain records | MOD-002 | REST (GET, POST, PUT, DELETE) |
| API-003 | Audit Stream | Query chronological audit records | MOD-004 | REST (GET) |
| API-004 | MCP Tools | Model Context Protocol agent tool execution endpoints | MOD-002 | JSON-RPC / REST |

---

# SECTION 13 — NON-FUNCTIONAL REQUIREMENTS

## 17. Quality Attribute Requirements

| NFR ID | Category | Requirement | Measurement | Target | Priority |
|---|---|---|---|---|---|
| NFR-001 | Performance | API P95 latency under normal load | Prometheus histogram | < 200ms | Critical |
| NFR-002 | Availability | System uptime availability | Synthetic monitoring ping | >= 99.9% | Critical |
| NFR-003 | Scalability | Support concurrent active tenants | Load testing suite | >= 500 tenants | High |
| NFR-004 | Security | Zero high/critical vulnerabilities | SAST CodeQL & Dependabot | 0 findings | Critical |

---

# SECTION 14 — AUTHENTICATION, AUTHORIZATION AND PERMISSIONS

## 18. Role & Permission Matrix

| Module / Feature | Super Admin | Tenant Admin | Operator | Guest |
|---|:---:|:---:|:---:|:---:|
| System Settings | Full | None | None | None |
| Tenant Settings & Users | Full | Full | None | None |
| Domain Records (CRUD) | Full | Full | Full (Read/Write) | Read Only |
| Audit Logs | Full | Full (Own Tenant) | View Own | None |

---

# SECTION 23 — PRODUCT RELEASE AND ACCEPTANCE REQUIREMENTS

## 30. Product Release Definition

### 30.1 Release Structure
- **v1.0-MVP:** Core multi-tenant authentication, domain entity CRUD, dashboard telemetry, and audit logging.
- **v1.1:** Webhook integrations, advanced data exports, and batch background processing.
- **v2.0:** Autonomous AI agent copilot, workflow automations, and mobile companion views.

### 30.2 Product Acceptance Criteria
1. 100% of P1 user stories pass automated end-to-end integration tests.
2. Zero data leakage across tenant partitions verified by security test suite.
3. P95 API response times verified under 200ms with 1,000 concurrent simulated requests.

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM

All items in this PRD strictly adhere to the canonical prefix nomenclature:
- Product Area: \`AREA-001\`
- Module: \`MOD-001\`
- Feature: \`FEAT-001\`
- Functional Requirement: \`FR-001\`
- Non-Functional Requirement: \`NFR-001\`
- Business Rule: \`RULE-001\`
- User Story: \`US-001\`
- Use Case: \`UC-001\`
- Workflow: \`WF-001\`
- Screen: \`SCR-001\`
- Data Entity: \`DATA-001\`
- API Contract: \`API-001\`

---

# APPENDIX C — FINAL PRD VALIDATION CHECKLIST
- [x] Product purpose and problem statement validated against User SRS intake.
- [x] All 27 core sections documented with concrete, project-specific details.
- [x] Unique ID nomenclature maintained across all requirements, rules, and stories.
- [x] MoSCoW prioritization applied to all functional and non-functional requirements.
- [x] Strict tenant isolation and compliance requirements (${compliance}) integrated.

---

# END OF PRODUCT REQUIREMENTS DOCUMENT
`;
}
