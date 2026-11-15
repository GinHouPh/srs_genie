import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function inspectStoredProject() {
  console.log('Inspecting saved projects in local storage via Edge browser...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    const raw = localStorage.getItem('srs_genie_saved_projects');
    const rawHierarchies = localStorage.getItem('srs_genie_specs_hierarchies');
    const projects = raw ? JSON.parse(raw) : [];
    const hierarchies = rawHierarchies ? JSON.parse(rawHierarchies) : {};
    return {
      projectsCount: projects.length,
      projects: projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        hasSpecs: !!p.specsHierarchy,
        specsCount: p.specsHierarchy ? Object.keys(p.specsHierarchy).length : 0,
        tasksCount: p.implementationTasks?.length || 0,
        timeline: p.formData?.project_overview?.expected_timeline,
        industry: p.formData?.project_overview?.industry,
        specs: p.specsHierarchy
      })),
      hierarchiesKeys: Object.keys(hierarchies)
    };
  });

  console.log('Stored Projects Count:', data.projectsCount);
  data.projects.forEach((p: any, idx: number) => {
    console.log(`\nProject #${idx + 1}: "${p.name}"`);
    console.log(`  - Industry: ${p.industry}`);
    console.log(`  - Timeline: ${p.timeline}`);
    console.log(`  - Specs Count: ${p.specsCount}`);
    console.log(`  - Tasks Count: ${p.tasksCount}`);

    if (p.specs) {
      console.log('  - Sample Spec Files:');
      const keys = Object.keys(p.specs);
      console.log(`    Total files: ${keys.length}`);
      keys.slice(0, 8).forEach(k => {
        console.log(`      * .specs/${k} (${p.specs[k].length} bytes)`);
      });

      console.log('\n  - foundation/brief.md preview:');
      console.log(p.specs['foundation/brief.md']?.substring(0, 300) + '...\n');
    }
  });

  await browser.close();
}

inspectStoredProject().catch(err => {
  console.error('Error:', err);
});

