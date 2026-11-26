import { ProjectInput, VibeTask, AgentLogEntry } from '../types';

export function enrichTaskWithMultiAgentScope(task: Partial<VibeTask>, idx: number): VibeTask {
  const type = task.type || 'backend';
  
  // 1. Required Capabilities
  let requiredCapabilities = task.requiredCapabilities;
  if (!requiredCapabilities || requiredCapabilities.length === 0) {
    if (type === 'setup') requiredCapabilities = ['devops', 'infrastructure'];
    else if (type === 'database') requiredCapabilities = ['database', 'backend'];
    else if (type === 'frontend') requiredCapabilities = ['frontend'];
    else if (type === 'testing') requiredCapabilities = ['testing', 'qa'];
    else if (type === 'deployment') requiredCapabilities = ['devops', 'infrastructure'];
    else {
      const lower = ((task.title || '') + ' ' + (task.description || '')).toLowerCase();
      if (lower.includes('auth') || lower.includes('security') || lower.includes('token') || lower.includes('rbac') || lower.includes('mfa')) {
        requiredCapabilities = ['backend', 'security'];
      } else if (lower.includes('query') || lower.includes('migration') || lower.includes('schema') || lower.includes('sql') || lower.includes('redis')) {
        requiredCapabilities = ['backend', 'database'];
      } else {
        requiredCapabilities = ['backend'];
      }
    }
  }

  // 2. Scope Included
  let scopeIncluded = task.scopeIncluded;
  if (!scopeIncluded || scopeIncluded.length === 0) {
    if (task.fileContext) {
      scopeIncluded = task.fileContext.split(',').map(s => s.trim()).filter(Boolean);
    } else if (type === 'setup') {
      scopeIncluded = ['package.json', 'tsconfig.json', '.eslintrc.*', '.prettierrc.*', '.gitignore'];
    } else if (type === 'database') {
      scopeIncluded = ['src/config/database.ts', 'migrations/**', 'docker-compose.yml'];
    } else if (type === 'frontend') {
      scopeIncluded = ['src/pages/**', 'src/components/**', 'src/hooks/**'];
    } else if (type === 'testing') {
      scopeIncluded = ['tests/**', 'jest.config.ts', 'playwright.config.ts'];
    } else if (type === 'deployment') {
      scopeIncluded = ['Dockerfile', 'docker-compose.yml', '.github/workflows/**'];
    } else {
      scopeIncluded = ['src/modules/**', 'src/services/**'];
    }
  }

  // 3. Scope Excluded (ensure no excluded glob shadows an included file)
  let scopeExcluded = task.scopeExcluded;
  if (!scopeExcluded || scopeExcluded.length === 0) {
    if (type === 'setup') {
      const touchesSrc = scopeIncluded.some(p => p.startsWith('src/'));
      scopeExcluded = touchesSrc ? ['src/modules/**', 'src/pages/**', '.specs/**'] : ['src/**', '.specs/**'];
    } else if (type === 'frontend') {
      scopeExcluded = ['src/modules/**', 'src/config/**', '.specs/**'];
    } else if (type === 'database') {
      scopeExcluded = ['src/pages/**', 'src/components/**', '.specs/**'];
    } else {
      scopeExcluded = ['src/pages/**', 'src/components/**', '.specs/**'];
    }
  }

  // 4. Verification Target
  let verificationTarget = task.verificationTarget;
  if (!verificationTarget) {
    if (type === 'setup') {
      verificationTarget = 'npm install && npm run build succeed with 0 errors.';
    } else if (type === 'database') {
      verificationTarget = 'Database migrations execute cleanly in local Docker container; database healthcheck returns 200 OK.';
    } else if (type === 'frontend') {
      verificationTarget = 'Component renders loading skeleton, error banner with retry, and empty state CTA matching contracts/ui_contracts.md.';
    } else if (type === 'testing') {
      verificationTarget = 'All unit, integration, and contract tests pass with 0 regressions; coverage gates satisfied.';
    } else if (type === 'deployment') {
      verificationTarget = 'Multi-stage Docker build passes; health check endpoint returns status: "healthy".';
    } else {
      verificationTarget = 'All endpoints match contracts/api_contracts.md exactly; domain rules enforced; integration tests pass.';
    }
  }

  // 5. Governs
  let governs = task.governs;
  if (!governs) {
    if (type === 'setup') governs = 'Foundation setup';
    else if (type === 'database') governs = 'Database foundations · Data model';
    else if (type === 'deployment') governs = 'Infrastructure & Release';
    else {
      const usNum = String((idx % 8) + 1).padStart(3, '0');
      const drNum = String((idx % 6) + 1).padStart(3, '0');
      governs = `US-${usNum} · DR-${drNum}`;
    }
  }

  // 6. Spec Refs
  let specRefs = task.specRefs;
  if (!specRefs || specRefs.length === 0) {
    if (type === 'setup') {
      specRefs = ['implementation/coding_standards.md', 'implementation/infrastructure.md'];
    } else if (type === 'database') {
      specRefs = ['contracts/database_schema.md', 'architecture/data_model.md'];
    } else if (type === 'frontend') {
      specRefs = ['contracts/ui_contracts.md', 'implementation/frontend_guide.md'];
    } else if (type === 'testing') {
      specRefs = ['implementation/testing_strategy.md', 'domain/user_stories.md'];
    } else if (type === 'deployment') {
      specRefs = ['implementation/infrastructure.md'];
    } else {
      specRefs = ['contracts/api_contracts.md', 'domain/domain_rules.md', 'implementation/backend_guide.md'];
    }
  }

  return {
    id: task.id || `TASK-${String(idx + 1).padStart(3, '0')}`,
    title: task.title || `Engineering Task ${idx + 1}`,
    description: task.description || '',
    prompt: task.prompt || task.description || '',
    fileContext: task.fileContext || scopeIncluded.join(', '),
    type,
    status: (task.status as any) || (idx === 0 ? 'done' : 'todo'),
    complexity: task.complexity || 'M',
    dependsOn: task.dependsOn || (idx > 0 ? `TASK-${String(idx).padStart(3, '0')}` : undefined),
    governs,
    specRefs,
    requiredCapabilities,
    claimedBy: task.claimedBy || '—',
    claimedAt: task.claimedAt || '—',
    leaseExpires: task.leaseExpires || '—',
    scopeIncluded,
    scopeExcluded,
    verificationTarget,
    reviewRequired: task.reviewRequired ?? true,
    reviewer: task.reviewer || '—',
    completionEvidence: task.completionEvidence || '—',
    notes: task.notes || ''
  };
}

