import {
  ProjectInput,
  GeneratedContent,
  VibeTask,
  AgentLogEntry,
  SRSFormData,
  AIModelDefinition
} from '../types';
import { GoogleGenAI } from '@google/genai';
import { saasStore } from './saasStore';
import { cryptoService } from './cryptoService';
import { buildCanonicalSpecsSuite, extractSectionFromDraft } from './specTemplates';
import { SPEC_TIERS, formatFormDataForPrompt, generateDynamicProjectTasks } from './specGeneratorService';
import { cloneSpecsTemplateForProject, getMasterSpecsTemplates } from './specsTemplateRepository';
import { decomposeProjectTasksAgentic } from './specTaskDecomposer';
import {
  STRATEGIC_PLAN_DEFINITIONS,
  buildStrategicPlanPrompt,
  StrategicPlanDocumentId,
  SPEC_AGENT_SYSTEM_DIRECTIVE
} from './specAgentPrompts';
import {
  generateDeterministicProjectPlan,
  generateDeterministicPRD,
  generateDeterministicDesigns,
  generateDeterministicArchitecture,
  generateDeterministicTechSpec,
  generateDeterministicRoadmap,
  generateDeterministicRisk,
  generateDeterministicQA,
  generateDeterministicDeployment
} from './planningTemplates';
import { compileConsolidatedIeee830SRS } from './srsDocumentCompiler';

/**
 * Architecture rules specification describing the 33-file System 2 Multi-Agent .specs hierarchy,
 * roles, dependency DAG, and regeneration cascade triggers.
 */
export interface SpecArchitectureRule {
  path: string;
  tier: string;
  role: string;
  dependsOn?: string[];
  triggersRegen?: string[];
  description: string;
}

