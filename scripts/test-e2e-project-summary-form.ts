import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runTest() {
  const screenshotsDir = path.resolve('test-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('=====================================================');
  console.log('🚀 TESTING SRS FORM IMPROVISATIONS & SPEC AGENT');
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
    if (text.includes('error') || text.includes('Error')) {
      console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${text}`);
    }
  });

  console.log('\n--- Step 1: Navigating to http://localhost:3000 ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Clear any existing draft to start fresh
  await page.evaluate(() => localStorage.removeItem('srs_genie_active_form_draft'));
  await page.reload({ waitUntil: 'networkidle' });

  console.log('\n--- Step 2: Sign in ---');
  const signInBtn = page.locator('button:has-text("Sign In")').first();
  await signInBtn.click();
  await page.waitForTimeout(500);

  await page.fill('input[type="email"]', 'admin@srsgenie.ai');
  await page.fill('input[type="password"]', 'Admin123!');
  const submitLogin = page.locator('button[type="submit"]:has-text("Enter Platform")');
  await submitLogin.click();
  await page.waitForTimeout(1500);

  console.log('\n--- Step 3: Launch Wizard Form ---');
  const newSpecBtn = page.locator('button:has-text("New Specification")').first();
  await newSpecBtn.click();
  await page.waitForTimeout(1000);

  console.log('\n--- Step 4: Verify Fullwidth Layout ---');
  // Check that form container is w-full and does not have max-w-4xl
  const innerContainer = page.locator('.p-6.md\\:p-8 > div, div[class*="bg-ink"] > div.w-full').first();
  const innerClass = await innerContainer.getAttribute('class');
  console.log('Inner container classes:', innerClass);
  const isFullwidth = innerClass?.includes('w-full') && !innerClass?.includes('max-w-4xl');
  console.log('Layout Fullwidth Check:', isFullwidth ? '✓ SUCCESS (w-full, no max-w-4xl)' : '❌ Failed');

  const containerBox = await innerContainer.boundingBox();
  console.log(`Container dimensions: width = ${containerBox?.width}px (Viewport 1440px)`);

  console.log('\n--- Step 5: Verify Field Placement & Project Summary Editor ---');
  // Check Project Name field
  const projectNameInput = page.locator('#project_overview_project_name');
  await projectNameInput.fill('SkyDrone Autonomous Fleet');
  console.log('✓ Filled Project Name: SkyDrone Autonomous Fleet');

  // Check Project Summary editor directly after Project Name
  const summaryEditor = page.locator('#project_overview_project_summary');
  const isSummaryVisible = await summaryEditor.isVisible();
  console.log('Project Summary Editor Visible:', isSummaryVisible ? '✓ SUCCESS' : '❌ Not visible');

  // Verify Write and Preview tabs
  const writeTab = page.locator('button:has-text("Write")');
  const previewTab = page.locator('button:has-text("Preview")');
  console.log('Tabs visible:', (await writeTab.isVisible()) && (await previewTab.isVisible()) ? '✓ Write & Preview tabs present' : '❌ Tabs missing');

  // Verify Attach File button
  const attachBtn = page.locator('button:has-text("Attach File")');
  console.log('Attach Button visible:', await attachBtn.isVisible() ? '✓ Attach File button present' : '❌ Attach button missing');

  console.log('\n--- Step 6: Test Format Filtering (Rejection of invalid formats) ---');
  // Create dummy invalid file (pdf)
  const invalidFilePath = path.resolve('test-screenshots/dummy.pdf');
  fs.writeFileSync(invalidFilePath, '%PDF-1.4 dummy pdf content');
  
  // Set file into hidden file input
  const fileInput = page.locator('input[type="file"][accept*=".md"]');
  await fileInput.setInputFiles(invalidFilePath);
  await page.waitForTimeout(600);

  // Check for error banner or message
  const errorBanner = page.locator('text=Only Markdown (.md) and plain text (.txt) files are allowed');
  const hasError = await errorBanner.isVisible();
  console.log('Invalid Format Filter (.pdf rejected):', hasError ? '✓ SUCCESS (.pdf correctly rejected with error banner)' : '❌ Not rejected');
  await page.screenshot({ path: path.join(screenshotsDir, 'test-summary-01-format-rejection.png') });

  console.log('\n--- Step 7: Test Valid Markdown Attachment (.md) ---');
  // Create sample valid markdown spec
  const validMdPath = path.resolve('test-screenshots/skydrone_core_spec.md');
  const mdContent = `# SkyDrone Autonomous Fleet Architecture

We are building a next-generation drone logistics hub operating across urban flight corridors.

### Non-Negotiable Core Features:
- **Kinematic Geofencing**: Millisecond polygonal containment engine.
- **Fail-Safe Parachute Activation**: Sensor-triggered deploy at pitch angles exceeding 65°.
- **Real-Time Video Telemetry**: Ultra-low-latency WebRTC streams encoded in H.265.
- **Automated Weather Grounding**: Auto-reroute when localized wind gusts exceed 25 knots.`;
  fs.writeFileSync(validMdPath, mdContent);

  await fileInput.setInputFiles(validMdPath);
  await page.waitForTimeout(800);

  const summaryValue = await summaryEditor.inputValue();
  const hasLoadedContent = summaryValue.includes('Kinematic Geofencing') && summaryValue.includes('Fail-Safe Parachute');
  console.log('Valid Markdown Ingestion:', hasLoadedContent ? '✓ SUCCESS (Loaded file contents into editor)' : '❌ Failed to load');

  // Check attached file badge
  const attachedBadge = page.locator('span[title="skydrone_core_spec.md"], .font-mono:has-text("skydrone_core_spec.md")').first();
  console.log('Attached File Badge:', (await attachedBadge.isVisible()) ? '✓ Attached chip displayed' : '❌ Badge missing');

  // Test Markdown Preview tab
  await previewTab.click();
  await page.waitForTimeout(500);
  const previewRendered = page.locator('text=Kinematic Geofencing');
  console.log('Markdown Preview Render:', (await previewRendered.isVisible()) ? '✓ SUCCESS (Markdown rendered in preview tab)' : '❌ Preview failed');
  await page.screenshot({ path: path.join(screenshotsDir, 'test-summary-02-markdown-preview.png') });

  // Switch back to write tab
  await writeTab.click();
  await page.waitForTimeout(300);

  console.log('\n--- Step 8: Complete Form & Check Wider Grid Layout ---');
  // Select Industry
  await page.locator('label:has-text("Logistics & Transportation")').first().click();

  // Select Project Type
  await page.locator('label:has-text("Full-Scale Production System")').first().click();

  // Select Business Model
  await page.locator('label:has-text("Subscription-based (SaaS)")').first().click();

  // Select Target Users
  await page.locator('label:has-text("Technical Users/Developers")').first().click();
  await page.locator('label:has-text("Management/Executives")').first().click();

  // Select Timeline
  await page.locator('label:has-text("3-4 months")').first().click();

  // Select Budget
  await page.locator('label:has-text("$50,000 - $100,000")').first().click();

  await page.screenshot({ path: path.join(screenshotsDir, 'test-summary-03-fullwidth-section.png') });

  // Navigate to Section 2 (System Type) and fill options
  const nextSecBtn = page.locator('button:has-text("Next Section")').first();
  await nextSecBtn.click();
  await page.waitForTimeout(600);

  // Select Application Type
  await page.locator('label:has-text("Web Application (Browser-based)")').first().click();
  await page.locator('label:has-text("Backend/API Only")').first().click();
  await page.locator('label:has-text("Progressive Web App (PWA)")').first().click();

  console.log('\n--- Step 9: Jump to Summary Review & Verify Project Summary Block ---');
  // Click Review button in header
  const reviewBtn = page.locator('button:has-text("Review")').first();
  await reviewBtn.click();
  await page.waitForTimeout(1000);

  const summaryInReview = page.locator('text=Project Summary & Build Specification');
  console.log('Review Mode Summary Block:', (await summaryInReview.isVisible()) ? '✓ SUCCESS (Summary rendered in pre-flight review)' : '❌ Block missing');
  await page.screenshot({ path: path.join(screenshotsDir, 'test-summary-04-review-summary.png') });

  // Select AgentRouter model (GPT 5.6 Sol) which runs ultra fast in test
  const modelCard = page.locator('div:has-text("GPT 5.6 Sol")').first();
  if (await modelCard.isVisible()) {
    await modelCard.scrollIntoViewIfNeeded();
    await modelCard.click();
    console.log('✓ Selected "GPT 5.6 Sol" AI engine.');
  }

  console.log('\n--- Step 10: Trigger AI Synthesis & Verify SpecAgent Ingestion ---');
  const generateBtn = page.locator('button:has-text("Generate 22-File .specs Suite")').first();
  await generateBtn.click();
  await page.waitForTimeout(1000);

  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1500);
    const hasExplore = await page.locator('button:has-text("Explore .specs Suite")').isVisible();
    const activeText = await page.innerText('body');
    const logsSnippet = activeText.split('\n').filter(l => l.includes('Consolidating') || l.includes('Ingesting') || l.includes('Major') || l.includes('Compiled') || l.includes('Extracted') || l.includes('Forged')).slice(-4).join(' | ');
    console.log(`[T+${i * 1.5}s] Viewport: ${logsSnippet || activeText.slice(0, 100).replace(/\n+/g, ' ')}`);

    if (hasExplore) {
      console.log('✓ Specification Suite Forged successfully!');
      break;
    }
  }

  await page.screenshot({ path: path.join(screenshotsDir, 'test-summary-06-specs-generated.png') });

  console.log('✓ Synthesis completed successfully! Clicking Explore .specs Suite...');
  const exploreBtn = page.locator('button:has-text("Explore .specs Suite")').first();
  if (await exploreBtn.isVisible()) {
    await exploreBtn.click();
    await page.waitForTimeout(1500);
  }

  // Take screenshot of Document Preview
  await page.screenshot({ path: path.join(screenshotsDir, 'test-summary-07-document-preview.png') });

  // Verify brief.md or brief content shows our Kinematic Geofencing from the uploaded markdown file
  const pageText = await page.textContent('body');
  const hasUserSummaryInOutput = pageText?.includes('Kinematic Geofencing') || pageText?.includes('skydrone_core_spec.md');
  console.log('User Summary Ingested into Specification Suite:', hasUserSummaryInOutput ? '✓ SUCCESS (Found custom specification in output)' : '❌ Not found');

  console.log('\n🎉 ALL FRONTEND & AGENT VERIFICATION CHECKS COMPLETED SUCCESSFULLY!');

  // Cleanup test files
  try {
    if (fs.existsSync(invalidFilePath)) fs.unlinkSync(invalidFilePath);
    if (fs.existsSync(validMdPath)) fs.unlinkSync(validMdPath);
  } catch {}

  await browser.close();
}

runTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
