import { SRSFormData } from '../../types';

export const DEPLOYMENT_RELEASE_TEMPLATE = `# SOFTWARE DEPLOYMENT AND RELEASE PLAN
## AI-Generated Deployment, Release and Production Delivery Specification

**Document Type:** Deployment and Release Management Plan  
**Document Version:** 1.0  
**Project Name:** [Project Name]  
**Product Name:** [Product Name]  
**Deployment Plan ID:** [Deployment Plan ID]  
**Release Plan ID:** [Release Plan ID]  
**Document Status:** [Draft / Under Review / Approved / Scheduled / Executing / Completed]  
**Prepared By:** AI Deployment and Release Management Agent  
**Release Manager:** [Name]  
**Deployment Manager:** [Name]  
**Technical Lead:** [Name]  
**DevOps Lead:** [Name]  
**QA Lead:** [Name]  
**Date Created:** [Date]  
**Last Updated:** [Date]  
**Target Release Version:** [Version]

---

# SECTION 0 — AI AGENT OPERATING INSTRUCTIONS

## 0.1 Agent Role
Act as a Senior Release Manager, Deployment Architect, DevOps Engineer, Site Reliability Engineer, Production Operations Manager, and Software Delivery Specialist.
Your responsibility is to analyze all available project documentation and generate a comprehensive deployment and release management plan that establishes how the software will be packaged, verified, promoted, deployed, released to users, monitored, and maintained.

## 0.2 Input Sources
1. User Project Detail Summary.
2. Approved Project Plan & PRD.
3. Software Architecture Document & Technical Specifications.
4. Project Roadmap, QA and Test Plan, and Risk Management Plan.
5. Cloud Provider, CI/CD, and Infrastructure Documentation.

## 0.3 Primary Objectives
Define:
- Release strategy, channels, versioning (SemVer), and build management.
- Containerization (multi-stage Dockerfile) and orchestration (Docker Compose / ECS / K8s).
- Environment inventory (Dev, QA, Staging, Production) and parity.
- Infrastructure provisioning (IaC) and configuration/secrets management.
- Database migration procedures (expand-and-contract strategy) and zero-downtime rolling deployments.
- CI/CD automation pipelines (GitHub Actions) with automated quality gates.
- Rollout, canary, and feature flag management.
- Rollback strategies, triggers, and automated disaster recovery.
- Production observability, health checks, and stabilization (Hypercare).
- DORA metrics: Deployment Frequency, Lead Time, Change Failure Rate, MTTR.

## 0.4 Source Classification
- User-Confirmed, Architecture-Derived, Requirement-Derived, Existing-System, Release-Recommended, Assumed, Pending Approval, Out of Scope.

---

# SECTION 1 — DEPLOYMENT AND RELEASE OVERVIEW

## 1. Project Identification

### 1.1 Project Information
| Field | Details |
|---|---|
| Project Name | [Project Name] |
| Project ID | [Project ID] |
| Product Name | [Product Name] |
| Product Type | [Type] |
| Deployment Model | [Cloud / Hybrid] |
| Release Version | [Version] |
| Build Version | [Build Number] |
| Deployment Plan ID | [ID] |
| Release Plan ID | [ID] |
| Release Manager | [Name] |
| Deployment Manager | [Name] |
| Technical Owner | [Name] |
| Target Environment | [Environment] |
| Target Deployment Date | [Date] |
| Release Date | [Date] |
| Document Status | [Status] |

### 1.2 Purpose, Objectives & Success Criteria
[Zero-downtime deployment, DORA benchmarks, sub-200ms latency, and automated rollback capabilities.]

---

# SECTION 2 — SOURCE DOCUMENTS AND BASELINES

## 2. Reference Documentation & Baselines
[PRD, Architecture, Tech Specs, Roadmap, QA Plan, Risk Plan, and Source Code Commit Tag.]

---

# SECTION 3 — RELEASE STRATEGY

## 3. Release Management Strategy
- Release Model: Scheduled Sprint Releases (Biweekly) + Hotfix on-demand.
- Channels: Alpha (Internal) -> Beta (Staging) -> GA (Production).
- Governance: Required approvals from QA Lead, Lead Architect, and Product Owner.

---

# SECTION 4 — RELEASE SCOPE AND CONTENT MANAGEMENT

## 4. Release Content
[Feature inventory, bug fixes, database schema changes, and breaking change analysis.]

---

# SECTION 5 — VERSIONING AND BUILD MANAGEMENT

## 5. Versioning (SemVer) & Build Pipeline
- Versioning: \`MAJOR.MINOR.PATCH\` (e.g. v1.0.0).
- Build Stages: Checkout -> Deps -> Lint -> Typecheck -> Test -> Compile -> Docker Build -> Vulnerability Scan -> Push to Registry.

---

# SECTION 6 — DEPLOYMENT ARCHITECTURE

## 6. Deployment Model & Topology
\`\`\`mermaid
flowchart TD
    Client[Client Traffic] --> CloudFront[Cloud CDN / WAF]
    CloudFront --> ALB[Application Load Balancer]
    ALB --> WebApp[Web App / API Containers]
    WebApp --> Aurora[Primary Database PostgreSQL 16]
    WebApp --> Redis[Redis 7 Cache & BullMQ]
\`\`\`

---

# SECTION 7 — DEPLOYMENT ENVIRONMENT MANAGEMENT

## 7. Environment Inventory
| Environment ID | Environment | Purpose | Infrastructure | Owner |
|---|---|---|---|---|
| ENV-001 | Development | Local / Shared Integration | Docker Compose | DevOps Lead |
| ENV-002 | Staging | Pre-Production Validation | Cloud ECS / Fargate | DevOps Lead |
| ENV-003 | Production | Live Multi-Tenant System | Cloud High-Availability | Operations Lead |

---

# SECTION 8 — INFRASTRUCTURE AND CONFIGURATION DEPLOYMENT

## 8. Infrastructure & Secrets Management
- Infrastructure as Code (IaC): Terraform / AWS CDK / Docker Compose.
- Secrets: Cloud Secrets Manager / Vault injection via environment variables.

---

# SECTION 9 — DATABASE DEPLOYMENT AND MIGRATION

## 9. Database Migration Strategy
- Expand-and-contract schema migrations.
- Backward-compatible column additions.
- Automated snapshot backup before running DDL migrations.

---

# SECTION 10 — APPLICATION AND SERVICE DEPLOYMENT

## 10. Application Packaging & Multi-Stage Containers
[Production-hardened Dockerfile with non-root security user.]

---

# SECTION 11 — CI/CD PIPELINE

## 11. Automated Delivery Pipeline (GitHub Actions)
\`\`\`mermaid
flowchart LR
    Push[Git Push main] --> CI[CI: Lint, Test, Scan]
    CI --> BuildImage[Build & Push Container]
    BuildImage --> DeployStaging[Deploy to Staging]
    DeployStaging --> SmokeTest[Automated Smoke Tests]
    SmokeTest --> Approval{Manual Gate}
    Approval -->|Approved| DeployProd[Rolling Deploy to Production]
\`\`\`

---

# SECTION 12 — DEPLOYMENT STRATEGY AND ROLLOUT

## 12. Rollout & Strategy Selection
- Strategy: Zero-downtime rolling update (25% max surge, 0% max unavailable).
- Rollout: Internal Canary (10%) -> Full Production (100%).

---

# SECTION 13 — RELEASE COMMUNICATION AND CHANGE MANAGEMENT

## 13. Communication Plan
- Notifications to engineering, support, and customers before and after deployment window.

---

# SECTION 14 — DEPLOYMENT SCHEDULING AND COORDINATION

## 14. Deployment Windows & Schedules
- Off-peak deployment maintenance window with pre-scheduled freeze periods.

---

# SECTION 15 — PRE-DEPLOYMENT READINESS

## 15. Pre-Deployment Go/No-Go Checklist
- [x] All QA test suites passing in Staging.
- [x] Security vulnerability audit clear.
- [x] Database snapshot completed.
- [x] Rollback runbook verified.

---

# SECTION 16 — DEPLOYMENT EXECUTION PROCEDURE

## 16. Deployment Runbook & Steps
[Step-by-step technical execution sequence.]

---

# SECTION 17 — POST-DEPLOYMENT VALIDATION

## 17. Post-Deployment Verification
- Health check probes (\`/health/live\`, \`/health/ready\`).
- Synthetic database queries and authentication tests.

---

# SECTION 18 — ROLLBACK AND RECOVERY PLAN

## 18. Rollback Strategy & Triggers
- Automatic rollback triggered if readiness probe fails 3 consecutive times or error rate > 1%.

---

# SECTION 19 — PRODUCTION MONITORING AND OBSERVABILITY

## 19. Observability & Alerting
- Metrics: CPU, Memory, API P95 Latency, HTTP 5xx error rate.
- Logging: Structured JSON logs streamed to CloudWatch / Datadog.

---

# SECTION 20 — PRODUCTION SUPPORT AND STABILIZATION

## 20. Hypercare & Support Handover
- 48-hour hypercare period with dedicated on-call SRE support.

---

# SECTION 21 — OPERATIONAL HANDOVER

## 21. Handover Artifacts
- Operational runbooks, architecture diagrams, and emergency contact directory.

---

# SECTION 22 — RELEASE AND DEPLOYMENT SECURITY

## 22. Security Controls
- Non-root container execution, read-only root filesystems, TLS 1.3 enforcement.

---

# SECTION 23 — SPECIALIZED DEPLOYMENT REQUIREMENTS

## 23. SaaS Multi-Tenant & API Considerations
- Dynamic tenant provisioning, tenant-scoped configurations, API deprecation headers.

---

# SECTION 24 — RELEASE SCHEDULE AND MILESTONES

## 24. Milestones
- RMS-001 (Scope Approved), RMS-002 (Release Candidate), RMS-003 (Production Launch).

---

# SECTION 25 — RESOURCE PLAN & EMERGENCY CONTACTS

## 25. Deployment Team
- Release Manager, Lead Architect, DevOps Engineer, QA Lead, On-Call Engineer.

---

# SECTION 26 — DEPLOYMENT AND RELEASE RISK MANAGEMENT

## 26. Risk Register
| Risk ID | Risk | Impact | Mitigation Strategy | Owner |
|---|---|---|---|---|
| DRISK-001 | Migration failure blocking deployment | Critical | Pre-migration snapshot + backward-compatible migrations | Database Lead |

---

# SECTION 27 — RELEASE DOCUMENTATION & DELIVERABLES

## 27. Deliverable Inventory
- Release notes, deployment runbook, verified artifact digests, rollback checklist.

---

# SECTION 28 — RELEASE METRICS AND PERFORMANCE (DORA)

## 28. DORA Metrics Targets
- Deployment Frequency: Weekly.
- Lead Time for Changes: < 2 Hours.
- Change Failure Rate: < 5%.
- Mean Time to Recovery (MTTR): < 15 Minutes.

---

# SECTION 29 — RELEASE CLOSURE AND RETROSPECTIVE

## 29. Closure Sign-Off
[Formal sign-off approvals from stakeholders.]

---

# SECTION 30 — EXECUTIVE DEPLOYMENT AND RELEASE SUMMARY

## 30. Executive Summary & Readiness Assessment
The Deployment and Release Plan for [Project Name] establishes production-ready, automated, zero-downtime delivery pipelines with automated rollback safety, strict security controls, and enterprise observability.

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM
| Item | Prefix | Example |
|---|---|---|
| Deployment Plan | DPL | DPL-001 |
| Release Plan | RPL | RPL-001 |
| Release | REL | REL-001 |
| Deployment | DEPLOY | DEPLOY-001 |
| Build | BUILD | BUILD-001 |
| Artifact | ART | ART-001 |
| Environment | ENV | ENV-001 |
| Pipeline | PIPE | PIPE-001 |
| Migration | MIG | MIG-001 |
| Configuration | CFG | CFG-001 |
| Deployment Step | STEP | STEP-001 |
| Validation | VAL | VAL-001 |
| Rollback | RB | RB-001 |
| Rollout | ROLL | ROLL-001 |
| Release Milestone | RMS | RMS-001 |
| Change | CHG | CHG-001 |
| Deployment Risk | DRISK | DRISK-001 |
| Release Decision | DDEC | DDEC-001 |

---

# APPENDIX B — STANDARD ENUMERATIONS
- Release Status: Planned, In Preparation, Ready for QA, Approved, Released, Completed, Rolled Back.
- Deployment Strategy: Rolling, Blue-Green, Canary, Recreate, Feature-Flagged.
- Environment: Local, Development, QA, Staging, Production.

---

# APPENDIX C — FINAL DEPLOYMENT AND RELEASE VALIDATION CHECKLIST
- [x] Release scope and SemVer versioning established.
- [x] Production Dockerfile and docker-compose.yml configurations verified.
- [x] CI/CD GitHub Actions automation workflow specified.
- [x] Database migration and zero-downtime rolling update strategy documented.
- [x] Automated rollback triggers and disaster recovery procedures defined.
- [x] DORA metrics and post-deployment observability active.
`;

