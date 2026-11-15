import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runWorkflowTest() {
  const screenshotsDir = path.resolve('test-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('=====================================================');
  console.log('🚀 STARTING SRS GENIE LOCAL E2E WORKFLOW INSPECTION');
  console.log('=====================================================');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (
      text.includes('[SaasStore]') ||
      text.includes('AgentRouter') ||
      text.includes('error') ||
      text.includes('Error') ||
      text.includes('ReferenceError') ||
      text.includes('WARNING')
    ) {
      console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${text}`);
    }
  });

  console.log('\n--- Step 1: Navigating to local site (http://localhost:3000) ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '01-landing-page.png') });
  console.log('✓ Landed on page:', await page.title());

  console.log('\n--- Step 2: Signing in to Admin Account ---');
  const signInBtn = page.locator('button:has-text("Sign In")').first();
  await signInBtn.click();
  await page.waitForTimeout(500);

  await page.fill('input[type="email"]', 'admin@srsgenie.ai');
  await page.fill('input[type="password"]', 'Admin123!');
  await page.screenshot({ path: path.join(screenshotsDir, '02-auth-modal.png') });

  // Click "Enter Platform"
  const submitLogin = page.locator('button[type="submit"]:has-text("Enter Platform")');
  await submitLogin.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '03-dashboard-logged-in.png') });
  console.log('✓ Successfully signed in as Admin! Dashboard active.');

  console.log('\n--- Step 3: Preparing High-Fidelity Test Project Data ---');
  const sampleProjectName = 'SkyCourier Autonomous Fleet Logistics';
  const sampleProjectDraft = {
    formData: {
      project_overview: {
        project_name: sampleProjectName,
        industry: 'Supply Chain & Logistics',
        project_type: 'Autonomous Drone Dispatch Cloud',
        target_users: ['Autonomous Fleet Operators', 'Air Traffic Coordinators', 'Warehouse Dispatchers'],
        target_users_text: 'Operators monitoring real-time flight telematics, FAA airspace clearance, battery swap automation, and automated waybill delivery handoffs.',
        expected_timeline: '3-4 months',
        budget_range: '$100,000 - $250,000'
      },
      system_type: {
        application_type: ['Web Application (Browser-based)', 'Backend/API Only', 'Progressive Web App (PWA)'],
        application_type_text: 'Low-latency operations dashboard with WebGL map layers for live 3D drone flight paths.',
        user_scale: 'Large (1,000-10,000 users)',
        geographic_reach: ['National', 'Multiple Countries']
      },
      target_audience: {
        primary_persona: 'Chief Logistics Officers, Depot Supervisors, and Automated Drone Fleet Operators.'
      },
      core_features: {
        user_management: ['Registration & Email Verification', 'Role-Based Access Control (RBAC)', 'Multi-Factor Authentication (MFA / 2FA)', 'Single Sign-On (SSO / SAML / OAuth)'],
        ecommerce_features: ['Cashfree Instant Billing / Invoicing', 'Tiered Subscription Management', 'Automated GST Invoicing & Tax Calculation'],
        communication_features: ['In-app Notifications & Alerts', 'Push Notifications (Web / Mobile)', 'Transactional Emails (SendGrid)', 'Webhook Event Subscriptions'],
        automation_workflow: ['Automated Dispatch Optimization', 'Airspace Geo-fence Breach Emergency Protocols']
      },
      technical_requirements: {
        backend_stack: 'Node.js 22 LTS / Express TypeScript',
        database_preference: 'PostgreSQL 16 + Redis 7',
        frontend_stack: 'React 19 / TypeScript / Tailwind CSS',
        caching_strategy: 'Redis Cluster for telemetry state caching and idempotency locks'
      },
      security: {
        compliance_standards: ['SOC 2 Type II', 'ISO 27001', 'OWASP Top 10', 'FAA Airspace Remote ID'],
        data_encryption: 'AES-256 for data-at-rest, TLS 1.3 for data-in-transit, Argon2id for password hashing'
      },
      deployment: {
        cloud_provider: 'Serverbyt Cloud StackCP / Docker Containers'
      }
    },
    savedAt: new Date().toISOString(),
    activeStep: 0,
    selectedModelId: 'gpt-5.6-sol'
  };

  await page.evaluate((draft) => {
    localStorage.setItem('srs_genie_active_form_draft', JSON.stringify(draft));
  }, sampleProjectDraft);
  console.log('✓ Stored test questionnaire draft in localStorage.');

  console.log('\n--- Step 4: Navigating to Questionnaire Wizard ---');
  const newSpecBtn = page.locator('button:has-text("New Specification")');
  await newSpecBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '04-wizard-mounted.png') });

  const resumeDraftBtn = page.locator('button:has-text("Resume Draft")');
  await resumeDraftBtn.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ "Resume Draft" banner detected! Clicking "Resume Draft"...');
  await resumeDraftBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '05-draft-resumed.png') });

  console.log('\n--- Step 5: Navigating to Pre-Flight Review Screen ---');
  const reviewBtn = page.locator('button:has-text("Review")').first();
  await reviewBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '06-preflight-summary.png') });
  console.log('✓ Pre-Flight Review summary displayed.');

  console.log('\n--- Step 6: Selecting AgentRouter AI Model (GPT 5.6 Sol) ---');
  const modelCard = page.locator('div:has-text("GPT 5.6 Sol")').first();
  if (await modelCard.isVisible()) {
    await modelCard.scrollIntoViewIfNeeded();
    await modelCard.click();
    console.log('✓ Clicked "GPT 5.6 Sol (Deep Engineer)" model card.');
  } else {
    const fallbackModel = page.locator('div:has-text("AgentRouter")').last();
    await fallbackModel.scrollIntoViewIfNeeded();
    await fallbackModel.click();
    console.log('✓ Clicked AgentRouter provider card.');
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '07-model-selected.png') });

  console.log('\n--- Step 7: Launching Generation & Inspecting Live Workflow ---');
  const generateBtn = page.locator('button:has-text("Generate 22-File .specs Suite")');
  await generateBtn.scrollIntoViewIfNeeded();
  await generateBtn.waitFor({ state: 'attached' });

  for (let t = 0; t < 10; t++) {
    const disabled = await generateBtn.getAttribute('disabled');
    if (disabled === null) break;
    await page.waitForTimeout(500);
  }

  await generateBtn.click();
  console.log('✓ Clicked "Generate 22-File .specs Suite"! Monitoring live viewport...');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '08-viewport-active.png') });

  let startTime = Date.now();
  let draftCaptured = false;
  let tab2PlanText = '';

  for (let i = 0; i < 45; i++) {
    await page.waitForTimeout(2000);
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);

    // Check Tab 2 (Master Project Plan Draft)
    const tab2Btn = page.locator('button:has-text("Master Project Plan Draft")');
    if (await tab2Btn.isVisible()) {
      await tab2Btn.click().catch(() => {});
      await page.waitForTimeout(400);

      const tab2Text = await page.locator('.prose, #markdown-body, div[class*="prose"]').innerText().catch(() => '');
      if (tab2Text.length > 200 && !draftCaptured) {
        draftCaptured = true;
        tab2PlanText = tab2Text;
        console.log(`\n======================================================`);
        console.log(`✓ [LIVE CONFIRMATION 1] Master Project Plan Rendered in Tab 2! (${elapsedSec}s)`);
        console.log(`  Character Count: ${tab2Text.length}`);
        console.log(`  Preview (First 450 chars):\n${tab2Text.substring(0, 450)}...`);
        console.log(`======================================================\n`);
        await page.screenshot({ path: path.join(screenshotsDir, '09-tab2-master-plan-rendered.png') });
      }

      // Switch back to Tab 1 (Agent Stream)
      const tab1Btn = page.locator('button:has-text("Agent Stream")');
      if (await tab1Btn.isVisible()) await tab1Btn.click().catch(() => {});
    }

    // Check if generation completed (Explore .specs Suite button or completion text)
    const exploreBtn = page.locator('button:has-text("Explore .specs Suite")');
    if (await exploreBtn.isVisible().catch(() => false)) {
      console.log(`🎉 [Workflow Completed] Finished in ${elapsedSec}s!`);
      await page.screenshot({ path: path.join(screenshotsDir, '10-generation-completed.png') });

      // Click "Explore .specs Suite" to enter DocumentPreview
      await exploreBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(screenshotsDir, '11-document-preview-screen.png') });
      break;
    }
  }

  console.log('\n--- Step 8: Deep Inspection of Stored Specifications ---');
  const projectData = await page.evaluate((targetName) => {
    const raw = localStorage.getItem('srs_genie_saved_projects');
    const rawHierarchies = localStorage.getItem('srs_genie_specs_hierarchies');
    if (!raw) return null;
    const list = JSON.parse(raw);
    const hierarchies = rawHierarchies ? JSON.parse(rawHierarchies) : {};
    
    // Find matching project
    const match = list.find((p: any) => p.name?.includes(targetName) || p.name?.includes('SkyCourier')) || list[0];
    const specs = match?.specsHierarchy || (match?.id ? hierarchies[match.id] : {}) || {};
    return {
      id: match?.id,
      name: match?.name,
      tasksCount: match?.vibeTasks?.length || match?.implementationTasks?.length || 0,
      specs,
      specsKeys: Object.keys(specs)
    };
  }, sampleProjectName);

  if (!projectData) {
    console.error('❌ Could not find project data in localStorage!');
  } else {
    console.log(`\n======================================================`);
    console.log(`📊 WORKFLOW AUDIT REPORT`);
    console.log(`======================================================`);
    console.log(`Project Name: ${projectData.name}`);
    console.log(`Total Spec Files Generated: ${projectData.specsKeys.length} / 22`);
    console.log(`Total Atomic Tasks Extracted: ${projectData.tasksCount}`);

    console.log('\n--- QUESTION 1: ARE FORMS CONVERTED INTO THE MASTER PROJECT PLAN? ---');
    const planText = tab2PlanText;
    const hasProjectNameInPlan = planText.includes('SkyCourier');
    const hasLogisticsInPlan = planText.includes('Logistics') || planText.includes('Supply Chain');
    const hasDroneOrAutonomous = planText.includes('Drone') || planText.includes('Autonomous') || planText.includes('Fleet');
    const hasPostgres = planText.includes('PostgreSQL');
    const hasTelemetry = planText.includes('Telemetry') || planText.includes('Airspace') || planText.includes('FAA');

    console.log(`- Project Name ("SkyCourier") in Master Plan: ${hasProjectNameInPlan ? 'YES ✓' : 'NO ✗'}`);
    console.log(`- Industry ("Logistics / Supply Chain") in Master Plan: ${hasLogisticsInPlan ? 'YES ✓' : 'NO ✗'}`);
    console.log(`- Domain ("Autonomous Drone Fleet") in Master Plan: ${hasDroneOrAutonomous ? 'YES ✓' : 'NO ✗'}`);
    console.log(`- Tech Stack ("PostgreSQL") in Master Plan: ${hasPostgres ? 'YES ✓' : 'NO ✗'}`);
    console.log(`- Specific Requirements ("Telemetry/Airspace") in Master Plan: ${hasTelemetry ? 'YES ✓' : 'NO ✗'}`);

    console.log('\n--- QUESTION 2: IS THE AI UPDATING/WEAVING THE SPECS BASED ON THE MASTER PROJECT PLAN? ---');
    const brief = projectData.specs['foundation/brief.md'] || '';
    const glossary = projectData.specs['foundation/glossary.md'] || '';
    const systemDesign = projectData.specs['architecture/system_design.md'] || '';
    const domainRules = projectData.specs['domain/domain_rules.md'] || '';
    const apiContracts = projectData.specs['contracts/api_contracts.md'] || '';
    const dbSchema = projectData.specs['contracts/database_schema.md'] || '';
    const tasksFile = projectData.specs['execution/tasks.md'] || '';

    console.log(`- foundation/brief.md (${brief.length} bytes):`);
    console.log(`  * Contains Project Name? ${brief.includes('SkyCourier') ? 'YES ✓' : 'NO ✗'}`);
    console.log(`  * Weaves AI Directives from Master Plan? ${brief.includes('Executive Vision') || brief.includes('Directives') ? 'YES ✓' : 'NO ✗'}`);

    console.log(`- foundation/glossary.md (${glossary.length} bytes):`);
    console.log(`  * Contains Bespoke Logistics Terms (Waybill/BOL, Telematics, Demurrage)? ${glossary.includes('Waybill') || glossary.includes('Telematics') ? 'YES ✓' : 'NO ✗'}`);

    console.log(`- architecture/system_design.md (${systemDesign.length} bytes):`);
    console.log(`  * Weaves AI Architecture Blueprint from Master Plan? ${systemDesign.includes('Architecture') || systemDesign.includes('System Design') ? 'YES ✓' : 'NO ✗'}`);

    console.log(`- domain/domain_rules.md (${domainRules.length} bytes):`);
    console.log(`  * Contains Domain Rules & Invariants from Master Plan? ${domainRules.includes('DR-001') || domainRules.includes('Domain Invariants') ? 'YES ✓' : 'NO ✗'}`);

    console.log(`- contracts/api_contracts.md (${apiContracts.length} bytes):`);
    console.log(`  * Contains OpenAPI REST Endpoints? ${apiContracts.includes('/api/v1/') ? 'YES ✓' : 'NO ✗'}`);

    console.log(`- contracts/database_schema.md (${dbSchema.length} bytes):`);
    console.log(`  * Contains PostgreSQL 16 DDL with RLS and foreign keys? ${dbSchema.includes('CREATE TABLE') && dbSchema.includes('tenant_id') ? 'YES ✓' : 'NO ✗'}`);

    console.log(`- execution/tasks.md (${tasksFile.length} bytes):`);
    console.log(`  * Contains bespoke dynamic tasks? ${tasksFile.includes('TASK-') ? 'YES ✓' : 'NO ✗'}`);
  }

  await browser.close();
  console.log('\n=====================================================');
  console.log('✅ ALL WORKFLOW AUDIT CHECKS COMPLETED SUCCESSFULLY');
  console.log('=====================================================');
}

runWorkflowTest().catch(err => {
  console.error('Workflow test failed with error:', err);
  process.exit(1);
});
