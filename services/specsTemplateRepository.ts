import fallbackTemplates from './specsTemplateFallback.json';

/**
 * Master .specs Template Repository
 * 
 * Provides access to the pristine canonical 33-file System 2 multi-agent .specs template directory.
 * Every time a user creates a specification, the AI Agent creates an isolated copy
 * of this template suite specifically for the project, leaving the master templates intact.
 */

// Use Vite's glob import to bundle all markdown files from the .specs template folder and AGENTS.md (with Node fallback)
const templateModules: Record<string, string> = (typeof (import.meta as any).glob === 'function')
  ? (import.meta as any).glob(['/.specs/**/*.md', '/AGENTS.md'], {
      query: '?raw',
      import: 'default',
      eager: true
    })
  : {};

/**
 * Normalizes Vite glob paths (e.g., "/.specs/foundation/brief.md" -> "foundation/brief.md")
 */
function normalizeTemplatePath(rawPath: string): string {
  return rawPath
    .replace(/^(\.\/|\/)?\.specs\//, '')
    .replace(/^(\.\/|\/)/, '')
    .replace(/\\/g, '/');
}

/**
 * Returns a pristine dictionary of all 33 raw canonical .specs template files
 */
export function getMasterSpecsTemplates(): Record<string, string> {
  const templates: Record<string, string> = {};
  for (const [rawPath, content] of Object.entries(templateModules)) {
    const cleanPath = normalizeTemplatePath(rawPath);
    templates[cleanPath] = content;
  }

  // Ensure all 33 files exist using the fallback if glob missed anything
  for (const [key, val] of Object.entries(fallbackTemplates as Record<string, string>)) {
    if (!templates[key]) {
      templates[key] = val;
    }
  }

  return templates;
}

/**
 * Creates an isolated, deep clone of the .specs template suite specifically for a new project.
 * The master template files remain untouched.
 */
export function cloneSpecsTemplateForProject(projectName: string): Record<string, string> {
  const master = getMasterSpecsTemplates();
  const projectCopy: Record<string, string> = {};
  const dateStr = new Date().toISOString().split('T')[0];

  for (const [filePath, templateContent] of Object.entries(master)) {
    // Clone template text and initialize project name / date stamps
    projectCopy[filePath] = templateContent
      .replace(/\[Project name\]/g, projectName)
      .replace(/YYYY-MM-DD/g, dateStr);
  }

  return projectCopy;
}
