import React, { useState } from 'react';
import {
  Network,
  Copy,
  Check,
  Terminal,
  Play,
  Plus,
  Cpu
} from 'lucide-react';
import { McpApiKey } from '../types';
import { saasStore } from '../services/saasStore';
import { executeMcpToolCall, generateAgentMcpConfig } from '../services/mcpClientSimulator';

interface McpHubProps {
  currentSpecs?: Record<string, string>;
  projectName?: string;
  onBack: () => void;
}

export const McpHub: React.FC<McpHubProps> = ({
  currentSpecs = {},
  projectName = 'Current Project',
  onBack
}) => {
  const [keys, setKeys] = useState<McpApiKey[]>(saasStore.getMcpKeys());
  const [selectedKey, setSelectedKey] = useState<McpApiKey>(keys[0] || null);
  const [activeConfigTab, setActiveConfigTab] = useState<'cursor' | 'claude' | 'windsurf' | 'cli'>('cursor');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Live MCP Tester state
  const [testTool, setTestTool] = useState<string>('get_spec_index');
  const [testFilePath, setTestFilePath] = useState<string>('contracts/api_contracts.md');
  const [testDecisionTitle, setTestDecisionTitle] = useState<string>('ADR-003: Postgres Partitioning');
  const [testDecisionText, setTestDecisionText] = useState<string>('Implement time-based table partitioning for multi-tenant analytics.');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionMs, setExecutionMs] = useState<number | null>(null);

  // New Key modal
  const [showNewKeyModal, setShowNewKeyModal] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  // Transport mode: cloud_sse (live web), npx_portable (universal npx), local_stdio (local dev)
  const [transportMode, setTransportMode] = useState<'cloud_sse' | 'npx_portable' | 'local_stdio'>('cloud_sse');

  const configs = selectedKey ? generateAgentMcpConfig(selectedKey, transportMode) : null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const newK = saasStore.createMcpKey(newKeyName, '1', projectName, newKeyAgent);
    setKeys(saasStore.getMcpKeys());
    setSelectedKey(newK);
    setShowNewKeyModal(false);
    setNewKeyName('');
  };

  const handleRunMcpTest = () => {
    setIsExecuting(true);
    let args: Record<string, any> = {};

    if (testTool === 'get_spec_file') {
      args = { filePath: testFilePath };
    } else if (testTool === 'append_decision_log') {
      args = {
        title: testDecisionTitle,
        decision: testDecisionText,
        context: 'Triggered via Web MCP Tester'
      };
    }

    setTimeout(() => {
      const res = executeMcpToolCall(testTool, args, currentSpecs);
      setTestResult(res.resultText);
      setExecutionMs(res.executionTimeMs);
      setIsExecuting(false);
    }, 200);
  };

  return (
    <div className="shell py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="agape-card p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="eyebrow mb-3">Model Context Protocol (MCP)</div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[0.04em] uppercase">
              AI Agent Context Gateway
            </h1>
            <p className="font-body text-xs text-muted mt-2 max-w-2xl">
              Connect external AI coding agents (Cursor IDE, Claude Code, Windsurf, Antigravity) directly to your project's .specs suite over JSON-RPC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="btn btn-sm btn--ghost"
            >
              ← Back
            </button>
            <button
              onClick={() => setShowNewKeyModal(true)}
              className="btn btn-sm btn--accent"
            >
              <Plus className="w-4 h-4" />
              <span>New Agent Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Keys & Configs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Selection Pills */}
          <div className="agape-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Select Connected Agent Key
              </h3>
              <span className="font-display text-xs text-muted tracking-widest uppercase">{keys.length} Keys Configured</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keys.map(k => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKey(k)}
                  className={`text-left p-3.5 border transition-all ${
                    selectedKey?.id === k.id
                      ? 'bg-box border-accent shadow-lg shadow-accent/10'
                      : 'bg-ink border-line hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display uppercase tracking-[0.06em] font-semibold text-white text-xs">{k.name}</span>
                    <span className="badge--off text-[10px]">
                      {k.agentType}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-muted truncate">{k.key}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Config Snippets for AI Editors */}
          {selectedKey && configs && (
            <div className="agape-card overflow-hidden">
              {/* Transport Mode Bar (Cloud Live SSE vs Portable NPX vs Local Stdio) */}
              <div className="px-5 py-3 bg-ink border-b border-line flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-display uppercase tracking-[0.16em] text-muted text-[11px]">
                    MCP Transport:
                  </span>
                  <div className="flex bg-surface p-0.5 border border-line font-display text-[11px] uppercase tracking-[0.1em]">
                    <button
                      onClick={() => setTransportMode('cloud_sse')}
                      className={`px-2.5 py-1 transition-all ${
                        transportMode === 'cloud_sse'
                          ? 'bg-accent text-white font-semibold'
                          : 'text-muted hover:text-white'
                      }`}
                    >
                      Cloud Live (SSE)
                    </button>
                    <button
                      onClick={() => setTransportMode('npx_portable')}
                      className={`px-2.5 py-1 transition-all ${
                        transportMode === 'npx_portable'
                          ? 'bg-accent text-white font-semibold'
                          : 'text-muted hover:text-white'
                      }`}
                    >
                      Universal NPX
                    </button>
                    <button
                      onClick={() => setTransportMode('local_stdio')}
                      className={`px-2.5 py-1 transition-all ${
                        transportMode === 'local_stdio'
                          ? 'bg-accent text-white font-semibold'
                          : 'text-muted hover:text-white'
                      }`}
                    >
                      Local Stdio
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="truncate max-w-[240px] text-white">
                    {configs.endpointUrl}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-box border-b border-line flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent" />
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    Agent IDE Configuration
                  </span>
                </div>

                <div className="flex bg-ink p-1 border border-line text-xs font-display uppercase tracking-[0.12em]">
                  {[
                    { id: 'cursor', label: 'Cursor IDE' },
                    { id: 'claude', label: 'Claude Desktop' },
                    { id: 'windsurf', label: 'Windsurf' },
                    { id: 'cli', label: 'CLI / Terminal' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveConfigTab(tab.id as any)}
                      className={`px-3 py-1.5 transition-all ${
                        activeConfigTab === tab.id
                          ? 'bg-accent text-white font-semibold'
                          : 'text-muted hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeConfigTab === 'cursor' && (
                  <div className="space-y-3">
                    <p className="font-body text-xs text-muted">
                      Save this inside your project root as <code className="text-white bg-box px-1.5 py-0.5 font-mono">.cursor/mcp.json</code>:
                    </p>
                    <div className="relative">
                      <pre className="p-4 bg-ink border border-line font-mono text-xs text-white overflow-x-auto leading-relaxed">
                        {configs.cursorJson}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(configs.cursorJson, 'cursor')}
                        className="absolute top-3 right-3 p-2 bg-box hover:bg-accent text-muted hover:text-white border border-line text-xs transition-colors"
                      >
                        {copiedType === 'cursor' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {activeConfigTab === 'claude' && (
                  <div className="space-y-3">
                    <p className="font-body text-xs text-muted">
                      Add this block to your Claude Desktop config (<code className="text-white bg-box px-1.5 py-0.5 font-mono">claude_desktop_config.json</code>):
                    </p>
                    <div className="relative">
                      <pre className="p-4 bg-ink border border-line font-mono text-xs text-white overflow-x-auto leading-relaxed">
                        {configs.claudeJson}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(configs.claudeJson, 'claude')}
                        className="absolute top-3 right-3 p-2 bg-box hover:bg-accent text-muted hover:text-white border border-line text-xs transition-colors"
                      >
                        {copiedType === 'claude' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {activeConfigTab === 'windsurf' && (
                  <div className="space-y-3">
                    <p className="font-body text-xs text-muted">
                      Add to your Windsurf MCP configuration settings:
                    </p>
                    <div className="relative">
                      <pre className="p-4 bg-ink border border-line font-mono text-xs text-white overflow-x-auto leading-relaxed">
                        {configs.windsurfJson}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(configs.windsurfJson, 'windsurf')}
                        className="absolute top-3 right-3 p-2 bg-box hover:bg-accent text-muted hover:text-white border border-line text-xs transition-colors"
                      >
                        {copiedType === 'windsurf' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {activeConfigTab === 'cli' && (
                  <div className="space-y-3">
                    <p className="font-body text-xs text-muted">
                      Execute in terminal or launch as an autonomous subprocess:
                    </p>
                    <div className="relative">
                      <pre className="p-4 bg-ink border border-line font-mono text-xs text-white overflow-x-auto leading-relaxed">
                        {configs.cliCommand}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(configs.cliCommand, 'cli')}
                        className="absolute top-3 right-3 p-2 bg-box hover:bg-accent text-muted hover:text-white border border-line text-xs transition-colors"
                      >
                        {copiedType === 'cli' ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live MCP Tool Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="agape-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent" />
                <h3 className="font-display uppercase tracking-[0.08em] font-semibold text-white text-base">
                  Interactive MCP Inspector
                </h3>
              </div>
              <span className="badge--on text-[10px]">Live Runner</span>
            </div>

            <p className="font-body text-xs text-muted mb-5">
              Simulate the exact tool calls your AI agent will execute when querying your 6-tier .specs suite.
            </p>

            <div className="space-y-4 mb-6">
              <div className="field">
                <label className="field__label">Select MCP Tool</label>
                <select
                  value={testTool}
                  onChange={e => setTestTool(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-white focus:border-accent outline-none font-mono"
                >
                  <option value="get_spec_index">get_spec_index (Read _index.md)</option>
                  <option value="get_spec_file">get_spec_file (Read specific tier spec)</option>
                  <option value="list_spec_tasks">list_spec_tasks (Read execution tasks)</option>
                  <option value="get_current_state">get_current_state (Read active sprint state)</option>
                  <option value="append_decision_log">append_decision_log (Append Architecture ADR)</option>
                </select>
              </div>

              {testTool === 'get_spec_file' && (
                <div className="field">
                  <label className="field__label">Target File Path</label>
                  <select
                    value={testFilePath}
                    onChange={e => setTestFilePath(e.target.value)}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-white focus:border-accent outline-none font-mono"
                  >
                    <option value="contracts/api_contracts.md">contracts/api_contracts.md</option>
                    <option value="foundation/brief.md">foundation/brief.md</option>
                    <option value="architecture/data_model.md">architecture/data_model.md</option>
                    <option value="architecture/system_design.md">architecture/system_design.md</option>
                    <option value="implementation/backend_guide.md">implementation/backend_guide.md</option>
                    <option value="execution/tasks.md">execution/tasks.md</option>
                  </select>
                </div>
              )}

              {testTool === 'append_decision_log' && (
                <div className="space-y-3">
                  <div className="field">
                    <label className="field__label">ADR Title</label>
                    <input
                      type="text"
                      value={testDecisionTitle}
                      onChange={e => setTestDecisionTitle(e.target.value)}
                      className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-white focus:border-accent outline-none"
                    />
                  </div>
                  <div className="field">
                    <label className="field__label">Decision Body</label>
                    <textarea
                      rows={2}
                      value={testDecisionText}
                      onChange={e => setTestDecisionText(e.target.value)}
                      className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-white focus:border-accent outline-none font-body"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleRunMcpTest}
                disabled={isExecuting}
                className="btn btn--accent w-full justify-center disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecuting ? 'Executing...' : 'Execute Tool Call'}</span>
              </button>
            </div>

            {/* Test Results Output */}
            {testResult && (
              <div className="space-y-2 pt-4 border-t border-line">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-display uppercase tracking-[0.1em] text-white">Tool Output</span>
                  <span className="font-mono text-accent">{executionMs}ms</span>
                </div>
                <div className="p-3 bg-ink border border-line max-h-60 overflow-y-auto">
                  <pre className="font-mono text-[11px] text-white whitespace-pre-wrap leading-relaxed">
                    {testResult}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">
              Create MCP Agent Key
            </h3>
            <p className="font-body text-xs text-muted mb-6">Generate credentials for an AI code editor or autonomous pipeline.</p>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="field">
                <label className="field__label">Key Label / Name</label>
                <input
                  type="text"
                  required
                  placeholder="Cursor Pro Workstation"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Target Agent Environment</label>
                <select
                  value={newKeyAgent}
                  onChange={e => setNewKeyAgent(e.target.value as any)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                >
                  <option value="cursor">Cursor IDE</option>
                  <option value="claude_desktop">Claude Desktop</option>
                  <option value="windsurf">Windsurf</option>
                  <option value="antigravity">Antigravity / Google Agent</option>
                  <option value="custom_agent">Custom Python / Node Agent CLI</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewKeyModal(false)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
