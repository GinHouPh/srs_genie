import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function testLiveProduction() {
  const screenshotsDir = path.resolve('test-screenshots/prod-test');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Navigating to https://srsgenie.agapeinfosys.com/ ...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[PROD CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });
  page.on('pageerror', err => {
    console.error(`[PROD PAGE ERROR]:`, err.message);
  });
  page.on('requestfailed', req => {
    console.warn(`[PROD REQUEST FAILED]: ${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  await page.goto('https://srsgenie.agapeinfosys.com/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '01-landing.png') });
  console.log('✓ Landed on page:', await page.title());

  // Check what providers are configured in localStorage on production
  const initialStorage = await page.evaluate(() => {
    return {
      keys: Object.keys(localStorage),
      user: localStorage.getItem('srs_genie_saas_user'),
      aiVault: localStorage.getItem('srs_genie_ai_providers_vault'),
      aiSettings: localStorage.getItem('srs_genie_saas_settings')
    };
  });
  console.log('Production localStorage keys:', initialStorage.keys);

  // Sign in as Admin
  const signInBtn = page.locator('button:has-text("Sign In")').first();
  await signInBtn.click();
  await page.waitForTimeout(500);

  await page.fill('input[type="email"]', 'admin@srsgenie.ai');
  await page.fill('input[type="password"]', 'Admin123!');
  await page.locator('button[type="submit"]:has-text("Enter Platform")').click();
  await page.waitForTimeout(1500);

  // Check AI providers after sign in
  const aiState = await page.evaluate(async () => {
    try {
      // Check localStorage
      const vault = localStorage.getItem('srs_genie_ai_providers_vault');
      const settings = localStorage.getItem('srs_genie_saas_settings');
      return { vaultPresent: Boolean(vault), settingsPresent: Boolean(settings), vaultRaw: vault?.slice(0, 300) };
    } catch (e: any) {
      return { error: e.message };
    }
  });
  console.log('AI State after admin login:', aiState);

  await browser.close();
}

testLiveProduction().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