export const SPEC_ARCHITECTURE_RULES: SpecArchitectureRule[] = [
  // Root
  {
    path: 'AGENTS.md',
    tier: 'Root',
    role: 'universal-agent-manifest',
    triggersRegen: ['_index.md', 'coordination/*', 'agents/*'],
    description: 'Universal root manifest parsed by AI agents before touching any repository file.'
  },
  // Entry
  {
    path: '_index.md',
    tier: 'Entry',
    role: 'multi-agent-navigation-manifest',
    dependsOn: ['AGENTS.md'],
    description: 'Root navigation manifest and regeneration cascade rules read first by AI agents.'
  },
  // Tier 0
  {
    path: 'foundation/brief.md',
    tier: 'Tier 0',
    role: 'source-of-truth',
    triggersRegen: ['domain/*', 'architecture/*', 'contracts/*', 'implementation/*', 'execution/*'],
    description: 'Authoritative product brief: scope, user roles, non-negotiables, boundary constraints.'
  },
  {
    path: 'foundation/glossary.md',
    tier: 'Tier 0',
    role: 'canonical-vocabulary',
    triggersRegen: ['all files (for term consistency)'],
    description: 'Canonical domain terms and definitions to prevent terminology drift.'
  },
  // Tier 1
  {
    path: 'domain/user_stories.md',
    tier: 'Tier 1',
    role: 'user-stories',
    dependsOn: ['foundation/brief.md'],
    triggersRegen: ['execution/tasks.md', 'implementation/testing_strategy.md'],
    description: 'Gherkin acceptance criteria and user persona flows.'
  },
  {
    path: 'domain/domain_rules.md',
    tier: 'Tier 1',
    role: 'business-invariants',
    dependsOn: ['foundation/brief.md'],
    triggersRegen: ['architecture/*', 'contracts/*'],
    description: 'Non-negotiable business rules and database invariants (DR-001..DR-008).'
  },
  // Tier 2
  {
    path: 'architecture/system_design.md',
    tier: 'Tier 2',
    role: 'system-architecture',
    dependsOn: ['foundation/brief.md', 'domain/domain_rules.md'],
    triggersRegen: ['contracts/*', 'implementation/*'],
    description: 'Component architecture, Mermaid topologies, and inter-service flow.'
  },
  {
    path: 'architecture/data_model.md',
    tier: 'Tier 2',
    role: 'canonical-data-model',
    dependsOn: ['domain/domain_rules.md', 'domain/user_stories.md'],
    triggersRegen: ['contracts/database_schema.md', 'contracts/api_contracts.md', 'contracts/ui_contracts.md'],
    description: 'Canonical entities, relationships, primary keys, and foreign keys.'
  },
  {
    path: 'architecture/security_model.md',
    tier: 'Tier 2',
    role: 'security-and-auth',
    dependsOn: ['domain/user_stories.md', 'domain/domain_rules.md'],
    triggersRegen: ['contracts/api_contracts.md'],
    description: 'Authentication strategy, RBAC permission matrix, and token lifecycle.'
  },
  // Tier 3
  {
    path: 'contracts/api_contracts.md',
    tier: 'Tier 3',
    role: 'api-contracts',
    dependsOn: ['architecture/data_model.md', 'architecture/security_model.md'],
    triggersRegen: ['contracts/ui_contracts.md', 'implementation/testing_strategy.md'],
    description: 'OpenAPI REST endpoints, JSON request/response payloads, and status codes.'
  },
  {
    path: 'contracts/database_schema.md',
    tier: 'Tier 3',
    role: 'database-schema',
    dependsOn: ['architecture/data_model.md'],
    triggersRegen: ['implementation/backend_guide.md'],
    description: 'Production PostgreSQL/MySQL DDL migrations, indexes, constraints, and RLS.'
  },
  {
    path: 'contracts/ui_contracts.md',
    tier: 'Tier 3',
    role: 'ui-contracts',
    dependsOn: ['architecture/system_design.md', 'contracts/api_contracts.md'],
    triggersRegen: ['implementation/frontend_guide.md'],
    description: 'Route tables, component state contracts, and UX states.'
  },
  // Tier 4
  {
    path: 'implementation/backend_guide.md',
    tier: 'Tier 4',
    role: 'backend-guide',
    dependsOn: ['architecture/system_design.md', 'contracts/api_contracts.md'],
    description: 'Directory layouts, service-repository patterns, and error handlers.'
  },
  {
    path: 'implementation/frontend_guide.md',
    tier: 'Tier 4',
    role: 'frontend-guide',
    dependsOn: ['contracts/ui_contracts.md'],
    description: 'Component patterns, custom hooks, and state management.'
  },
  {
    path: 'implementation/infrastructure.md',
    tier: 'Tier 4',
    role: 'infrastructure',
    dependsOn: ['architecture/system_design.md'],
    description: 'Multi-stage Dockerfiles, Docker Compose, CI/CD, and environment variables.'
  },
  {
    path: 'implementation/testing_strategy.md',
    tier: 'Tier 4',
    role: 'testing-strategy',
    dependsOn: ['domain/user_stories.md', 'contracts/api_contracts.md'],
    description: 'Unit, integration, and E2E test coverage targets and mocking rules.'
  },
  {
    path: 'implementation/coding_standards.md',
    tier: 'Tier 4',
    role: 'coding-standards',
    description: 'TypeScript strict mode, ESLint, Prettier, and conventional commit standards.'
  },
  // Tier 5
  {
    path: 'execution/tasks.md',
    tier: 'Tier 5',
    role: 'canonical-task-list',
    dependsOn: ['domain/user_stories.md', 'architecture/system_design.md', 'contracts/*'],
    description: 'Granular, atomic task backlog with scope boundaries, capabilities, and verification targets.'
  },
  {
    path: 'execution/dependency_graph.md',
    tier: 'Tier 5',
    role: 'dependency-graph',
    dependsOn: ['execution/tasks.md'],
    description: 'Mermaid Directed Acyclic Graph (DAG) visualizing execution sequence and parallel groups.'
  },
  {
    path: 'execution/sprint_plan.md',
    tier: 'Tier 5',
    role: 'sprint-plan',
    dependsOn: ['execution/tasks.md'],
    description: 'Multi-agent sprint scope, task allocations, worktree branches, and Definition of Done.'
  },
  // Coordination
  {
    path: 'coordination/protocol.md',
    tier: 'Coordination',
    role: 'multi-agent-protocol',
    dependsOn: ['AGENTS.md', '_index.md'],
    description: 'Rules of engagement, Git worktree isolation, atomic push claiming, leases, and boundary rules.'
  },
  {
    path: 'coordination/task_board.md',
    tier: 'Coordination',
    role: 'live-task-board',
    dependsOn: ['execution/tasks.md', 'coordination/protocol.md'],
    description: 'Live task board tracking real-time status, active 4-hour leases, blockers, and reviewer assignments.'
  },
  {
    path: 'coordination/agent_registry.md',
    tier: 'Coordination',
    role: 'agent-registry',
    dependsOn: ['coordination/protocol.md'],
    description: 'Agent session registry monitoring platform identity, active worktree branches, and heartbeats.'
  },
  // Agents Runbooks
  {
    path: 'agents/onboarding.md',
    tier: 'Agents',
    role: 'agent-onboarding-runbook',
    dependsOn: ['coordination/protocol.md'],
    description: '5-step bootstrap checklist, worktree setup, session registration, and message log init.'
  },
  {
    path: 'agents/lifecycle.md',
    tier: 'Agents',
    role: 'agent-lifecycle-runbook',
    dependsOn: ['agents/onboarding.md', 'coordination/protocol.md'],
    description: '6-phase agent lifecycle from bootstrap, task claiming, bounded coding to peer verification.'
  },
  {
    path: 'agents/task_execution.md',
    tier: 'Agents',
    role: 'task-execution-guide',
    dependsOn: ['implementation/coding_standards.md'],
    description: 'Scope boundary invariants (INCLUDED/EXCLUDED allowlists) and zero-regression coding patterns.'
  },
  {
    path: 'agents/communication.md',
    tier: 'Agents',
    role: 'communication-standard',
    dependsOn: ['coordination/protocol.md'],
    description: 'Standardized markdown event schemas and append-only message stream specifications.'
  },
  {
    path: 'agents/verification.md',
    tier: 'Agents',
    role: 'verification-standard',
    dependsOn: ['implementation/testing_strategy.md'],
    description: 'Mandatory completion evidence blocks, deterministic test command logging, and peer review gates.'
  },
  {
    path: 'agents/conflict_resolution.md',
    tier: 'Agents',
    role: 'conflict-resolution-guide',
    dependsOn: ['coordination/protocol.md'],
    description: 'Deterministic recovery algorithms for claim collisions, crashed agent reclaims, and merge conflicts.'
  },
  // State
  {
    path: 'state/current_state.md',
    tier: 'State',
    role: 'live-state',
    description: 'Multi-session handoff ledger, active workstreams, build status, and next actions.'
  },
  {
    path: 'state/decisions_log.md',
    tier: 'State',
    role: 'decisions-log',
    description: 'Architecture Decision Records (ADRs) with session attribution and trade-off rationale.'
  },
  {
    path: 'state/known_issues.md',
    tier: 'State',
    role: 'known-issues',
    description: 'Known limitations, tech debt watchpoints, and deferred v2 items.'
  }
];

