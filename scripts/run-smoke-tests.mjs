#!/usr/bin/env node
/**
 * SRS Genie - Automated Smoke & Integrity Test Suite
 * Validates spec hierarchies, PHP API endpoints, IDE rules, and TypeScript soundness.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('=====================================================');
console.log('🧪 RUNNING SRS GENIE AUTOMATED SMOKE TESTS');
console.log('=====================================================\n');

// 1. Verify Core Server API Endpoints
console.log('[Suite 1: Backend PHP API Gateways]');
const expectedApiFiles = [
  'public/api/mcp.php',
  'public/api/auth.php',
  'public/api/projects.php',
  'public/api/saas.php',
  'public/api/cashfree.php',
  'public/api/license.php',
  'public/api/license_check.php',
  'public/api/health.php',
  'public/api/db.php'
];

for (const rel of expectedApiFiles) {
  const full = path.join(rootDir, rel);
  assert(fs.existsSync(full), `Endpoint exists: ${rel}`);
}

// 2. Verify Apache .htaccess Routing
console.log('\n[Suite 2: Apache Routing Integrity]');
const htaccessContent = fs.readFileSync(path.join(rootDir, 'public/.htaccess'), 'utf8');
assert(htaccessContent.includes('RewriteRule ^api/mcp(/.*)?$ api/mcp.php'), 'Route ^api/mcp configured in public/.htaccess');
assert(htaccessContent.includes('RewriteRule ^api/license(/.*)?$ api/license.php'), 'Route ^api/license configured in public/.htaccess');
assert(htaccessContent.includes('RewriteRule ^api/projects(/.*)?$ api/projects.php'), 'Route ^api/projects configured in public/.htaccess');

// 3. Verify Canonical System 2 .specs Hierarchy & Universal Manifest
console.log('\n[Suite 3: Canonical System 2 .specs Hierarchy & Universal Manifest]');
const agentsManifest = path.join(rootDir, 'AGENTS.md');
assert(fs.existsSync(agentsManifest) && fs.statSync(agentsManifest).size > 50, 'Universal agent manifest verified: AGENTS.md');

const specsDir = path.join(rootDir, '.specs');
assert(fs.existsSync(specsDir), '.specs root directory exists');
const criticalSpecFiles = [
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

for (const f of criticalSpecFiles) {
  const p = path.join(specsDir, f);
  assert(fs.existsSync(p) && fs.statSync(p).size > 50, `Canonical spec verified: .specs/${f}`);
}

// 4. Verify TypeScript Compilation Soundness
console.log('\n[Suite 4: TypeScript Soundness]');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe', encoding: 'utf8' });
  assert(true, 'TypeScript typecheck (tsc --noEmit) passed with 0 errors');
} catch (err) {
  assert(false, `TypeScript compilation failed: ${err.stdout || err.message}`);
}

console.log('\n=====================================================');
console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('=====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
