import React, { useState, useEffect } from 'react';
import { MarkdownViewer } from './MarkdownViewer';
import { GeneratedContent, VibeTask, PreviewSessionState, PreviewTabId, IdeRuleTarget } from '../types';
import {
  Download,
  FileText,
  Code2,
  Copy,
  Check,
  Terminal,
  FileCode,
  FolderTree,
  Network,
  FileArchive,
  ChevronRight,
  Eye,
  CheckCircle2,
  Edit3,
  Save,
  RotateCcw,
  Trash2,
  Layers,
  Printer,
  BookOpen,
  Sliders,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  GitBranch,
  Clock,
  User,
  CheckSquare
} from 'lucide-react';
import { downloadSpecsZip, SPEC_TIERS, generateIdeRules } from '../services/specGeneratorService';
import { STRATEGIC_PLAN_DEFINITIONS } from '../services/specAgentPrompts';
import { McpHub } from './McpHub';
import { projectStore } from '../services/projectStore';
import { compileConsolidatedIeee830SRS } from '../services/srsDocumentCompiler';

interface DocumentPreviewProps {
  content: GeneratedContent;
  onReset: () => void;
  onOpenMcpHub?: () => void;
  onDeleteProject?: (id: string, name: string) => void;
  initialPreviewState?: PreviewSessionState;
  onPreviewStateChange?: (state: PreviewSessionState) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  content,
  onReset,
  onOpenMcpHub,
  onDeleteProject,
  initialPreviewState,
  onPreviewStateChange
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTabId>(initialPreviewState?.activeTab || 'specs_suite');
  const [selectedPlanFilename, setSelectedPlanFilename] = useState<string>(initialPreviewState?.selectedPlanFilename || 'project_plan.md');
  const [selectedIdeRule, setSelectedIdeRule] = useState<IdeRuleTarget>(initialPreviewState?.selectedIdeRule || 'cursor');
  const [selectedFilePath, setSelectedFilePath] = useState<string>(initialPreviewState?.selectedFilePath || '_index.md');
  const [unsavedEdits, setUnsavedEdits] = useState<Record<string, string>>(initialPreviewState?.unsavedEdits || {});
  const [viewSource, setViewSource] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState<string>('');

  const specs = content.specsHierarchy || {};
  const activeFileContent = specs[selectedFilePath] || content.srsMarkdown || '# Specification\n\nNo content loaded.';
  const projectName = content.projectMeta?.projectName || 'Project';
  const ideRules = generateIdeRules(projectName);
  const formalIeeeSrs = compileConsolidatedIeee830SRS(content);

  useEffect(() => {
    const pendingDraft = unsavedEdits[selectedFilePath];
    if (pendingDraft !== undefined && pendingDraft !== activeFileContent) {
      setEditedText(pendingDraft);
      setIsEditing(true);
    } else {
      setEditedText(activeFileContent);
      setIsEditing(false);
    }
  }, [selectedFilePath, activeFileContent]);

