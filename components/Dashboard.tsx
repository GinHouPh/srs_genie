import React, { useState, useEffect } from 'react';
import {
  Plus,
  Clock,
  FileText,
  Network,
  ShieldAlert,
  FolderTree,
  ArrowRight,
  Trash2,
  Edit2,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { ProjectInput, User } from '../types';
import { projectStore, SavedProjectRecord } from '../services/projectStore';

interface DashboardProps {
  onNewProject: () => void;
  onSelectProject?: (proj: ProjectInput) => void;
  onOpenMcpHub?: () => void;
  onOpenAdmin?: () => void;
  onOpenSubscription?: () => void;
  user?: User | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewProject,
  onSelectProject,
  onOpenMcpHub,
  onOpenAdmin,
  onOpenSubscription,
  user
}) => {
  const [projects, setProjects] = useState<SavedProjectRecord[]>([]);
  const [editingProject, setEditingProject] = useState<SavedProjectRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editVersion, setEditVersion] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isBusinessOwnerOrStaff = user?.role === 'admin' || user?.role === 'staff';
  const isClient = user?.role === 'client';

  const refreshProjects = () => {
    const all = projectStore.getAllProjects();
    if (isClient && user) {
      setProjects(all.filter(p => !p.userId || p.userId === user.id));
    } else {
      setProjects(all);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    projectStore.deleteProject(id);
    refreshProjects();
    setDeletingId(null);
    showToast(`Deleted specification: "${name}"`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) return;

    projectStore.updateProjectMetadata(editingProject.id, {
      name: editName.trim(),
      version: editVersion.trim() || '1.0.0'
    });

    refreshProjects();
    setEditingProject(null);
    showToast('Project details updated.');
  };

  return (
    <div className="shell py-8 space-y-10 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-box border border-accent text-white px-5 py-3 shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="font-display text-xs uppercase tracking-[0.1em]">{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="agape-card p-8 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="eyebrow mb-3">
              {isBusinessOwnerOrStaff ? 'Executive Workspace' : 'Client Specification Hub'}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-[0.04em] uppercase">
              {isClient ? 'My Specifications' : 'Specifications & Projects'}
            </h1>
            <p className="font-body text-sm text-muted mt-2 max-w-2xl">
              {isClient
                ? 'Architect, build, and download modular 6-tier .specs suites designed for autonomous AI agents like Claude Code, Cursor, and Windsurf.'
                : 'Executive overview: manage client accounts, staff access, pricing models, and generated specification deliverables.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenMcpHub && (
              <button
                onClick={onOpenMcpHub}
                className="btn btn--ghost"
              >
                <Network className="w-4 h-4 text-accent" />
                <span>MCP Gateway</span>
              </button>
            )}

            <button
              onClick={onNewProject}
              className="btn btn--accent"
            >
              <Plus className="w-4 h-4" />
              <span>New Specification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Agape Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="stat">
          <span className="stat__value">{projects.length}</span>
          <span className="stat__label">Total Specifications</span>
        </div>

        <div className="stat">
          <span className="stat__value text-accent">22</span>
          <span className="stat__label">Files In .Specs Suite</span>
        </div>

        <div className="stat">
          <span className="stat__value text-white">
            {isClient ? (user?.plan ? user.plan.toUpperCase() : 'PRO') : 'ADMIN'}
          </span>
          <span className="stat__label">Active Service Level</span>
        </div>
      </div>

      {/* Quick Action Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="agape-card p-6 flex flex-col justify-between group">
          <div>
            <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
              <FolderTree className="w-5 h-5" />
            </div>
            <div className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-1 font-semibold">
              Architecture
            </div>
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
              6-Tier .specs Suite
            </h3>
            <p className="font-body text-xs text-muted leading-relaxed">
              Produces 22 atomic specification documents covering Foundation, Domain, Workflow, State, UI, and Execution rules.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-line flex items-center text-xs font-display uppercase tracking-[0.16em] text-accent">
            Brief, API, DB & Tasks <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        <div
          onClick={onOpenMcpHub}
          className="agape-card p-6 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
              <Network className="w-5 h-5" />
            </div>
            <div className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-1 font-semibold">
              Connectivity
            </div>
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2 group-hover:text-accent transition-colors">
              MCP Agent Protocol
            </h3>
            <p className="font-body text-xs text-muted leading-relaxed">
              Standard Model Context Protocol gateway enabling AI tools to pull project context without copy-pasting.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-line flex items-center text-xs font-display uppercase tracking-[0.16em] text-accent">
            Configure Live Keys <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Business Owner / Staff sees Admin Console */}
        {isBusinessOwnerOrStaff ? (
          <div
            onClick={onOpenAdmin}
            className="agape-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-1 font-semibold">
                Governance
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2 group-hover:text-accent transition-colors">
                SaaS Console
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Manage accounts, staff permissions, subscription tiers, invoicing, and platform telemetry.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line flex items-center text-xs font-display uppercase tracking-[0.16em] text-accent">
              Open Admin Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        ) : (
          <div
            onClick={onOpenSubscription}
            className="agape-card p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                  Subscription
                </span>
                <span className="badge--on text-[10px]">Active</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2 group-hover:text-accent transition-colors">
                {user?.plan || 'Pro'} Tier
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Full access to 22-file .specs downloads, high-speed Gemini synthesis, and MCP gateway integration.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line flex items-center text-xs font-display uppercase tracking-[0.16em] text-accent">
              Manage Quotas & Billing <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Projects Grid Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-[0.06em] uppercase">
              {isClient ? 'My Specifications' : 'Specifications Register'} ({projects.length})
            </h2>
            <span className="font-body text-xs text-muted">
              Select any project to view, edit files, or download the .specs archive
            </span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center agape-card">
            <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
              No Specifications Generated
            </h3>
            <p className="font-body text-xs text-muted max-w-md mx-auto mb-6">
              Launch our 15-step software specification interview to build an agent-ready documentation suite.
            </p>
            <button
              onClick={onNewProject}
              className="btn btn--accent"
            >
              <Plus className="w-4 h-4" />
              <span>Create Specification Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="agape-card p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      onClick={() => onSelectProject?.(proj)}
                      className="w-10 h-10 bg-box border border-line flex items-center justify-center cursor-pointer group-hover:border-accent transition-colors"
                    >
                      <FileText className="w-5 h-5 text-accent" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={proj.status === 'generated' ? 'badge--on' : 'badge--off'}>
                        {proj.status === 'generated' ? '.specs Ready' : 'Draft'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(proj);
                          setEditName(proj.name);
                          setEditVersion(proj.version);
                        }}
                        className="p-1.5 text-muted hover:text-white bg-box hover:bg-accent/40 border border-line transition-all"
                        title="Edit project name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(proj.id);
                        }}
                        className="p-1.5 text-muted hover:text-accent bg-box hover:bg-accent/40 border border-line transition-all"
                        title="Delete specification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3
                    onClick={() => onSelectProject?.(proj)}
                    className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1 cursor-pointer group-hover:text-accent transition-colors"
                  >
                    {proj.name}
                  </h3>
                  <p className="font-mono text-xs text-muted mb-4">
                    v{proj.version} · {Object.keys(proj.specsHierarchy || {}).length || 22} Atomic Spec Files
                  </p>
                </div>

                <div
                  onClick={() => onSelectProject?.(proj)}
                  className="pt-4 border-t border-line flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="flex items-center text-muted font-body">
                    <Clock className="w-3.5 h-3.5 mr-1 text-muted" />
                    {new Date(proj.lastModified).toLocaleDateString()}
                  </span>
                  <span className="font-display uppercase tracking-[0.14em] text-accent font-semibold group-hover:text-white transition-colors flex items-center">
                    Explore .specs →
                  </span>
                </div>
              </div>
            ))}

            {/* New Specification Card */}
            <div
              onClick={onNewProject}
              className="border-2 border-dashed border-line hover:border-accent p-8 flex flex-col items-center justify-center text-center cursor-pointer group transition-all min-h-[220px]"
            >
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent mb-3 transition-all">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-display text-sm uppercase tracking-[0.16em] text-white font-semibold">
                New Specification
              </span>
              <span className="font-body text-xs text-muted mt-1">
                15-Step Guided Questionnaire
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">
              Edit Specification Details
            </h3>
            <p className="font-body text-xs text-muted mb-6">
              Update the project title and version number for this specification.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="field">
                <label className="field__label">Specification Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-ink border border-line px-4 py-2.5 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Version Number</label>
                <input
                  type="text"
                  value={editVersion}
                  onChange={e => setEditVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="w-full bg-ink border border-line px-4 py-2.5 text-sm text-white focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-sm shadow-2xl">
            <div className="w-10 h-10 bg-accent-soft border border-accent/30 flex items-center justify-center text-accent mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
              Delete Specification?
            </h3>
            <p className="font-body text-xs text-muted mb-6">
              Are you sure? All 22 generated .specs files and AI agent tasks will be permanently removed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="btn btn-sm btn--ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const proj = projects.find(p => p.id === deletingId);
                  if (proj) handleDelete(proj.id, proj.name);
                }}
                className="btn btn-sm btn--accent"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
