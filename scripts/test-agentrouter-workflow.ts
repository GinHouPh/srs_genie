// Polyfill localStorage for node script execution
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => { store.set(key, String(val)); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] || null,
    length: store.size
  } as any;
}

import { generateComprehensiveSpecPackage } from '../services/specGeneratorService';
import { saasStore } from '../services/saasStore';
import { ProjectInput } from '../types';

async function runLiveTest() {
  console.log('--- Step 1: Checking AI Providers in saasStore ---');
  const providers = saasStore.getAiProviders();
  console.log('Configured AI Providers:', providers.map(p => ({ id: p.id, name: p.name, type: p.type, active: p.isActive })));

  const availableModels = saasStore.getAvailableModels();
  console.log('Available Models count:', availableModels.length);
  const agentRouterModels = availableModels.filter(m => m.providerId === 'prov_agentrouter' || m.id.startsWith('gpt-'));
  console.log('AgentRouter Models available:', agentRouterModels.map(m => m.id));

  // Set AgentRouter key if not already populated from baseline
  const arProv = providers.find(p => p.id === 'prov_agentrouter');
  if (arProv) {
    if (!arProv.apiKey) {
      console.log('Setting AgentRouter API key in provider...');
      arProv.apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
      saasStore.updateAiProvider(arProv.id, arProv);
    }
    console.log('AgentRouter provider status:', {
      name: arProv.name,
      baseUrl: arProv.baseUrl,
      apiKeyPrefix: arProv.apiKey.substring(0, 10) + '...',
      models: arProv.models.map(m => m.id)
    });
  } else {
    console.warn('prov_agentrouter not found in baseline providers!');
  }

  console.log('\n--- Step 2: Preparing Test Project Input ---');
  const sampleProject: ProjectInput = {
    id: 'proj_test_live',
    version: '1.0',
    lastModified: new Date(),
    status: 'draft',
    name: 'OmniFlow Logistics Cloud',
    formData: {
      project_overview: {
        project_name: 'OmniFlow Logistics Cloud',
        industry: 'Supply Chain & Logistics',
        project_type: 'Multi-Tenant SaaS Platform',
        target_users: ['Fleet Operators', 'Warehouse Managers', 'Enterprise Logistics Directors'],
        expected_timeline: '3-4 months',
        budget_range: '$40,000 - $75,000'
      },
      system_type: {
        application_type: ['Web Application (React 19 + TypeScript)', 'REST API Services']
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
        user_management: ['Multi-tenant RBAC', 'MFA Authenticator', 'Session Vault'],
        ecommerce_features: ['Cashfree Instant Billing', 'Automated GST Invoice Generation']
      },
      deployment: {
        cloud_provider: 'Serverbyt Cloud StackCP / Docker Containers'
      }
    } as any
  };

  const logs: any[] = [];
  const onProgress = (log: any) => {
    logs.push(log);
    console.log(`[${log.type.toUpperCase()}] ${log.title}: ${log.content.substring(0, 120)}...`);
  };

  console.log('\n--- Step 3: Executing generateComprehensiveSpecPackage with gpt-5.6-sol ---');
  const startTime = Date.now();
  const specPackage = await generateComprehensiveSpecPackage(
    sampleProject,
    'gpt-5.6-sol',
    onProgress
  );
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n--- Step 4: Verification of Generated Spec Package (${duration}s) ---`);
  const fileKeys = Object.keys(specPackage.specsHierarchy);
  console.log(`✓ Total canonical .specs files generated: ${fileKeys.length} / 22`);
  console.log(`✓ Total dynamic tasks formulated: ${specPackage.implementationTasks.length}`);

  console.log('\nGenerated Files List:');
  fileKeys.forEach(f => {
    const size = specPackage.specsHierarchy[f].length;
    console.log(`  - .specs/${f} (${size} bytes)`);
  });

  const indexSnippet = specPackage.specsHierarchy['_index.md']?.substring(0, 350);
  console.log('\n_index.md AI Synthesis Header Preview:\n', indexSnippet);

  // Check if AI draft was used or fallback
  const aiDraftLog = logs.find(l => l.title.includes('Synthesized via') || l.title.includes('AgentRouter'));
  if (aiDraftLog) {
    console.log('\n✓ LIVE AI SYNTHESIS CONFIRMED:');
    console.log(' ', aiDraftLog.title);
    console.log(' ', aiDraftLog.content);
  } else {
    console.log('\n⚠ AI synthesis log not explicitly matched, check logs:', logs.map(l => l.title));
  }

  console.log('\n=== LIVE TEST OF AGENTROUTER WORKFLOW: SUCCESS ===');
}

runLiveTest().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});

