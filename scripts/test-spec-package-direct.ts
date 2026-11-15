// Polyfill localStorage
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
import { ProjectInput } from '../types';

async function testDirect() {
  const sampleProject: ProjectInput = {
    id: 'proj_test_direct',
    version: '1.0',
    lastModified: new Date(),
    status: 'draft',
    name: 'SkyCourier Autonomous Fleet Logistics',
    formData: {
      project_overview: {
        project_name: 'SkyCourier Autonomous Fleet Logistics',
        industry: 'Supply Chain & Logistics',
        project_type: 'Autonomous Drone Dispatch Cloud',
        target_users: ['Autonomous Fleet Operators', 'Air Traffic Coordinators', 'Warehouse Dispatchers'],
        expected_timeline: '3-4 months',
        budget_range: '$100,000 - $250,000'
      },
      system_type: {
        application_type: ['Web Application (Browser-based)', 'Backend/API Only', 'Progressive Web App (PWA)']
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
        user_management: ['Registration & Email Verification', 'Role-Based Access Control (RBAC)'],
        ecommerce_features: ['Cashfree Instant Billing / Invoicing']
      },
      deployment: {
        cloud_provider: 'Serverbyt Cloud StackCP / Docker Containers'
      }
    } as any
  };

  console.log('Testing generateComprehensiveSpecPackage directly...');
  try {
    const result = await generateComprehensiveSpecPackage(sampleProject, 'gpt-5.6-sol', (log) => {
      console.log(`[LOG] ${log.type}: ${log.title}`);
    });
    console.log('✓ SUCCESS! Result keys:', Object.keys(result.specsHierarchy).length);
  } catch (err: any) {
    console.error('❌ FAILED with error:', err);
  }
}

testDirect();

