import { buildCanonicalSpecsSuite } from '../services/specTemplates';
import { generateDynamicProjectTasks } from '../services/specGeneratorService';
import { compileConsolidatedIeee830SRS } from '../services/srsDocumentCompiler';
import { ProjectInput, GeneratedContent } from '../types';

const sampleInput: ProjectInput = {
  id: 'proj_verification',
  version: '1.0',
  lastModified: new Date(),
  status: 'draft',
  name: 'OmniTrade Autonomous Exchange',
  formData: {
    project_overview: {
      project_name: 'OmniTrade Autonomous Exchange',
      industry: 'Financial Technology (FinTech)',
      project_type: 'Decentralized Trading & Settlement Engine',
      target_users: ['High-Frequency Traders', 'Settlement Officers', 'Compliance Auditors'],
      expected_timeline: '3-4 months',
      budget_range: '$100,000 - $250,000',
      project_summary: 'Build a low-latency exchange with automated market making and zero-trust audit trails.'
    },
    system_type: {
      application_type: ['Web Application (Browser-based)', 'Backend/API Only']
    },
    technical_requirements: {
      backend_stack: 'Node.js 22 LTS / Express TypeScript',
      database_preference: 'PostgreSQL 16 + Redis 7',
      frontend_stack: 'React 19 / TypeScript / Tailwind CSS'
    },
    security: {
      compliance_standards: ['SOC 2 Type II', 'ISO 27001', 'OWASP Top 10']
    },
    core_features: {
      user_management: ['Registration & Email Verification', 'Role-Based Access Control (RBAC)', 'Two-Factor Authentication (2FA)'],
      ecommerce_features: ['Cashfree Instant Billing / Invoicing']
    },
    deployment: {
      cloud_provider: 'Serverbyt Cloud StackCP / Docker Containers'
    }
  } as any
};

console.log('=== Verifying Dynamic Task Generation ===');
const tasks = generateDynamicProjectTasks(sampleInput);
console.log(`Generated ${tasks.length} tasks.`);
const t1 = tasks[0];
console.log('Task 1 sample:', {
  id: t1.id,
  title: t1.title,
  requiredCapabilities: t1.requiredCapabilities,
  scopeIncluded: t1.scopeIncluded,
  scopeExcluded: t1.scopeExcluded,
  verificationTarget: t1.verificationTarget,
  governs: t1.governs
});

if (!t1.requiredCapabilities || t1.requiredCapabilities.length === 0) {
  throw new Error('Task missing requiredCapabilities');
}
if (!t1.scopeIncluded || t1.scopeIncluded.length === 0) {
  throw new Error('Task missing scopeIncluded');
}

console.log('\n=== Verifying Canonical Specs Suite (buildCanonicalSpecsSuite) ===');
const files = buildCanonicalSpecsSuite(sampleInput, tasks, 'Master plan draft content');
const fileKeys = Object.keys(files);
console.log(`Generated ${fileKeys.length} files in canonical specs suite.`);

const mandatoryFiles = [
  'AGENTS.md',
  '_index.md',
  'foundation/brief.md',
  'foundation/glossary.md',
  'domain/user_stories.md',
  'domain/domain_rules.md',
  'architecture/system_design.md',
  'architecture/data_model.md',
  'architecture/security_model.md',
  'contracts/api_contracts.md',
  'contracts/database_schema.md',
  'contracts/ui_contracts.md',
  'implementation/backend_guide.md',
  'implementation/frontend_guide.md',
  'implementation/infrastructure.md',
  'implementation/testing_strategy.md',
  'implementation/coding_standards.md',
  'execution/tasks.md',
  'execution/dependency_graph.md',
  'execution/sprint_plan.md',
  'coordination/protocol.md',
  'coordination/task_board.md',
  'coordination/agent_registry.md',
  'coordination/messages/.gitkeep',
  'agents/onboarding.md',
  'agents/lifecycle.md',
  'agents/task_execution.md',
  'agents/communication.md',
  'agents/verification.md',
  'agents/conflict_resolution.md',
  'state/current_state.md',
  'state/decisions_log.md',
  'state/known_issues.md'
];

for (const mf of mandatoryFiles) {
  if (!files[mf]) {
    throw new Error(`Missing mandatory file in generated suite: ${mf}`);
  }
  console.log(`  ✓ Generated: ${mf} (${files[mf].length} bytes)`);
}

console.log('\n=== Verifying IEEE 830 Consolidated SRS Compilation ===');
const fakeGeneratedContent: GeneratedContent = {
  srsMarkdown: '',
  agentContext: files['_index.md'],
  implementationTasks: tasks,
  specsHierarchy: files,
  projectMeta: {
    projectName: sampleInput.name,
    description: 'OmniTrade Autonomous Exchange',
    techStack: ['Node.js', 'PostgreSQL', 'React 19'],
    timeline: '3-4 months',
    budget: '$100,000 - $250,000'
  }
};

const srs = compileConsolidatedIeee830SRS(fakeGeneratedContent, sampleInput);
console.log(`Compiled SRS length: ${srs.length} bytes`);

if (!srs.includes('7. Autonomous Multi-Agent Coordination & Execution Protocol')) {
  throw new Error('SRS missing Section 7: Autonomous Multi-Agent Coordination & Execution Protocol');
}
if (!srs.includes('Universal Agent Directives & Repository Manifest (AGENTS.md)')) {
  throw new Error('SRS missing subsection 7.1');
}
if (!srs.includes('Multi-Agent Coordination Protocol & Workspace Isolation')) {
  throw new Error('SRS missing subsection 7.2');
}
if (!srs.includes('Live Task Board, Leases & Bounded Implementation')) {
  throw new Error('SRS missing subsection 7.3');
}

console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
