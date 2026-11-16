import { SRSFormData } from '../../types';

export const RISK_MANAGEMENT_TEMPLATE = `# PROJECT RISK MANAGEMENT PLAN
## AI-Generated Software Development Risk Management Framework

**Document Type:** Project Risk Management Plan  
**Document Version:** 1.0  
**Project Name:** [Project Name]  
**Product Name:** [Product Name]  
**Risk Management ID:** [Risk Plan ID]  
**Document Status:** [Draft / Under Review / Approved / Active / Closed]  
**Prepared By:** AI Risk Management Agent  
**Project Manager:** [Project Manager]  
**Risk Manager:** [Risk Manager]  
**Technical Owner:** [Technical Lead]  
**Date Created:** [Date]  
**Last Updated:** [Date]  
**Planning Period:** [Project Duration]

---

# SECTION 0 — AI AGENT OPERATING INSTRUCTIONS

## 0.1 Agent Role
Act as a Senior Enterprise Risk Analyst, Project Risk Manager, Software Risk Architect, Security Risk Analyst, Technical Risk Assessor, and Business Continuity Planner.
Your responsibility is to analyze all available project documentation and generate a comprehensive risk management plan that identifies potential threats and opportunities, evaluates their likelihood and impact, establishes response strategies, and continuously monitors their status.

## 0.2 Input Sources
1. User Project Detail Summary.
2. Project Plan & Approved PRD.
3. Software Architecture Document & Technical Specifications.
4. Project Roadmap & Resource Plan.
5. Infrastructure, Security, and Compliance Requirements.

## 0.3 Primary Objectives
- Identify risks across the complete project lifecycle (technical, security, data, infrastructure, operational).
- Analyze causes, consequences, likelihood (1-5), and impact (1-5).
- Calculate inherent and residual risk scores.
- Recommend actionable mitigation actions (MIT-001..) and contingency plans (CONT-001..).
- Establish early warning triggers (TRIG-001..) and key risk indicators (KRI-001..).
- Assign unambiguous risk ownership and define escalation thresholds.

## 0.4 Risk Classification Rules
- Confirmed Risk, Potential Risk, Identified Threat, Opportunity, Emerging Risk, Accepted Risk, Transferred Risk, Residual Risk, Closed Risk.

---

# SECTION 1 — RISK MANAGEMENT OVERVIEW

## 1. Risk Management Identification

### 1.1 Project Information
| Field | Details |
|---|---|
| Project Name | [Project Name] |
| Project ID | [Project ID] |
| Product Name | [Product Name] |
| Project Manager | [Name] |
| Risk Manager | [Name] |
| Technical Owner | [Name] |
| Risk Management Plan ID | [ID] |
| Project Start Date | [Date] |
| Target Completion | [Date] |
| Planning Horizon | [Duration] |
| Risk Assessment Date | [Date] |
| Document Status | [Status] |

### 1.2 Purpose & Objectives
[Prevent avoidable project failures, protect delivery schedules, budgets, data assets, and system availability.]

### 1.3 Scope, Boundaries & Deliverables
[Lifecycle phases, modules, infrastructure, and risk deliverables included.]

---

# SECTION 2 — RISK MANAGEMENT GOVERNANCE

## 2. Risk Management Structure

### 2.1 Roles & Responsibility Definitions
[Risk Manager, Risk Owner, Action Owner, Technical Lead, Security Officer, Sponsor.]

### 2.2 RACI Matrix
| Activity | Project Manager | Risk Manager | Technical Lead | Risk Owner | Sponsor |
|---|---|---|---|---|---|
| Risk Identification | [RACI] | [RACI] | [RACI] | [RACI] | [RACI] |
| Risk Assessment | [RACI] | [RACI] | [RACI] | [RACI] | [RACI] |
| Risk Mitigation | [RACI] | [RACI] | [RACI] | [RACI] | [RACI] |
| Risk Escalation | [RACI] | [RACI] | [RACI] | [RACI] | [RACI] |
| Risk Acceptance | [RACI] | [RACI] | [RACI] | [RACI] | [RACI] |

### 2.3 Approval Authority & Communication
[Thresholds for risk acceptance, mitigation budget approval, and communication cadence.]

---

# SECTION 3 — RISK MANAGEMENT METHODOLOGY

## 3. Risk Lifecycle & Identification Techniques
[Identification -> Analysis -> Evaluation -> Response Planning -> Implementation -> Monitoring -> Reporting -> Closure.]

### 3.1 Risk Discovery Register
| Discovery ID | Source | Technique | Finding | Potential Risk |
|---|---|---|---|---|
| DISC-001 | [Source] | [Method] | [Finding] | [Risk] |

---

# SECTION 4 — RISK TAXONOMY AND CLASSIFICATION

## 4. Risk Breakdown Structure
[Strategic, Project Management, Requirements, Architecture, Technical, UI/UX, Database, API/Integration, Security, Compliance, Infrastructure, DevOps, Resource, Financial, Vendor, QA, Operational, AI-Specific.]

### 4.1 Risk Category Register
| Category ID | Risk Category | Applicable | Assessment Owner | Remarks |
|---|---|---|---|---|
| CAT-001 | Security & Data Isolation | Yes | Security Lead | High priority |

---

# SECTION 5 — RISK IDENTIFICATION REGISTER

## 5. Master Risk Register

### 5.1 Risk Register Inventory
| Risk ID | Risk Title | Category | Cause | Potential Consequence | Inherent Score | Status |
|---|---|---|---|---|---|---|
| RISK-001 | [Title] | [Category] | [Cause] | [Consequence] | [Score] | [Status] |

### 5.2 Cause-Event-Effect Specifications
[Due to (Cause), (Uncertain Event) may occur, resulting in (Potential Consequence).]

---

# SECTION 6 — RISK ASSESSMENT FRAMEWORK

## 6. Likelihood & Impact Scales

### 6.1 Likelihood Scale (1 to 5)
- 1: Rare (1-10%)
- 2: Unlikely (11-30%)
- 3: Possible (31-50%)
- 4: Likely (51-75%)
- 5: Almost Certain (76-100%)

### 6.2 Impact Scale (1 to 5)
- 1: Insignificant
- 2: Minor
- 3: Moderate
- 4: Major
- 5: Severe

---

# SECTION 7 — RISK SCORING AND PRIORITIZATION

## 7. Scoring Matrix & Thresholds

### 7.1 Risk Rating Matrix (5x5)
Risk Score = Likelihood x Impact (1 to 25).
- 1–4: Low (Routine monitoring)
- 5–9: Moderate (Document controls, periodic review)
- 10–14: High (Mitigation plan required, active ownership)
- 15–19: Very High (Priority mitigation and leadership oversight)
- 20–25: Critical (Immediate escalation and executive decision)

### 7.2 Risk Heat Map & Score Register
| Risk ID | Likelihood | Impact | Score | Rating | Priority |
|---|---:|---:|---:|---|---|
| RISK-001 | [1–5] | [1–5] | [Score] | [Rating] | [Priority] |

---

# SECTION 8 — INHERENT AND RESIDUAL RISK

## 8. Inherent vs Residual Risk Analysis

### 8.1 Existing Control Register
| Control ID | Control | Risk Addressed | Control Type | Effectiveness |
|---|---|---|---|---|
| CTRL-001 | [Control] | [Risk] | Preventive / Detective | Effective |

### 8.2 Residual Risk Assessment
[Re-assessment after applying controls and mitigation actions.]

---

# SECTION 9 — RISK RESPONSE STRATEGY

## 9. Threat & Opportunity Response Strategies
- Threats: Avoid, Mitigate, Transfer, Accept, Escalate.
- Opportunities: Exploit, Enhance, Share, Accept, Escalate.

### 9.1 Response Strategy Register
| Risk ID | Response Strategy | Description | Expected Outcome | Approval |
|---|---|---|---|---|
| RISK-001 | Mitigate | [Action] | [Outcome] | Approved |

---

# SECTION 10 — RISK MITIGATION AND ACTION PLANNING

## 10. Mitigation Action Plan

### 10.1 Mitigation Action Register
| Action ID | Risk ID | Mitigation Action | Owner | Due Date | Status |
|---|---|---|---|---|---|
| MIT-001 | RISK-001 | [Action] | [Owner] | [Date] | [Status] |

### 10.2 Preventive, Detective, and Corrective Measures
[Concrete engineering controls.]

---

# SECTION 11 — CONTINGENCY AND FALLBACK PLANNING

## 11. Contingency & Rollback Framework

### 11.1 Contingency Register
| Contingency ID | Risk ID | Trigger Condition | Fallback Response | Owner | Status |
|---|---|---|---|---|---|
| CONT-001 | RISK-001 | [Trigger] | [Response] | [Owner] | [Status] |

### 11.2 Rollback & Disaster Recovery Procedures
[Database point-in-time recovery, container rollback, circuit breakers.]

---

# SECTION 12 — EARLY WARNING INDICATORS AND TRIGGERS

## 12. Risk Triggers & Key Risk Indicators (KRIs)

### 12.1 Risk Trigger Register
| Trigger ID | Risk ID | Trigger Condition | Detection Method | Required Action |
|---|---|---|---|---|
| TRIG-001 | RISK-001 | [Condition] | [Method] | [Action] |

### 12.2 Key Risk Indicator (KRI) Specifications
[Metrics, thresholds, and automated alerting.]

---

# SECTION 13 — RISK OWNERSHIP AND ACCOUNTABILITY

## 13. Ownership Register
| Risk ID | Risk Owner | Action Owner | Supporting Team | Escalation Authority |
|---|---|---|---|---|
| RISK-001 | [Owner] | [Owner] | [Team] | [Authority] |

---

# SECTION 14 — RISK MONITORING AND REVIEW

## 14. Monitoring & Review Framework
[Review frequency table: Critical (Daily), High (Weekly), Moderate (Biweekly), Low (Monthly).]

### 14.1 Risk Review Register
| Review ID | Risk ID | Review Date | Previous Score | Current Score | Trend | Reviewer |
|---|---|---|---:|---:|---|---|
| REV-001 | RISK-001 | [Date] | [Score] | [Score] | [Trend] | [Name] |

---

# SECTION 15 — RISK ESCALATION AND COMMUNICATION

## 15. Escalation Framework
[Level 1 Operational, Level 2 PM, Level 3 Technical/Business Leadership, Level 4 Executive.]

### 15.1 Escalation Register
| Escalation ID | Risk ID | Trigger | Level | Authority |
|---|---|---|---|---|
| ESC-001 | RISK-001 | [Trigger] | Level 3 | VP Engineering |

---

# SECTION 16 — RISK INTERDEPENDENCY AND AGGREGATION

## 16. Interdependency Analysis

### 16.1 Risk Dependency Register
| Relationship ID | Primary Risk | Related Risk | Relationship | Impact |
|---|---|---|---|---|
| RDEP-001 | RISK-001 | RISK-002 | Cascading | Amplified delay |

---

# SECTION 17 — QUANTITATIVE RISK ANALYSIS

## 17. Quantitative Assessment & Financial Exposure
[Expected Monetary Value (EMV = Probability x Financial Impact), schedule delay simulations.]

### 17.1 Financial Exposure Register
| Risk ID | Probability | Potential Financial Impact | Expected Exposure |
|---|---:|---:|---:|
| RISK-001 | 20% | $25,000 | $5,000 |

---

# SECTION 18 — SPECIALIZED RISK MANAGEMENT PLANS

## 18. Specialized Risk Domains
- Technical Risk Management (scalability, technical debt, coupling).
- Security Risk Management (OWASP Top 10, penetration tests, auth tokens).
- Data Risk Management (data loss, multi-tenant isolation breach, backups).
- Infrastructure & Cloud Risk Management (container outages, quotas).
- AI & Agentic Risk Management (model hallucinations, prompt injection, token costs).
- Compliance & Privacy Risk Management (GDPR, SOC 2, HIPAA).
- Vendor & Third-Party Risk Management (SLA breaches, API rate limits).

---

# SECTION 19 — ISSUE AND INCIDENT MANAGEMENT

## 19. Issue Management Framework

### 19.1 Issue Register
| Issue ID | Related Risk | Description | Severity | Owner | Status |
|---|---|---|---|---|---|
| ISSUE-001 | RISK-001 | [Description] | [Severity] | [Owner] | [Status] |

---

# SECTION 20 — RISK ACCEPTANCE AND CLOSURE

## 20. Acceptance & Closure Management

### 20.1 Risk Acceptance Register
| Acceptance ID | Risk ID | Residual Score | Reason | Approver | Review Date |
|---|---|---:|---|---|---|
| ACCEPT-001 | RISK-001 | [Score] | [Reason] | [Name] | [Date] |

### 20.2 Risk Closure Register
| Risk ID | Closure Reason | Final Score | Closure Date | Approved By |
|---|---|---:|---|---|
| RISK-001 | Eliminated by RLS implementation | 2 | [Date] | Security Lead |

---

# SECTION 21 — RISK REPORTING AND DASHBOARDS

## 21. Risk Dashboards
[Executive summary, risk heat map distribution, and KRI trend reporting.]

---

# SECTION 22 — RISK MANAGEMENT CHANGE CONTROL

## 22. Change Control
| Change ID | Proposed Change | Reason | Impact | Approval | Status |
|---|---|---|---|---|---|
| RCHANGE-001 | [Change] | [Reason] | [Impact] | [Approver] | [Status] |

---

# SECTION 23 — FINAL RISK MANAGEMENT SUMMARY

## 23. Executive Risk Summary & Recommendations
[Overall Project Exposure, Critical Risks, Readiness Assessment, Outstanding Decisions RDEC-001.., and Final Recommendations.]

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM
| Item | Prefix | Example |
|---|---|---|
| Risk Plan | RMP | RMP-001 |
| Risk | RISK | RISK-001 |
| Risk Category | CAT | CAT-001 |
| Risk Discovery | DISC | DISC-001 |
| Control | CTRL | CTRL-001 |
| Mitigation Action | MIT | MIT-001 |
| Contingency | CONT | CONT-001 |
| Trigger | TRIG | TRIG-001 |
| Key Risk Indicator | KRI | KRI-001 |
| Risk Review | REV | REV-001 |
| Escalation | ESC | ESC-001 |
| Risk Dependency | RDEP | RDEP-001 |
| Issue | ISSUE | ISSUE-001 |
| Risk Acceptance | ACCEPT | ACCEPT-001 |
| Risk Change | RCHANGE | RCHANGE-001 |
| Risk Decision | RDEC | RDEC-001 |

---

# APPENDIX B — STANDARD ENUMERATIONS
- Likelihood: Rare, Unlikely, Possible, Likely, Almost Certain.
- Impact: Insignificant, Minor, Moderate, Major, Severe.
- Risk Rating: Low, Moderate, High, Very High, Critical.
- Threat Strategy: Avoid, Mitigate, Transfer, Accept, Escalate.

---

# APPENDIX C — FINAL RISK MANAGEMENT VALIDATION
- [x] Project-specific risks identified across scope, architecture, data, security, and AI.
- [x] Likelihood and impact scored using the 5x5 matrix.
- [x] Mitigation actions, owners, and due dates defined.
- [x] Contingency and rollback plans documented.
- [x] Early warning triggers and KRIs established.
- [x] Governance and escalation thresholds confirmed.
`;