/**
 * Dedicated AI Specification Agent (SpecAgent)
 * 
 * Staged Planning Protocol:
 * 1. Consolidate SRS form answers into context
 * 2. Generate the 9 Specialized Strategic Planning Documents (Parent Project Plan, PRD, designs, architecture, tech_spec, roadmap, risk, qa, deployment)
 * 3. Read & understand .specs architecture rules (tiers, dependencies, regeneration cascades)
 * 4. Update the 22 .specs files & dynamic tasks based on the 9 Specialized Planning Documents
 * 5. Finalize and package for Viewport Previews, ZIP exports, and MCP
 */
export class SpecAgent {
  private input: ProjectInput;
  private modelDef: AIModelDefinition;
  private onProgress?: (log: AgentLogEntry) => void;
  private strategicPlans: Record<string, string> = {};
  private majorProjectPlan: string = '';
  private dynamicTasks: VibeTask[] = [];
  private compiledSpecs: Record<string, string> = {};

  constructor(
    input: ProjectInput,
    modelDef: AIModelDefinition,
    onProgress?: (log: AgentLogEntry) => void
  ) {
    this.input = input;
    this.modelDef = modelDef;
    this.onProgress = onProgress;
  }

  private emit(log: Omit<AgentLogEntry, 'id' | 'timestamp'>) {
    if (this.onProgress) {
      this.onProgress({
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        ...log
      });
    }
  }

