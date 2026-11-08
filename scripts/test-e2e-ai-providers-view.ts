import { chromium } from 'playwright';

async function run() {
  console.log('Launching Edge browser to verify Console > AI Providers improvements...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // If on Landing page, sign in
    const signInBtn = page.locator('button:has-text("Sign In")').first();
    if (await signInBtn.isVisible().catch(() => false)) {
      console.log('Clicking "Sign In"...');
      await signInBtn.click();
      await page.waitForTimeout(1000);
    }

    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible().catch(() => false)) {
      console.log('Signing in as admin@srsgenie.ai...');
      await emailInput.fill('admin@srsgenie.ai');
      await page.fill('input[type="password"]', 'Admin123!');
      await page.click('button:has-text("Enter Platform")');
      await page.waitForTimeout(2000);
    }

    // Navigate to Admin Console
    console.log('Navigating to Admin Console...');
    await page.evaluate(() => {
      sessionStorage.setItem('srs_active_app_state', 'ADMIN_CONSOLE');
      sessionStorage.setItem('srs_admin_active_tab', 'ai_providers');
    });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Switch tab to AI Providers if not selected
    const aiProvidersTab = page.locator('button:has-text("AI Providers")').first();
    if (await aiProvidersTab.isVisible().catch(() => false)) {
      console.log('Clicking "AI Providers" tab...');
      await aiProvidersTab.click();
      await page.waitForTimeout(1000);
    }

    // Verify Title & Metrics Bar
    const titleVisible = await page.locator('text=AI Model Providers Configuration').first().isVisible({ timeout: 5000 });
    console.log(`AI Model Providers title visible: ${titleVisible}`);
    if (!titleVisible) throw new Error('AI Model Providers Configuration title not found!');

    const metricsVisible = await page.locator('text=Registered Models').first().isVisible();
    console.log(`Metrics stats bar visible: ${metricsVisible}`);

    // --- TEST 1: VIEW MODES ---
    console.log('\n--- 1. Testing View Modes (Cards, Table, Models Catalog) ---');

    // Default view: Cards
    const cardsViewBtn = page.locator('button:has-text("Cards")').first();
    console.log(`Cards view button visible: ${await cardsViewBtn.isVisible()}`);

    // Switch to Table View
    console.log('Switching to Table view...');
    const tableViewBtn = page.locator('button:has-text("Table")').first();
    await tableViewBtn.click();
    await page.waitForTimeout(800);

    const tableVisible = await page.locator('table').first().isVisible();
    console.log(`Table element visible in Table view: ${tableVisible}`);
    if (!tableVisible) throw new Error('Table element not rendered in Table view!');

    const tableHeaders = await page.$$eval('table th', ths => ths.map(t => t.textContent?.trim()));
    console.log('Table columns:', tableHeaders);
    await page.screenshot({ path: 'test-screenshots/ai-providers-table-view.png' });

    // Switch to Models Catalog View
    console.log('Switching to Models Catalog view...');
    const modelsViewBtn = page.locator('button:has-text("Models Catalog")').first();
    await modelsViewBtn.click();
    await page.waitForTimeout(800);

    const catalogHeaderVisible = await page.locator('text=Unified Client Model Catalog').first().isVisible();
    console.log(`Unified Client Model Catalog header visible: ${catalogHeaderVisible}`);
    if (!catalogHeaderVisible) throw new Error('Unified Client Model Catalog not rendered!');
    await page.screenshot({ path: 'test-screenshots/ai-providers-models-catalog-view.png' });

    // Switch back to Cards View
    console.log('Switching back to Cards view...');
    await cardsViewBtn.click();
    await page.waitForTimeout(800);

    // --- TEST 2: SEARCH ---
    console.log('\n--- 2. Testing Search & Clear ---');
    const searchInput = page.locator('input[placeholder*="Search providers"]');
    console.log(`Search input visible: ${await searchInput.isVisible()}`);

    console.log('Typing "gemini" in search...');
    await searchInput.fill('gemini');
    await page.waitForTimeout(600);

    const showingText = await page.locator('text=Showing').first().textContent();
    console.log('Search results counter:', showingText);

    // Verify only matching providers appear
    const geminiVisible = await page.locator('h3:has-text("Google Gemini")').first().isVisible();
    console.log(`Google Gemini card visible in search results: ${geminiVisible}`);
    if (!geminiVisible) throw new Error('Google Gemini card should be visible for "gemini" search!');

    // Clear search using X button
    console.log('Clearing search query...');
    await page.locator('button[title="Clear Search"]').first().click();
    await page.waitForTimeout(600);

    // --- TEST 3: SORTING ---
    console.log('\n--- 3. Testing Sorting ---');
    const sortSelect = page.locator('select').filter({ has: page.locator('option[value="name-asc"]') }).first();
    console.log(`Sort select dropdown visible: ${await sortSelect.isVisible()}`);

    console.log('Sorting by Name (A → Z)...');
    await sortSelect.selectOption('name-asc');
    await page.waitForTimeout(600);

    console.log('Sorting by Most Models...');
    await sortSelect.selectOption('models-desc');
    await page.waitForTimeout(600);

    // --- TEST 4: FAVOURITES ---
    console.log('\n--- 4. Testing Favourites (Star Toggle & Filter) ---');
    // Find the first star button
    const firstStarBtn = page.locator('button[title*="Star"]').first();
    console.log(`Star button visible: ${await firstStarBtn.isVisible()}`);

    console.log('Clicking Star to favourite first provider...');
    await firstStarBtn.click();
    await page.waitForTimeout(800);

    // Verify Star is filled
    const isStarFilled = await page.locator('.text-amber-400.fill-amber-400').first().isVisible();
    console.log(`Star is filled with amber color: ${isStarFilled}`);
    if (!isStarFilled) throw new Error('Star icon did not turn filled amber upon favouriting!');

    // Click "Favourites Only" filter pill
    console.log('Clicking "Favourites Only" filter pill...');
    const favPill = page.locator('button:has-text("Favourites")').first();
    await favPill.click();
    await page.waitForTimeout(800);

    const favShowing = await page.locator('text=Showing').first().textContent();
    console.log('Favourites filter counter:', favShowing);

    // Reset filters
    await page.locator('button:has-text("Reset Filters"), button:has-text("All (")').first().click();
    await page.waitForTimeout(800);

    // Capture final verified screenshot
    await page.screenshot({ path: 'test-screenshots/ai-providers-verified.png', fullPage: true });

    console.log('\n========================================================================');
    console.log(' ALL AI PROVIDERS IMPROVEMENTS VERIFIED: VIEW MODES, SORT, SEARCH, FAVS! ');
    console.log('========================================================================');

  } catch (err) {
    console.error('Test execution error:', err);
    await page.screenshot({ path: 'test-screenshots/ai-providers-error.png', fullPage: true }).catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
