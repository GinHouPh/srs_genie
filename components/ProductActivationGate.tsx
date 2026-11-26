import React, { useState } from 'react';
import {
  Key,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Server,
  HelpCircle
} from 'lucide-react';
import { licenseService } from '../services/licenseService';

interface ProductActivationGateProps {
  onActivationSuccess?: () => void;
}

export const ProductActivationGate: React.FC<ProductActivationGateProps> = ({
  onActivationSuccess
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = keyInput.trim();
    if (!cleanKey) {
      setError('Please provide an Envato Purchase Code or Agape License Key.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await licenseService.activateLicense(cleanKey);
      if (res.valid) {
        setSuccessMsg(res.message || 'SRS Genie activated successfully! Unlocking workspace...');
        await licenseService.fetchLicenseStatus();
        if (onActivationSuccess) {
          onActivationSuccess();
        }
      } else {
        setError(res.message || 'License verification rejected by Agape Central Licensing Server.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the licensing server. Please check network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-surface border-2 border-line p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-rose-500 to-amber-500" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-accent/10 border border-accent/40 flex items-center justify-center text-accent shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <div className="eyebrow text-accent flex items-center gap-2">
                <span>PRODUCT ACTIVATION REQUIRED</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mt-1">
                Activate SRS Genie
              </h1>
              <p className="font-body text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                This installation is currently locked. To unlock specification synthesis, AI agents, MCP cloud gateway, and client project management, please activate with your license key.
              </p>
            </div>
          </div>

          {/* Host Domain Info Pill */}
          <div className="bg-box border border-line px-4 py-2.5 flex items-center justify-between text-xs font-mono">
            <span className="text-muted flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-accent" />
              Binding Target Host:
            </span>
            <span className="text-white font-bold">{currentDomain}</span>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-4 bg-accent/10 border-l-4 border-accent text-accent text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold uppercase tracking-wider">Activation Failed</div>
                <div className="text-accent/90">{error}</div>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold uppercase tracking-wider">License Verified</div>
                <div>{successMsg}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-display uppercase tracking-widest text-muted mb-2">
                Envato Purchase Code or Agape License Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder="e.g. c2f8e120-410a-4b95-a249-1663b6528d9a or AGAPE-SRS-XXXX-XXXX"
                  disabled={loading || !!successMsg}
                  className="w-full bg-box border border-line pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-muted/50 focus:outline-none focus:border-accent uppercase tracking-wider disabled:opacity-50"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg || !keyInput.trim()}
              className="w-full btn btn-accent py-3.5 uppercase font-display tracking-widest text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with Licensing Server...</span>
                </>
              ) : successMsg ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activated & Unlocked</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Activate Software & Unlock</span>
                </>
              )}
            </button>
          </form>

          {/* Help & Links */}
          <div className="border-t border-line pt-4 space-y-3">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-xs text-muted hover:text-white flex items-center gap-1.5 transition-colors font-display uppercase tracking-wider"
            >
              <HelpCircle className="w-3.5 h-3.5 text-accent" />
              <span>Where do I find my Purchase Code or License Key?</span>
            </button>

            {showHelp && (
              <div className="p-4 bg-box border border-line text-xs text-muted space-y-2 leading-relaxed animate-in fade-in duration-200">
                <p>
                  <strong>Envato Market (CodeCanyon):</strong> Log in to your ThemeForest / CodeCanyon account, navigate to <em>Downloads</em>, find <em>SRS Genie</em>, and click <em>Download → License Certificate & Purchase Code (text or PDF)</em>. The purchase code format is a 36-character UUID.
                </p>
                <p>
                  <strong>Agape Infosys Direct:</strong> If you purchased directly from agapeinfosys.com, check your license confirmation email or client dashboard at <a href="https://agapeinfosys.com/dashboard/licenses" target="_blank" rel="noreferrer" className="text-accent underline">agapeinfosys.com/dashboard/licenses</a>.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted pt-2">
              <a
                href="https://agapeinfosys.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Agape Central Licensing</span>
                <ExternalLink className="w-3 h-3 text-accent" />
              </a>
              <span>CodeCanyon (Envato Market) Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
