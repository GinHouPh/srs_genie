import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldBan,
  UserX,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Zap,
  Flame,
  Globe,
  Mail,
  Server,
  PlayCircle,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { BlacklistEntry, BlacklistType, FraudEvaluationResult } from '../../types';
import { fraudDetectionService } from '../../services/fraudDetectionService';
import { authService } from '../../services/authService';
import { auditLogger } from '../../services/auditLogger';

interface AdminBlacklistViewProps {
  onToast: (msg: string) => void;
}

export const AdminBlacklistView: React.FC<AdminBlacklistViewProps> = ({ onToast }) => {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(fraudDetectionService.getBlacklist());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newType, setNewType] = useState<BlacklistType>('domain');
  const [newValue, setNewValue] = useState('');
  const [newReason, setNewReason] = useState('');
  const [cascadeSuspend, setCascadeSuspend] = useState(true);

  // Simulator State
  const [simEmail, setSimEmail] = useState('scammer@tempmail.com');
  const [simResult, setSimResult] = useState<FraudEvaluationResult | null>(null);

  const metrics = fraudDetectionService.getMetrics();
  const blockedAuditEvents = auditLogger.getEvents().filter(e => e.action.startsWith('auth.fraud.'));

  const refreshRules = () => {
    setBlacklist(fraudDetectionService.getBlacklist());
  };

  const handleToggleRule = (id: string) => {
    fraudDetectionService.toggleBlacklistEntry(id);
    refreshRules();
    onToast('Rule status updated.');
  };

  const handleDeleteRule = (id: string, value: string) => {
    if (confirm(`Remove blacklist rule for "${value}"?`)) {
      fraudDetectionService.removeBlacklistEntry(id);
      refreshRules();
      onToast(`Removed rule: ${value}`);
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim() || !newReason.trim()) return;

    const entry = fraudDetectionService.addBlacklistEntry({
      type: newType,
      value: newValue.trim(),
      reason: newReason.trim(),
      addedBy: 'Security Admin'
    });

    if (cascadeSuspend) {
      const affected = authService.suspendAccountsByRule(entry);
      if (affected > 0) {
        onToast(`Blacklisted "${entry.value}" and suspended ${affected} matching account(s).`);
      } else {
        onToast(`Blacklisted "${entry.value}".`);
      }
    } else {
      onToast(`Blacklisted "${entry.value}".`);
    }

    refreshRules();
    setShowAddModal(false);
    setNewValue('');
    setNewReason('');
  };

  const [testingSimulator, setTestingSimulator] = useState(false);

  const handleRunSimulator = async () => {
    if (!simEmail.trim()) return;
    setTestingSimulator(true);
    try {
      const res = await fraudDetectionService.evaluateRegistrationAsync(simEmail.trim());
      setSimResult(res);
    } finally {
      setTestingSimulator(false);
    }
  };

  const filteredRules = blacklist.filter(rule => {
    if (filterType !== 'ALL' && rule.type !== filterType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return rule.value.toLowerCase().includes(q) || rule.reason.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-surface border border-line p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldBan className="w-5 h-5 text-accent" />
            <span className="font-display text-xs tracking-[0.2em] text-accent uppercase font-bold">
              Autonomous Anti-Fraud Sentinel
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Fraud Detection & Blacklist Control
          </h2>
          <p className="text-muted text-sm font-body mt-1">
            Blocks disposable burner inboxes, throttles automated bot account creation velocity, and enforces real-time administrative IP/domain bans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-accent text-white hover:bg-accent-hover transition-colors font-display text-xs uppercase tracking-[0.14em] flex items-center gap-2 font-semibold shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Blacklist Rule</span>
          </button>

          <button
            onClick={refreshRules}
            className="p-2 bg-box border border-line text-muted hover:text-white hover:border-accent transition-colors"
            title="Refresh rules"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat">
          <span className="stat__value text-white font-mono">{metrics.activeRules}</span>
          <span className="stat__label">Active Blacklist Rules</span>
          <div className="text-[11px] text-muted mt-2 font-body tracking-normal flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Across Email, Domain & IP Rules</span>
          </div>
        </div>

        <div className="stat">
          <span className="stat__value text-accent font-mono">{metrics.disposableCount}</span>
          <span className="stat__label">Disposable Inbox Domains</span>
          <div className="text-[11px] text-muted mt-2 font-body tracking-normal flex items-center gap-1">
            <Flame className="w-3 h-3 text-accent" />
            <span>Burner inboxes blocked on sight</span>
          </div>
        </div>

        <div className="stat">
          <span className="stat__value text-white font-mono">{metrics.velocityLimit} / {metrics.velocityWindowMins}m</span>
          <span className="stat__label">Max Registration Velocity</span>
          <div className="text-[11px] text-muted mt-2 font-body tracking-normal flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Anti-bot burst throttling window</span>
          </div>
        </div>

        <div className="stat">
          <span className="stat__value text-accent font-mono">{blockedAuditEvents.length}</span>
          <span className="stat__label">Fraud Attacks Thwarted</span>
          <div className="text-[11px] text-muted mt-2 font-body tracking-normal flex items-center gap-1">
            <UserX className="w-3 h-3 text-accent" />
            <span>Logged to SIEM audit stream</span>
          </div>
        </div>
      </div>

      {/* Interactive Fraud Risk Simulator */}
      <div className="bg-surface border border-line p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-accent" />
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
              Interactive Registration Risk Simulator
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted">Test prospective emails against heuristics in real-time</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={simEmail}
              onChange={(e) => setSimEmail(e.target.value)}
              placeholder="e.g. attacker@tempmail.com or normal@company.com"
              className="w-full bg-box border border-line pl-9 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent font-mono"
            />
          </div>

          <button
            onClick={handleRunSimulator}
            disabled={testingSimulator}
            className="px-5 py-2.5 bg-box border border-accent/40 text-accent hover:bg-accent hover:text-white transition-all text-xs font-display uppercase tracking-[0.16em] flex items-center justify-center gap-2 font-semibold disabled:opacity-60"
          >
            {testingSimulator ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Mailbox & DNS...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Evaluate Risk Score</span>
              </>
            )}
          </button>
        </div>

        {/* Simulator Result Output */}
        {simResult && (
          <div className={`p-4 border mt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            simResult.allowed
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
              : 'bg-red-950/25 border-red-800/60 text-red-300'
          }`}>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {simResult.allowed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-accent shrink-0" />
                )}
                <span className="font-display text-sm uppercase tracking-wider font-bold">
                  {simResult.allowed ? 'REGISTRATION ALLOWED' : 'REGISTRATION REJECTED (FRAUD BLOCKED)'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-box border border-line">
                  Risk Score: {simResult.riskScore} / 100
                </span>
                {simResult.mxActive !== undefined && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    simResult.mxActive ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' : 'bg-red-950/60 text-red-400 border-red-800/40'
                  }`}>
                    {simResult.mxActive ? 'Active Mail Routing' : 'No Active MX'}
                  </span>
                )}
              </div>

              {simResult.reason && (
                <p className="text-xs font-body text-white/90 pl-7">{simResult.reason}</p>
              )}

              {simResult.violations.length > 0 && (
                <div className="pl-7 pt-1 flex flex-wrap gap-1.5">
                  {simResult.violations.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 bg-box/80 border border-line rounded text-[10px] font-mono text-muted">
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSimResult(null)}
              className="text-[11px] font-display uppercase tracking-wider text-muted hover:text-white self-start md:self-center"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Rules Table Search & Filter */}
      <div className="bg-surface border border-line p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blacklist rules by target or reason..."
            className="w-full bg-box border border-line pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-display uppercase tracking-wider text-muted">Rule Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-box border border-line text-white text-xs px-2.5 py-1.5 focus:outline-none focus:border-accent font-mono"
          >
            <option value="ALL">All Rule Types</option>
            <option value="email">Exact Email</option>
            <option value="domain">Domain Wildcard</option>
            <option value="ip">IP Address</option>
          </select>
        </div>
      </div>

      {/* Blacklist Rules Table */}
      <div className="bg-surface border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-box text-[11px] font-display uppercase tracking-[0.16em] text-muted">
                <th className="py-3 px-4">Rule Type</th>
                <th className="py-3 px-4">Target Pattern / Value</th>
                <th className="py-3 px-4">Security Reason / Attribution</th>
                <th className="py-3 px-4">Added Date & Actor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-mono text-xs">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted font-body">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                    No blacklist rules match the current filter.
                  </td>
                </tr>
              ) : (
                filteredRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-box/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                        rule.type === 'domain'
                          ? 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                          : rule.type === 'email'
                          ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                      }`}>
                        {rule.type === 'domain' && <Globe className="w-3 h-3" />}
                        {rule.type === 'email' && <Mail className="w-3 h-3" />}
                        {rule.type === 'ip' && <Server className="w-3 h-3" />}
                        <span>{rule.type}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-bold text-white">
                      {rule.value}
                    </td>

                    <td className="py-3 px-4 text-muted/90 font-body text-xs max-w-sm">
                      {rule.reason}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-muted text-[11px]">
                      <div>{rule.addedAt}</div>
                      <span className="text-[10px] text-muted/60">{rule.addedBy}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${
                          rule.isActive
                            ? 'bg-red-950/60 text-red-400 border-red-800/60 hover:bg-red-900/60'
                            : 'bg-box text-muted border-line hover:text-white'
                        }`}
                      >
                        {rule.isActive ? 'ACTIVE (BLOCKING)' : 'INACTIVE'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRule(rule.id, rule.value)}
                        className="p-1.5 bg-box border border-line text-muted hover:text-accent hover:border-accent transition-colors"
                        title="Remove rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Blacklist Rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-line p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-1">
              <ShieldBan className="w-5 h-5 text-accent" />
              <h3 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                Add Blacklist Deny Rule
              </h3>
            </div>
            <p className="text-muted text-xs font-body mb-6">
              Enforce immediate rejection on matching registrations and prevent blacklisted actors from signing in.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-display uppercase tracking-wider text-muted mb-1.5">
                  Rule Target Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['domain', 'email', 'ip'] as BlacklistType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`py-2 px-3 text-xs font-display uppercase tracking-wider border text-center transition-all ${
                        newType === t
                          ? 'bg-accent text-white border-accent font-bold'
                          : 'bg-box border-line text-muted hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-display uppercase tracking-wider text-muted mb-1.5">
                  {newType === 'domain' ? 'Domain or Wildcard (*.domain.xyz)' : newType === 'email' ? 'Exact Email Address' : 'IP Address'}
                </label>
                <input
                  type="text"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={
                    newType === 'domain'
                      ? 'e.g. spambot.net or *.fraud.ru'
                      : newType === 'email'
                      ? 'e.g. badactor@spammer.org'
                      : 'e.g. 192.168.1.100'
                  }
                  className="w-full bg-box border border-line px-3.5 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-display uppercase tracking-wider text-muted mb-1.5">
                  Security Rationale / Attribution
                </label>
                <textarea
                  required
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g. Repeated chargeback abuse and bot-generated spec spamming"
                  className="w-full bg-box border border-line px-3.5 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent font-body"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cascade"
                  checked={cascadeSuspend}
                  onChange={(e) => setCascadeSuspend(e.target.checked)}
                  className="w-4 h-4 accent-accent bg-box border border-line rounded cursor-pointer"
                />
                <label htmlFor="cascade" className="text-xs text-white cursor-pointer font-body">
                  Immediately suspend all existing customer accounts matching this rule
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-box border border-line text-muted hover:text-white text-xs font-display uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent text-white hover:bg-accent-hover text-xs font-display uppercase tracking-wider font-semibold shadow-lg shadow-accent/20"
                >
                  Enforce Blacklist Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
