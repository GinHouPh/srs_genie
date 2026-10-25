import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GeneratedContent, VibeTask } from '../types';
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
  RotateCcw
} from 'lucide-react';
import { downloadSpecsZip, SPEC_TIERS } from '../services/specGeneratorService';
import { McpHub } from './McpHub';
import { projectStore } from '../services/projectStore';

interface DocumentPreviewProps {
  content: GeneratedContent;
  onReset: () => void;
  onOpenMcpHub?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ content, onReset, onOpenMcpHub }) => {
  const [activeTab, setActiveTab] = useState<'specs_suite' | 'tasks' | 'mcp_connect'>('specs_suite');
  const [selectedFilePath, setSelectedFilePath] = useState<string>('_index.md');
  const [viewSource, setViewSource] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const specs = content.specsHierarchy || {};
  const activeFileContent = specs[selectedFilePath] || content.srsMarkdown || '# Specification\n\nNo content loaded.';

  useEffect(() => {
    setEditedText(activeFileContent);
    setIsEditing(false);
  }, [selectedFilePath, activeFileContent]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadSpecsZip(specs, content.projectMeta?.projectName || 'project');
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
    setIsEditing(false);
    showToast(`Saved changes to ${selectedFilePath}`);
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
            .specs Suite ({Object.keys(specs).length || 22} Files)
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
            Tasks ({content.implementationTasks?.length || 6})
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
                          <span className="truncate">{file.path}</span>
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
                  <span className="text-white font-semibold">.specs/{selectedFilePath}</span>
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
                  <div className="prose prose-invert max-w-none text-body">
                    <ReactMarkdown>{activeFileContent}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: EXECUTION TASKS BOARD */}
        {activeTab === 'tasks' && (
          <div className="h-full overflow-y-auto p-8 bg-ink">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="agape-card p-6 border-accent/40">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase">
                    Autonomous AI Coding Task Prompts
                  </h3>
                </div>
                <p className="font-body text-xs text-muted leading-relaxed">
                  Extracted from <code className="text-white bg-box px-1.5 py-0.5 font-mono">.specs/execution/tasks.md</code>.
                  Copy each prompt directly into your AI coding tool (Cursor, Windsurf, or Claude Code) in the sequential order shown below.
                </p>
              </div>

              <div className="space-y-4">
                {content.implementationTasks?.map((task, idx) => (
                  <div
                    key={task.id || idx}
                    className="agape-card p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="badge--on text-[10px] font-mono">
                            {task.id || `TASK-00${idx + 1}`}
                          </span>
                          <span className="badge--off text-[10px]">
                            {task.type}
                          </span>
                          {task.complexity && (
                            <span className="px-2 py-0.5 text-[10px] font-mono bg-box text-muted border border-line">
                              Complexity: {task.complexity}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-base font-semibold text-white uppercase tracking-[0.06em]">{task.title}</h4>
                      </div>

                      <button
                        onClick={() => copyToClipboard(task.prompt, `task_${idx}`)}
                        className="btn btn-sm btn--ghost shrink-0"
                      >
                        {copiedKey === `task_${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-accent" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="font-body text-xs text-muted mb-4">{task.description}</p>

                    <div className="p-4 bg-box/60 border border-line">
                      <div className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-accent mb-2">Prompt for AI Editor:</div>
                      <div className="font-mono text-xs text-white whitespace-pre-wrap leading-relaxed">{task.prompt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: MCP DIRECT AGENT CONNECT */}
        {activeTab === 'mcp_connect' && (
          <div className="h-full overflow-y-auto p-4 bg-ink">
            <McpHub
              currentSpecs={specs}
              projectName={content.projectMeta?.projectName || 'Project'}
              onBack={() => setActiveTab('specs_suite')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
