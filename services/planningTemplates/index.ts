import { PARENT_PROJECT_PLAN_TEMPLATE, generateDeterministicProjectPlan } from './projectPlanTemplate';
import { PRD_TEMPLATE, generateDeterministicPRD } from './prdTemplate';
import { DESIGNS_TEMPLATE, generateDeterministicDesigns } from './designsTemplate';
import { ARCHITECTURE_TEMPLATE, generateDeterministicArchitecture } from './architectureTemplate';
import { TECHNICAL_SPECIFICATION_TEMPLATE, generateDeterministicTechSpec } from './techSpecTemplate';
import { ROADMAP_TEMPLATE, generateDeterministicRoadmap } from './roadmapTemplate';
import { RISK_MANAGEMENT_TEMPLATE, generateDeterministicRisk } from './riskTemplate';
import { QA_TEMPLATE, generateDeterministicQA } from './qaTemplate';
import { DEPLOYMENT_RELEASE_TEMPLATE, generateDeterministicDeployment } from './deploymentTemplate';

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
  generateDeterministicRoadmap,
  RISK_MANAGEMENT_TEMPLATE,
  generateDeterministicRisk,
  QA_TEMPLATE,
  generateDeterministicQA,
  DEPLOYMENT_RELEASE_TEMPLATE,
  generateDeterministicDeployment
};

/**
 * Registry mapping template IDs to their raw markdown template instructions.
 * All 9 specialized strategic planning schemes are registered here.
 */
export const PLANNING_SCHEME_TEMPLATES: Record<string, string> = {
  project_plan: PARENT_PROJECT_PLAN_TEMPLATE,
  prd: PRD_TEMPLATE,
  designs: DESIGNS_TEMPLATE,
  architecture: ARCHITECTURE_TEMPLATE,
  tech_spec: TECHNICAL_SPECIFICATION_TEMPLATE,
  roadmap: ROADMAP_TEMPLATE,
  risk: RISK_MANAGEMENT_TEMPLATE,
  qa: QA_TEMPLATE,
  deployment: DEPLOYMENT_RELEASE_TEMPLATE
};

export function getPlanningSchemeTemplate(schemeId: string): string | undefined {
  return PLANNING_SCHEME_TEMPLATES[schemeId];
}
