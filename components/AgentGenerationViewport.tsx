import React, { useState, useEffect, useRef } from 'react';
import { MarkdownViewer } from './MarkdownViewer';
import {
  GenerationProgressState,
  AgentLogEntry,
  VibeTask
} from '../types';
import {
  Terminal,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FolderTree,
  Network,
  Download,
  Eye,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  ListTodo,
  FileText,
  Pause,
  Play
} from 'lucide-react';
import { SPEC_TIERS as CANONICAL_SPEC_TIERS } from '../services/specGeneratorService';

interface AgentGenerationViewportProps {
  projectName: string;
  selectedModelName?: string;
  progressState: GenerationProgressState;
  onExploreSpecs: () => void;
  onDownloadZip: () => void;
  onOpenMcpHub: () => void;
  onCancel?: () => void;
}

export const AgentGenerationViewport: React.FC<AgentGenerationViewportProps> = ({
  projectName,
  selectedModelName = 'Gemini 2.5 Flash',
  progressState,
  onExploreSpecs,
  onDownloadZip,
  onOpenMcpHub,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'draft' | 'tasks'>('stream');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (progressState.isComplete) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [progressState.isComplete]);

  // Auto-scroll log feed
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [progressState.logs, autoScroll, activeTab]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Find compiled files from logs
  const createdFiles = new Set(
    progressState.logs
      .filter(l => l.type === 'file_created' && l.meta?.file)
      .map(l => l.meta!.file!)
  );

  return (
    <div className="shell flex flex-col h-[calc(100vh-80px)] py-3">
      {/* Top Telemetry Header */}
      <div className="bg-box border border-line p-4 mb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3.5 h-3.5 rounded-full ${progressState.isComplete ? 'bg-emerald-500' : 'bg-accent animate-ping'}`} />
            <div className={`absolute inset-0 w-3.5 h-3.5 rounded-full ${progressState.isComplete ? 'bg-emerald-500' : 'bg-accent'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                {projectName}
              </span>
              <span className="text-[10px] bg-accent/10 border border-accent/30 text-accent px-2 py-0.5 font-mono">
                {selectedModelName}
              </span>
            </div>
            <div className="font-mono text-xs text-muted flex items-center gap-2 mt-0.5">
              <span>Status:</span>
              <span className={progressState.isComplete ? 'text-emerald-400 font-semibold' : 'text-accent'}>
                {progressState.isComplete ? 'Synthesis Complete' : 'Autonomous Spec Generation in Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-ink/60 border border-line px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-muted" />
            <span className="text-muted">Elapsed:</span>
            <span className="text-white font-semibold">{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-ink/60 border border-line px-3 py-1.5">
            <FileCode className="w-3.5 h-3.5 text-accent" />
            <span className="text-muted">Specs Files:</span>
            <span className="text-accent font-semibold">{progressState.filesGeneratedCount} / 22</span>
          </div>

          <div className="flex items-center gap-1.5 bg-ink/60 border border-line px-3 py-1.5">
            <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-muted">Dynamic Tasks:</span>
            <span className="text-cyan-400 font-semibold">{progressState.tasksExtractedCount}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-ink/60 border border-line px-3 py-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-muted">Est. Tokens:</span>
            <span className="text-purple-400 font-semibold">{progressState.tokensStreamed.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Column: Lifecycle Phases & Specs Tree (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3 min-h-0">
          {/* Phases Progress */}
          <div className="bg-box border border-line p-3">
            <div className="font-display text-xs text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Agentic Workflow Pipeline</span>
              <span className="text-[10px] text-accent">5 Stages</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {progressState.phases.map((phase, idx) => {
                const isCurrent = phase.id === progressState.currentPhaseId && !progressState.isComplete;
                const isDone = phase.status === 'completed' || progressState.isComplete;
                return (
                  <div
                    key={phase.id}
                    className={`flex items-center justify-between p-2 border transition-all ${
                      isCurrent
                        ? 'border-accent bg-accent/5 text-white'
                        : isDone
                        ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-300'
                        : 'border-line/40 bg-ink/30 text-muted/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] w-4 text-muted">{idx + 1}.</span>
                      <span className="truncate">{phase.name}</span>
                    </div>
                    <div>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-[10px] text-muted">pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 22 Canonical Specs Compilation Matrix */}
          <div className="bg-box border border-line p-3 flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="font-display text-xs text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Hierarchical .specs Hierarchy</span>
              <span className="text-[10px] text-accent font-mono">{createdFiles.size} / 22 Compiled</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs custom-scrollbar">
              {CANONICAL_SPEC_TIERS.map(tier => (
                <div key={tier.tier} className="border border-line/50 p-2 bg-ink/40">
                  <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>{tier.tier}: {tier.name}</span>
                  </div>
                  <div className="space-y-1">
                    {tier.files.map(f => {
                      const isCompiled = createdFiles.has(f.path);
                      return (
                        <div
                          key={f.path}
                          className={`flex items-center justify-between py-1 px-1.5 text-[11px] border transition-all ${
                            isCompiled
                              ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-200'
                              : 'border-transparent text-muted/50'
                          }`}
                        >
                          <span className="truncate">{f.path}</span>
                          {isCompiled ? (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted/40 font-sans">waiting...</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Viewport Console / Stream / Draft / Tasks (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-box border border-line min-h-0 overflow-hidden">
          {/* Tab Bar */}
          <div className="flex items-center justify-between border-b border-line px-3 py-2 bg-ink/40">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('stream')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'stream'
                    ? 'bg-accent text-white font-semibold'
                    : 'text-muted hover:text-white hover:bg-ink'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Agent Stream ({progressState.logs.length})
              </button>

              <button
                onClick={() => setActiveTab('draft')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'draft'
                    ? 'bg-accent text-white font-semibold'
                    : 'text-muted hover:text-white hover:bg-ink'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Master Project Plan Draft
              </button>

              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-accent text-white font-semibold'
                    : 'text-muted hover:text-white hover:bg-ink'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                Dynamic Tasks ({progressState.tasksExtractedCount})
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {activeTab === 'stream' && (
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`text-[11px] font-mono flex items-center gap-1 px-2 py-1 border transition-all ${
                    autoScroll
                      ? 'border-accent/40 bg-accent/10 text-accent'
                      : 'border-line text-muted hover:text-white'
                  }`}
                  title={autoScroll ? 'Pause auto-scroll' : 'Resume auto-scroll'}
                >
                  {autoScroll ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>Auto-scroll</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab 1: Agent Stream */}
          {activeTab === 'stream' && (
            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs custom-scrollbar bg-ink/70"
            >
              {progressState.logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted py-12">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
                  <p>Initializing agent context and parsing 15-section questionnaire...</p>
                </div>
              ) : (
                progressState.logs.map(log => {
                  let badgeColor = 'bg-line text-muted';
                  let icon = <Terminal className="w-3.5 h-3.5" />;

                  if (log.type === 'thought') {
                    badgeColor = 'bg-purple-900/40 text-purple-300 border border-purple-700/40';
                    icon = <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
                  } else if (log.type === 'action') {
                    badgeColor = 'bg-blue-900/40 text-blue-300 border border-blue-700/40';
                    icon = <Cpu className="w-3.5 h-3.5 text-blue-400" />;
                  } else if (log.type === 'file_created') {
                    badgeColor = 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40';
                    icon = <FileCode className="w-3.5 h-3.5 text-emerald-400" />;
                  } else if (log.type === 'task_extracted') {
                    badgeColor = 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/40';
                    icon = <ListTodo className="w-3.5 h-3.5 text-cyan-400" />;
                  }

                  return (
                    <div
                      key={log.id}
                      className="border border-line/60 bg-box/80 p-3 shadow-sm hover:border-line transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 ${badgeColor}`}>
                            {icon}
                            {log.type.replace('_', ' ')}
                          </span>
                          <span className="font-semibold text-white">{log.title}</span>
                        </div>
                        <span className="text-[10px] text-muted">{log.timestamp}</span>
                      </div>

                      <div className="text-gray-300 leading-relaxed font-sans text-xs whitespace-pre-wrap pl-1">
                        {log.content}
                      </div>

                      {log.meta && (
                        <div className="mt-2 pt-2 border-t border-line/40 flex items-center gap-3 text-[10px] text-muted">
                          {log.meta.file && (
                            <span className="text-accent font-mono font-medium">
                              File: {log.meta.file}
                            </span>
                          )}
                          {log.meta.tier && (
                            <span className="text-muted">
                              Tier: {log.meta.tier}
                            </span>
                          )}
                          {log.meta.taskCount && (
                            <span className="text-cyan-400">
                              Tasks: {log.meta.taskCount}
                            </span>
                          )}
                          {log.meta.tokens && (
                            <span className="text-purple-400">
                              Est. {log.meta.tokens} tokens
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Live typing indicator if still generating */}
              {!progressState.isComplete && (
                <div className="flex items-center gap-2 text-accent p-2 font-mono text-xs">
                  <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>Agent active · Synthesizing specification structures...</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Master Project Plan Draft */}
          {activeTab === 'draft' && (
            <div className="flex-1 overflow-y-auto p-6 font-sans text-xs text-gray-200 leading-relaxed custom-scrollbar bg-ink/70">
              {progressState.draftText ? (
                <div className="max-w-4xl mx-auto">
                  <MarkdownViewer content={progressState.draftText} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted py-12">
                  <FileText className="w-8 h-8 text-accent mb-3 animate-pulse" />
                  <p className="font-display uppercase tracking-wider text-white">Synthesizing Master Project Plan Draft...</p>
                  <p className="text-muted text-[11px] mt-1">Connecting to Frontier AI Engine to draft comprehensive architectural foundations.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Dynamic Tasks Extracted */}
          {activeTab === 'tasks' && (
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs custom-scrollbar bg-ink/70">
              {progressState.tasksExtractedCount === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted py-12">
                  <ListTodo className="w-8 h-8 text-muted mb-2 animate-pulse" />
                  <p>Extracting dynamic task breakdown from Project Plan Draft...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {progressState.logs
                    .filter(l => l.type === 'task_extracted')
                    .map((l, i) => (
                      <div key={i} className="border border-line/70 bg-box p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-accent font-display">{l.title}</span>
                          <span className="text-[10px] text-muted">{l.timestamp}</span>
                        </div>
                        <p className="text-gray-300 font-sans text-xs">{l.content}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Completion Action Footer */}
          {progressState.isComplete ? (
            <div className="p-4 border-t border-line bg-ink/90 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-white uppercase tracking-wider">
                    Specification Suite Successfully Forged
                  </div>
                  <div className="text-[11px] text-muted">
                    22 canonical spec files compiled · {progressState.tasksExtractedCount} dynamic atomic tasks extracted
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onDownloadZip}
                  className="px-3 py-2 bg-box border border-line hover:border-accent text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .zip
                </button>

                <button
                  onClick={onOpenMcpHub}
                  className="px-3 py-2 bg-box border border-line hover:border-cyan-400 text-cyan-300 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Network className="w-3.5 h-3.5" />
                  Connect MCP
                </button>

                <button
                  onClick={onExploreSpecs}
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-accent/20 transition-all"
                >
                  <span>Explore .specs Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 border-t border-line bg-ink/80 flex items-center justify-between text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>Autonomous compilation active...</span>
              </div>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-muted hover:text-white transition-all text-xs"
                >
                  Cancel Generation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

