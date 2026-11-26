import { ProjectInput, GeneratedContent, User } from '../types';
import { synthesizeSpecsSuite } from './specGeneratorService';
import { auditLogger } from './auditLogger';
import { apiService } from './apiService';
import { saasStore } from './saasStore';

const STORAGE_PROJECTS_KEY = 'srs_genie_saved_projects';
const STORAGE_SPECS_KEY = 'srs_genie_specs_hierarchies';

export interface SavedProjectRecord extends ProjectInput {
  userId?: string;
  tenantId?: string;
  specsHierarchy?: Record<string, string>;
  strategicPlans?: Record<string, string>;
  content?: string;
  vibeTasks?: any[];
  createdAt: string;
  updatedAt: string;
}

class ProjectStore {
  private projects: SavedProjectRecord[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
    this.syncFromServer();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => {
      try { l(); } catch {}
    });
  }

  async syncFromServer() {
    try {
      const { ok, projects: serverProjects } = await apiService.fetchProjectsWithStatus();
      if (!ok) {
        return;
      }

      if (serverProjects.length > 0) {
        const mappedServerProjects: SavedProjectRecord[] = [];
        for (const sp of serverProjects) {
          const existing = this.projects.find(p => p.id === sp.id);
          let restoredSpecs = sp.specsHierarchy;
          let restoredPlans = sp.strategicPlans;
          if ((!restoredSpecs || Object.keys(restoredSpecs).length === 0) && sp.content) {
            try {
              const parsed = typeof sp.content === 'string' ? JSON.parse(sp.content) : sp.content;
              if (parsed && typeof parsed === 'object') {
                if (parsed.specsHierarchy) restoredSpecs = parsed.specsHierarchy;
                if (parsed.strategicPlans) restoredPlans = parsed.strategicPlans;
              }
            } catch {}
          }
          const mapped: SavedProjectRecord = {
            id: sp.id,
            name: sp.title || 'Untitled',
            version: sp.version || '1.0.0',
            userId: sp.userId,
            tenantId: sp.tenantId,
            status: sp.status || 'draft',
            createdAt: sp.createdAt,
            updatedAt: sp.updatedAt,
            lastModified: new Date(sp.updatedAt || Date.now()),
            formData: sp.formData,
            content: sp.content,
            specsHierarchy: restoredSpecs || existing?.specsHierarchy,
            strategicPlans: restoredPlans || existing?.strategicPlans,
            vibeTasks: sp.vibeTasks || existing?.vibeTasks
          };
          mappedServerProjects.push(existing ? { ...existing, ...mapped } : mapped);
        }

        // Preserve any locally-created projects not yet on server (excluding the default starter seed)
        const serverIds = new Set(mappedServerProjects.map(p => p.id));
        const localOnly = this.projects.filter(p => !serverIds.has(p.id) && p.id !== 'proj_starter_1');
        this.projects = [...localOnly, ...mappedServerProjects];
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(this.projects));
        this.notifyListeners();
      } else if (this.projects.length === 0) {
        // Server genuinely has 0 projects and localStorage is empty: seed starter locally without pushing to server
        const starterProject = this.createStarterProject();
        this.projects = [starterProject];
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(this.projects));
        this.notifyListeners();
      }
    } catch {}
  }

  private createStarterProject(): SavedProjectRecord {
    const starterProject: SavedProjectRecord = {
      id: 'proj_starter_1',
      tenantId: 'tenant_master_001',
      userId: 'admin_root',
      name: 'NextGen SaaS Analytics',
      version: '1.0.0',
      status: 'generated',
      lastModified: new Date(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData: {
        project_overview: {
          project_name: 'NextGen SaaS Analytics',
          industry: 'Marketing & Advertising',
          project_type: 'New Product Development',
          target_users: ['Management/Executives', 'Technical Users/Developers'],
          expected_timeline: '3-4 months',
          budget_range: '$25,000 - $50,000'
        },
        system_type: {
          application_type: ['Web Application (Browser-based)', 'Mobile App - Cross-platform (iOS + Android)']
        },
        technical_requirements: {
          frontend_stack: 'React 19 / TypeScript / Tailwind CSS',
          backend_stack: 'Node.js / Express TypeScript',
          database_preference: 'PostgreSQL 16 + Redis'
        }
      }
    };
    starterProject.specsHierarchy = synthesizeSpecsSuite(starterProject);
    return starterProject;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (stored) {
        this.projects = JSON.parse(stored);
      } else {
        // Defer starter seeding until syncFromServer() confirms the server has no projects
        this.projects = [];
      }
    } catch (e) {
      console.warn('LocalStorage error in ProjectStore:', e);
    }
  }

  private saveToStorage(projectToSync?: SavedProjectRecord) {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(this.projects));
      if (projectToSync) {
        let contentPayload = projectToSync.content;
        if (!contentPayload && (projectToSync.specsHierarchy || projectToSync.strategicPlans)) {
          contentPayload = JSON.stringify({
            specsHierarchy: projectToSync.specsHierarchy,
            strategicPlans: projectToSync.strategicPlans
          });
        }
        apiService.saveProject({
          id: projectToSync.id,
          userId: projectToSync.userId,
          tenantId: projectToSync.tenantId,
          title: projectToSync.name,
          description: projectToSync.formData?.project_overview?.industry || '',
          status: projectToSync.status,
          tierCompletion: 100,
          formData: projectToSync.formData,
          content: contentPayload,
          vibeTasks: projectToSync.vibeTasks
        }).catch(() => {});
      }
    } catch (e) {}
    this.notifyListeners();
  }

  // Tenant-Aware CRUD Operations
  getAllProjects(user?: User | null): SavedProjectRecord[] {
    if (!user || user.role === 'admin' || user.role === 'staff') {
      return [...this.projects];
    }

    // Strict Multi-Tenant Isolation for Clients
    return this.projects.filter(p => {
      const matchesUser = p.userId && p.userId === user.id;
      const matchesTenant = p.tenantId && user.tenantId && p.tenantId === user.tenantId;
      return matchesUser || matchesTenant;
    });
  }

  getProjectById(id: string, user?: User | null): SavedProjectRecord | undefined {
    const proj = this.projects.find(p => p.id === id);
    if (!proj) return undefined;

    // Verify tenant ownership if client
    if (user && user.role === 'client') {
      const isOwner = (proj.userId && proj.userId === user.id) || (proj.tenantId && user.tenantId && proj.tenantId === user.tenantId);
      if (!isOwner) {
        auditLogger.log({
          actorId: user.id,
          actorEmail: user.email,
          actorRole: 'client',
          tenantId: user.tenantId || 'unknown',
          action: 'tenant.isolation.violation',
          status: 'DENIED',
          resourceType: 'project',
          resourceId: id,
          details: `Client attempted unauthorized cross-tenant read on project ${id}. Blocked.`
        });
        return undefined; // Block cross-tenant access
      }
    }

    return proj;
  }

  createProject(input: {
    name: string;
    version?: string;
    formData?: any;
    userId?: string;
    tenantId?: string;
  }): SavedProjectRecord {
    const newProj: SavedProjectRecord = {
      id: `proj_${Date.now()}`,
      tenantId: input.tenantId || (input.userId ? `tenant_${input.userId}` : 'tenant_default'),
      name: input.name.trim(),
      version: input.version || '1.0.0',
      status: 'draft',
      lastModified: new Date(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: input.userId,
      formData: input.formData || {
        project_overview: {
          project_name: input.name.trim()
        }
      }
    };

    newProj.specsHierarchy = synthesizeSpecsSuite(newProj);
    this.projects = [newProj, ...this.projects];
    this.saveToStorage(newProj);

    auditLogger.log({
      actorId: input.userId || 'system',
      actorEmail: 'system',
      actorRole: 'client',
      tenantId: newProj.tenantId || 'tenant_default',
      action: 'project.created',
      status: 'SUCCESS',
      resourceType: 'project',
      resourceId: newProj.id,
      details: `Project "${newProj.name}" created under tenant ${newProj.tenantId}.`
    });

    return newProj;
  }

  saveFullProject(
    project: ProjectInput,
    specs?: Record<string, string>,
    user?: User | null,
    strategicPlans?: Record<string, string>,
    vibeTasks?: any[]
  ): SavedProjectRecord {
    const existingIdx = this.projects.findIndex(p => p.id === project.id);
    const now = new Date().toISOString();

    const tenantId = user?.tenantId || project.tenantId || (user?.role === 'admin' ? 'tenant_master_001' : (user ? `tenant_${user.id}` : 'tenant_master_001'));
    const userId = user?.id || project.userId;

    const record: SavedProjectRecord = {
      ...project,
      userId,
      tenantId,
      lastModified: new Date(),
      updatedAt: now,
      createdAt: existingIdx >= 0 ? this.projects[existingIdx].createdAt : now,
      specsHierarchy: specs || (existingIdx >= 0 ? this.projects[existingIdx].specsHierarchy : synthesizeSpecsSuite(project)),
      strategicPlans: strategicPlans || (existingIdx >= 0 ? this.projects[existingIdx].strategicPlans : undefined),
      vibeTasks: vibeTasks || (project as any).vibeTasks || (existingIdx >= 0 ? this.projects[existingIdx].vibeTasks : undefined)
    };

    if (existingIdx >= 0) {
      this.projects[existingIdx] = record;
    } else {
      this.projects = [record, ...this.projects];
    }

    this.saveToStorage(record);

    auditLogger.log({
      actorId: userId || 'anonymous',
      actorEmail: user?.email || 'user',
      actorRole: user?.role || 'client',
      tenantId: tenantId,
      action: 'project.specs.synthesized',
      status: 'SUCCESS',
      resourceType: 'project',
      resourceId: record.id,
      details: `Synthesized complete 22-file .specs suite for "${record.name}" under tenant ${tenantId}.`
    });

    return record;
  }

  updateProjectMetadata(id: string, updates: { name?: string; version?: string; status?: 'draft' | 'generated' }): SavedProjectRecord | null {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.projects[idx] = {
      ...this.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
      lastModified: new Date()
    };

    this.saveToStorage(this.projects[idx]);
    return this.projects[idx];
  }

  updateFileContent(projectId: string, filePath: string, content: string): boolean {
    const idx = this.projects.findIndex(p => p.id === projectId);
    if (idx === -1) return false;

    if (!this.projects[idx].specsHierarchy) {
      this.projects[idx].specsHierarchy = synthesizeSpecsSuite(this.projects[idx]);
    }

    this.projects[idx].specsHierarchy![filePath] = content;
    this.projects[idx].updatedAt = new Date().toISOString();
    this.projects[idx].lastModified = new Date();

    this.saveToStorage(this.projects[idx]);
    return true;
  }

  deleteProject(id: string): boolean {
    const targetProj = this.projects.find(p => p.id === id);
    const initialLen = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveToStorage();

    // 1. Purge standalone specs storage if present
    try {
      const rawSpecs = localStorage.getItem(STORAGE_SPECS_KEY);
      if (rawSpecs) {
        const specsMap = JSON.parse(rawSpecs);
        if (specsMap[id]) {
          delete specsMap[id];
          localStorage.setItem(STORAGE_SPECS_KEY, JSON.stringify(specsMap));
        }
      }
    } catch {}

    // 2. Purge questionnaire form draft if it matches the deleted project
    try {
      const rawDraft = localStorage.getItem('srs_genie_active_form_draft');
      if (rawDraft) {
        const parsedDraft = JSON.parse(rawDraft);
        const draftProjectName =
          parsedDraft?.formData?.project_overview?.project_name ||
          parsedDraft?.formData?.projectName ||
          parsedDraft?.formData?.name ||
          parsedDraft?.projectName;
        if (
          targetProj &&
          (draftProjectName?.trim().toLowerCase() === targetProj.name?.trim().toLowerCase() ||
           parsedDraft?.id === id)
        ) {
          localStorage.removeItem('srs_genie_active_form_draft');
        }
      }
    } catch {}

    // 3. Purge MCP Agent keys linked to this project
    if (targetProj) {
      saasStore.deleteMcpKeysForProject(targetProj.id, targetProj.name);
    }

    auditLogger.log({
      actorId: 'user',
      action: 'project.deleted',
      status: 'SUCCESS',
      resourceType: 'project',
      resourceId: id,
      details: `Project "${targetProj?.name || id}" and all associated specification files were purged.`
    });

    apiService.deleteProject(id).catch(() => {});
    this.notifyListeners();
    return this.projects.length < initialLen;
  }

  clearAllProjects() {
    this.projects = [];
    this.saveToStorage();
    try {
      localStorage.removeItem(STORAGE_SPECS_KEY);
      localStorage.removeItem('srs_genie_active_form_draft');
    } catch {}
    this.notifyListeners();
  }
}

export const projectStore = new ProjectStore();