  useEffect(() => {
    if (!onPreviewStateChange) return;
    const timer = setTimeout(() => {
      const nextUnsaved = { ...unsavedEdits };
      if (isEditing && editedText !== activeFileContent) {
        nextUnsaved[selectedFilePath] = editedText;
      } else if (nextUnsaved[selectedFilePath] !== undefined && editedText === activeFileContent) {
        delete nextUnsaved[selectedFilePath];
      }
      onPreviewStateChange({
        activeTab,
        selectedFilePath,
        selectedPlanFilename,
        selectedIdeRule,
        unsavedEdits: Object.keys(nextUnsaved).length > 0 ? nextUnsaved : undefined
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [activeTab, selectedFilePath, selectedPlanFilename, selectedIdeRule, isEditing, editedText, activeFileContent, unsavedEdits, onPreviewStateChange]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadSpecsZip(specs, content.projectMeta?.projectName || 'project', content.strategicPlans);
    } catch (e) {
      console.error('Failed to download specs zip', e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadSingleFile = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.split('/').pop() || 'spec.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveFileEdits = () => {
    specs[selectedFilePath] = editedText;
    if (content.projectMeta?.projectName) {
      const allProjects = projectStore.getAllProjects();
      const matched = allProjects.find(p => p.name === content.projectMeta?.projectName);
      if (matched) {
        projectStore.updateFileContent(matched.id, selectedFilePath, editedText);
      }
    }
    setUnsavedEdits(prev => {
      if (!(selectedFilePath in prev)) return prev;
      const next = { ...prev };
      delete next[selectedFilePath];
      return next;
    });
    setIsEditing(false);
    showToast(`Saved changes to ${selectedFilePath}`);
  };

  const handleConfirmDelete = () => {
    const projName = content.projectMeta?.projectName || 'Project';
    const allProjects = projectStore.getAllProjects();
    const matched = allProjects.find(p => p.name === projName);
    const idToDelete = matched?.id || '';
    if (onDeleteProject && idToDelete) {
      onDeleteProject(idToDelete, projName);
    } else if (idToDelete) {
      projectStore.deleteProject(idToDelete);
    }
    setShowDeleteModal(false);
    onReset();
  };

  return (
    <div className="shell flex flex-col h-[calc(100vh-90px)] py-4">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-box border border-accent text-white px-5 py-3 shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="font-display text-xs uppercase tracking-[0.1em]">{toastMsg}</span>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="agape-card p-3.5 flex flex-col md:flex-row justify-between items-center gap-4 no-print border-b-0">
        {/* Main Tab Controls */}
        <div className="flex bg-ink p-1 border border-line overflow-x-auto w-full md:w-auto font-display text-xs uppercase tracking-[0.14em]">
          <button
            onClick={() => setActiveTab('specs_suite')}
            className={`flex items-center px-4 py-2 transition-all whitespace-nowrap ${
              activeTab === 'specs_suite'
                ? 'bg-accent text-white font-semibold'
                : 'text-muted hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4 mr-2" />
            .specs Suite ({Object.keys(specs).length || 33} Files)
          </button>

          {content.strategicPlans && Object.keys(content.strategicPlans).length > 0 && (
            <button
              onClick={() => setActiveTab('strategic_plans')}
              className={`flex items-center px-4 py-2 transition-all whitespace-nowrap ${
                activeTab === 'strategic_plans'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 mr-2" />
              9 Staging Plans ({Object.keys(content.strategicPlans).length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('formal_srs')}
            className={`flex items-center px-4 py-2 transition-all whitespace-nowrap ${
              activeTab === 'formal_srs'
                ? 'bg-accent text-white font-semibold'
                : 'text-muted hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Formal SRS (IEEE 830)
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center px-4 py-2 transition-all whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-accent text-white font-semibold'
                : 'text-muted hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 mr-2" />
            Task Board ({content.implementationTasks?.length || 6})
          </button>

          <button
            onClick={() => setActiveTab('ide_rules')}
            className={`flex items-center px-4 py-2 transition-all whitespace-nowrap ${
              activeTab === 'ide_rules'
                ? 'bg-accent text-white font-semibold'
                : 'text-muted hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4 mr-2" />
            AI IDE Rules
          </button>

          <button
            onClick={() => setActiveTab('mcp_connect')}
            className={`flex items-center px-4 py-2 transition-all whitespace-nowrap ${
              activeTab === 'mcp_connect'
                ? 'bg-accent text-white font-semibold'
                : 'text-muted hover:text-white'
            }`}
          >
            <Network className="w-4 h-4 mr-2" />
            Agent MCP Gateway
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {activeTab === 'formal_srs' && (
            <>
              <button
                onClick={() => window.print()}
                className="btn btn-sm btn--ghost"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print / Save PDF
              </button>
              <button
                onClick={() => copyToClipboard(formalIeeeSrs, 'ieee_srs')}
                className="btn btn-sm btn--ghost"
              >
                {copiedKey === 'ieee_srs' ? <Check className="w-3.5 h-3.5 mr-1 text-accent" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                Copy SRS
              </button>
              <button
                onClick={() => handleDownloadSingleFile(`${projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}-IEEE-830-SRS.md`, formalIeeeSrs)}
                className="btn btn-sm btn--ghost"
                title="Download IEEE 830 SRS Markdown"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                .md
              </button>
            </>
          )}

          {activeTab === 'ide_rules' && (
            <>
              <button
                onClick={() => {
                  const targetContent = selectedIdeRule === 'agents_md' ? (specs['AGENTS.md'] || ideRules.agentRules) :
                    selectedIdeRule === 'cursor' ? ideRules.cursorRules :
                    selectedIdeRule === 'claude' ? ideRules.claudeMd :
                    selectedIdeRule === 'windsurf' ? ideRules.windsurfRules : ideRules.agentRules;
                  copyToClipboard(targetContent, 'ide_rule');
                }}
                className="btn btn-sm btn--ghost"
              >
                {copiedKey === 'ide_rule' ? <Check className="w-3.5 h-3.5 mr-1 text-accent" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                Copy Rule
              </button>
              <button
                onClick={() => {
                  const targetFile = selectedIdeRule === 'agents_md' ? 'AGENTS.md' :
                    selectedIdeRule === 'cursor' ? '.cursorrules' :
                    selectedIdeRule === 'claude' ? 'CLAUDE.md' :
                    selectedIdeRule === 'windsurf' ? '.windsurfrules' : '.agentrules';
                  const targetContent = selectedIdeRule === 'agents_md' ? (specs['AGENTS.md'] || ideRules.agentRules) :
                    selectedIdeRule === 'cursor' ? ideRules.cursorRules :
                    selectedIdeRule === 'claude' ? ideRules.claudeMd :
                    selectedIdeRule === 'windsurf' ? ideRules.windsurfRules : ideRules.agentRules;
                  handleDownloadSingleFile(targetFile, targetContent);
                }}
                className="btn btn-sm btn--ghost"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download
              </button>
            </>
          )}
          {activeTab === 'specs_suite' && (
            <>
              {/* Edit Mode Toggle */}
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveFileEdits}
                    className="btn btn-sm btn--accent"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    Save File
                  </button>
                  <button
                    onClick={() => {
                      setEditedText(activeFileContent);
                      setIsEditing(false);
                    }}
                    className="btn btn-sm btn--ghost"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn--ghost"
                  title="Edit this spec file"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-accent" />
                  Edit File
                </button>
              )}

              {/* Toggle Source vs Preview */}
              {!isEditing && (
                <button
                  onClick={() => setViewSource(!viewSource)}
                  className="btn btn-sm btn--ghost"
                  title="Toggle Markdown Raw / Preview"
                >
                  {viewSource ? <Eye className="w-3.5 h-3.5 mr-1" /> : <Code2 className="w-3.5 h-3.5 mr-1" />}
                  {viewSource ? 'Preview' : 'Raw'}
                </button>
              )}

              {/* Copy Current File */}
              <button
                onClick={() => copyToClipboard(isEditing ? editedText : activeFileContent, 'current_file')}
                className="btn btn-sm btn--ghost"
              >
                {copiedKey === 'current_file' ? (
                  <Check className="w-3.5 h-3.5 mr-1 text-accent" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                Copy
              </button>

              {/* Download Current File */}
              <button
                onClick={() => handleDownloadSingleFile(selectedFilePath, isEditing ? editedText : activeFileContent)}
                className="btn btn-sm btn--ghost"
                title="Download this file"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                .md
              </button>
            </>
          )}

          {/* Download Complete .specs ZIP */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="btn btn-sm btn--accent disabled:opacity-50"
          >
            <FileArchive className="w-4 h-4 mr-1.5" />
            {isZipping ? 'Packaging...' : 'Download .specs ZIP'}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-sm btn--ghost text-accent hover:border-accent hover:bg-accent/10 flex items-center gap-1.5"
            title="Delete this entire specification suite"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>

          <button
            onClick={onReset}
            className="btn btn-sm btn--ghost hover:border-accent hover:text-accent"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Content Viewer Container */}
      <div className="flex-1 overflow-hidden bg-ink border border-line relative">
        {/* VIEW 1: COMPLETE .SPECS SUITE (Tree Sidebar + Markdown Preview / Editor) */}
        {activeTab === 'specs_suite' && (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Sidebar: Spec Hierarchy Explorer (320px) */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-line bg-surface overflow-y-auto p-4 space-y-4">
              <div className="px-1 py-1 flex items-center justify-between border-b border-line pb-2">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Spec Tiers
                </span>
                <span className="badge--on text-[9px]">
                  Agent Ready
                </span>
              </div>

              {SPEC_TIERS.map(tier => (
                <div key={tier.tier} className="space-y-1">
                  <div className="px-1 py-1 font-display text-xs font-semibold text-white uppercase tracking-[0.1em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent" />
                    <span>{tier.tier}: {tier.name}</span>
                  </div>
                  <div className="space-y-0.5 pl-3">
                    {tier.files.map(file => {
                      const isSelected = selectedFilePath === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => {
                            if (isEditing) {
                              if (confirm('Discard unsaved edits in current file?')) {
                                setSelectedFilePath(file.path);
                              }
                            } else {
                              setSelectedFilePath(file.path);
                            }
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-xs font-mono transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-box text-white font-semibold border-l-2 border-accent'
                              : 'text-muted hover:text-white hover:bg-box/50'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <span>{file.path}</span>
                            {file.path === 'AGENTS.md' && (
                              <span className="px-1 py-0.2 bg-accent/20 text-accent text-[8px] font-mono border border-accent/40 rounded-sm">
                                ROOT
                              </span>
                            )}
                          </span>
                          {isSelected && <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Pane: Document Viewer / Editor */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-ink">
              {/* Document Header Breadcrumb */}
              <div className="p-3 bg-surface border-b border-line flex items-center justify-between text-xs text-muted font-mono">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-accent" />
                  <span className="text-white font-semibold">
                    {selectedFilePath === 'AGENTS.md' ? 'AGENTS.md (Root Universal Manifest)' : `.specs/${selectedFilePath}`}
                  </span>
                  {isEditing && (
                    <span className="badge--on text-[9px]">
                      Editing
                    </span>
                  )}
                </div>
                <div className="font-mono text-muted text-[11px]">
                  {(isEditing ? editedText : activeFileContent).split('\n').length} lines · Markdown
                </div>
              </div>

              {/* Document Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                {isEditing ? (
                  <textarea
                    value={editedText}
                    onChange={e => setEditedText(e.target.value)}
                    className="w-full h-full min-h-[500px] bg-ink text-white font-mono text-xs p-4 border border-line focus:border-accent outline-none resize-none leading-relaxed"
                    placeholder="Enter specification markdown..."
                  />
                ) : viewSource ? (
                  <pre className="font-mono text-xs text-body whitespace-pre-wrap leading-relaxed">
                    {activeFileContent}
                  </pre>
                ) : (
                  <div className="max-w-4xl mx-auto py-2">
                    <MarkdownViewer content={activeFileContent} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: 9 STRATEGIC PLANNING DOCUMENTS */}
        {activeTab === 'strategic_plans' && content.strategicPlans && (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Sidebar: Staging Plans List */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-line bg-surface overflow-y-auto p-4 space-y-4">
              <div className="px-1 py-1 flex items-center justify-between border-b border-line pb-2">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Strategic Plans
                </span>
                <span className="badge--on text-[9px]">
                  Pre-Specs Stage
                </span>
              </div>

              <div className="space-y-1">
                {STRATEGIC_PLAN_DEFINITIONS.map(plan => {
                  const hasPlan = Boolean(content.strategicPlans?.[plan.filename]);
                  const isSelected = selectedPlanFilename === plan.filename;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanFilename(plan.filename)}
                      className={`w-full text-left p-2.5 border transition-all ${
                        isSelected
                          ? 'border-accent bg-box text-white'
                          : hasPlan
                          ? 'border-line/40 bg-ink/40 text-gray-300 hover:text-white hover:border-line'
                          : 'border-transparent text-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-semibold">{plan.filename}</span>
                        {hasPlan && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-muted line-clamp-1">{plan.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Markdown Viewer for Selected Staging Plan */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-ink custom-scrollbar">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 pb-3 border-b border-line/60 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-base font-semibold text-white uppercase tracking-wider">
                      {STRATEGIC_PLAN_DEFINITIONS.find(d => d.filename === selectedPlanFilename)?.title || selectedPlanFilename}
                    </h2>
                    <p className="text-xs text-muted">
                      Author: {STRATEGIC_PLAN_DEFINITIONS.find(d => d.filename === selectedPlanFilename)?.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const text = content.strategicPlans?.[selectedPlanFilename] || '';
                        navigator.clipboard.writeText(text);
                        showToast(`Copied ${selectedPlanFilename} to clipboard`);
                      }}
                      className="btn btn-sm btn--ghost"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy .md
                    </button>
                    <button
                      onClick={() => {
                        const text = content.strategicPlans?.[selectedPlanFilename] || '';
                        handleDownloadSingleFile(selectedPlanFilename, text);
                      }}
                      className="btn btn-sm btn--ghost"
                      title="Download this planning document"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      .md
                    </button>
                  </div>
                </div>

                <MarkdownViewer content={content.strategicPlans[selectedPlanFilename] || '# Document not found.'} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: EXECUTION TASKS BOARD */}
        {activeTab === 'tasks' && (() => {
          const allTasks = content.implementationTasks || [];
          const filteredTasks = allTasks.filter(task => {
            if (taskStatusFilter !== 'all' && (task.status || 'todo') !== taskStatusFilter) return false;
            if (taskTypeFilter !== 'all' && (task.type || 'backend') !== taskTypeFilter) return false;
            if (taskSearchQuery.trim()) {
              const q = taskSearchQuery.toLowerCase();
              const matchId = (task.id || '').toLowerCase().includes(q);
              const matchTitle = (task.title || '').toLowerCase().includes(q);
              const matchDesc = (task.description || '').toLowerCase().includes(q);
              const matchGov = (task.governs || '').toLowerCase().includes(q);
              const matchFiles = (task.scopeIncluded || []).some(f => f.toLowerCase().includes(q));
              const matchCaps = (task.requiredCapabilities || []).some(c => c.toLowerCase().includes(q));
              if (!matchId && !matchTitle && !matchDesc && !matchGov && !matchFiles && !matchCaps) return false;
            }
            return true;
          });

          const taskCounts = {
            total: allTasks.length,
            todo: allTasks.filter(t => (t.status || 'todo') === 'todo').length,
            claimed: allTasks.filter(t => t.status === 'claimed').length,
            inProgress: allTasks.filter(t => t.status === 'in-progress').length,
            review: allTasks.filter(t => t.status === 'review').length,
            done: allTasks.filter(t => t.status === 'done').length,
            blocked: allTasks.filter(t => t.status === 'blocked').length
          };

          return (
            <div className="h-full overflow-y-auto p-4 sm:p-8 bg-ink custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Information Banner */}
                <div className="agape-card p-6 border-accent/40 bg-surface">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-accent" />
                      <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase">
                        System 2 Multi-Agent Task Board & Execution Matrix
                      </h3>
                    </div>
                    <span className="badge--on text-[10px] font-mono self-start sm:self-auto">
                      Synchronized with .specs/coordination/task_board.md
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted leading-relaxed">
                    Extracted from <code className="text-white bg-box px-1.5 py-0.5 font-mono">.specs/execution/tasks.md</code>. 
                    Every atomic task defines strict file boundaries (<code className="text-accent font-mono">INCLUDED</code> vs <code className="text-rose-400 font-mono">EXCLUDED</code>), 
                    required agent capabilities, and evidence-based verification targets for concurrent, conflict-free AI execution across Git worktrees.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="agape-card p-4 space-y-3 bg-surface/80">
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={taskSearchQuery}
                        onChange={e => setTaskSearchQuery(e.target.value)}
                        placeholder="Search tasks by ID, title, capability, or file scope..."
                        className="w-full bg-ink text-white pl-9 pr-8 py-2 text-xs font-mono border border-line focus:border-accent outline-none"
                      />
                      {taskSearchQuery && (
                        <button
                          onClick={() => setTaskSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-white text-xs font-mono"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-muted overflow-x-auto pb-1 md:pb-0">
                      <span className="text-white font-semibold">{filteredTasks.length}</span> of <span>{allTasks.length} Tasks</span>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-line/60">
                    <span className="text-[10px] font-display uppercase tracking-wider text-muted mr-1">Status:</span>
                    {[
                      { id: 'all', label: `All (${taskCounts.total})` },
                      { id: 'todo', label: `Todo (${taskCounts.todo})` },
                      { id: 'claimed', label: `Claimed (${taskCounts.claimed})` },
                      { id: 'in-progress', label: `In Progress (${taskCounts.inProgress})` },
                      { id: 'review', label: `Review (${taskCounts.review})` },
                      { id: 'done', label: `Done (${taskCounts.done})` },
                      { id: 'blocked', label: `Blocked (${taskCounts.blocked})` }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setTaskStatusFilter(st.id)}
                        className={`px-2 py-0.5 text-[10px] font-mono transition-all border ${
                          taskStatusFilter === st.id
                            ? 'bg-accent text-white border-accent font-semibold'
                            : 'bg-box/50 text-muted border-line hover:text-white hover:border-line-hover'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Type Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-display uppercase tracking-wider text-muted mr-1">Domain:</span>
                    {[
                      { id: 'all', label: 'All Domains' },
                      { id: 'setup', label: 'Setup' },
                      { id: 'backend', label: 'Backend' },
                      { id: 'frontend', label: 'Frontend' },
                      { id: 'database', label: 'Database' },
                      { id: 'testing', label: 'Testing' },
                      { id: 'deployment', label: 'Deployment' }
                    ].map(tp => (
                      <button
                        key={tp.id}
                        onClick={() => setTaskTypeFilter(tp.id)}
                        className={`px-2 py-0.5 text-[10px] font-mono transition-all border ${
                          taskTypeFilter === tp.id
                            ? 'bg-white text-ink border-white font-semibold'
                            : 'bg-box/30 text-muted border-line hover:text-white'
                        }`}
                      >
                        {tp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task Cards Matrix */}
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="agape-card p-12 text-center text-muted">
                      <Terminal className="w-8 h-8 text-muted mx-auto mb-3 opacity-40" />
                      <p className="font-display text-sm uppercase tracking-wider text-white mb-1">No Matching Tasks Found</p>
                      <p className="text-xs">Adjust your status, domain filters, or search query above.</p>
                    </div>
                  ) : (
                    filteredTasks.map((task, idx) => {
                      const status = task.status || 'todo';
                      const statusClass =
                        status === 'done' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40' :
                        status === 'in-progress' ? 'bg-cyan-950/60 text-cyan-300 border-cyan-600/40' :
                        status === 'claimed' ? 'bg-amber-950/60 text-amber-300 border-amber-600/40' :
                        status === 'review' ? 'bg-purple-950/60 text-purple-300 border-purple-600/40' :
                        status === 'blocked' ? 'bg-rose-950/60 text-rose-300 border-rose-600/40' :
                        'bg-slate-900 text-slate-300 border-slate-700';

                      return (
                        <div
                          key={task.id || idx}
                          className="agape-card p-6 bg-surface border-line hover:border-line-hover transition-all space-y-4"
                        >
                          {/* Task Top Meta Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-line/60">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-accent/20 text-accent border border-accent/30">
                                  {task.id || `TASK-00${idx + 1}`}
                                </span>

                                <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border font-medium ${statusClass}`}>
                                  ● {status}
                                </span>

                                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-box text-muted border border-line">
                                  {task.type}
                                </span>

                                {task.complexity && (
                                  <span className="px-2 py-0.5 text-[10px] font-mono bg-box text-muted border border-line">
                                    Size: {task.complexity}
                                  </span>
                                )}

                                {task.dependsOn && (
                                  <span className="px-2 py-0.5 text-[10px] font-mono bg-box text-muted border border-line flex items-center gap-1">
                                    <GitBranch className="w-3 h-3 text-muted" />
                                    Depends: {task.dependsOn}
                                  </span>
                                )}

                                {task.reviewRequired && (
                                  <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-950/40 text-purple-300 border border-purple-800/40 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-purple-300" />
                                    Peer Review Required
                                  </span>
                                )}

                                {task.claimedBy && (
                                  <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-950/40 text-amber-300 border border-amber-800/40 flex items-center gap-1">
                                    <User className="w-3 h-3 text-amber-300" />
                                    Leased: {task.claimedBy}
                                  </span>
                                )}
                              </div>

                              <h4 className="font-display text-base font-semibold text-white uppercase tracking-[0.05em] pt-1">
                                {task.title}
                              </h4>
                            </div>

                            <button
                              onClick={() => copyToClipboard(task.prompt, `task_${task.id || idx}`)}
                              className="btn btn-sm btn--ghost shrink-0 self-start"
                            >
                              {copiedKey === `task_${task.id || idx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-accent" />
                                  <span>Prompt Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Task Prompt</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="font-body text-xs text-muted leading-relaxed">{task.description}</p>

                          {/* Multi-Agent System 2 Scope & Rule Governance Matrix */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-ink/70 p-3.5 border border-line">
                            {/* Governs & Spec References */}
                            <div className="space-y-2">
                              {task.governs && (
                                <div>
                                  <span className="text-[10px] font-display uppercase tracking-wider text-muted block mb-0.5">Governing Scope:</span>
                                  <span className="text-white text-[11px] font-medium">{task.governs}</span>
                                </div>
                              )}

                              {task.specRefs && task.specRefs.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-display uppercase tracking-wider text-muted block mb-1">Spec References:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {task.specRefs.map((ref, rIdx) => (
                                      <span key={rIdx} className="px-1.5 py-0.5 bg-box text-[10px] text-accent border border-line">
                                        {ref}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {task.requiredCapabilities && task.requiredCapabilities.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-display uppercase tracking-wider text-muted block mb-1">Required Capabilities:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {task.requiredCapabilities.map((cap, cIdx) => (
                                      <span key={cIdx} className="px-1.5 py-0.2 bg-box text-[10px] text-cyan-300 border border-line">
                                        {cap}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Scope Boundaries: INCLUDED vs EXCLUDED */}
                            <div className="space-y-2">
                              {task.scopeIncluded && task.scopeIncluded.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-display uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1">
                                    <CheckSquare className="w-3 h-3 text-emerald-400" />
                                    Scope Boundary: INCLUDED (Authorized to edit):
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {task.scopeIncluded.map((inc, iIdx) => (
                                      <span key={iIdx} className="px-1.5 py-0.2 bg-emerald-950/30 text-[10px] text-emerald-300 border border-emerald-800/40">
                                        {inc}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {task.scopeExcluded && task.scopeExcluded.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-display uppercase tracking-wider text-rose-400 block mb-1 flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                                    Scope Boundary: EXCLUDED (Protected):
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {task.scopeExcluded.map((exc, eIdx) => (
                                      <span key={eIdx} className="px-1.5 py-0.2 bg-rose-950/20 text-[10px] text-rose-400/80 border border-rose-900/30">
                                        {exc}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Verification Target */}
                          {task.verificationTarget && (
                            <div className="p-3 bg-box/40 border border-line text-xs font-mono space-y-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-wider text-cyan-400 font-semibold">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>Evidence-Based Verification Target:</span>
                              </div>
                              <p className="text-[11px] text-body pl-5">{task.verificationTarget}</p>
                            </div>
                          )}

                          {/* Actionable Prompt for AI Agent */}
                          <div className="p-4 bg-ink border border-line">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                                Formatted Task Prompt for AI Coding Agent:
                              </span>
                              <span className="text-[10px] font-mono text-muted">Ready for Cursor, Claude Code, Windsurf, or Antigravity</span>
                            </div>
                            <div className="font-mono text-xs text-white whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto custom-scrollbar bg-surface/50 p-3 border border-line/40">
                              {task.prompt}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* VIEW: FORMAL IEEE 830 SRS DOCUMENT */}
        {activeTab === 'formal_srs' && (
          <div className="h-full overflow-y-auto p-4 md:p-8 bg-ink custom-scrollbar">
            <div className="max-w-4xl mx-auto bg-surface border border-line p-6 md:p-12 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-line no-print">
                <div className="flex items-center gap-2">
                  <span className="badge--on text-[10px]">IEEE Std 830-1998</span>
                  <span className="text-xs text-muted font-mono">Formal Baselined Software Requirements Specification</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="btn btn-sm btn--accent"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print / Save as PDF
                </button>
              </div>
              <MarkdownViewer content={formalIeeeSrs} />
            </div>
          </div>
        )}

        {/* VIEW: AI IDE AGENT RULES */}
        {activeTab === 'ide_rules' && (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Sidebar: Select IDE Rule */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-line bg-surface overflow-y-auto p-4 space-y-4">
              <div className="px-1 py-1 flex items-center justify-between border-b border-line pb-2">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Agent Harness Rules
                </span>
                <span className="badge--on text-[9px]">5 Formats</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {[
                  { id: 'agents_md', label: 'AGENTS.md', title: 'Universal Manifest', desc: 'Open standard autonomous multi-agent directives & runbook' },
                  { id: 'cursor', label: '.cursorrules', title: 'Cursor IDE', desc: 'Rules & specification index reader for Cursor agent' },
                  { id: 'claude', label: 'CLAUDE.md', title: 'Claude Code', desc: 'Anthropic CLI & Claude Desktop memory file' },
                  { id: 'windsurf', label: '.windsurfrules', title: 'Windsurf Cascade', desc: 'Invariants & contract enforcement for Cascade' },
                  { id: 'agent', label: '.agentrules', title: 'Autonomous Agents', desc: 'Global rules for Antigravity & custom subagents' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedIdeRule(r.id as any)}
                    className={`w-full text-left p-3 border transition-all ${
                      selectedIdeRule === r.id
                        ? 'border-accent bg-box text-white'
                        : 'border-line/40 bg-ink/40 text-gray-300 hover:text-white hover:border-line'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-accent">{r.label}</span>
                      <span className="text-[10px] text-muted">{r.title}</span>
                    </div>
                    <p className="text-[10px] text-muted line-clamp-1">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Pane: Code Preview */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-ink custom-scrollbar">
              <div className="max-w-4xl mx-auto">
                <div className="mb-4 pb-3 border-b border-line/60 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                      {selectedIdeRule === 'agents_md' ? 'AGENTS.md (Autonomous Agent Directives & Universal Manifest)' :
                       selectedIdeRule === 'cursor' ? '.cursorrules (Cursor IDE Agent Instructions)' :
                       selectedIdeRule === 'claude' ? 'CLAUDE.md (Claude Code Context Protocol)' :
                       selectedIdeRule === 'windsurf' ? '.windsurfrules (Windsurf Cascade Directives)' :
                       '.agentrules (Antigravity & Agent Roster Specification)'}
                    </h3>
                    <p className="text-xs text-muted">
                      Drop this file in your project's root folder so your AI coding agent automatically follows the specification.
                    </p>
                  </div>
                </div>

                <pre className="p-6 bg-box border border-line text-xs font-mono text-body whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {selectedIdeRule === 'agents_md' ? (specs['AGENTS.md'] || ideRules.agentRules) :
                   selectedIdeRule === 'cursor' ? ideRules.cursorRules :
                   selectedIdeRule === 'claude' ? ideRules.claudeMd :
                   selectedIdeRule === 'windsurf' ? ideRules.windsurfRules :
                   ideRules.agentRules}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: MCP DIRECT AGENT CONNECT */}
        {activeTab === 'mcp_connect' && (
          <div className="h-full overflow-y-auto p-4 bg-ink">
            <McpHub
              currentSpecs={specs}
              strategicPlans={content.strategicPlans}
              projectName={content.projectMeta?.projectName || 'Project'}
              onBack={() => setActiveTab('specs_suite')}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-sm shadow-2xl">
            <div className="w-10 h-10 bg-accent-soft border border-accent/30 flex items-center justify-center text-accent mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
              Delete Specification?
            </h3>
            <p className="font-body text-xs text-muted mb-6">
              Are you sure? All {Object.keys(specs).length || 33} canonical specification files for <strong className="text-white">"{content.projectMeta?.projectName || 'this project'}"</strong> will be permanently removed.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-sm btn--ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-sm btn--accent"
              >
                Delete Specification Suite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