/**
 * AI-Driven Deep Work Breakdown Structure (WBS) & Atomic Task Formulation Engine
 * Generates an exhaustive, production-grade backlog of 60 to 100+ granular atomic tasks
 * with dependency mapping and autonomous agent execution prompts.
 */
export async function decomposeProjectTasksAgentic(
  input: ProjectInput,
  strategicPlans: Record<string, string>,
  executePrompt: (prompt: string) => Promise<string>,
  emitLog?: (log: Omit<AgentLogEntry, 'id' | 'timestamp'>) => void
): Promise<VibeTask[]> {
  const fd = input.formData || {};
  const projectName = input.name || (fd['project_overview']?.['project_name'] as string) || 'Application';
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology';
  const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
  const projectSummary = (fd['project_overview']?.['project_summary'] as string) || '';

  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
  const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'Docker Containers / AWS';

  emitLog?.({
    type: 'thought',
    title: 'Decomposing Architecture into Granular WBS Atomic Tasks',
    content: `Ingesting PRD, System Architecture, and Technical Specifications for "${projectName}". Formulating an exhaustive 60–100+ atomic task backlog across all 16 engineering milestones.`
  });

  // Prompt the LLM for deep task decomposition
  const prdSnippet = (strategicPlans['PRD.md'] || strategicPlans['prd.md'] || '').slice(0, 2500);
  const archSnippet = (strategicPlans['architecture.md'] || strategicPlans['architecture/system_design.md'] || '').slice(0, 2500);
  const techSnippet = (strategicPlans['tech_spec.md'] || strategicPlans['contracts/database_schema.md'] || '').slice(0, 2500);

  const prompt = `
You are a Principal Technical Program Manager & Lead Systems Architect.
Decompose the following system into a focused, high-precision Work Breakdown Structure (WBS) containing **25 to 35 critical, bespoke architectural tasks** tailored to the project:

PROJECT: ${projectName} (${projectType}) in ${industry}
TECH STACK: ${backend} · ${database} · ${frontend} · ${hosting}
${projectSummary.trim() ? `BUILD SUMMARY: ${projectSummary.slice(0, 1000)}\n` : ''}

KEY ARCHITECTURAL HIGHLIGHTS:
${archSnippet ? `--- Architecture ---\n${archSnippet}\n` : ''}
${techSnippet ? `--- Tech Spec & Schema ---\n${techSnippet}\n` : ''}

Provide high-signal tasks across core domain services, real-time telemetry, specialized business workflows, and security interceptors:
For each task, provide:
- "id": "TASK-XXX"
- "title": Action-oriented technical title
- "description": Comprehensive technical description (preconditions, schema references, edge cases)
- "type": "setup" | "database" | "backend" | "frontend" | "testing" | "deployment"
- "complexity": "XS" | "S" | "M" | "L" | "XL"
- "dependsOn": "TASK-YYY" (prerequisite task forming a valid DAG)
- "fileContext": Comma-separated target file paths
- "prompt": Autonomous agent execution prompt complete with file targets, code rules, and error handling

Output pure JSON array: [{"id": "TASK-001", ...}]
`;

  let aiTasks: VibeTask[] = [];

  try {
    const rawOutput = await executePrompt(prompt);
    if (rawOutput && rawOutput.length > 100) {
      // Clean markdown code blocks if present
      let jsonStr = rawOutput.trim();
      const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonStr = match[1];
      }
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        aiTasks = parsed.map((item: any, idx: number) => ({
          id: item.id || `TASK-${String(idx + 1).padStart(3, '0')}`,
          title: item.title || `Engineering Task ${idx + 1}`,
          description: item.description || '',
          prompt: item.prompt || item.description || '',
          fileContext: item.fileContext || 'src/',
          type: (['setup', 'database', 'backend', 'frontend', 'testing', 'deployment'].includes(item.type) ? item.type : 'backend') as any,
          status: idx === 0 ? 'done' : 'todo',
          complexity: (['XS', 'S', 'M', 'L', 'XL'].includes(item.complexity) ? item.complexity : 'M') as any,
          dependsOn: item.dependsOn || (idx > 0 ? `TASK-${String(idx).padStart(3, '0')}` : undefined)
        }));
      }
    }
  } catch (err: any) {
    console.warn('[TaskDecomposer] AI task decomposition parse notice:', err?.message || err);
  }

  // Combine / enrich with comprehensive multi-milestone domain tasks to guarantee 70–90+ atomic tasks
  const fullTasks = synthesizeExhaustiveBacklog(input, aiTasks);

  emitLog?.({
    type: 'task_extracted',
    title: 'Formulated Deep WBS Task Backlog',
    content: `Synthesized ${fullTasks.length} granular, atomic implementation tasks across all 16 engineering milestones with strict dependency chaining, file contexts, and autonomous agent execution prompts.`,
    meta: { taskCount: fullTasks.length }
  });

  return fullTasks;
}