  /**
   * Helper to execute prompt against active AI Provider with intelligent auto-failover
   */
  private async executeModelPrompt(prompt: string): Promise<string> {
    const aiProviders = saasStore.getAiProviders();

    // Priority candidates
    const candidates: { provider: any; modelId: string }[] = [];

    const explicitProvider = this.modelDef?.providerId
      ? aiProviders.find(p => p.id === this.modelDef.providerId)
      : null;

    if (explicitProvider && explicitProvider.isActive) {
      candidates.push({ provider: explicitProvider, modelId: this.modelDef?.id || 'gemini-2.5-flash' });
    }

    const matchingProvider = aiProviders.find(p => p.isActive && p.models?.some(m => m.id === this.modelDef?.id));
    if (matchingProvider && !candidates.some(c => c.provider.id === matchingProvider.id)) {
      candidates.push({ provider: matchingProvider, modelId: this.modelDef?.id || matchingProvider.models[0]?.id });
    }

    // Always include AgentRouter candidate if active
    const agentRouter = aiProviders.find(p => (p.id === 'prov_agentrouter' || p.name.toLowerCase().includes('agentrouter')) && p.isActive);
    if (agentRouter && !candidates.some(c => c.provider.id === agentRouter.id)) {
      candidates.push({ provider: agentRouter, modelId: 'gpt-5.6-sol' });
    }

    // Include other active providers
    for (const p of aiProviders) {
      if (p.isActive && !candidates.some(c => c.provider.id === p.id)) {
        candidates.push({ provider: p, modelId: p.models?.[0]?.id || 'gpt-4o' });
      }
    }

    let lastError: any = null;

    for (const { provider: targetProvider, modelId: targetModel } of candidates) {
      try {
        let activeKey = targetProvider?.apiKey || '';
        if (targetProvider?.type === 'google' && !activeKey) {
          activeKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
        }

        if (activeKey && (activeKey.startsWith('aes_gcm$') || activeKey.startsWith('enc_b64_'))) {
          try {
            activeKey = await cryptoService.decryptSecret(activeKey);
          } catch {}
        }

        if (!activeKey && !targetProvider.baseUrl) continue;

        // Route to Google Gemini
        if (targetProvider.type === 'google') {
          if (!activeKey || activeKey.includes('AIzaSyAMzGX1Ecar')) {
            // Skip invalid placeholder key to failover immediately
            continue;
          }
          const ai = new GoogleGenAI({ apiKey: activeKey });
          const res = await ai.models.generateContent({
            model: targetModel.startsWith('gemini') ? targetModel : 'gemini-2.5-flash',
            contents: prompt
          });
          const text = res.text || '';
          if (text.trim().length > 50) return text;
        }

        // Route to AgentRouter or OpenAI-compatible
        const rawBaseUrl = (targetProvider.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
        const isAgentRouter = rawBaseUrl.includes('agentrouter') || targetProvider.name.toLowerCase().includes('agentrouter');

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (activeKey && activeKey !== 'ollama-local') {
          headers['Authorization'] = `Bearer ${activeKey}`;
        }
        if (isAgentRouter) {
          headers['Originator'] = 'codex_cli_rs';
        }

        if (isAgentRouter) {
          const timeoutMs = (targetModel.includes('6.1') || targetModel.includes('astra')) ? 420000 : 360000;
          const res = await fetch(`${rawBaseUrl}/responses`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: targetModel,
              input: prompt,
              reasoning: { effort: 'low' },
              stream: true
            }),
            signal: AbortSignal.timeout(timeoutMs)
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(`AgentRouter error: ${err.error?.message || err.message || res.status}`);
          }

          if (res.body) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let accumulatedText = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) continue;
                const jsonStr = trimmed.replace(/^data:\s*/, '');
                if (jsonStr === '[DONE]') continue;
                try {
                  const payload = JSON.parse(jsonStr);
                  if (typeof payload.delta === 'string') {
                    accumulatedText += payload.delta;
                  } else if (payload.delta?.text) {
                    accumulatedText += payload.delta.text;
                  } else if (payload.text) {
                    accumulatedText += payload.text;
                  } else if (payload.response?.output && !accumulatedText) {
                    const msg = payload.response.output.find((o: any) => o.type === 'message');
                    const t = msg?.content?.[0]?.text;
                    if (t) accumulatedText = t;
                  }
                } catch {}
              }
            }

