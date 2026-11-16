import { PARENT_PROJECT_PLAN_TEMPLATE, generateDeterministicProjectPlan } from './projectPlanTemplate';
import { PRD_TEMPLATE, generateDeterministicPRD } from './prdTemplate';
import { DESIGNS_TEMPLATE, generateDeterministicDesigns } from './designsTemplate';
import { ARCHITECTURE_TEMPLATE, generateDeterministicArchitecture } from './architectureTemplate';
import { TECHNICAL_SPECIFICATION_TEMPLATE, generateDeterministicTechSpec } from './techSpecTemplate';
import { ROADMAP_TEMPLATE, generateDeterministicRoadmap } from './roadmapTemplate';

export {
  PARENT_PROJECT_PLAN_TEMPLATE,
  generateDeterministicProjectPlan,
  PRD_TEMPLATE,
  generateDeterministicPRD,
  DESIGNS_TEMPLATE,
  generateDeterministicDesigns,
  ARCHITECTURE_TEMPLATE,
  generateDeterministicArchitecture,
  TECHNICAL_SPECIFICATION_TEMPLATE,
  generateDeterministicTechSpec,
  ROADMAP_TEMPLATE,
  generateDeterministicRoadmap
};

/**
 * Registry mapping template IDs to their raw markdown template instructions.
 * As the user provides the remaining templates one by one, they are registered here.
 */
export const PLANNING_SCHEME_TEMPLATES: Record<string, string> = {
  project_plan: PARENT_PROJECT_PLAN_TEMPLATE,
  prd: PRD_TEMPLATE,
  designs: DESIGNS_TEMPLATE,
  architecture: ARCHITECTURE_TEMPLATE,
  tech_spec: TECHNICAL_SPECIFICATION_TEMPLATE,
  roadmap: ROADMAP_TEMPLATE,
  // risk, qa, deployment will be added as provided
};

export function getPlanningSchemeTemplate(schemeId: string): string | undefined {
  return PLANNING_SCHEME_TEMPLATES[schemeId];
}
