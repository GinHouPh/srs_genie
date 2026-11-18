import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Globe,
  RefreshCw,
  DownloadCloud,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Unlink,
  Server,
  Zap,
  Sparkles,
  Layers,
  Lock,
  Unlock
} from 'lucide-react';
import { licenseService } from '../../services/licenseService';
import { LicenseInfo, SoftwareUpdateInfo } from '../../types';

interface AdminLicenseViewProps {
  onToast: (msg: string) => void;
}

export const AdminLicenseView: React.FC<AdminLicenseViewProps> = ({ onToast }) => {
  const [license, setLicense] = useState<LicenseInfo>(() => licenseService.getLicenseInfo());
  const [keyInput, setKeyInput] = useState<string>('');
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [isDeactivating, setIsDeactivating] = useState<boolean>(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<SoftwareUpdateInfo | null>(null);

  useEffect(() => {
    return licenseService.subscribe(info => {
      setLicense(info);
    });
  }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      onToast('Please input an Envato Purchase Code or Agape License Key.');
      return;
    }

    setIsActivating(true);
    try {
      const res = await licenseService.activateLicense(keyInput);
      if (res.valid) {
        onToast(`✅ License activated successfully! [${res.tier?.toUpperCase()}]`);
        setKeyInput('');
      } else {
        onToast(`❌ Activation failed: ${res.message}`);
      }
    } catch (err: any) {
      onToast(`❌ Error: ${err.message || 'Verification failed.'}`);
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to unbind this domain? This will release your license so you can activate it on another server.')) {
      return;
    }

    setIsDeactivating(true);
    try {
      const res = await licenseService.deactivateLicense();
      if (res.success) {
        onToast('License unbound. Domain released successfully.');
      }
    } catch (err: any) {
      onToast(`Error: ${err.message}`);
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleCheckUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const res = await licenseService.checkForUpdates();
      setUpdateInfo(res);
      if (res.updateAvailable) {
        onToast(`🚀 New version ${res.latestVersion} available!`);
      } else {
        onToast('✅ SRS Genie is running the latest production release.');
      }
    } catch (err: any) {
      onToast('Could not reach Agape Central Update Server.');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-1 flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-accent" />
            <span>CENTRAL LICENSING & UPDATE GOVERNANCE</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white tracking-[0.06em] uppercase">
            License & Software Protection
          </h2>
          <p className="font-body text-xs text-muted max-w-2xl mt-1">
            Governs cryptographic domain-locking, Envato Market (CodeCanyon) purchase code verification,
            Agape direct sales licensing, and 1-click cloud updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              licenseService.fetchLicenseStatus();
              onToast('License status re-synchronized.');
            }}
            className="btn btn-sm btn--ghost text-xs flex items-center gap-1.5"
            title="Refresh License Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Status</span>
          </button>
          <a
            href="https://agapeinfosys.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn--outline text-xs flex items-center gap-1.5 border-line hover:border-accent text-muted hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Agape Hub</span>
          </a>
        </div>
      </div>

      {/* Primary Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-surface border border-line rounded-none space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 flex items-center justify-center border ${
                  license.isLicensed
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-accent/40 bg-accent/10 text-accent'
                }`}
              >
                {license.isLicensed ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-white tracking-[0.04em] uppercase">
                    {license.isLocal
                      ? 'Local Sandbox Dev Mode'
                      : license.isLicensed
                      ? 'Verified & Domain-Locked'
                      : 'Unlicensed Installation'}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                      license.isLicensed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-accent/20 text-accent border border-accent/30'
                    }`}
                  >
                    {license.tier ? license.tier.toUpperCase() : 'NO TIER'}
                  </span>
                </div>
                <p className="font-body text-xs text-muted mt-0.5">{license.statusMessage}</p>
              </div>
            </div>

            {/* Channel Badge */}
            <span className="text-[11px] font-mono px-2.5 py-1 bg-box border border-line text-muted">
              {license.channel === 'envato' && '🛒 CodeCanyon (Envato)'}
              {license.channel === 'agape_direct' && '⚡ Agape Direct Sales'}
              {license.channel === 'offline_dev' && '🛠️ Offline Dev Allowance'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-line/60">
            <div>
              <div className="text-[10px] font-display uppercase tracking-widest text-muted">Active Key</div>
              <div className="font-mono text-xs text-white truncate mt-1">
                {license.licenseKey
                  ? license.licenseKey.length > 20
                    ? `${license.licenseKey.slice(0, 8)}...${license.licenseKey.slice(-4)}`
                    : license.licenseKey
                  : '—'}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-display uppercase tracking-widest text-muted">Bound Host</div>
              <div className="font-mono text-xs text-white truncate mt-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-muted" />
                <span>{license.boundDomain || 'localhost'}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-display uppercase tracking-widest text-muted">Buyer / Licensee</div>
              <div className="font-mono text-xs text-white truncate mt-1">
                {license.buyerName || (license.isLocal ? 'Sandbox Developer' : 'Unregistered')}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-display uppercase tracking-widest text-muted">Updates & Support</div>
              <div className="font-mono text-xs text-white truncate mt-1">
                {license.supportUntil ? new Date(license.supportUntil).toLocaleDateString() : 'Perpetual Core'}
              </div>
            </div>
          </div>

          {/* Action Row */}
          {license.isLicensed && !license.isLocal && (
            <div className="pt-4 border-t border-line/60 flex items-center justify-between">
              <span className="text-xs text-muted">
                Moving this instance to a different server or domain?
              </span>
              <button
                onClick={handleDeactivate}
                disabled={isDeactivating}
                className="btn btn-sm btn--outline text-xs text-accent border-accent/40 hover:bg-accent/10 flex items-center gap-1.5"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>{isDeactivating ? 'Unbinding...' : 'Deactivate & Unbind Domain'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Feature Entitlements Card */}
        <div className="p-6 bg-surface border border-line rounded-none space-y-4">
          <div className="eyebrow text-accent flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACTIVATED ENTITLEMENTS</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                label: 'Autonomous MCP Gateway',
                desc: 'Windsurf, Cursor & Claude agent tools',
                active: license.features.mcpGateway,
                icon: Server
              },
              {
                label: 'Multi-Provider AI Matrix',
                desc: 'Gemini, OpenAI, Claude, DeepSeek & Ollama',
                active: license.features.multiAiProvider,
                icon: Zap
              },
              {
                label: 'White-Label Branding',
                desc: 'Custom corporate branding and invoice overrides',
                active: license.features.whiteLabel,
                icon: Layers
              },
              {
                label: '1-Click Cloud Updates',
                desc: 'Automated delta schema and prompt updates',
                active: license.features.priorityUpdates,
                icon: DownloadCloud
              }
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-start gap-3 p-2 bg-box border border-line/50">
                  <div className={`mt-0.5 p-1 border ${f.active ? 'border-emerald-500/40 text-emerald-400' : 'border-line text-muted'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">{f.label}</span>
                      {f.active ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-muted" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted truncate mt-0.5">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activation / Key Input Form */}
      <div className="p-6 bg-surface border border-line rounded-none space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-white tracking-[0.04em] uppercase flex items-center gap-2">
            <Key className="w-4 h-4 text-accent" />
            <span>Activate or Update License Key</span>
          </h3>
          <p className="font-body text-xs text-muted mt-1">
            Enter your <strong>Envato Purchase Code</strong> (from CodeCanyon Downloads) or an{' '}
            <strong>Agape License Key</strong> (from your agapeinfosys.com order receipt).
          </p>
        </div>

        <form onSubmit={handleActivate} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="e.g. c2f8e120-410a-4b95-a249-1663b6528d9a OR AGAPE-SRS-9K2M-7B3X-L8Q1"
              className="w-full bg-box border border-line px-4 py-2.5 text-xs text-white font-mono placeholder:text-muted/60 focus:outline-none focus:border-accent uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={isActivating || !keyInput.trim()}
            className="btn btn-sm btn--primary px-6 py-2.5 font-display text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            {isActivating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify & Bind License</span>
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-line/60 text-[11px] text-muted">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Localhost & Staging domains are permanently exempt from seat limits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes 14-day offline grace period for uninterrupted production</span>
            </div>
          </div>
          <a
            href="/setup-guide.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline font-display tracking-wider uppercase text-[10px]"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open Client Setup Guide</span>
          </a>
        </div>
      </div>

      {/* Auto-Updater & Software Releases Section */}
      <div className="p-6 bg-surface border border-line rounded-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-accent flex items-center gap-1.5">
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>RELEASE REGISTRY & 1-CLICK UPDATES</span>
            </div>
            <h3 className="font-display text-base font-bold text-white tracking-[0.04em] uppercase mt-1">
              Software Version & Cloud Synchronizer
            </h3>
            <p className="font-body text-xs text-muted mt-0.5">
              Currently running <strong>SRS Genie v2.5.0</strong>. Check for official updates, AI schema upgrades, and bug fixes.
            </p>
          </div>

          <button
            onClick={handleCheckUpdates}
            disabled={isCheckingUpdate}
            className="btn btn-sm btn--outline border-line hover:border-accent text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin text-accent' : ''}`} />
            <span>{isCheckingUpdate ? 'Checking Cloud...' : 'Check for Updates'}</span>
          </button>
        </div>

        {updateInfo && (
          <div className="p-4 bg-box border border-line space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    updateInfo.updateAvailable ? 'bg-accent animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
                  {updateInfo.updateAvailable
                    ? `Update Available: v${updateInfo.latestVersion}`
                    : 'Your Installation Is Up To Date'}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted">
                Current: v{updateInfo.currentVersion}
              </span>
            </div>

            {updateInfo.changelog && (
              <div className="text-xs text-muted font-body bg-surface p-3 border border-line/60">
                <div className="text-[10px] font-display uppercase tracking-widest text-white mb-1">
                  Changelog Highlights
                </div>
                <p className="whitespace-pre-line">{updateInfo.changelog}</p>
              </div>
            )}

            {updateInfo.updateAvailable && updateInfo.downloadUrl && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-muted">
                  Sha256 Checksum: <code className="text-white font-mono">{updateInfo.sha256?.slice(0, 16)}...</code>
                </span>
                <a
                  href={updateInfo.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn--primary text-xs flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>Download Update Package</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Commercial Sales & CodeCanyon Links */}
      <div className="p-4 bg-box border border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-muted">
          <span>Need additional licenses for client projects or an Extended/White-Label license?</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://codecanyon.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-accent font-display text-[11px] tracking-wider uppercase underline underline-offset-4"
          >
            CodeCanyon Listing
          </a>
          <span className="text-muted">•</span>
          <a
            href="https://agapeinfosys.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-accent font-display text-[11px] tracking-wider uppercase underline underline-offset-4"
          >
            Agape Direct Store
          </a>
        </div>
      </div>
    </div>
  );
};
