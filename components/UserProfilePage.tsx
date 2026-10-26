import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  KeyRound,
  CreditCard,
  Building2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  LogOut,
  Calendar,
  Lock,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { User, PricingPlan } from '../types';
import { authService } from '../services/authService';
import { saasStore } from '../services/saasStore';
import { projectStore, SavedProjectRecord } from '../services/projectStore';

interface UserProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNavigateToDashboard: () => void;
  onNavigateToBilling: () => void;
  onOpenProject?: (project: SavedProjectRecord) => void;
  onLogout: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onUpdateUser,
  onNavigateToDashboard,
  onNavigateToBilling,
  onOpenProject,
  onLogout
}) => {
  // Form state: Profile details
  const [name, setName] = useState(user.name || '');
  const [company, setCompany] = useState(user.company || '');
  const [avatarSeed, setAvatarSeed] = useState(user.name || 'User');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Form state: Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Active user's projects
  const myProjects = projectStore.getAllProjects(user);
  const plans = saasStore.getPlans();
  const activePlan = plans.find(p => p.id === user.plan) || {
    id: user.plan,
    name: user.plan.toUpperCase(),
    quotaSpecsPerMonth: 3,
    quotaMcpKeys: 0
  } as PricingPlan;

  const currentAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(null);

    const updated = await authService.updateUserProfile(user.id, {
      name: name.trim(),
      company: company.trim(),
      avatarUrl: currentAvatarUrl
    });

    if (updated) {
      onUpdateUser(updated);
      setProfileSuccess('Profile details saved successfully.');
      setTimeout(() => setProfileSuccess(null), 4000);
    }
    setProfileSaving(false);
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordSaving(true);
    const res = await authService.changePassword(user.id, currentPassword, newPassword);

    if (!res.success) {
      setPasswordError(res.error || 'Failed to update password.');
    } else {
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    }
    setPasswordSaving(false);
  };

  return (
    <div className="shell py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="text-xs font-display uppercase tracking-[0.14em] text-muted hover:text-white flex items-center gap-1.5 transition-colors"
          >
            ← Back to Workspace
          </button>
          <span className="text-line">/</span>
          <span className="font-display text-xs uppercase tracking-[0.14em] text-accent font-semibold">
            Account Profile
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToBilling}
            className="btn btn-sm btn--secondary text-xs flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-accent" />
            <span>Manage Billing</span>
          </button>
          <button
            onClick={onLogout}
            className="btn btn-sm btn--ghost text-xs text-muted hover:text-accent flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* User Identity Hero Card */}
      <div className="agape-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
          <div className="w-32 h-32 bg-accent rotate-45 transform origin-bottom-left translate-x-5 -translate-y-16 opacity-70" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-surface border-2 border-accent overflow-hidden shadow-xl shadow-accent/10">
              <img
                src={user.avatarUrl || currentAvatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-ink rounded-full" title="Active Account" />
          </div>

          {/* User Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[0.04em] uppercase">
                {user.name}
              </h1>
              <span className={`px-2.5 py-0.5 font-display text-[11px] tracking-[0.14em] uppercase font-semibold ${
                user.role === 'admin'
                  ? 'bg-accent text-white'
                  : user.role === 'staff'
                  ? 'bg-box border border-line text-white'
                  : 'bg-box border border-line text-muted'
              }`}>
                {user.role === 'admin' ? 'Business Owner (Admin)' : user.role === 'staff' ? 'Staff Member' : 'Client Account'}
              </span>
              {user.isEmailVerified && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            <p className="font-body text-xs sm:text-sm text-muted flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-body">
                <Mail className="w-3.5 h-3.5 text-accent" />
                {user.email}
              </span>
              {user.company && (
                <span className="flex items-center gap-1.5 text-muted">
                  <Building2 className="w-3.5 h-3.5" />
                  {user.company}
                </span>
              )}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
              <span>Account ID: <strong className="text-white">{user.id}</strong></span>
              <span>Workspace: <strong className="text-white">{user.tenantId || 'tenant_default'}</strong></span>
              {user.createdAt && (
                <span>Member Since: <strong className="text-white">{new Date(user.createdAt).toLocaleDateString()}</strong></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Profile Editor & Password Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Information Editor (7 cols) */}
        <div className="lg:col-span-7 agape-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <div className="eyebrow mb-1">Identity Settings</div>
              <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">
                Personal Information
              </h2>
            </div>
            <UserIcon className="w-5 h-5 text-accent" />
          </div>

          {profileSuccess && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="field">
              <label className="field__label">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-ink border border-line px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                placeholder="Your Name"
              />
            </div>

            <div className="field">
              <label className="field__label">Company / Agency</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-ink border border-line px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                placeholder="Company Name (Optional)"
              />
            </div>

            <div className="field">
              <label className="field__label">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-ink/50 border border-line/60 px-4 py-2.5 text-sm text-muted font-mono cursor-not-allowed outline-none"
              />
              <p className="text-[11px] text-muted font-body mt-1">
                To change your email address, please submit a request to support@srsgenie.ai.
              </p>
            </div>

            <div className="field">
              <label className="field__label">Avatar Generator Seed</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={avatarSeed}
                  onChange={e => setAvatarSeed(e.target.value)}
                  className="flex-1 bg-ink border border-line px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                  placeholder="Enter any seed text"
                />
                <button
                  type="button"
                  onClick={() => setAvatarSeed(`Seed_${Math.floor(Math.random() * 10000)}`)}
                  className="p-2.5 bg-box border border-line text-muted hover:text-white transition-colors"
                  title="Randomize Avatar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="btn btn--accent w-full justify-center mt-2"
            >
              {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Password & Security (5 cols) */}
        <div className="lg:col-span-5 agape-card p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-line mb-6">
              <div>
                <div className="eyebrow mb-1">Credentials & Auth</div>
                <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">
                  Change Password
                </h2>
              </div>
              <KeyRound className="w-5 h-5 text-accent" />
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-accent/10 border border-accent/20 text-accent text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="field">
                <label className="field__label">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-ink border border-line px-4 py-2.5 pl-10 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-ink border border-line px-4 py-2.5 pl-10 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-ink border border-line px-4 py-2.5 pl-10 text-sm text-white placeholder:text-muted focus:border-accent outline-none font-body transition-colors"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="btn btn--secondary w-full justify-center mt-2"
              >
                {passwordSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="p-3 bg-box border border-line text-xs font-body text-muted flex items-center gap-2 mt-4">
            <Shield className="w-4 h-4 shrink-0 text-accent" />
            <span>Passwords are salted and stored in your Serverbyt MySQL database.</span>
          </div>
        </div>
      </div>

      {/* Subscription & Usage Overview */}
      <div className="agape-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="eyebrow mb-1">Active Plan & Quota</div>
            <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">
              Subscription & Workspace Quota
            </h2>
          </div>
          <button
            onClick={onNavigateToBilling}
            className="btn btn--accent text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Upgrade / Change Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat">
            <span className="stat__value text-white uppercase text-2xl">{activePlan.name}</span>
            <span className="stat__label">Current Active Plan</span>
            <div className="text-[11px] text-accent mt-1 font-mono">
              ${activePlan.priceMonthly}/month
            </div>
          </div>

          <div className="stat">
            <span className="stat__value text-accent font-mono">{myProjects.length}</span>
            <span className="stat__label">Specifications Generated</span>
            <div className="text-[11px] text-muted mt-1 font-body">
              Allowance: {activePlan.quotaSpecsPerMonth} / month
            </div>
          </div>

          <div className="stat">
            <span className="stat__value text-white font-mono">{activePlan.quotaMcpKeys}</span>
            <span className="stat__label">Active MCP Keys</span>
            <div className="text-[11px] text-muted mt-1 font-body">
              Cursor / Windsurf sync
            </div>
          </div>

          <div className="stat">
            <span className="stat__value text-white font-mono">
              {Math.min(100, Math.round((myProjects.length / Math.max(1, activePlan.quotaSpecsPerMonth)) * 100))}%
            </span>
            <span className="stat__label">Quota Utilization</span>
            <div className="w-full bg-box h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-accent h-full transition-all"
                style={{
                  width: `${Math.min(100, (myProjects.length / Math.max(1, activePlan.quotaSpecsPerMonth)) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Register */}
      <div className="agape-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <div className="eyebrow mb-1">My Repository</div>
            <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">
              Recent Specifications ({myProjects.length})
            </h2>
          </div>
          <button
            onClick={onNavigateToDashboard}
            className="btn btn-sm btn--ghost text-xs"
          >
            View All in Dashboard →
          </button>
        </div>

        {myProjects.length === 0 ? (
          <div className="py-12 text-center text-muted font-body text-xs">
            No specifications synthesized yet. Start a new project from your workspace dashboard.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {myProjects.slice(0, 5).map(proj => (
              <div
                key={proj.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-box/30 px-2 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-white uppercase tracking-[0.05em]">
                      {proj.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-box border border-line text-muted">
                      v{proj.version || '1.0.0'}
                    </span>
                    <span className="badge--on text-[10px]">
                      {proj.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted font-body">
                    {proj.formData?.project_overview?.industry || 'Software Specification'} · Last updated {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onOpenProject) {
                      onOpenProject(proj);
                    } else {
                      onNavigateToDashboard();
                    }
                  }}
                  className="btn btn-sm btn--secondary text-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-accent" />
                  <span>Open Spec</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