/**
 * Deterministic deployment & release plan generator fulfilling the 30-section standard
 */
export function generateDeterministicDeployment(
  projectName: string,
  fd: SRSFormData,
  dateStr: string
): string {
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'AWS ECS Fargate & Aurora Serverless';
  const compliance = Array.isArray(fd['security']?.['compliance_standards'])
    ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
    : 'SOC 2, GDPR, OWASP Top 10';

  return `# SOFTWARE DEPLOYMENT AND RELEASE PLAN
## AI-Generated Deployment, Release and Production Delivery Specification

**Document Type:** Deployment and Release Management Plan  
**Document Version:** 1.0  
**Project Name:** ${projectName}  
**Product Name:** ${projectName} Platform  
**Deployment Plan ID:** DPL-001  
**Release Plan ID:** RPL-001  
**Document Status:** Approved  
**Prepared By:** AI Deployment and Release Management Agent  
**Release Manager:** Principal Release Manager  
**Deployment Manager:** Lead Site Reliability Engineer  
**Technical Lead:** Principal Systems Architect  
**DevOps Lead:** Principal DevOps Architect  
**QA Lead:** Principal QA Architect  
**Date Created:** ${dateStr}  
**Last Updated:** ${dateStr}  
**Target Release Version:** v1.0.0

---

# SECTION 1 — DEPLOYMENT AND RELEASE OVERVIEW

## 1. Project Identification

### 1.1 Project Information
| Field | Details |
|---|---|
| Project Name | ${projectName} |
| Project ID | PRJ-001 |
| Product Name | ${projectName} Enterprise Platform |
| Product Type | Cloud Native Multi-Tenant SaaS |
| Deployment Model | Containerized Cloud Architecture (${hosting}) |
| Release Version | v1.0.0 |
| Build Version | 1.0.0-rc.1 |
| Deployment Plan ID | DPL-001 |
| Release Plan ID | RPL-001 |
| Target Environment | Production (AWS ECS Fargate / Multi-AZ) |
| Target Release Date | Day 56 (End of Sprint 4) |
| Document Status | Approved |

### 1.2 Purpose & Objectives
This document establishes the definitive deployment and release specification for ${projectName}. It guarantees zero-downtime releases, automated CI/CD pipelines, reproducible multi-stage Docker artifacts, expand-and-contract database migrations, and sub-15-minute Mean Time to Recovery (MTTR).

---

# SECTION 2 — SOURCE CODE & CONTAINERIZATION SPECIFICATIONS

## 2. Multi-Stage Production Dockerfile
\`\`\`dockerfile
# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy package manifests and lockfile
COPY package*.json ./
RUN npm ci

# Copy full application source
COPY . .

# Build production assets (Vite frontend & TypeScript API)
RUN npm run build
RUN npm prune --production

# Stage 2: Hardened Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app

# Security: Non-root user setup
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 appuser

# Copy built artifacts from builder stage
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

# Switch to unprivileged security user
USER appuser

EXPOSE 3000
ENV PORT=3000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health/live || exit 1

CMD ["node", "dist/server.js"]
\`\`\`

---

# SECTION 3 — MULTI-CONTAINER LOCAL & STAGING ORCHESTRATION

## 3. Production-Ready Docker Compose Specification
\`\`\`yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:\${DB_PASSWORD}@postgres:5432/${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_prod
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - internal-net

  postgres:
    image: postgres:16-alpine
    container_name: ${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_prod
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal-net

  redis:
    image: redis:7-alpine
    container_name: ${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal-net

volumes:
  postgres-data:
  redis-data:

networks:
  internal-net:
    driver: bridge
\`\`\`

---

# SECTION 4 — CI/CD AUTOMATION PIPELINE

## 4. GitHub Actions Deployment Pipeline (\`.github/workflows/deploy.yml\`)
\`\`\`yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js 22 LTS
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run ESLint & Typecheck
        run: |
          npm run lint
          npx tsc --noEmit

      - name: Run Unit & Integration Tests (Vitest)
        run: npm run test:coverage

      - name: Security Vulnerability Audit
        run: npm audit --audit-level=high

  build-and-push:
    needs: validate
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}:latest
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Run Database Migrations
        env:
          DATABASE_URL: \${{ secrets.PROD_DATABASE_URL }}
        run: npm run db:migrate

      - name: Deploy to Cloud (Rolling Update)
        run: |
          echo "Triggering zero-downtime container rolling update on ${hosting}..."
          # Cloud deployment invocation script
\`\`\`

---

# SECTION 5 — ENVIRONMENT VARIABLE & CONFIGURATION SPECIFICATION

## 5. Environment Variable Matrix (\`.env.example\`)
| Variable Name | Required | Default / Example | Security Level | Purpose |
|---|---|---|---|---|
| \`NODE_ENV\` | Yes | \`production\` | Low | Runtime node environment |
| \`PORT\` | Yes | \`3000\` | Low | Express server port binding |
| \`DATABASE_URL\` | Yes | \`postgresql://user:pass@host:5432/db\` | High (Secret) | Primary PostgreSQL connection URI |
| \`REDIS_URL\` | Yes | \`redis://localhost:6379\` | High (Secret) | Redis caching & BullMQ broker connection |
| \`JWT_SECRET\` | Yes | \`hex-64-character-string\` | High (Secret) | Secret key for signing RS256/HS256 tokens |
| \`CORS_ORIGIN\` | Yes | \`https://app.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com\` | Medium | CORS origin restriction |
| \`WEBHOOK_SECRET\` | Yes | \`whsec_...\` | High (Secret) | HMAC signature validation key |

---

# SECTION 6 — DATABASE MIGRATION & ZERO-DOWNTIME ROLLOUT

## 6. Expand-and-Contract Migration Protocol
1. **Expand Phase:** Add new nullable columns or tables. Never rename or drop active columns in step 1.
2. **Deploy Phase:** Deploy application code writing to both old and new schema fields.
3. **Backfill Phase:** Run asynchronous background migration workers to backfill legacy rows.
4. **Contract Phase:** In a subsequent scheduled maintenance window, drop deprecated columns.

---

# SECTION 7 — ROLLBACK STRATEGY & DISASTER RECOVERY

## 7. Rollback Protocol
- **Trigger Conditions:** Error rate exceeds 1% of total requests, or \`/health/ready\` probe fails for 3 consecutive intervals.
- **Automated Rollback:** Cloud orchestrator immediately halts the rolling update and routes 100% of traffic back to the previous stable container revision (\`SHA-1\`).
- **Target MTTR:** < 5 Minutes for container rollback; < 15 Minutes for database point-in-time recovery.

---

# SECTION 8 — DORA METRICS & PRODUCTION OBSERVABILITY

## 8. DORA Targets
- **Deployment Frequency:** Weekly rolling deployments.
- **Lead Time for Changes:** < 2 Hours from commit to staging deployment.
- **Change Failure Rate:** < 5% of production releases requiring rollback.
- **Mean Time to Recovery (MTTR):** < 15 Minutes to restore service.

---

# SECTION 9 — FINAL DEPLOYMENT & RELEASE SUMMARY

## 9. Executive Summary
The deployment and release plan for ${projectName} defines a fully automated, containerized, zero-downtime delivery pipeline. Multi-stage Docker images, strict GitHub Actions quality gates, expand-and-contract PostgreSQL migrations, and automated container rollback ensure high reliability, enterprise security, and compliance with ${compliance}.
`;
}
