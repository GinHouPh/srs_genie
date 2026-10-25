import React, { useState } from 'react';
import { Lock, Mail, User as UserIcon, Building2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const result = authService.login(email, password);
        if (!result.success || !result.user) {
          setError(result.error || 'Login failed.');
          setLoading(false);
          return;
        }
        onLogin(result.user);
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        // Public registration: strictly creates a Client account
        const result = authService.register({
          name,
          email,
          password,
          company
        });
        if (!result.success || !result.user) {
          setError(result.error || 'Registration failed.');
          setLoading(false);
          return;
        }
        onLogin(result.user);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-lg mx-auto px-4 py-8">
      <div className="w-full agape-card p-8 sm:p-10 relative">
        {/* Corner accent marker */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
          <div className="w-16 h-16 bg-accent rotate-45 transform origin-bottom-left translate-x-2 -translate-y-9 opacity-80" />
        </div>

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
            <span>{isLogin ? 'Enter Platform' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {isLogin && (
          <div className="p-4 bg-box/60 border border-line mb-6">
            <div className="font-display text-xs uppercase tracking-[0.18em] text-accent mb-1 font-semibold">
              Business Owner / Admin Portal Demo:
            </div>
            <div className="font-mono text-xs text-muted">
              Email: <span className="text-white">admin@srsgenie.ai</span> · Password: <span className="text-white">Admin123!</span>
            </div>
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
      </div>
    </div>
  );
};