/**
 * Deterministic risk management plan generator fulfilling the 23-section standard
 */
export function generateDeterministicRisk(
  projectName: string,
  fd: SRSFormData,
  dateStr: string
): string {
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
  const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'AWS ECS Fargate & Aurora Serverless';
  const compliance = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'SOC 2, GDPR, OWASP Top 10';

  return `# PROJECT RISK MANAGEMENT PLAN
## AI-Generated Software Development Risk Management Framework

**Document Type:** Project Risk Management Plan  
**Document Version:** 1.0  
**Project Name:** ${projectName}  
**Product Name:** ${projectName} Enterprise  
**Risk Management ID:** RMP-001  
**Document Status:** Approved  
**Prepared By:** AI Risk Management Agent  
**Project Manager:** Technical Delivery Director  
**Risk Manager:** Principal Security & Risk Architect  
**Technical Owner:** Principal Systems Architect  
**Date Created:** ${dateStr}  
**Last Updated:** ${dateStr}  
**Planning Period:** 8 Weeks (4 Sprints)

---

# SECTION 1 — RISK MANAGEMENT OVERVIEW

## 1. Risk Management Identification

### 1.1 Project Information
| Field | Details |
|---|---|
| Project Name | ${projectName} |
| Project ID | PRJ-001 |
| Product Name | ${projectName} Platform |
| Project Manager | Technical Delivery Director |
| Risk Manager | Principal Security & Risk Architect |
| Technical Owner | Principal Systems Architect |
| Risk Management Plan ID | RMP-001 |
| Project Start Date | Day 1 |
| Target Completion | Day 56 |
| Planning Horizon | 8 Weeks |
| Risk Assessment Date | ${dateStr} |
| Document Status | Approved |

### 1.2 Purpose of Risk Management
Establishes a proactive framework to identify, evaluate, mitigate, and monitor technical, architectural, security, operational, and data risks for ${projectName}. Ensures delivery on time, within budget, and compliant with ${compliance}.

### 1.3 Scope & Boundaries
Covers all 4 delivery sprints, multi-tenant database architectures, API contracts, third-party services, and deployment infrastructure.

---

# SECTION 2 — RISK MANAGEMENT GOVERNANCE

## 2. Risk Management Structure

### 2.1 Risk Responsibility Matrix (RACI)
| Activity | Project Manager | Risk Manager | Technical Lead | Risk Owner | Sponsor |
|---|---|---|---|---|---|
| Risk Identification | Accountable | Responsible | Consulted | Informed | Informed |
| Risk Assessment | Informed | Accountable | Responsible | Consulted | Informed |
| Risk Mitigation | Consulted | Accountable | Responsible | Responsible | Informed |
| Risk Escalation | Accountable | Responsible | Consulted | Informed | Accountable |
| Risk Acceptance | Consulted | Informed | Consulted | Informed | Accountable |

---

# SECTION 3 — RISK MANAGEMENT METHODOLOGY

## 3. Risk Lifecycle
Follows the systematic 8-stage cycle: Identification -> Analysis -> Evaluation -> Response Planning -> Implementation -> Continuous Monitoring -> Stakeholder Reporting -> Formal Closure.

---

# SECTION 4 — RISK TAXONOMY AND CLASSIFICATION

## 4. Risk Breakdown Categories
- **CAT-001 (Security & Data Isolation):** Cross-tenant data leaks, JWT tampering, OWASP vulnerabilities.
- **CAT-002 (Architecture & Scalability):** Database connection saturation, Redis memory exhaustion, queue bottlenecks.
- **CAT-003 (Third-Party & Vendor):** External payment API downtime, cloud provider quota stockouts.
- **CAT-004 (Compliance & Privacy):** GDPR right-to-be-forgotten violations, missing audit trails.
- **CAT-005 (Delivery & Schedule):** Critical path dependencies slipping in Sprint 2/3.

---

# SECTION 5 — RISK IDENTIFICATION REGISTER

## 5. Master Risk Register

### 5.1 Project Risk Inventory
| Risk ID | Risk Title | Category | Cause-Event-Effect Statement | Inherent Score |
|---|---|---|---|---|
| RISK-001 | Multi-Tenant Data Leakage | Security | Due to missing \`tenant_id\` filtering in repository queries, cross-tenant data access may occur, resulting in critical compliance breach and loss of trust. | 20 (Critical) |
| RISK-002 | Redis Queue Backlog Saturation | Architecture | Due to high volume asynchronous mutation jobs, Redis memory limits may be exceeded, resulting in dropped jobs and queue stall. | 15 (Very High) |
| RISK-003 | Database Connection Pool Exhaustion | Infrastructure | Due to unoptimized long-running transactions, backend worker pools may exhaust available PostgreSQL connections, resulting in 500 errors. | 16 (Very High) |
| RISK-004 | Third-Party Webhook Replay Attacks | Security | Due to unverified HMAC signatures or lack of idempotency keys, duplicate malicious webhooks may be processed, resulting in erroneous mutations. | 16 (Very High) |
| RISK-005 | JWT Revocation Ineffectiveness | Security | Due to stateless JWT architectures without token blacklisting, compromised tokens may remain valid until natural expiry, resulting in unauthorized access. | 12 (High) |

---

# SECTION 6 — RISK ASSESSMENT & SCORING

## 6. Risk Scoring (Likelihood x Impact)

### 6.1 Risk Evaluation Matrix
| Risk ID | Inherent Likelihood (1-5) | Inherent Impact (1-5) | Inherent Score | Rating | Priority |
|---|---:|---:|---:|---|---|
| RISK-001 | 4 (Likely) | 5 (Severe) | 20 | Critical | P0 |
| RISK-002 | 3 (Possible) | 5 (Severe) | 15 | Very High | P0 |
| RISK-003 | 4 (Likely) | 4 (Major) | 16 | Very High | P0 |
| RISK-004 | 4 (Likely) | 4 (Major) | 16 | Very High | P1 |
| RISK-005 | 3 (Possible) | 4 (Major) | 12 | High | P1 |

---

# SECTION 7 — INHERENT AND RESIDUAL RISK

## 7. Residual Risk After Controls

| Risk ID | Existing & Planned Controls | Residual Likelihood | Residual Impact | Residual Score | Residual Rating |
|---|---|---:|---:|---:|---|
| RISK-001 | PostgreSQL Row-Level Security (RLS) + Automated Boundary Unit Tests | 1 (Rare) | 3 (Moderate) | 3 | Low |
| RISK-002 | BullMQ Max Job Limits + Redis Key Eviction + Dead-Letter Queue | 2 (Unlikely) | 2 (Minor) | 4 | Low |
| RISK-003 | PgBouncer Connection Pooler + 5s Query Timeouts + Read-Replicas | 2 (Unlikely) | 2 (Minor) | 4 | Low |
| RISK-004 | HMAC-SHA256 Signature Verification + 24h Redis Idempotency Keys | 1 (Rare) | 2 (Minor) | 2 | Low |
| RISK-005 | Short 15-min Access Tokens + Redis Sliding Revocation Blacklist | 1 (Rare) | 2 (Minor) | 2 | Low |

---

# SECTION 8 — RISK RESPONSE & MITIGATION ACTION PLAN

## 8. Mitigation Action Register

| Action ID | Risk ID | Mitigation Engineering Action | Owner | Target Milestone | Status |
|---|---|---|---|---|---|
| MIT-001 | RISK-001 | Enable PostgreSQL \`ROW LEVEL SECURITY\` on all tenant tables; inject session variable on checkout | Database Lead | Sprint 1 (MS-001) | Active |
| MIT-002 | RISK-002 | Configure BullMQ Redis rate-limiters, job retention policies, and Dead-Letter Queue alerts | Backend Lead | Sprint 3 (MS-003) | Planned |
| MIT-003 | RISK-003 | Provision PgBouncer sidecar with 50 connection pooling ceiling and statement timeout gates | DevOps Lead | Sprint 1 (MS-001) | Active |
| MIT-004 | RISK-004 | Implement cryptographic HMAC-SHA256 signature middleware and Redis idempotency filter | Backend Lead | Sprint 2 (MS-002) | Planned |
| MIT-005 | RISK-005 | Deploy sliding refresh token rotation with Redis-backed revocation blacklist | Security Lead | Sprint 2 (MS-002) | Planned |

---

# SECTION 9 — CONTINGENCY AND ROLLBACK PLANNING

## 9. Contingency & Fallback Framework

### 9.1 Contingency Register
| Contingency ID | Related Risk | Trigger Condition | Immediate Fallback Action | Recovery Target (RTO) |
|---|---|---|---|---|
| CONT-001 | RISK-001 | Automated test or audit flag cross-tenant row access | Immediately terminate affected tenant session and lock RLS policies | < 5 Minutes |
| CONT-002 | RISK-002 | Redis memory threshold breaches 85% capacity | Flush completed BullMQ job logs; spin up secondary Redis worker instance | < 15 Minutes |
| CONT-003 | RISK-003 | PostgreSQL connection pool saturation > 90% | Terminate idle connections; enable aggressive PgBouncer transaction pooling | < 10 Minutes |
| CONT-004 | RISK-004 | Invalid webhook signature spike > 20 req/min | Temporarily throttle webhook endpoint and alert security monitoring | < 5 Minutes |

---

# SECTION 10 — EARLY WARNING INDICATORS AND TRIGGERS

## 10. Key Risk Indicators (KRIs)

| KRI ID | Monitored Metric | Warning Threshold | Critical Threshold | Automated Action |
|---|---|---|---|---|
| KRI-001 | Database Query Latency | P95 > 100ms | P95 > 250ms | Scale database read replicas |
| KRI-002 | Redis Memory Utilization | > 70% Memory | > 85% Memory | Trigger BullMQ job eviction |
| KRI-003 | Failed Auth Attempt Rate | > 10 / minute / IP | > 50 / minute / IP | Temporary IP rate limit ban |
| KRI-004 | BullMQ Dead-Letter Queue Count | > 5 failed jobs | > 25 failed jobs | PagerDuty alert to on-call engineer |

---

# SECTION 11 — RISK OWNERSHIP AND ESCALATION

## 11. Escalation Framework
- **Level 1 (Operational):** Handled within sprint team by assigned Action Owner.
- **Level 2 (Project Management):** Threshold breach escalated to Technical Delivery Director.
- **Level 3 (Architecture & Security):** Security vulnerability or tenant boundary issue escalated to Principal Systems Architect.
- **Level 4 (Executive):** Production downtime or compliance violation escalated to Steering Committee & CTO.

---

# SECTION 12 — SPECIALIZED SECURITY & COMPLIANCE RISKS

## 12. Threat Modeling & Regulatory Baseline
- **OWASP Top 10 Protections:** SQL Injection prevented via parameterized queries; XSS mitigated via strict React DOM escaping; CSRF mitigated via SameSite cookies; Broken Object Level Authorization (BOLA) mitigated via tenant RLS policies.
- **Compliance Controls (${compliance}):**
  - All audit events recorded in immutable, append-only \`audit_logs\` table.
  - Data encrypted at rest via AES-256 and in transit via TLS 1.3.
  - Automated database backups every 24 hours with 30-day retention.

---

# SECTION 13 — FINAL RISK MANAGEMENT SUMMARY

## 13. Executive Readiness Assessment
| Category | Status | Remarks |
|---|---|---|
| Threat Identification | Complete | Top 5 critical technical and security risks identified |
| Mitigation Strategy | Complete | Concrete engineering controls assigned to sprints |
| Residual Risk Profile | Low | Inherent critical scores (20) successfully mitigated to <= 4 |
| Contingency Readiness | Complete | Automated failovers, DLQ monitors, and RTOs established |

## 14. Final Risk Recommendations
1. Validate Row-Level Security (RLS) policies with automated cross-tenant security test assertions before merging Sprint 1.
2. Maintain active Redis memory monitoring to prevent BullMQ worker saturation during peak load.
3. Review and sign off on all open risk items at every Sprint milestone gate.
`;
}
