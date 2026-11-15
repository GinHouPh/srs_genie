import { chromium } from 'playwright';

async function printSkyCourierDetails() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  const project = await page.evaluate(() => {
    const raw = localStorage.getItem('srs_genie_saved_projects');
    const rawHierarchies = localStorage.getItem('srs_genie_specs_hierarchies');
    const list = raw ? JSON.parse(raw) : [];
    const hierarchies = rawHierarchies ? JSON.parse(rawHierarchies) : {};
    const match = list.find((p: any) => p.name?.includes('SkyCourier'));
    const specs = match?.specsHierarchy || (match?.id ? hierarchies[match.id] : {}) || {};
    return {
      match,
      specs
    };
  });

  console.log('Project Found:', project.match?.name);
  console.log('Specs Keys Count:', Object.keys(project.specs).length);

  console.log('\n=========================================');
  console.log('1. foundation/brief.md Content Preview:');
  console.log('=========================================');
  console.log(project.specs['foundation/brief.md']?.substring(0, 1200));

  console.log('\n=========================================');
  console.log('2. foundation/glossary.md Content Preview:');
  console.log('=========================================');
  console.log(project.specs['foundation/glossary.md']?.substring(0, 800));

  console.log('\n=========================================');
  console.log('3. architecture/system_design.md Content Preview:');
  console.log('=========================================');
  console.log(project.specs['architecture/system_design.md']?.substring(0, 800));

  console.log('\n=========================================');
  console.log('4. execution/tasks.md Content Preview:');
  console.log('=========================================');
  console.log(project.specs['execution/tasks.md']?.substring(0, 1000));

  await browser.close();
}

printSkyCourierDetails();

