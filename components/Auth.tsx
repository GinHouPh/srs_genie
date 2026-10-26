import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  RotateCw,
  Loader2
} from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthProps {
  onLogin: (user: User) => void;
  initialMode?: 'login' | 'register';
  initialPlan?: string;
  onCancel?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, initialMode = 'login', initialPlan = 'pro', onCancel }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Email Verification Step State
  const [showVerifyStep, setShowVerifyStep] = useState(false);
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState('');
  const [devSimCode, setDevSimCode] = useState('');
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const result = await authService.login(email, password);
        if (!result.success) {
          if (result.requiresVerification) {
            setPendingVerifyEmail(result.email || email);
            setDevSimCode(result.verificationCode || '');
            setShowVerifyStep(true);
            setLoading(false);
            return;
          }
          setError(result.error || 'Login failed.');
          setLoading(false);
          return;
        }
        if (result.user) {
          onLogin(result.user);
        }
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }

        // Public registration: evaluates live DNS MX + fraud heuristics
        const result = await authService.register({
          name,
          email,
          password,
          company
        });

        if (!result.success) {
          setError(result.error || 'Registration failed.');
          setLoading(false);
          return;
        }

        if (result.requiresVerification) {
          setPendingVerifyEmail(email);
          setDevSimCode(result.verificationCode || '');
          setShowVerifyStep(true);
          setLoading(false);
          return;
        }

        if (result.user) {
          onLogin(result.user);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!verifyCodeInput.trim() || verifyCodeInput.trim().length !== 6) {
      setError('Please enter the 6-digit confirmation code.');
      return;
    }

    const result = authService.verifyEmailCode(pendingVerifyEmail, verifyCodeInput.trim());
    if (!result.success || !result.user) {
      setError(result.error || 'Verification code failed.');
      return;
    }

    onLogin(result.user);
  };

  const handleResendCode = () => {
    setError(null);
    const res = authService.resendVerificationCode(pendingVerifyEmail);
    if (res.success && res.code) {
      setDevSimCode(res.code);
      setResendNotice('A fresh verification code has been generated.');
      setTimeout(() => setResendNotice(null), 4000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-lg mx-auto px-4 py-8">
      <div className="w-full agape-card p-8 sm:p-10 relative">
        {/* Corner accent marker */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
          <div className="w-16 h-16 bg-accent rotate-45 transform origin-bottom-left translate-x-2 -translate-y-9 opacity-80" />
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mb-4 text-xs font-display uppercase tracking-[0.14em] text-muted hover:text-white flex items-center gap-1.5 transition-colors"
          >
            ← Back to Storefront
          </button>
        )}

        {/* STEP 2: EMAIL VERIFICATION CONFIRMATION */}
        {showVerifyStep ? (
          <div className="space-y-6">
            <div className="mb-6">
              <div className="eyebrow mb-2">Mailbox Verification</div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[0.06em] uppercase">
                Confirm Your Email
              </h2>
              <p className="mt-2 font-body text-xs text-muted leading-relaxed">
                We need to verify that your email address is active and available. Enter the 6-digit activation code sent to:
                <strong className="block text-white font-mono mt-1 text-sm">{pendingVerifyEmail}</strong>
              </p>
            </div>

            {/* Simulated Mailbox Dispatch Banner for Dev/Testing */}
            {devSimCode && (
              <div className="p-3.5 bg-box border border-accent/40 rounded space-y-1">
                <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-accent font-bold">
                  <KeyRound className="w-4 h-4" />
                  <span>Simulated Mailbox Dispatch</span>
                </div>
                <p className="text-xs font-body text-muted">
                  Development notice: Verification token dispatched to inbox:
                </p>
                <div className="font-mono text-lg font-bold text-white tracking-[0.25em] bg-ink/70 px-3 py-1.5 border border-line rounded inline-block">
                  {devSimCode}
                </div>
              </div>
            )}

            {resendNotice && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resendNotice}</span>
              </div>
            )}

            {error && (
              <div className="p-4 border-l-2 border-accent bg-accent/10 border border-accent/20 text-xs text-white flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-accent" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-5">
              <div className="field">
                <label className="field__label">6-Digit Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verifyCodeInput}
                    onChange={e => setVerifyCodeInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-ink border border-line px-4 py-3 pl-11 text-lg font-mono tracking-[0.3em] text-white placeholder:text-muted focus:border-accent outline-none text-center"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--accent w-full justify-center text-xs uppercase tracking-wider font-semibold py-3"
              >
                <span>Activate & Access Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between pt-4 border-t border-line text-xs">
              <button
                type="button"
                onClick={handleResendCode}
                className="font-display uppercase tracking-[0.14em] text-muted hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowVerifyStep(false);
                  setError(null);
                  setIsLogin(true);
                }}
                className="font-display uppercase tracking-[0.14em] text-accent hover:text-white transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: LOGIN OR REGISTRATION FORM */
          <>
            <div className="mb-8">
              <div className="eyebrow mb-3">
                {isLogin ? 'Authentication' : 'Registration'}
              </div>
              <h2 className="font-display text-3xl font-semibold text-white tracking-[0.06em] uppercase">
                {isLogin ? 'Sign In To Platform' : 'Create Client Account'}
              </h2>
              <p className="mt-2 font-body text-sm text-muted">
                {isLogin
                  ? 'Enter your credentials to manage software projects and AI agent specifications.'
                  : 'Sign up to generate comprehensive 6-tier .specs suites for your development team.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 border-l-2 border-accent bg-accent/10 border border-accent/20 text-xs text-white flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-accent" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              {!isLogin && (
                <>
                  <div className="field">
                    <label className="field__label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-ink border border-line px-4 py-3 pl-11 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                        placeholder="Alex Morgan"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field__label">Company / Agency (Optional)</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        className="w-full bg-ink border border-line px-4 py-3 pl-11 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                        placeholder="Acme Technologies"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-box border border-line text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-accent" />
                    <span className="font-display uppercase tracking-[0.1em] text-muted text-[11px]">
                      Account Role: <strong className="text-white">Customer / Client</strong>
                    </span>
                  </div>
                </>
              )}

              <div className="field">
                <label className="field__label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-ink border border-line px-4 py-3 pl-11 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-ink border border-line px-4 py-3 pl-11 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--accent w-full mt-4 justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Verifying Mailbox & Security...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Enter Platform' : 'Register Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {isLogin && (
              <div className="p-4 bg-box/60 border border-line mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-display text-xs uppercase tracking-[0.18em] text-accent mb-1 font-semibold">
                    Business Owner / Admin Portal Demo:
                  </div>
                  <div className="font-mono text-xs text-muted">
                    Email: <span className="text-white font-semibold">admin@srsgenie.ai</span> · Password: <span className="text-white font-semibold">Admin123!</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@srsgenie.ai');
                    setPassword('Admin123!');
                    setError(null);
                  }}
                  className="btn btn--secondary text-xs px-3 py-1.5 shrink-0 self-start sm:self-auto"
                >
                  ⚡ Fill Admin
                </button>
              </div>
            )}

            <div className="text-center pt-2 border-t border-line">
              <span className="font-body text-xs text-muted">
                {isLogin ? "Need a client account? " : 'Already registered? '}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="font-display text-xs uppercase tracking-[0.16em] text-accent hover:text-white font-semibold ml-2 transition-colors"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
