import { chromium } from 'playwright';

async function inspectProdProviders() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://srsgenie.agapeinfosys.com/', { waitUntil: 'networkidle' });

  // Sign in as Admin
  const signInBtn = page.locator('button:has-text("Sign In")').first();
  await signInBtn.click();
  await page.waitForTimeout(500);
  await page.fill('input[type="email"]', 'admin@srsgenie.ai');
  await page.fill('input[type="password"]', 'Admin123!');
  await page.locator('button[type="submit"]:has-text("Enter Platform")').click();
  await page.waitForTimeout(1500);

  const report = await page.evaluate(async () => {
    const rawVault = localStorage.getItem('srs_genie_ai_providers_vault');
    const parsed = rawVault ? JSON.parse(rawVault) : [];
    
    // Check saasStore
    // @ts-ignore
    const store = (window as any).saasStore;
    
    return {
      vaultLength: parsed.length,
      providers: parsed.map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        isActive: p.isActive,
        isDefault: p.isDefault,
        hasKey: Boolean(p.apiKey),
        keyHead: p.apiKey ? p.apiKey.slice(0, 15) : null
      }))
    };
  });

  console.log('Production Providers in Vault:', JSON.stringify(report, null, 2));
  await browser.close();
}

inspectProdProviders();
