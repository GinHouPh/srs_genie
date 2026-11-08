import { chromium } from 'playwright';

async function run() {
  console.log('Launching Edge browser for Comprehensive E2E Project Deletion Test...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const generate22Files = () => {
    const filePaths = [
      '_index.md',
      'foundation/brief.md',
      'foundation/principles.md',
      'domain/glossary.md',
      'domain/entities.md',
      'contracts/api_contracts.md',
      'contracts/database_schema.md',
      'state/application_state.md',
      'state/adr_001_initial_architecture.md',
      'ui/design_tokens.md',
      'ui/component_inventory.md',
      'execution/tasks.md',
      'execution/prompt_plan.md',
      'security/auth_model.md',
      'security/data_privacy.md',
      'devops/deployment.md',
      'devops/ci_cd_pipeline.md',
      'qa/test_strategy.md',
      'qa/test_cases.md',
      'operations/runbook.md',
      'operations/monitoring.md',
      'costs/estimation.md'
    ];
    const map: Record<string, string> = {};
    filePaths.forEach((fn, idx) => {
      map[fn] = `# ${fn}\n\nCanonical specification content for file ${idx + 1} of 22.`;
    });
    return map;
  };

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // If on Landing page, click Sign In
    const signInBtn = page.locator('button:has-text("Sign In")').first();
    if (await signInBtn.isVisible().catch(() => false)) {
      console.log('Landing page detected. Clicking "Sign In"...');
      await signInBtn.click();
      await page.waitForTimeout(1000);
    }

    // Sign in as admin@srsgenie.ai
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible().catch(() => false)) {
      console.log('Signing in as admin@srsgenie.ai...');
      await emailInput.fill('admin@srsgenie.ai');
      await page.fill('input[type="password"]', 'Admin123!');
      await page.click('button:has-text("Enter Platform")');
      await page.waitForTimeout(2000);
    }

    // Ensure session is active and navigate to Dashboard
    await page.evaluate(() => {
      sessionStorage.setItem('srs_active_app_state', 'DASHBOARD');
    });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // =========================================================================
    // TEST 1: DELETION VIA DOCUMENT PREVIEW DELETE BUTTON & CONFIRMATION MODAL
    // =========================================================================
    console.log('\n--- TEST 1: Deletion from inside DocumentPreview modal ---');
    const project1Id = 'proj_del_preview_' + Date.now();
    const project1Name = 'Preview Deletion Suite';

    console.log(`Seeding project "${project1Name}" (${project1Id}) with 22 specification files...`);
    await page.evaluate(({ id, name, specs }) => {
      const proj = {
        id,
        tenantId: 'tenant_master_001',
        userId: 'admin_root',
        name,
        version: '1.0.0',
        status: 'completed',
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        specsHierarchy: specs,
        content: '# Master Document for ' + name,
        formData: {
          project_overview: { project_name: name, industry: 'Fintech' }
        }
      };

      // Add to srs_genie_saved_projects
      const projects = JSON.parse(localStorage.getItem('srs_genie_saved_projects') || '[]');
      projects.unshift(proj);
      localStorage.setItem('srs_genie_saved_projects', JSON.stringify(projects));

      // Add to srs_genie_specs_hierarchies
      const hier = JSON.parse(localStorage.getItem('srs_genie_specs_hierarchies') || '{}');
      hier[id] = specs;
      localStorage.setItem('srs_genie_specs_hierarchies', JSON.stringify(hier));

      // Add matching form draft
      localStorage.setItem('srs_genie_active_form_draft', JSON.stringify({
        savedAt: new Date().toISOString(),
        formData: {
          project_overview: { project_name: name },
          projectName: name
        }
      }));

      // Add MCP Key in saasStore storage
      const saasRaw = localStorage.getItem('srs_genie_saas_store_v2');
      const saasData = saasRaw ? JSON.parse(saasRaw) : {};
      if (!saasData.mcpKeys) saasData.mcpKeys = [];
      saasData.mcpKeys.push({
        id: 'key-' + id,
        name: 'Key for ' + name,
        key: 'genie_preview_del_key',
        role: 'agent',
        projectId: id,
        projectName: name,
        createdAt: new Date().toISOString(),
        queriesCount: 0
      });
      localStorage.setItem('srs_genie_saas_store_v2', JSON.stringify(saasData));
    }, { id: project1Id, name: project1Name, specs: generate22Files() });

    // Reload page to reflect seeded project
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Verify project appears on Dashboard
    const p1Card = page.locator(`text=${project1Name}`).first();
    const p1Visible = await p1Card.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Project "${project1Name}" visible on Dashboard: ${p1Visible}`);
    if (!p1Visible) throw new Error(`Project "${project1Name}" not rendered on Dashboard!`);

    // Click on project to open DocumentPreview
    console.log(`Opening "${project1Name}" in DocumentPreview...`);
    await p1Card.click();
    await page.waitForTimeout(1500);

    // Check that .specs Suite (22 Files) is visible
    const p1TabVisible = await page.locator('text=22 Files').first().isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`"22 Files" indicator visible in DocumentPreview: ${p1TabVisible}`);
    if (!p1TabVisible) throw new Error('"22 Files" tab not visible in DocumentPreview!');

    // Check MCP Hub view has 22 files active
    console.log('Verifying MCP Gateway has 22 files loaded...');
    await page.locator('button:has-text("MCP Gateway")').first().click();
    await page.waitForTimeout(1000);
    const mcpFilesAvailable = await page.locator('text=22 Files Available').first().isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`MCP Gateway displays "22 Files Available": ${mcpFilesAvailable}`);
    if (!mcpFilesAvailable) throw new Error('Expected "22 Files Available" in MCP Gateway banner!');

    // Return to DocumentPreview by clicking project again
    await page.locator('button:has-text("Dashboard"), button:has-text("Projects")').first().click();
    await page.waitForTimeout(1000);
    await page.locator(`text=${project1Name}`).first().click();
    await page.waitForTimeout(1000);

    // Click "Delete" button in DocumentPreview header
    console.log('Clicking "Delete" in DocumentPreview top bar...');
    const delBtn = page.locator('button[title="Delete this entire specification suite"]').first();
    const delBtnVisible = await delBtn.isVisible({ timeout: 5000 });
    console.log(`Delete button visible in DocumentPreview: ${delBtnVisible}`);
    if (!delBtnVisible) throw new Error('Delete button missing from DocumentPreview!');
    await delBtn.click();
    await page.waitForTimeout(500);

    // Verify Confirmation Modal
    const modalPrompt = await page.locator('text=Are you sure?').isVisible({ timeout: 3000 });
    console.log(`Deletion confirmation modal appeared: ${modalPrompt}`);
    if (!modalPrompt) throw new Error('Confirmation modal did not appear!');

    // Click "Delete All 22 Files"
    console.log('Confirming "Delete All 22 Files"...');
    await page.locator('button:has-text("Delete All 22 Files")').first().click();
    await page.waitForTimeout(2000);

    // Verify: User is redirected back to Dashboard
    console.log('Verifying redirection to Dashboard and absence of deleted project card...');
    const p1CardAfterDelete = page.locator('.agape-card h3').filter({ hasText: project1Name });
    const p1StillOnDash = await p1CardAfterDelete.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Is "${project1Name}" card still on Dashboard? ${p1StillOnDash}`);
    if (p1StillOnDash) throw new Error(`"${project1Name}" card still visible on Dashboard after deletion!`);

    // Verify: MCP Gateway is completely purged
    console.log('Verifying MCP Gateway is purged...');
    await page.locator('button:has-text("MCP Gateway")').first().click();
    await page.waitForTimeout(1000);
    const emptyBanner1 = await page.locator('text=No Spec Loaded').first().isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`MCP Gateway displays "No Spec Loaded" banner: ${emptyBanner1}`);
    if (!emptyBanner1) throw new Error('MCP Gateway still has lingering specification files in memory!');

    // Verify: LocalStorage purged
    const audit1 = await page.evaluate(({ id, name }) => {
      const projects = JSON.parse(localStorage.getItem('srs_genie_saved_projects') || '[]');
      const projFound = projects.some((p: any) => p.id === id || p.name === name);

      const specsHier = JSON.parse(localStorage.getItem('srs_genie_specs_hierarchies') || '{}');
      const specsFound = !!specsHier[id];

      const draftRaw = localStorage.getItem('srs_genie_active_form_draft');
      const draft = draftRaw ? JSON.parse(draftRaw) : null;
      const draftName = draft?.formData?.project_overview?.project_name || draft?.formData?.projectName;
      const draftFound = draftName === name;

      const saasRaw = localStorage.getItem('srs_genie_saas_store_v2');
      const saasData = saasRaw ? JSON.parse(saasRaw) : {};
      const keys = saasData.mcpKeys || [];
      const keysFound = keys.some((k: any) => k.projectId === id || (k.projectName && k.projectName.toLowerCase() === name.toLowerCase()));

      return { projFound, specsFound, draftFound, keysFound };
    }, { id: project1Id, name: project1Name });

    console.log('Test 1 Storage Audit:', audit1);
    if (audit1.projFound || audit1.specsFound || audit1.draftFound || audit1.keysFound) {
      throw new Error(`Test 1 failed: Project or associated files still remain in storage! ${JSON.stringify(audit1)}`);
    }
    console.log(' TEST 1 PASSED: DocumentPreview modal deletion completely purges project, 22 spec files, draft, keys, and memory state.\n');

    // =========================================================================
    // TEST 2: DELETION VIA DASHBOARD CARD DELETE BUTTON
    // =========================================================================
    console.log('--- TEST 2: Deletion directly from Dashboard card ---');
    const project2Id = 'proj_del_dash_' + Date.now();
    const project2Name = 'Dashboard Deletion Suite';

    console.log(`Seeding second project "${project2Name}" (${project2Id}) with 22 files...`);
    await page.evaluate(({ id, name, specs }) => {
      const proj = {
        id,
        tenantId: 'tenant_master_001',
        userId: 'admin_root',
        name,
        version: '1.0.0',
        status: 'completed',
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        specsHierarchy: specs,
        content: '# Master Document for ' + name,
        formData: {
          project_overview: { project_name: name, industry: 'Healthcare' }
        }
      };

      const projects = JSON.parse(localStorage.getItem('srs_genie_saved_projects') || '[]');
      projects.unshift(proj);
      localStorage.setItem('srs_genie_saved_projects', JSON.stringify(projects));

      const hier = JSON.parse(localStorage.getItem('srs_genie_specs_hierarchies') || '{}');
      hier[id] = specs;
      localStorage.setItem('srs_genie_specs_hierarchies', JSON.stringify(hier));
    }, { id: project2Id, name: project2Name, specs: generate22Files() });

    // Navigate back to Dashboard
    await page.locator('button:has-text("Projects"), button:has-text("Dashboard")').first().click();
    await page.waitForTimeout(1000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const p2Card = page.locator(`text=${project2Name}`).first();
    const p2Visible = await p2Card.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Project "${project2Name}" visible on Dashboard: ${p2Visible}`);
    if (!p2Visible) throw new Error(`Project "${project2Name}" not rendered on Dashboard!`);

    // Click project to set it active in App.tsx memory
    await p2Card.click();
    await page.waitForTimeout(1000);

    // Return to Dashboard
    await page.locator('button:has-text("Exit")').first().click();
    await page.waitForTimeout(1000);

    // Now delete from Dashboard card specifically for project 2
    console.log(`Deleting "${project2Name}" via Dashboard card delete button...`);
    const project2Card = page.locator('.agape-card').filter({ hasText: project2Name });
    const cardDeleteBtn = project2Card.locator('button[title="Delete specification"]').first();
    await cardDeleteBtn.click();
    await page.waitForTimeout(500);

    // The Dashboard delete modal appears
    console.log('Confirming delete in Dashboard modal...');
    const deleteModal = page.locator('div.fixed.inset-0').filter({ hasText: 'Delete Specification?' });
    await deleteModal.waitFor({ state: 'visible', timeout: 5000 });
    const dashModalDeleteBtn = deleteModal.locator('button:has-text("Delete")').first();
    await dashModalDeleteBtn.click();
    await page.waitForTimeout(2000);

    // Verify card is removed from Dashboard
    console.log('Verifying project card is removed from Dashboard grid...');
    const p2CardAfterDelete = page.locator('.agape-card h3').filter({ hasText: project2Name });
    const p2StillOnDash = await p2CardAfterDelete.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Is "${project2Name}" card still on Dashboard? ${p2StillOnDash}`);
    if (p2StillOnDash) throw new Error(`"${project2Name}" is still displayed on Dashboard after deletion!`);

    // Verify MCP Gateway is empty
    await page.locator('button:has-text("MCP Gateway")').first().click();
    await page.waitForTimeout(1000);
    const emptyBanner2 = await page.locator('text=No Spec Loaded').first().isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`MCP Gateway displays "No Spec Loaded" banner: ${emptyBanner2}`);
    if (!emptyBanner2) throw new Error('MCP Gateway still has files loaded in memory after Dashboard deletion!');

    // Verify storage clean
    const audit2 = await page.evaluate(({ id, name }) => {
      const projects = JSON.parse(localStorage.getItem('srs_genie_saved_projects') || '[]');
      const projFound = projects.some((p: any) => p.id === id || p.name === name);

      const specsHier = JSON.parse(localStorage.getItem('srs_genie_specs_hierarchies') || '{}');
      const specsFound = !!specsHier[id];

      return { projFound, specsFound };
    }, { id: project2Id, name: project2Name });

    console.log('Test 2 Storage Audit:', audit2);
    if (audit2.projFound || audit2.specsFound) {
      throw new Error('Test 2 failed: Project or specs still remain in storage!');
    }
    console.log(' TEST 2 PASSED: Dashboard card deletion completely purges project, 22 spec files, and memory state.\n');

    await page.screenshot({ path: 'test-screenshots/e2e-deletion-complete-success.png', fullPage: true });

    console.log('========================================================================');
    console.log(' ALL E2E DELETION TESTS PASSED SUCCESSFULLY! ZERO LINGERING SPEC FILES! ');
    console.log('========================================================================');

  } catch (err) {
    console.error('E2E Deletion Test Failed:', err);
    await page.screenshot({ path: 'test-screenshots/e2e-deletion-failure.png', fullPage: true }).catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