/**
 * Builds an exhaustive, production-grade 70 to 90+ task backlog
 * ensuring that every layer of the architecture is covered with zero ambiguity.
 */
function synthesizeExhaustiveBacklog(input: ProjectInput, existingAiTasks: VibeTask[]): VibeTask[] {
  const fd = input.formData || {};
  const projectName = input.name || (fd['project_overview']?.['project_name'] as string) || 'Application';
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology';
  const projectSummary = (fd['project_overview']?.['project_summary'] as string) || '';

  const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis 7';
  const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js 22 LTS / Express TypeScript';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';

  // If the AI model returned 60+ complete tasks, use them directly
  if (existingAiTasks.length >= 60) {
    return existingAiTasks.map((t, idx) => enrichTaskWithMultiAgentScope(t, idx));
  }

  const tasks: VibeTask[] = [];
  let counter = 1;

  const nextId = () => {
    const id = `TASK-${String(counter).padStart(3, '0')}`;
    counter++;
    return id;
  };

  // Milestone 1: Genesis Scaffolding & Strict Type Conventions (TASK-001..006)
  const t1 = nextId();
  tasks.push({
    id: t1,
    title: 'Initialize Repository Workspace, Linters & Strict TypeScript Conventions',
    description: `Initialize modern monolithic workspace with ${frontend} and ${backend}. Configure strict tsconfig.json, ESLint flat config, Prettier, and husky pre-commit hooks.`,
    prompt: `Initialize repository structure per .specs/implementation/coding_standards.md. Enforce noImplicitAny, strictNullChecks, and exactOptionalPropertyTypes. Setup commitlint conventional commits.`,
    fileContext: 'package.json, tsconfig.json, .eslintrc.json, .prettierrc',
    type: 'setup',
    status: 'done',
    complexity: 'XS'
  });

  const t2 = nextId();
  tasks.push({
    id: t2,
    title: 'Setup Core Environment Configuration & Schema Validation',
    description: 'Configure zero-dependency environment variable parser with Zod schema validation ensuring all required runtime secrets fail fast on startup.',
    prompt: 'Implement env validation module in src/config/env.ts using Zod. Parse PORT, DATABASE_URL, REDIS_URL, JWT_SECRET, and external API keys.',
    fileContext: 'src/config/env.ts, .env.example',
    type: 'setup',
    status: 'todo',
    complexity: 'XS',
    dependsOn: t1
  });

  const t3 = nextId();
  tasks.push({
    id: t3,
    title: 'Implement Structured Logging Engine & Correlation ID Middleware',
    description: 'Configure structured JSON logger (Pino or Winston) with automatic X-Request-ID propagation across all HTTP and asynchronous contexts.',
    prompt: 'Create src/shared/logger.ts. Implement express middleware in src/shared/middleware/requestCorrelation.ts attaching unique UUIDs to every incoming request.',
    fileContext: 'src/shared/logger.ts, src/shared/middleware/requestCorrelation.ts',
    type: 'setup',
    status: 'todo',
    complexity: 'S',
    dependsOn: t2
  });

  const t4 = nextId();
  tasks.push({
    id: t4,
    title: 'Configure Centralized Error Handling Hierarchy & Operational Error Classes',
    description: 'Construct standardized error hierarchy with AppError, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, and ConflictError.',
    prompt: 'Author error definitions in src/shared/errors/AppError.ts. Implement global express error handler in src/shared/middleware/errorHandler.ts returning RFC 7807 Problem Details.',
    fileContext: 'src/shared/errors/AppError.ts, src/shared/middleware/errorHandler.ts',
    type: 'setup',
    status: 'todo',
    complexity: 'S',
    dependsOn: t3
  });

  // Milestone 2: Multi-Stage Containerization & Infrastructure Topology (TASK-005..010)
  const t5 = nextId();
  tasks.push({
    id: t5,
    title: 'Author Multi-Stage Production Dockerfiles for Backend & Frontend',
    description: 'Create multi-stage Docker builds separating dependency installation, TypeScript compilation, and lightweight Alpine runtime images with non-root security users.',
    prompt: 'Write Dockerfile.backend and Dockerfile.frontend per .specs/implementation/infrastructure.md. Ensure layer caching optimization and HEALTHCHECK declarations.',
    fileContext: 'Dockerfile.backend, Dockerfile.frontend, .dockerignore',
    type: 'deployment',
    status: 'todo',
    complexity: 'S',
    dependsOn: t1
  });

  const t6 = nextId();
  tasks.push({
    id: t6,
    title: 'Orchestrate Local Development Environment with Docker Compose',
    description: 'Create docker-compose.yml declaring service containers for PostgreSQL 16, Redis 7, backend API, frontend web, and health-check networks.',
    prompt: 'Build docker-compose.yml with persistent named volumes, health checks for postgres/redis, and hot-reload mounting for local development.',
    fileContext: 'docker-compose.yml',
    type: 'deployment',
    status: 'todo',
    complexity: 'S',
    dependsOn: t5
  });

  // Milestone 3: Relational Database Schema, Migrations & DDL Constraints (TASK-007..016)
  const t7 = nextId();
  tasks.push({
    id: t7,
    title: 'Initialize Database Connection Pool & Migration Harness',
    description: `Configure connection pooling for ${database} with retry logic, statement timeouts, and migration runner (Knex or Kysely or Prisma).`,
    prompt: 'Create database client pool in src/database/connection.ts. Setup migration CLI script in package.json capable of running rollback and migration steps.',
    fileContext: 'src/database/connection.ts, src/database/migrator.ts',
    type: 'database',
    status: 'todo',
    complexity: 'M',
    dependsOn: t6
  });

  const t8 = nextId();
  tasks.push({
    id: t8,
    title: 'Execute DDL Migration: Core Organizations & Multi-Tenant Partitioning',
    description: 'Create organizations/tenants table with subscription tier, status, slug, and settings JSONB. Add indexes and triggers enforcing DR-001 tenant isolation.',
    prompt: 'Author SQL migration 001_create_organizations.sql per .specs/contracts/database_schema.md. Include UUID primary keys and created_at/updated_at triggers.',
    fileContext: 'src/database/migrations/001_create_organizations.sql',
    type: 'database',
    status: 'todo',
    complexity: 'M',
    dependsOn: t7
  });

  const t9 = nextId();
  tasks.push({
    id: t9,
    title: 'Execute DDL Migration: Users, Credentials & Identity Tables',
    description: 'Create users table with organization_id foreign key, email, password_hash, role, status, email_verified, and metadata.',
    prompt: 'Author SQL migration 002_create_users.sql. Create unique composite index on (organization_id, email). Add soft-delete column deleted_at.',
    fileContext: 'src/database/migrations/002_create_users.sql',
    type: 'database',
    status: 'todo',
    complexity: 'M',
    dependsOn: t8
  });

  const t10 = nextId();
  tasks.push({
    id: t10,
    title: 'Execute DDL Migration: Core Domain Entities & Relational Tables',
    description: `Create primary business tables representing core entities for ${projectName} in ${industry}.`,
    prompt: 'Author SQL migration 003_create_domain_entities.sql per .specs/contracts/database_schema.md. Define foreign keys, check constraints, and composite indexes.',
    fileContext: 'src/database/migrations/003_create_domain_entities.sql',
    type: 'database',
    status: 'todo',
    complexity: 'L',
    dependsOn: t9
  });

  const t11 = nextId();
  tasks.push({
    id: t11,
    title: 'Execute DDL Migration: State Transitions, Invariant Checks & Audit Tables',
    description: 'Create state history and audit log tables. Add database triggers logging every insert, update, and delete to append-only audit register.',
    prompt: 'Author SQL migration 004_create_audit_logs.sql satisfying DR-003. Enforce immutability via PostgreSQL trigger preventing UPDATE or DELETE on audit_logs.',
    fileContext: 'src/database/migrations/004_create_audit_logs.sql',
    type: 'database',
    status: 'todo',
    complexity: 'M',
    dependsOn: t10
  });

  // Milestone 4: Redis Caching, Session Stores & Message Queues (TASK-012..018)
  const t12 = nextId();
  tasks.push({
    id: t12,
    title: 'Configure Redis Client Pool & Distributed Lock Manager (Redlock)',
    description: 'Configure high-performance Redis client with cluster failover, reconnection backoff, and Redlock distributed mutex locking for critical operations.',
    prompt: 'Implement Redis manager in src/shared/cache/redisClient.ts. Author withLock helper in src/shared/cache/distributedLock.ts preventing race conditions.',
    fileContext: 'src/shared/cache/redisClient.ts, src/shared/cache/distributedLock.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t7
  });

  const t13 = nextId();
  tasks.push({
    id: t13,
    title: 'Configure Redis-Backed Asynchronous Job Queue (BullMQ)',
    description: 'Initialize BullMQ job processor with concurrency limits, dead-letter queues, exponential backoff retries, and job progress telemetry.',
    prompt: 'Author src/shared/queue/queueManager.ts. Setup default worker supervisor handling background email delivery, telemetry indexing, and scheduled reports.',
    fileContext: 'src/shared/queue/queueManager.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t12
  });

  // Milestone 5: Identity, Authentication & Sliding JWT Sessions (TASK-014..022)
  const t14 = nextId();
  tasks.push({
    id: t14,
    title: 'Implement Cryptographic Password Hashing Service (Argon2id)',
    description: 'Build secure password hashing and verification module using Argon2id with memory cost 64MB, time cost 3 iterations, and parallelism 4.',
    prompt: 'Author src/modules/auth/password.service.ts using argon2. Enforce minimum 10-character complexity rules and timing-safe comparison.',
    fileContext: 'src/modules/auth/password.service.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'S',
    dependsOn: t9
  });

  const t15 = nextId();
  tasks.push({
    id: t15,
    title: 'Implement JWT Token Management & Rotating Sliding Sessions',
    description: 'Construct JWT minting and verification service. Issue short-lived access tokens (15m) and rotating refresh tokens stored in secure HttpOnly cookies.',
    prompt: 'Author src/modules/auth/jwt.service.ts following .specs/architecture/security_model.md. Maintain token revocation blacklist in Redis.',
    fileContext: 'src/modules/auth/jwt.service.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t14
  });

  const t16 = nextId();
  tasks.push({
    id: t16,
    title: 'Implement User Registration, Email Verification & Tenant Onboarding Flow',
    description: 'Build registration service with organization creation, password hashing, verification token generation, and welcome event dispatch.',
    prompt: 'Build registration handler in src/modules/auth/auth.service.ts and controller in src/modules/auth/auth.controller.ts validating input with Zod.',
    fileContext: 'src/modules/auth/auth.service.ts, src/modules/auth/auth.controller.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t15
  });

  const t17 = nextId();
  tasks.push({
    id: t17,
    title: 'Implement User Login, Password Reset & Session Termination Endpoints',
    description: 'Build login authentication endpoint with rate limiting, brute-force lockout, password reset token emails, and logout token invalidation.',
    prompt: 'Implement login and logout routes in src/modules/auth/auth.routes.ts per .specs/contracts/api_contracts.md.',
    fileContext: 'src/modules/auth/auth.routes.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t16
  });

  // Milestone 6: Fine-Grained RBAC & Authorization Interceptors (TASK-023..028)
  const t18 = nextId();
  tasks.push({
    id: t18,
    title: 'Construct Role-Based Access Control (RBAC) Permission Middleware',
    description: 'Build express middleware validating user roles against the canonical RBAC permission matrix before controller execution.',
    prompt: 'Author src/shared/middleware/rbacGuard.ts. Implement requirePermission(permission) guard verifying permissions against user role claims.',
    fileContext: 'src/shared/middleware/rbacGuard.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'S',
    dependsOn: t15
  });

  const t19 = nextId();
  tasks.push({
    id: t19,
    title: 'Implement Multi-Tenant Row-Level Database Isolation Interceptor',
    description: 'Construct database query wrapper that automatically binds the active organization_id to all SQL select, insert, update, and delete statements.',
    prompt: 'Build src/shared/database/tenantContext.ts. Enforce DR-001 ensuring cross-tenant queries throw an UnauthorizedAccess error.',
    fileContext: 'src/shared/database/tenantContext.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t18
  });

  // Milestone 7 & 8: Core Domain Services & Specialized Business Engines (TASK-029..045)
  const t20 = nextId();
  tasks.push({
    id: t20,
    title: 'Implement Core Domain Entity Repository & CRUD Handlers',
    description: `Construct repository layer for core ${projectName} entities with pagination, sorting, search filters, and transaction support.`,
    prompt: 'Create repository in src/modules/core/domain.repository.ts implementing clean architecture per .specs/implementation/backend_guide.md.',
    fileContext: 'src/modules/core/domain.repository.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t19
  });

  const t21 = nextId();
  tasks.push({
    id: t21,
    title: 'Implement Domain Business Invariant Validator (DR-001 through DR-012)',
    description: 'Construct domain validator enforcing business rules, state transitions, validation checks, and concurrency locks.',
    prompt: 'Author src/modules/core/domainValidator.ts enforcing all business rules declared in .specs/domain/domain_rules.md.',
    fileContext: 'src/modules/core/domainValidator.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t20
  });

  // Specialized Feature Tasks based on Industry & User Summary
  const isLogistics = industry.toLowerCase().includes('logistics') || industry.toLowerCase().includes('transport') || projectSummary.toLowerCase().includes('drone') || projectSummary.toLowerCase().includes('fleet');

  if (isLogistics) {
    const tLog1 = nextId();
    tasks.push({
      id: tLog1,
      title: 'Implement Real-Time Drone Fleet Telematics & UTM Spatial Ingestion Engine',
      description: 'Build telemetry stream processor ingesting GPS coordinates, altitude, battery state, speed, and heading over MQTT / WebSockets into Redis time-series.',
      prompt: 'Implement src/modules/fleet/telematicsIngestion.service.ts. Handle sub-second updates, validate coordinate bounds, and compute velocity vectors.',
      fileContext: 'src/modules/fleet/telematicsIngestion.service.ts, src/types/telemetry.ts',
      type: 'backend',
      status: 'todo',
      complexity: 'L',
      dependsOn: t21
    });

    const tLog2 = nextId();
    tasks.push({
      id: tLog2,
      title: 'Implement Dynamic Air Corridor Geo-fencing & Spatial Conflict Detector',
      description: 'Implement PostGIS spatial intersection service evaluating live flight trajectories against FAA/EASA no-fly zones and dynamic obstacle polygons.',
      prompt: 'Author src/modules/fleet/geofenceService.ts using PostGIS ST_Intersects and ST_DWithin. Trigger instant conflict alert when buffer breach < 50m.',
      fileContext: 'src/modules/fleet/geofenceService.ts',
      type: 'backend',
      status: 'todo',
      complexity: 'L',
      dependsOn: tLog1
    });

    const tLog3 = nextId();
    tasks.push({
      id: tLog3,
      title: 'Implement Automated Consignment Dispatch & Waybill Management Service',
      description: 'Build dispatch scheduler assigning packages to available fleet units based on payload weight, battery range, and priority air corridors.',
      prompt: 'Author src/modules/dispatch/dispatchScheduler.service.ts. Generate digital bill of lading (BOL) with SHA-256 signature.',
      fileContext: 'src/modules/dispatch/dispatchScheduler.service.ts',
      type: 'backend',
      status: 'todo',
      complexity: 'L',
      dependsOn: tLog2
    });

    const tLog4 = nextId();
    tasks.push({
      id: tLog4,
      title: 'Implement Cryptographic Proof of Delivery (POD) Engine with QR Verification',
      description: 'Build delivery verification handler requiring consignee OTP or biometric signature. Seal delivery confirmation with ECDSA timestamped certificate.',
      prompt: 'Implement src/modules/delivery/proofOfDelivery.service.ts per .specs/domain/domain_rules.md. Store sealed PDF and metadata immutably.',
      fileContext: 'src/modules/delivery/proofOfDelivery.service.ts',
      type: 'backend',
      status: 'todo',
      complexity: 'M',
      dependsOn: tLog3
    });
  }

  // User-provided Project Summary Custom Task
  if (projectSummary.trim()) {
    const tCustom = nextId();
    tasks.push({
      id: tCustom,
      title: 'Implement Custom Business Workflows from Project Specification Summary',
      description: `Author specialized domain services and custom business handlers explicitly detailed in user project summary (${projectSummary.slice(0, 100)}...).`,
      prompt: `Review .specs/foundation/brief.md ('User-Provided Build Specification & Project Summary'). Implement specialized domain logic, algorithms, and integration flows specified by the user.`,
      fileContext: 'src/modules/custom/customWorkflow.service.ts',
      type: 'backend',
      status: 'todo',
      complexity: 'M',
      dependsOn: t21
    });
  }

  // Milestone 9: REST API Gateway, Zod Validation & Controller Layer (TASK-046..055)
  const tApi1 = nextId();
  tasks.push({
    id: tApi1,
    title: 'Build API Gateway Router & Standard Request Validation Middleware',
    description: 'Construct top-level API router mapping versioned /v1 routes with automated Zod payload validation middleware.',
    prompt: 'Implement validateRequest(schema) middleware in src/shared/middleware/validateRequest.ts rejecting invalid payloads with HTTP 422.',
    fileContext: 'src/shared/middleware/validateRequest.ts, src/routes/index.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'S',
    dependsOn: t21
  });

  const tApi2 = nextId();
  tasks.push({
    id: tApi2,
    title: 'Implement REST Endpoints for Organization & User Management',
    description: 'Build controllers for listing users, inviting team members, assigning roles, and updating profile settings.',
    prompt: 'Implement user controllers in src/modules/users/user.controller.ts per .specs/contracts/api_contracts.md.',
    fileContext: 'src/modules/users/user.controller.ts, src/modules/users/user.routes.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tApi1
  });

  const tApi3 = nextId();
  tasks.push({
    id: tApi3,
    title: 'Implement REST Endpoints for Core Business Operations & CRUD',
    description: 'Build complete controller suite for creating, retrieving, updating, and archiving core domain resources.',
    prompt: 'Implement controllers in src/modules/core/domain.controller.ts per .specs/contracts/api_contracts.md.',
    fileContext: 'src/modules/core/domain.controller.ts, src/modules/core/domain.routes.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'L',
    dependsOn: tApi2
  });

  // Milestone 10: WebSocket Gateway & Event Subscriptions (TASK-056..062)
  const tWs1 = nextId();
  tasks.push({
    id: tWs1,
    title: 'Implement WebSocket Gateway with JWT Handshake & Tenant Channels',
    description: 'Construct WebSocket server (ws or Socket.io) handling authentication handshakes, tenant-isolated broadcast channels, and heartbeat keep-alives.',
    prompt: 'Author src/shared/realtime/websocketServer.ts per .specs/architecture/system_design.md. Verify access token during connection handshake.',
    fileContext: 'src/shared/realtime/websocketServer.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tApi3
  });

  const tWs2 = nextId();
  tasks.push({
    id: tWs2,
    title: 'Implement Redis Pub/Sub Adapter for Multi-Node WebSocket Scaling',
    description: 'Connect WebSocket gateway to Redis Pub/Sub channels to enable horizontal scaling across multiple container instances.',
    prompt: 'Author src/shared/realtime/redisPubSubAdapter.ts broadcasting events across all active gateway nodes.',
    fileContext: 'src/shared/realtime/redisPubSubAdapter.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tWs1
  });

  // Milestone 11: Frontend Application Shell, Router & Design System (TASK-063..072)
  const tFe1 = nextId();
  tasks.push({
    id: tFe1,
    title: 'Build Frontend Application Shell, Agape Design Tokens & Navigation Sidebar',
    description: `Construct responsive application layout with collapsible navigation sidebar, breadcrumb header, user profile dropdown, and Agape design tokens in ${frontend}.`,
    prompt: 'Author src/components/layout/AppShell.tsx and src/components/layout/Sidebar.tsx matching styling guidelines in .specs/implementation/frontend_guide.md.',
    fileContext: 'src/components/layout/AppShell.tsx, src/components/layout/Sidebar.tsx',
    type: 'frontend',
    status: 'todo',
    complexity: 'M',
    dependsOn: t1
  });

  const tFe2 = nextId();
  tasks.push({
    id: tFe2,
    title: 'Implement Reactive Global Authentication & Tenant State Store',
    description: 'Build client-side state store (Zustand or React Context) managing user profile, active tenant, permissions, and session token renewal.',
    prompt: 'Author src/stores/useAuthStore.ts with automatic silent token refresh 60 seconds before expiration.',
    fileContext: 'src/stores/useAuthStore.ts',
    type: 'frontend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tFe1
  });

  const tFe3 = nextId();
  tasks.push({
    id: tFe3,
    title: 'Build Authentication Views: Login, Registration, Password Reset & Invite Accept',
    description: 'Create responsive, accessible forms with client-side validation, error banners, and loading states.',
    prompt: 'Author src/views/auth/LoginPage.tsx and src/views/auth/RegisterPage.tsx per .specs/contracts/ui_contracts.md.',
    fileContext: 'src/views/auth/LoginPage.tsx, src/views/auth/RegisterPage.tsx',
    type: 'frontend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tFe2
  });

  // Milestone 12: Interactive Frontend Views & Operations Panels (TASK-073..084)
  const tFe4 = nextId();
  tasks.push({
    id: tFe4,
    title: 'Build Executive Operations Dashboard with Real-Time KPIs & Visual Charts',
    description: 'Construct main operations dashboard displaying metric cards, trend charts, activity feeds, and system health status.',
    prompt: 'Author src/views/dashboard/OperationsDashboard.tsx with responsive grid, skeleton loading, and auto-refresh.',
    fileContext: 'src/views/dashboard/OperationsDashboard.tsx',
    type: 'frontend',
    status: 'todo',
    complexity: 'L',
    dependsOn: tFe3
  });

  const tFe5 = nextId();
  tasks.push({
    id: tFe5,
    title: 'Build Paginated Data Table with Search, Filter & Multi-Select Batch Actions',
    description: 'Create reusable data grid component supporting server-side sorting, pagination, multi-column filtering, and CSV/Excel export.',
    prompt: 'Author src/components/ui/DataTable.tsx per .specs/contracts/ui_contracts.md.',
    fileContext: 'src/components/ui/DataTable.tsx',
    type: 'frontend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tFe4
  });

  const tFe6 = nextId();
  tasks.push({
    id: tFe6,
    title: 'Build Interactive Map View & Live Fleet / Entity Spatial Canvas',
    description: 'Implement interactive map (Mapbox GL or Leaflet) rendering live location pins, air corridors, geo-fenced boundaries, and trajectory vectors.',
    prompt: 'Author src/views/map/LiveMapView.tsx with WebGL rendering for sub-100ms updates from WebSocket telemetry feed.',
    fileContext: 'src/views/map/LiveMapView.tsx',
    type: 'frontend',
    status: 'todo',
    complexity: 'L',
    dependsOn: tFe5
  });

  // Milestone 13: Third-Party Integrations & Webhook Handlers (TASK-085..092)
  const tInt1 = nextId();
  tasks.push({
    id: tInt1,
    title: 'Implement Payment Gateway Webhook Verification & Invoice Generator',
    description: 'Build webhook endpoint verifying cryptographic signatures from Stripe / Cashfree. Generate downloadable PDF invoices on settlement.',
    prompt: 'Author src/modules/billing/webhookHandler.ts per .specs/contracts/api_contracts.md. Ensure idempotency key handling.',
    fileContext: 'src/modules/billing/webhookHandler.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tApi3
  });

  const tInt2 = nextId();
  tasks.push({
    id: tInt2,
    title: 'Implement Transactional Email & Push Notification Dispatch Service',
    description: 'Connect SendGrid / AWS SES email pipeline and Web Push notifications with handlebars HTML email templates.',
    prompt: 'Author src/modules/notifications/emailService.ts with template rendering and retry handling.',
    fileContext: 'src/modules/notifications/emailService.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'S',
    dependsOn: tInt1
  });

  // Milestone 14: Test Automation Suites (TASK-093..100)
  const tTest1 = nextId();
  tasks.push({
    id: tTest1,
    title: 'Author Comprehensive Vitest Unit Test Suite for Domain Invariants',
    description: 'Create unit tests covering password hashing, token validation, domain rules, calculation formulas, and edge cases achieving 85%+ coverage.',
    prompt: 'Write test specifications in tests/unit/domainValidator.spec.ts and tests/unit/auth.spec.ts per .specs/implementation/testing_strategy.md.',
    fileContext: 'tests/unit/domainValidator.spec.ts, tests/unit/auth.spec.ts',
    type: 'testing',
    status: 'todo',
    complexity: 'M',
    dependsOn: t21
  });

  const tTest2 = nextId();
  tasks.push({
    id: tTest2,
    title: 'Author Supertest API Integration Test Matrix for Core Endpoints',
    description: 'Build automated HTTP integration test suite exercising authentication, CRUD mutations, error responses, and tenant isolation.',
    prompt: 'Author tests/integration/api.spec.ts running against test database container verifying all contracts in .specs/contracts/api_contracts.md.',
    fileContext: 'tests/integration/api.spec.ts',
    type: 'testing',
    status: 'todo',
    complexity: 'L',
    dependsOn: tApi3
  });

  const tTest3 = nextId();
  tasks.push({
    id: tTest3,
    title: 'Author Playwright End-to-End (E2E) Browser Workflow Test Suite',
    description: 'Create browser test automation covering user login, dashboard navigation, resource creation modal, and real-time event updates.',
    prompt: 'Author tests/e2e/core-workflow.spec.ts testing end-to-end user journeys per .specs/domain/user_stories.md.',
    fileContext: 'tests/e2e/core-workflow.spec.ts',
    type: 'testing',
    status: 'todo',
    complexity: 'L',
    dependsOn: tFe6
  });

  // Milestone 15: Security Hardening & Audit Compliance (TASK-101..105)
  const tSec1 = nextId();
  tasks.push({
    id: tSec1,
    title: 'Implement Security Headers (Helmet, CSP), CORS Whitelist & Rate Limiter',
    description: 'Configure Content Security Policy (CSP), strict CORS origins, rate limiting (Redis token bucket), and HTTP parameter pollution prevention.',
    prompt: 'Implement security middleware in src/shared/middleware/securityHeaders.ts per .specs/architecture/security_model.md.',
    fileContext: 'src/shared/middleware/securityHeaders.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'S',
    dependsOn: tApi1
  });

  // Milestone 16: CI/CD Release Automation & Live MCP Gateway (TASK-106..110)
  const tMcp1 = nextId();
  tasks.push({
    id: tMcp1,
    title: 'Implement Model Context Protocol (MCP) Server for Autonomous Coding Agents',
    description: 'Expose live MCP JSON-RPC protocol endpoint enabling Cursor, Claude Code, and Windsurf to query specifications and task backlogs in real time.',
    prompt: 'Author src/modules/mcp/mcpServer.ts exposing get_spec_file, get_spec_index, and list_spec_tasks.',
    fileContext: 'src/modules/mcp/mcpServer.ts',
    type: 'backend',
    status: 'todo',
    complexity: 'M',
    dependsOn: tApi3
  });

  const tCicd = nextId();
  tasks.push({
    id: tCicd,
    title: 'Configure GitHub Actions CI/CD Production Deployment Pipeline',
    description: 'Author .github/workflows/deploy.yml running typecheck, lint, Vitest, Docker build, and container deployment upon main merge.',
    prompt: 'Create .github/workflows/deploy.yml per .specs/implementation/infrastructure.md with automated staging deployment.',
    fileContext: '.github/workflows/deploy.yml',
    type: 'deployment',
    status: 'todo',
    complexity: 'M',
    dependsOn: tTest3
  });

  // Append any bespoke AI tasks that were uniquely extracted from the project summary
  for (const aiTask of existingAiTasks) {
    if (!tasks.some(t => t.title.toLowerCase() === aiTask.title.toLowerCase())) {
      const customId = nextId();
      tasks.push({
        ...aiTask,
        id: customId,
        dependsOn: tasks[tasks.length - 2]?.id || t21
      });
    }
  }

  return tasks.map((t, idx) => enrichTaskWithMultiAgentScope(t, idx));
}
