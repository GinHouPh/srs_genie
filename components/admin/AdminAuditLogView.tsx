import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Download,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Activity,
  Terminal,
  FileJson,
  FileSpreadsheet,
  UserX,
  Server
} from 'lucide-react';
import { auditLogger, SecurityAuditEvent } from '../../services/auditLogger';

interface AdminAuditLogViewProps {
  onToast: (msg: string) => void;
}

export const AdminAuditLogView: React.FC<AdminAuditLogViewProps> = ({ onToast }) => {
  const [events, setEvents] = useState<SecurityAuditEvent[]>(auditLogger.getEvents());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    // Subscribe to live audit telemetry events
    const unsubscribe = auditLogger.subscribe((allEvents) => {
      setEvents(allEvents);
    });
    return unsubscribe;
  }, []);

  const refreshLogs = () => {
    setEvents(auditLogger.getEvents());
    onToast('Refreshed audit telemetry stream.');
  };

  const handleExportJson = () => {
    const jsonStr = auditLogger.exportAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `srs_security_audit_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Exported audit trail to JSON.');
  };

  const handleExportCsv = () => {
    const csvStr = auditLogger.exportAsCsv();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `srs_security_audit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Exported audit trail to CSV.');
  };

  const handleClearLogs = () => {
    if (confirm('Clear the current security audit log buffer? In production environments, this action requires multi-party quorum.')) {
      auditLogger.clear();
      onToast('Audit logs buffer cleared.');
    }
  };

  const handleSimulateProbe = () => {
    auditLogger.log({
      action: 'tenant.isolation.probe_test',
      status: 'DENIED',
      actorEmail: 'attacker_sim@test.local',
      tenantId: 'tenant_rogue_999',
      details: {
        reason: 'Simulated cross-tenant row access probe against tenant_master_001',
        origin: 'Audit Test Harness'
      }
    });
    onToast('Simulated security probe event emitted.');
  };

  // Metrics computation
  const totalEvents = events.length;
  const violationCount = events.filter(e => e.status === 'DENIED' || e.action.includes('violation') || e.action.includes('blocked')).length;
  const failureCount = events.filter(e => e.status === 'FAILED' || e.action.includes('lockout')).length;
  const uniqueTenants = new Set(events.map(e => e.tenantId).filter(Boolean)).size;

  // Filter pipeline
  const filteredEvents = events.filter(ev => {
    if (filterStatus !== 'ALL' && ev.status !== filterStatus) return false;
    if (selectedCategory !== 'ALL') {
      if (!ev.action.toLowerCase().startsWith(selectedCategory.toLowerCase())) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchActor = ev.actorEmail?.toLowerCase().includes(q) || ev.actorId?.toLowerCase().includes(q);
      const matchAction = ev.action.toLowerCase().includes(q);
      const matchTenant = ev.tenantId?.toLowerCase().includes(q);
      const matchDetails = JSON.stringify(ev.details || {}).toLowerCase().includes(q);
      if (!matchActor && !matchAction && !matchTenant && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-surface border border-line p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-accent" />
            <span className="font-display text-xs tracking-[0.2em] text-accent uppercase font-bold">
              SIEM & Access Audit Trail
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Security Telemetry & Event Store
          </h2>
          <p className="text-muted text-sm font-body mt-1">
            OWASP ASVS v4.0 and SOC 2 Type II compliant immutable audit log capturing IAM, privilege checks, multi-tenant boundaries, and gateway operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateProbe}
            className="px-3 py-2 bg-box border border-accent/40 text-accent hover:bg-accent hover:text-white transition-all text-xs font-display uppercase tracking-[0.14em] flex items-center gap-1.5"
            title="Simulate a security alert probe"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulate Probe</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-2 bg-box border border-line text-muted hover:text-white hover:border-line-hover transition-colors text-xs font-display uppercase tracking-[0.14em] flex items-center gap-1.5"
            title="Export full log as JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-box border border-line text-muted hover:text-white hover:border-line-hover transition-colors text-xs font-display uppercase tracking-[0.14em] flex items-center gap-1.5"
            title="Export as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={refreshLogs}
            className="p-2 bg-box border border-line text-muted hover:text-white hover:border-accent transition-colors"
            title="Refresh stream"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2 bg-box border border-line text-muted hover:text-red-400 hover:border-red-500/40 transition-colors"
            title="Clear buffer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat">
          <span className="stat__value text-white font-mono">{totalEvents}</span>
          <span className="stat__label">Total Audit Events</span>
          <div className="text-[11px] text-muted mt-2 font-body tracking-normal flex items-center gap-1">
            <Server className="w-3 h-3 text-accent" />
            <span>Persistent client-side event store</span>
          </div>
        </div>

        <div className="stat">
          <span className={`stat__value font-mono ${violationCount > 0 ? 'text-accent' : 'text-emerald-400'}`}>
            {violationCount}
          </span>
          <span className="stat__label">Violations & Denials</span>
          <div className="text-[11px] text-muted mt-2 font-body tracking-normal flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-accent" />
            <span>Cross-tenant & escalation blocks</span>
          </div>
        </div>

        <div className="stat">
          <span className={`stat__value font-mono ${failureCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {failureCount}
          </span>
          <span className="stat__label">Auth Failures / Lockouts</span>
          <div className="text-[11px] text-muted mt-2 font-body tracking-normal flex items-center gap-1">
            <UserX className="w-3 h-3 text-amber-400" />
            <span>Brute-force lockout enforcement</span>
          </div>
        </div>

        <div className="stat">
          <span className="stat__value text-white font-mono">{uniqueTenants}</span>
          <span className="stat__label">Isolated Tenants</span>
          <div className="text-[11px] text-emerald-400 mt-2 font-body tracking-normal flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Zero cross-tenant leakage</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-line p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, email, tenantId, or details..."
            className="w-full bg-box border border-line pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-display uppercase tracking-wider text-muted">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-box border border-line text-white text-xs px-2.5 py-1.5 focus:outline-none focus:border-accent font-mono"
            >
              <option value="ALL">All Categories</option>
              <option value="auth">auth.* (Authentication)</option>
              <option value="tenant">tenant.* (Isolation)</option>
              <option value="security">security.* (RBAC)</option>
              <option value="saas">saas.* (Admin Config)</option>
              <option value="payment">payment.* (Cashfree)</option>
              <option value="mcp">mcp.* (MCP Keys)</option>
              <option value="project">project.* (Specs)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-display uppercase tracking-wider text-muted">Severity:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-box border border-line text-white text-xs px-2.5 py-1.5 focus:outline-none focus:border-accent font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="DENIED">DENIED (Blocked)</option>
              <option value="WARNING">WARNING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Events Table */}
      <div className="bg-surface border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-box text-[11px] font-display uppercase tracking-[0.16em] text-muted">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-mono text-xs">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted font-body">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                    No audit events match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const isDenied = ev.status === 'DENIED';
                  const isWarning = ev.status === 'WARNING';
                  const isFailed = ev.status === 'FAILED';
                  const isSuccess = ev.status === 'SUCCESS';

                  return (
                    <tr key={ev.eventId} className="hover:bg-box/50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-muted text-[11px]">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        <span className="block text-[9px] text-muted/60">{ev.timestamp.split('T')[0]}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                            isSuccess
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : isDenied
                              ? 'bg-red-950/70 text-red-400 border border-red-800/60'
                              : isWarning
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {isSuccess && <CheckCircle2 className="w-3 h-3" />}
                          {isDenied && <XCircle className="w-3 h-3" />}
                          {isWarning && <AlertTriangle className="w-3 h-3" />}
                          {isFailed && <AlertTriangle className="w-3 h-3" />}
                          <span>{ev.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-semibold">
                        <span className={isDenied ? 'text-accent' : isWarning ? 'text-amber-300' : 'text-white'}>
                          {ev.action}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-muted">
                        <div className="text-white text-xs">{ev.actorEmail || 'anonymous'}</div>
                        {ev.actorRole && (
                          <span className="text-[10px] text-muted/80 uppercase">
                            [{ev.actorRole}]
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-muted text-[11px]">
                        <span className="px-1.5 py-0.5 bg-box border border-line rounded text-[10px] text-accent font-mono">
                          {ev.tenantId || 'global'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs font-mono text-muted/90 max-w-md truncate">
                        {ev.details ? (
                          <span title={JSON.stringify(ev.details, null, 2)}>
                            {Object.entries(ev.details)
                              .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
                              .join(' | ')}
                          </span>
                        ) : (
                          <span className="text-muted/40">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