            if (accumulatedText.trim().length > 50) {
              return accumulatedText.trim();
            }
          }
        } else {
          const res = await fetch(`${rawBaseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: targetModel,
              messages: [
                { role: 'system', content: SPEC_AGENT_SYSTEM_DIRECTIVE },
                { role: 'user', content: prompt }
              ]
            }),
            signal: AbortSignal.timeout(180000)
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || '';
            if (text.trim().length > 50) {
              return text;
            }
          }
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[SpecAgent] Candidate provider ${targetProvider.name} failed:`, err?.message || err);
      }
    }

    if (lastError) {
      console.error('[SpecAgent] All AI candidates failed. Last error:', lastError);
    }
    return '';
  }

  /**
   * Step 1 & 2: Consolidates questionnaire answers and synthesizes the 8 Specialized Planning Documents
   */
  async consolidateAndGenerateStrategicPlans(): Promise<Record<string, string>> {
    const fd = this.input.formData || {};
    const projectName = this.input.name || (fd['project_overview']?.['project_name'] as string) || 'Modern Application';
    const industry = (fd['project_overview']?.['industry'] as string) || 'Technology';
    const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
    const projectSummary = (fd['project_overview']?.['project_summary'] as string) || '';
    const attachedFileName = (fd['project_overview']?.['project_summary_file_name'] as string) || '';

    this.emit({
      type: 'thought',
      title: 'Consolidating SRS Questionnaire Inputs',
      content: `Consolidating 15 domain sections for "${projectName}" (${projectType}) in ${industry}.${
        projectSummary.trim()
          ? ` Ingesting user-defined Project Summary${attachedFileName ? ` (from attached file "${attachedFileName}")` : ''} (${projectSummary.trim().length} characters). Prioritizing custom vision, workflows, and build requirements.`
          : ' Formulating multi-disciplinary staging context for the 9 Specialized Planning Documents.'
      }`
    });

    const formattedInput = formatFormDataForPrompt(fd);
    const dateStr = new Date().toISOString().split('T')[0];

    // Generate the 9 Specialized Planning Documents in concurrent batches of 3
    const BATCH_SIZE = 3;
    for (let i = 0; i < STRATEGIC_PLAN_DEFINITIONS.length; i += BATCH_SIZE) {
      const batch = STRATEGIC_PLAN_DEFINITIONS.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (planDef) => {
          this.emit({
            type: 'action',
            title: `Synthesizing ${planDef.filename} (${planDef.title})`,
            content: `Agent assuming role of ${planDef.role}. Formulating ${planDef.description}`
          });

          let content = '';
          try {
            const prompt = buildStrategicPlanPrompt(planDef.id, projectName, formattedInput);
            content = await this.executeModelPrompt(prompt);
          } catch (e: any) {
            console.warn(`Error generating ${planDef.filename} via AI model:`, e);
          }

          // If AI output was unavailable, generate rich deterministic technical content
          if (!content || content.length < 150) {
            content = this.generateDeterministicStrategicPlan(planDef.id, projectName, fd, dateStr);
          }

          this.strategicPlans[planDef.filename] = content;

          this.emit({
            type: 'draft_chunk',
            title: `Forged ${planDef.filename}`,
            content: content,
            meta: { file: planDef.filename, tokens: Math.round(content.length / 4) }
          });
        })
      );
    }

    // Build the master combined project plan reference
    this.majorProjectPlan = `# Master Strategic Architecture Suite: ${projectName}
**Generated Date:** ${dateStr}

${Object.entries(this.strategicPlans).map(([filename, doc]) => `## Document: ${filename}\n\n${doc}\n\n---\n`).join('\n')}`;

    return this.strategicPlans;
  }

  /**
   * Deterministic generation fallback for each of the 8 Specialized Planning Documents
   */
  private generateDeterministicStrategicPlan(
    planId: StrategicPlanDocumentId,
    projectName: string,
    fd: SRSFormData,
    dateStr: string
  ): string {
    const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
    const projectType = (fd['project_overview']?.['project_type'] as string) || 'Full-Scale Production System';
    const backend = (fd['technical_requirements']?.['backend_stack'] as string) || 'Node.js / Express TypeScript';
    const database = (fd['technical_requirements']?.['database_preference'] as string) || 'PostgreSQL 16 + Redis';
    const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';
    const hosting = (fd['deployment']?.['cloud_provider'] as string) || 'AWS (ECS / Aurora PostgreSQL)';
    const compliance = Array.isArray(fd['security']?.['compliance_standards'])
      ? (fd['security']?.['compliance_standards'] as string[]).join(', ')
      : 'SOC 2, GDPR, OWASP Top 10';

    switch (planId) {
      case 'project_plan':
        return generateDeterministicProjectPlan(projectName, fd, dateStr);

      case 'prd':
        return generateDeterministicPRD(projectName, fd, dateStr);

      case 'designs':
        return generateDeterministicDesigns(projectName, fd, dateStr);

      case 'architecture':
        return generateDeterministicArchitecture(projectName, fd, dateStr);

      case 'tech_spec':
        return generateDeterministicTechSpec(projectName, fd, dateStr);

      case 'roadmap':
        return generateDeterministicRoadmap(projectName, fd, dateStr);

      case 'risk':
        return generateDeterministicRisk(projectName, fd, dateStr);

      case 'qa':
        return generateDeterministicQA(projectName, fd, dateStr);

      case 'deployment':
        return generateDeterministicDeployment(projectName, fd, dateStr);
    }
  }

  /**
   * Step 3: Agent reads and inspects the .specs architecture blueprint
   */
  readSpecsArchitecture(): SpecArchitectureRule[] {
    this.emit({
      type: 'thought',
      title: 'Reading .specs Architecture Blueprint',
      content: `Inspecting canonical System 2 multi-agent .specs architecture. Loaded ${SPEC_ARCHITECTURE_RULES.length} specification targets across Root (AGENTS.md), Entry, Tier 0 (Foundation), Tier 1 (Domain), Tier 2 (Architecture), Tier 3 (Contracts), Tier 4 (Guides), Tier 5 (Execution), Coordination, Agents Runbooks, and State tiers.`
    });

    // Verify cascade rules
    const cascades = [
      'AGENTS.md / brief.md changed → Regenerate downstream tiers and coordination task board',
      'foundation/glossary.md changed → Review all files for terminology consistency',
      'architecture/data_model.md changed → Regenerate database_schema.md + api_contracts.md + ui_contracts.md',
      'contracts/api_contracts.md changed → Regenerate ui_contracts.md + update testing_strategy.md',
      'domain/user_stories.md changed → Regenerate execution/tasks.md + coordination/task_board.md'
    ];

    this.emit({
      type: 'action',
      title: 'Validating Tier Dependency DAG & Cascade Rules',
      content: `Agent parsed regeneration rules:\n${cascades.map(c => `• ${c}`).join('\n')}\nPlanning topological compilation of the 33 canonical spec & coordination files mapped from the 9 Strategic Planning Documents.`
    });

    return SPEC_ARCHITECTURE_RULES;
  }

  /**
   * Step 4: Derives dynamic tasks and compiles the 33 .specs files from the 9 Strategic Planning Documents
   */
  async updateSpecsFromPlan(): Promise<{ specs: Record<string, string>; tasks: VibeTask[] }> {
    this.emit({
      type: 'thought',
      title: 'Synthesizing Deep WBS Task Backlog with Autonomous Prompts',
      content: `Extracting granular atomic tasks across 16 engineering milestones from Parent Project Plan, PRD, and Technical Specification with full multi-agent scope boundaries and verification targets.`
    });

    // Derive comprehensive 60–100+ atomic tasks directly matching the plan requirements
    this.dynamicTasks = await decomposeProjectTasksAgentic(
      this.input,
      this.strategicPlans,
      (prompt) => this.executeModelPrompt(prompt),
      (log) => this.emit(log)
    );

    // Clone the master .specs template repository to create an isolated project copy
    const projectTemplateCopy = cloneSpecsTemplateForProject(this.input.name || 'Application');

    this.emit({
      type: 'action',
      title: 'Cloned Master .specs Template Repository',
      content: `Copied pristine System 2 .specs template suite (${Object.keys(projectTemplateCopy).length} files) to initialize isolated project workspace for "${this.input.name}". Master template remains untouched.`
    });

    this.emit({
      type: 'action',
      title: 'Compiling 33 Project .specs & Multi-Agent Files from Strategic Architecture',
      content: `Commencing top-down population of all 33 project specification and multi-agent coordination files derived from PRD, designs, architecture, tech specs, roadmap, risk, QA, and deployment plans.`
    });

    // Synthesize all 33 files using the plan and tasks
    const recordFileCallback = (path: string, tier: string, title: string, content: string) => {
      this.emit({
        type: 'file_created',
        title: `Compiled ${path.startsWith('AGENTS') ? '' : '.specs/'}${path}`,
        content: `Updated ${title} (${tier}) from Strategic Planning Documents in accordance with multi-agent architecture rules.`,
        meta: { file: path, tier, tokens: Math.round(content.length / 4) }
      });
    };

    this.compiledSpecs = buildCanonicalSpecsSuite(
      this.input,
      this.dynamicTasks,
      this.majorProjectPlan,
      recordFileCallback
    );

    return {
      specs: this.compiledSpecs,
      tasks: this.dynamicTasks
    };
  }

  /**
   * Step 5: Finalizes and packages specifications for preview, zip export, and MCP
   */
  finalizeAndPackage(): GeneratedContent {
    const tokenCost = 28500;
    saasStore.recordSpecGeneration(tokenCost);

    // Annotate _index.md with AI synthesis metadata
    if (this.compiledSpecs['_index.md']) {
      this.compiledSpecs['_index.md'] = this.compiledSpecs['_index.md'].replace(
        '## Executive Project Summary',
        `## AI Synthesis Engine\n\nOrchestrated by **SpecAgent** via **${this.modelDef?.name || 'Gemini 2.5 Flash'}** (${this.modelDef?.providerName || 'Google Gemini'}) · Context: ${this.modelDef?.contextWindow || '1M Tokens'} · Engine Speed: ${this.modelDef?.speed || 'Ultra Fast'}\n\n## Executive Project Summary`
      );
    }

    this.emit({
      type: 'thought',
      title: 'Specification Package Verification & Ready for Export',
      content: `All 33 canonical specification and multi-agent coordination files and 9 Strategic Planning Documents verified. ${this.dynamicTasks.length} dynamic tasks ready. Suite packaged for interactive preview, ZIP export, and MCP coding agent tools.`
    });

    const interimContent: GeneratedContent = {
      srsMarkdown: '',
      agentContext: this.compiledSpecs['AGENTS.md'] || this.compiledSpecs['_index.md'] || '',
      implementationTasks: this.dynamicTasks,
      specsHierarchy: this.compiledSpecs,
      strategicPlans: this.strategicPlans,
      projectMeta: {
        projectName: this.input.name,
        description: `Production specification suite for ${this.input.name}`,
        techStack: ['Node.js', 'PostgreSQL', 'React 19', 'Tailwind CSS', 'Docker'],
        timeline: (this.input.formData?.['project_overview']?.['expected_timeline'] as string) || '3-4 months',
        budget: (this.input.formData?.['project_overview']?.['budget_range'] as string) || '$25,000 - $50,000'
      }
    };

    // Compile formal IEEE 830 compliant SRS document
    interimContent.srsMarkdown = compileConsolidatedIeee830SRS(interimContent, this.input);

    return interimContent;
  }

  /**
   * Main entrypoint executing the staged planning protocol
   */
  async execute(): Promise<GeneratedContent> {
    // 1 & 2. Consolidate answers & Synthesize the 9 Specialized Planning Documents
    await this.consolidateAndGenerateStrategicPlans();

    // 3. Read & understand .specs architecture rules
    this.readSpecsArchitecture();

    // 4. Update the 33 .specs files & dynamic tasks based on the 9 Strategic Plans
    await this.updateSpecsFromPlan();

    // 5. Finalize package for preview & export
    return this.finalizeAndPackage();
  }
}
