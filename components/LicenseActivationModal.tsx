import React, { useState } from 'react';
import {
  Key,
  ShieldAlert,
  ShieldCheck,
  X,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { licenseService } from '../services/licenseService';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LicenseActivationModal: React.FC<LicenseActivationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setError('Please provide an Envato Purchase Code or Agape License Key.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await licenseService.activateLicense(keyInput);
      if (res.valid) {
        setSuccessMsg(res.message || 'SRS Genie activated successfully!');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(res.message || 'Verification rejected by licensing server.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error verifying key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border border-line p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent/10 border border-accent/40 flex items-center justify-center text-accent shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="eyebrow text-accent">SOFTWARE ACTIVATION</div>
            <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider mt-0.5">
              Activate SRS Genie
            </h3>
            <p className="font-body text-xs text-muted mt-1">
              Enter your purchase code from CodeCanyon or direct license key from Agape Infosys to bind this domain.
            </p>
          </div>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-3 bg-accent/10 border border-accent/40 text-accent text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Activation Form */}
        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-display uppercase tracking-widest text-muted mb-1.5">
              License Key / Purchase Code
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="e.g. c2f8e120-410a-4b95-a249-1663b6528d9a"
              className="w-full bg-box border border-line px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-muted/60 focus:outline-none focus:border-accent uppercase"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !keyInput.trim()}
            className="w-full btn btn-sm btn--primary py-2.5 font-display text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying with Agape Server...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Verify & Activate License</span>
              </>
            )}
          </button>
        </form>

        {/* Informational Perks & Purchase Options */}
        <div className="pt-4 border-t border-line/60 space-y-3">
          <div className="text-[11px] text-muted space-y-1.5">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Unlocks autonomous 33-file multi-agent specification synthesis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full MCP server connectivity for Cursor, Windsurf & Claude Desktop</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px]">
            <span className="text-muted">Don&apos;t have a license yet?</span>
            <div className="flex items-center gap-3">
              <a
                href="https://codecanyon.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent font-display uppercase tracking-wider underline flex items-center gap-1"
              >
                <span>CodeCanyon</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-muted">•</span>
              <a
                href="https://agapeinfosys.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent font-display uppercase tracking-wider underline flex items-center gap-1"
              >
                <span>Agape Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
