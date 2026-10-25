import { ProjectInput, GeneratedContent } from '../types';
import { synthesizeSpecsSuite } from './specGeneratorService';

const STORAGE_PROJECTS_KEY = 'srs_genie_saved_projects';
const STORAGE_SPECS_KEY = 'srs_genie_specs_hierarchies';

export interface SavedProjectRecord extends ProjectInput {
  userId?: string;
  specsHierarchy?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

class ProjectStore {
  private projects: SavedProjectRecord[] = [];

  constructor() {
    this.loadFromStorage();
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

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(this.projects));
    } catch (e) {}
  }

  // CRUD Operations
  getAllProjects(): SavedProjectRecord[] {
    return [...this.projects];
  }

  getProjectById(id: string): SavedProjectRecord | undefined {
    return this.projects.find(p => p.id === id);
  }

  createProject(input: {
    name: string;
    version?: string;
    formData?: any;
    userId?: string;
  }): SavedProjectRecord {
    const newProj: SavedProjectRecord = {
      id: `proj_${Date.now()}`,
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
    return newProj;
  }

  saveFullProject(project: ProjectInput, specs?: Record<string, string>): SavedProjectRecord {
    const existingIdx = this.projects.findIndex(p => p.id === project.id);
    const now = new Date().toISOString();

    const record: SavedProjectRecord = {
      ...project,
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
    return this.projects.length < initialLen;
  }
}

export const projectStore = new ProjectStore();
