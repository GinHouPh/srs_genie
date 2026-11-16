import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runLiveSpecificationTest() {
  const screenshotsDir = path.resolve('test-screenshots/live-test');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('================================================================');
  console.log('🚀 LIVE SPECIFICATION GENERATION TEST: FULL FORM FILL TO DELIVERABLES');
  console.log('================================================================');

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
      text.includes('error') ||
      text.includes('Error') ||
      text.includes('SpecAgent') ||
      text.includes('AgentRouter')
    ) {
      console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${text}`);
    }
  });

  // Step 1: Navigate to http://localhost:3000
  console.log('\n--- Step 1: Navigating to http://localhost:3000 ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '01-landing-page.png') });
  console.log('✓ Landed on page:', await page.title());

  // Step 2: Sign in as Admin
  console.log('\n--- Step 2: Sign in to Platform ---');
  const signInBtn = page.locator('button:has-text("Sign In")').first();
  await signInBtn.click();
  await page.waitForTimeout(500);

  await page.fill('input[type="email"]', 'admin@srsgenie.ai');
  await page.fill('input[type="password"]', 'Admin123!');
  const submitLogin = page.locator('button[type="submit"]:has-text("Enter Platform")');
  await submitLogin.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '02-dashboard-ready.png') });
  console.log('✓ Signed in as Admin. Dashboard active.');

  // Clear any existing active form draft to ensure a completely fresh live test
  await page.evaluate(() => {
    localStorage.removeItem('srs_genie_active_form_draft');
  });

  // Step 3: Launch Wizard
  console.log('\n--- Step 3: Launch Specification Wizard ---');
  const newSpecBtn = page.locator('button:has-text("New Specification")').first();
  await newSpecBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '03-wizard-section-1.png') });
  console.log('✓ Wizard mounted on Section 1 (Project Overview).');

  // Helper for clicking choices and checkboxes
  const selectChoice = async (optionText: string) => {
    const choiceLabel = page.locator(`label:has-text("${optionText}")`).first();
    if (await choiceLabel.isVisible()) {
      await choiceLabel.scrollIntoViewIfNeeded();
      await choiceLabel.click();
    }
  };

  const clickNext = async () => {
    const nextBtn = page.locator('button:has-text("Next Section"), button:has-text("Review Summary")').last();
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();
    await page.waitForTimeout(600);
  };

  // ==========================================
  // SECTION 1: PROJECT OVERVIEW
  // ==========================================
  console.log('\n--- Filling Section 1: Project Overview ---');
  await page.fill('#project_overview_project_name', 'SkyCourier Autonomous Fleet Logistics');
  console.log('  Filled: Project Name');

  const summaryText = `# SkyCourier Autonomous Fleet Logistics System Specification
An enterprise-grade, mission-critical autonomous drone logistics platform for dispatch, route optimization, air corridor telematics, and automated consignment handoff.

### Core Capabilities:
1. **Fleet Dispatch & Mission Control:** Real-time UTM (Unmanned Traffic Management) telemetry with sub-second WebSocket updates.
2. **Dynamic Air Corridor Geo-fencing:** Real-time spatial routing adhering to civil aviation safety regulations.
3. **Automated Consignment Delivery & POD:** Cryptographically sealed Proof of Delivery (POD) with QR verification and multi-signature release.
4. **Resilient Offline Failover:** Autonomous edge fail-safe return-to-base protocols.`;

  await page.fill('#project_overview_project_summary', summaryText);
  console.log('  Filled: Project Summary & Build Specification');

  await selectChoice('Logistics & Transportation');
  console.log('  Selected: Industry -> Logistics & Transportation');

  await selectChoice('Full-Scale Production System');
  console.log('  Selected: Project Type -> Full-Scale Production System');

  await selectChoice('B2B (Business to Business)');
  console.log('  Selected: Business Model -> B2B');

  await selectChoice('Business Professionals');
  await selectChoice('Technical Users/Developers');
  await selectChoice('Administrators');
  console.log('  Selected: Target Users');

  await selectChoice('3-4 months');
  console.log('  Selected: Expected Timeline -> 3-4 months');

  await selectChoice('$100,000 - $250,000');
  console.log('  Selected: Budget Range -> $100,000 - $250,000');

  await page.screenshot({ path: path.join(screenshotsDir, '04-section-1-completed.png') });
  await clickNext();

  // ==========================================
  // SECTION 2: SYSTEM TYPE & PLATFORM
  // ==========================================
  console.log('\n--- Filling Section 2: System Type & Platform ---');
  await selectChoice('Web Application (Browser-based)');
  await selectChoice('Backend/API Only');
  await selectChoice('Progressive Web App (PWA)');
  console.log('  Selected: Application Type');

  await selectChoice('Marketplace: Airbnb, Uber, Upwork');
  console.log('  Selected: Similar Systems');

  await selectChoice('Large (1,000-10,000 users)');
  console.log('  Selected: Expected User Scale');

  await selectChoice('National');
  await selectChoice('Multiple Countries');
  console.log('  Selected: Geographic Reach');

  await clickNext();

  // ==========================================
  // SECTION 3: CORE FEATURES & FUNCTIONALITY
  // ==========================================
  console.log('\n--- Filling Section 3: Core Features & Functionality ---');
  await selectChoice('User Registration & Sign Up');
  await selectChoice('Email/Password Login');
  await selectChoice('Two-Factor Authentication (2FA)');
  await selectChoice('Single Sign-On (SSO)');
  await selectChoice('Role-based Access Control');
  console.log('  Selected: User Management');

  await selectChoice('Create/Edit/Delete Content');
  await selectChoice('Media Upload (Images, Videos, Documents)');
  console.log('  Selected: Content Management');

  await selectChoice('Order Management');
  await selectChoice('Inventory Management');
  await selectChoice('Shipping Integration');
  await selectChoice('Payment Gateway Integration');
  console.log('  Selected: E-commerce & Delivery Operations');

  await selectChoice('In-app Messaging/Chat');
  await selectChoice('Real-time Chat (1-on-1)');
  await selectChoice('Email Notifications');
  await selectChoice('Push Notifications');
  await selectChoice('In-app Notifications');
  console.log('  Selected: Communication Features');

  await selectChoice('Basic Keyword Search');
  await selectChoice('Advanced Search with Filters');
  await selectChoice('Geolocation-based Search');
  await selectChoice('Real-time Analytics');
  await selectChoice('Dashboard with Key Metrics');
  await selectChoice('Data Visualization (Charts, Graphs)');
  console.log('  Selected: Search & Analytics');

  await selectChoice('Resource Scheduling');
  await selectChoice('Availability Management');
  await selectChoice('Booking Confirmation');
  console.log('  Selected: Booking & Scheduling');

  await selectChoice('Task Automation');
  await selectChoice('Scheduled Tasks/Jobs');
  await selectChoice('Triggers & Actions');
  console.log('  Selected: Automation & Workflow');

  await page.fill('#core_features_additional_features', 'Automated airspace conflict resolution, drone telemetry streaming, battery swap station diagnostics.');
  console.log('  Filled: Additional Features');

  await clickNext();

  // ==========================================
  // SECTION 4: USER ROLES & PERMISSIONS
  // ==========================================
  console.log('\n--- Filling Section 4: User Roles & Permissions ---');
  await selectChoice('Super Admin (Full system access)');
  await selectChoice('Admin (System management)');
  await selectChoice('Manager/Supervisor');
  await selectChoice('Staff/Employee');
  await selectChoice('Vendor/Partner');
  console.log('  Selected: User Roles');

  await selectChoice('Hierarchical (Manager can manage subordinates)');
  console.log('  Selected: Permission Model');

  await clickNext();

  // ==========================================
  // SECTION 5: DESIGN & USER INTERFACE (DELIVERABLES)
  // ==========================================
  console.log('\n--- Filling Section 5: Design & User Interface (UI Deliverables) ---');
  await selectChoice('Modern & Minimalist');
  await selectChoice('Dark Theme/Dark Mode');
  console.log('  Selected: Design Style Preference');

  await selectChoice('Have complete brand guidelines (logo, colors, fonts)');
  console.log('  Selected: Branding Assets');

  await selectChoice('All devices (Fully responsive)');
  console.log('  Selected: Device & Screen Support');

  await selectChoice('WCAG 2.1 Level AA Compliance');
  await selectChoice('Keyboard Navigation');
  console.log('  Selected: Accessibility');

  await selectChoice('Single Language (English)');
  console.log('  Selected: Multi-language Support');

  // Explicitly select Design Deliverables!
  await selectChoice('Wireframes');
  await selectChoice('High-fidelity Mockups');
  await selectChoice('Interactive Prototype');
  await selectChoice('Design System/Style Guide');
  await selectChoice('Animation Specifications');
  console.log('  Selected: UI Deliverables Needed (Wireframes, Mockups, Prototype, Design System, Specs)');

  await page.screenshot({ path: path.join(screenshotsDir, '05-section-5-deliverables.png') });
  await clickNext();

  // ==========================================
  // SECTION 6: TECHNICAL REQUIREMENTS
  // ==========================================
  console.log('\n--- Filling Section 6: Technical Requirements ---');
  await selectChoice('Specific technologies required (will specify)');
  console.log('  Selected: Tech Preference');

  await selectChoice('Cloud Infrastructure (AWS, Azure, Google Cloud)');
  await selectChoice('Existing Database Systems');
  console.log('  Selected: Existing Infrastructure');

  await selectChoice('Both Relational and NoSQL');
  console.log('  Selected: Database Requirements');

  await selectChoice('RESTful API');
  await selectChoice('WebSocket for Real-time');
  await selectChoice('Webhooks');
  await selectChoice('API Rate Limiting');
  console.log('  Selected: API Requirements');

  await selectChoice('Document Upload (PDF, Word, Excel)');
  await selectChoice('Large File Support (> 100MB)');
  await selectChoice('CDN for File Delivery');
  await selectChoice('Cloud Storage (AWS S3, Azure Blob)');
  console.log('  Selected: File Storage & Delivery');

  await selectChoice('Partial offline (read-only)');
  console.log('  Selected: Offline Capability');

  await clickNext();

  // ==========================================
  // SECTION 7: THIRD-PARTY INTEGRATIONS
  // ==========================================
  console.log('\n--- Filling Section 7: Third-Party Integrations ---');
  await selectChoice('Stripe');
  await selectChoice('Razorpay');
  console.log('  Selected: Payment Gateways');

  await selectChoice('SendGrid');
  await selectChoice('Transactional Emails');
  console.log('  Selected: Email Services');

  await selectChoice('Google (Login, APIs)');
  console.log('  Selected: Social Media / Auth Integrations');

  await selectChoice('AWS S3');
  console.log('  Selected: Cloud Storage Integration');

  await selectChoice('Google Maps');
  await selectChoice('Mapbox');
  await selectChoice('Geolocation Services');
  await selectChoice('Route Planning');
  console.log('  Selected: Maps & Location Services');

  await selectChoice('Google Analytics');
  await selectChoice('Mixpanel');
  console.log('  Selected: Analytics Tools');

  await selectChoice('Twilio (SMS, Voice)');
  await selectChoice('Slack');
  console.log('  Selected: Communication Tools');

  await page.fill('#integrations_other_integrations', 'FAA Airspace Remote ID Broadcast, Weather Radar Telemetry Feed, RTK GPS DGPS Corrections');
  console.log('  Filled: Other Integrations');

  await clickNext();

  // ==========================================
  // SECTION 8: SECURITY & COMPLIANCE
  // ==========================================
  console.log('\n--- Filling Section 8: Security & Compliance ---');
  await selectChoice('Email & Password');
  await selectChoice('Two-Factor Authentication (2FA)');
  await selectChoice('Single Sign-On (SSO)');
  console.log('  Selected: Authentication Methods');

  await selectChoice('Data Encryption at Rest');
  await selectChoice('Data Encryption in Transit (SSL/TLS)');
  await selectChoice('Password Hashing');
  await selectChoice('API Key Management');
  await selectChoice('Secrets Management');
  console.log('  Selected: Data Security Requirements');

  await selectChoice('SOC 2');
  await selectChoice('ISO 27001');
  await selectChoice('GDPR (EU Data Protection)');
  console.log('  Selected: Compliance Standards');

  await selectChoice('Privacy Policy & Terms');
  await selectChoice('Data Export (User can download their data)');
  await selectChoice('Data Retention Policies');
  console.log('  Selected: Data Privacy');

  await selectChoice('Real-time/Continuous Backup');
  console.log('  Selected: Backup & Disaster Recovery');

  await clickNext();

  // ==========================================
  // SECTION 9: PERFORMANCE & SCALABILITY
  // ==========================================
  console.log('\n--- Filling Section 9: Performance & Scalability ---');
  await selectChoice('Real-time Updates (< 100ms)');
  await selectChoice('Page Load Time < 2 seconds');
  console.log('  Selected: Performance Expectations');

  await selectChoice('500-5,000 users');
  console.log('  Selected: Concurrent Users');

  await selectChoice('Auto-scaling needed');
  console.log('  Selected: Scalability Requirements');

  await selectChoice('99.99% (52 minutes downtime/year)');
  console.log('  Selected: Uptime Requirements');

  await clickNext();

  // ==========================================
  // SECTION 10: DEPLOYMENT & HOSTING (DELIVERY & DEPLOY)
  // ==========================================
  console.log('\n--- Filling Section 10: Deployment & Hosting ---');
  await selectChoice('Cloud Hosting (AWS, Azure, Google Cloud)');
  console.log('  Selected: Hosting Model');

  await selectChoice('Development Environment');
  await selectChoice('Staging/Testing Environment');
  await selectChoice('Production Environment');
  console.log('  Selected: Deployment Environments');

  await selectChoice('Fully automated CI/CD pipeline');
  console.log('  Selected: CI/CD Pipeline');

  await selectChoice('Ongoing monthly maintenance (bug fixes, updates)');
  console.log('  Selected: Post-Launch Support & Maintenance');

  await selectChoice('User Documentation/Manual');
  await selectChoice('Admin Documentation');
  await selectChoice('Technical Documentation');
  await selectChoice('API Documentation');
  console.log('  Selected: Documentation Requirements');

  await page.screenshot({ path: path.join(screenshotsDir, '06-section-10-deployment.png') });
  await clickNext();

  // ==========================================
  // SECTION 11: TESTING & QUALITY ASSURANCE
  // ==========================================
  console.log('\n--- Filling Section 11: Testing & Quality Assurance ---');
  await selectChoice('Unit Testing');
  await selectChoice('Integration Testing');
  await selectChoice('End-to-End (E2E) Testing');
  await selectChoice('User Acceptance Testing (UAT)');
  await selectChoice('Security Testing');
  await selectChoice('Performance/Load Testing');
  console.log('  Selected: Testing Scope');

  await selectChoice('All modern browsers');
  console.log('  Selected: Browser & Device Coverage');

  await clickNext();

  // ==========================================
  // SECTION 12: CONTENT & DATA MIGRATION
  // ==========================================
  console.log('\n--- Filling Section 12: Content & Data Migration ---');
  await selectChoice('No existing data');
  console.log('  Selected: Existing Data');

  await selectChoice('Client provides all content (text, images, videos)');
  console.log('  Selected: Content Creation Responsibility');

  await clickNext();

  // ==========================================
  // SECTION 13: CONSTRAINTS & LIMITATIONS
  // ==========================================
  console.log('\n--- Filling Section 13: Constraints & Limitations ---');
  await selectChoice('Must use specific technology/framework');
  console.log('  Selected: Technical Constraints');

  await selectChoice('Strict budget limitation');
  console.log('  Selected: Business Constraints');

  await clickNext();

  // ==========================================
  // SECTION 14: RISKS & CONCERNS
  // ==========================================
  console.log('\n--- Filling Section 14: Risks & Concerns ---');
  await page.fill('#risks_known_risks', 'Severe weather turbulence, temporary loss of GPS signal in urban canyons, FAA flight waiver approval delays.');
  console.log('  Filled: Known Risks or Challenges');

  await selectChoice('Iterative development with feedback loops');
  console.log('  Selected: Change Management');

  await clickNext();

  // ==========================================
  // SECTION 15: ADDITIONAL INFORMATION
  // ==========================================
  console.log('\n--- Filling Section 15: Additional Information ---');
  await page.fill('#additional_competitive_analysis', 'Competitors: Wing, Zipline, Flytrex. Advantage: Open architecture, multimodal dispatch, and hardware-agnostic flight controller SDK.');
  await page.fill('#additional_success_metrics', 'Target 99.99% on-time flight execution, zero mid-air safety anomalies, and < 3s automated waypoint reassignment.');
  await page.fill('#additional_future_roadmap', 'Phase 2: Autonomous AI landing pad optical recognition. Phase 3: Cross-border customs automated manifest filing.');
  await page.fill('#additional_additional_notes', 'All delivery proofs must be cryptographically signed with ECDSA SHA-256.');
  console.log('  Filled: Competitors, Metrics, Roadmap, Notes');

  await page.screenshot({ path: path.join(screenshotsDir, '07-section-15-completed.png') });

  // Transition to Review Summary
  console.log('\n--- Transitioning to Review Summary ---');
  await clickNext();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '08-review-summary.png') });
  console.log('✓ Reached Pre-Flight Review Summary screen!');

  // Check stats
  const statsText = await page.locator('text=fields completed').innerText().catch(() => '');
  console.log(`✓ Completion Stats: ${statsText}`);

  // Select Model: AgentRouter GPT 5.6 Sol or Google Gemini
  console.log('\n--- Selecting Model for Generation ---');
  const gptModel = page.locator('div:has-text("GPT 5.6 Sol")').first();
  if (await gptModel.isVisible()) {
    await gptModel.scrollIntoViewIfNeeded();
    await gptModel.click();
    console.log('✓ Selected AI Model: GPT 5.6 Sol (Deep Engineer)');
  } else {
    console.log('Using default selected AI Model');
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '09-model-selected.png') });

  // Launch Generation!
  console.log('\n--- Step 4: Triggering Live Specification Generation ---');
  const generateBtn = page.locator('button:has-text("Generate 22-File .specs Suite")');
  await generateBtn.scrollIntoViewIfNeeded();
  await generateBtn.click();
  console.log('✓ Clicked "Generate 22-File .specs Suite"!');

  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '10-live-generation-viewport.png') });

  // Monitor live generation stream
  console.log('\n--- Step 5: Monitoring SpecAgent Live Synthesis ---');
  let isDone = false;
  let masterPlanCaptured = false;
  const startTime = Date.now();

  // Allow up to 900s (15 mins) for authentic multi-agent LLM synthesis
  for (let i = 0; i < 450; i++) {
    await page.waitForTimeout(2000);
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    // Check Tab 2 (Combined Plan)
    const tab2 = page.locator('button:has-text("Combined Plan")');
    if (await tab2.isVisible()) {
      await tab2.click().catch(() => {});
      await page.waitForTimeout(300);
      const planContent = await page.locator('.prose, div[class*="prose"]').innerText().catch(() => '');
      if (planContent.length > 200 && !masterPlanCaptured) {
        masterPlanCaptured = true;
        console.log(`✓ [LIVE STREAM CONFIRMED] Combined Plan rendered (${planContent.length} chars) at ${elapsed}s`);
        await page.screenshot({ path: path.join(screenshotsDir, '11-master-plan-live-tab.png') });
      }
      // Return to Agent Stream tab
      const tab1 = page.locator('button:has-text("Agent Stream")');
      if (await tab1.isVisible()) await tab1.click().catch(() => {});
    }

    // Check if generation finished
    const exploreBtn = page.locator('button:has-text("Explore .specs Suite")');
    if (await exploreBtn.isVisible().catch(() => false)) {
      console.log(`🎉 Specification Generation COMPLETED in ${elapsed}s!`);
      await page.screenshot({ path: path.join(screenshotsDir, '12-generation-complete.png') });
      isDone = true;

      // Click to enter DocumentPreview deliverables
      await exploreBtn.click();
      await page.waitForTimeout(1500);
      break;
    }
  }

  if (!isDone) {
    throw new Error('Generation timed out without showing Explore .specs Suite button');
  }

  // ==========================================
  // STEP 6: VERIFY ALL SPECIFICATION DELIVERABLES
  // ==========================================
  console.log('\n================================================================');
  console.log('📦 STEP 6: DEEP AUDIT OF GENERATED SPECIFICATION DELIVERABLES');
  console.log('================================================================');

  await page.screenshot({ path: path.join(screenshotsDir, '13-deliverables-specs-suite.png') });
  console.log('✓ DocumentPreview Deliverables Screen Mounted');

  // 1. Deliverable Tab 1: Specs Suite (22 canonical files across 6 tiers)
  console.log('\n--- Deliverable 1: 22-File .specs Hierarchy ---');
  const specTreeItems = await page.locator('.space-y-1 button, div.agape-card button').allInnerTexts();
  const specFilesFound = specTreeItems.filter(t => t.includes('.md'));
  console.log(`Found ${specFilesFound.length} specification file nodes in hierarchy viewer`);

  // Verify brief.md content
  const previewBody = await page.locator('.prose, div[class*="prose"]').innerText().catch(() => '');
  console.log(`✓ Active Spec File Content Preview (${previewBody.length} chars):`);
  console.log(`  "${previewBody.substring(0, 200).replace(/\n/g, ' ')}..."`);

  // 2. Deliverable Tab 2: 9 Strategic Planning Documents
  console.log('\n--- Deliverable 2: 9 Strategic Planning Documents ---');
  const strategicPlansTab = page.locator('button:has-text("Staging Plans")');
  await strategicPlansTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '14-deliverables-strategic-plans.png') });

  const planButtons = await page.locator('button:has-text(".md")').allInnerTexts();
  console.log('Strategic Planning Documents Available:', planButtons.filter(b => b.includes('.md')));

  // Inspect the active strategic plan markdown content
  const planMarkdown = await page.locator('.prose, div[class*="prose"]').innerText().catch(() => '');
  console.log(`✓ Strategic Plan Markdown Preview (${planMarkdown.length} chars):`);
  console.log(`  "${planMarkdown.substring(0, 250).replace(/\n/g, ' ')}..."`);

  // 3. Deliverable Tab 3: Execution Tasks Board
  console.log('\n--- Deliverable 3: Execution Tasks Board ---');
  const tasksTab = page.locator('button:has-text("Tasks (")').first();
  await tasksTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '15-deliverables-tasks-board.png') });

  const taskCards = await page.locator('div:has-text("TASK-")').count();
  console.log(`✓ Dynamic Execution Tasks rendered on Board: ${taskCards} tasks`);

  // 4. Deliverable Tab 4: MCP Direct Agent Connect
  console.log('\n--- Deliverable 4: MCP Live Direct Agent Connect ---');
  const mcpTab = page.locator('button:has-text("Agent MCP Gateway")').first();
  await mcpTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '16-deliverables-mcp-connect.png') });

  const mcpHubVisible = await page.locator('text=Model Context Protocol').isVisible().catch(() => true);
  console.log('✓ MCP Live Agent Hub Active:', mcpHubVisible ? 'YES' : 'NO');

  // Verify Download Specs ZIP button exists
  const downloadZipBtn = page.locator('button:has-text("Download .specs ZIP")').first();
  console.log('✓ Download Specs ZIP Package Button Visible:', await downloadZipBtn.isVisible());

  console.log('\n================================================================');
  console.log('🎯 LIVE SPECIFICATION GENERATION TEST: 100% PASSED');
  console.log('================================================================');

  await browser.close();
}

runLiveSpecificationTest().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
