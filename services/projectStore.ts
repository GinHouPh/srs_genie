import { ProjectInput, GeneratedContent, User } from '../types';
import { synthesizeSpecsSuite } from './specGeneratorService';
import { auditLogger } from './auditLogger';
import { apiService } from './apiService';

const STORAGE_PROJECTS_KEY = 'srs_genie_saved_projects';
const STORAGE_SPECS_KEY = 'srs_genie_specs_hierarchies';

export interface SavedProjectRecord extends ProjectInput {
  userId?: string;
  tenantId?: string;
  specsHierarchy?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

class ProjectStore {
  private projects: SavedProjectRecord[] = [];

  constructor() {
    this.loadFromStorage();
    this.syncFromServer();
  }

  async syncFromServer() {
    try {
      const serverProjects = await apiService.fetchProjects();
      if (serverProjects && serverProjects.length > 0) {
        for (const sp of serverProjects) {
          const idx = this.projects.findIndex(p => p.id === sp.id);
          const mapped: SavedProjectRecord = {
            id: sp.id,
            name: sp.title || 'Untitled',
            userId: sp.userId,
            tenantId: sp.tenantId,
            status: sp.status || 'draft',
            createdAt: sp.createdAt,
            updatedAt: sp.updatedAt,
            lastModified: new Date(sp.updatedAt || Date.now()),
            formData: sp.formData,
            content: sp.content,
            vibeTasks: sp.vibeTasks
          };
          if (idx >= 0) {
            this.projects[idx] = { ...this.projects[idx], ...mapped };
          } else {
            this.projects.push(mapped);
          }
        }
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(this.projects));
      }
    } catch {}
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (stored) {
        this.projects = JSON.parse(stored);
      } else {
        // Start with a clean starter project so user can immediately test without having to re-type 15 forms
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
        this.projects = [starterProject];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('LocalStorage error in ProjectStore:', e);
    }
  }

  private saveToStorage(projectToSync?: SavedProjectRecord) {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(this.projects));
      const target = projectToSync || this.projects[0];
      if (target) {
        apiService.saveProject({
          id: target.id,
          userId: target.userId,
          tenantId: target.tenantId,
          title: target.name,
          description: target.formData?.project_overview?.industry || '',
          status: target.status,
          tierCompletion: 100,
          formData: target.formData,
          content: target.content,
          vibeTasks: target.vibeTasks
        }).catch(() => {});
      }
    } catch (e) {}
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
    this.saveToStorage();

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

  saveFullProject(project: ProjectInput, specs?: Record<string, string>, user?: User | null): SavedProjectRecord {
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
      specsHierarchy: specs || (existingIdx >= 0 ? this.projects[existingIdx].specsHierarchy : synthesizeSpecsSuite(project))
    };

    if (existingIdx >= 0) {
      this.projects[existingIdx] = record;
    } else {
      this.projects = [record, ...this.projects];
    }

    this.saveToStorage();

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

    this.saveToStorage();
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

    this.saveToStorage();
    return true;
  }

  deleteProject(id: string): boolean {
    const initialLen = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveToStorage();
    apiService.deleteProject(id).catch(() => {});
    return this.projects.length < initialLen;
  }

  clearAllProjects() {
    this.projects = [];
    this.saveToStorage();
  }
}

export const projectStore = new ProjectStore();
