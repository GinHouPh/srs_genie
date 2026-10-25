import React from 'react';
import { ScrollText, LogOut, User as UserIcon, ShieldAlert, Network, LayoutDashboard, Crown, CreditCard } from 'lucide-react';
import { User, AppState } from '../types';

interface HeaderProps {
  user?: User | null;
  currentAppState?: AppState;
  onLogout?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToMcp?: () => void;
  onNavigateToDashboard?: () => void;
  onOpenClientSubscription?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentAppState,
  onLogout,
  onNavigateToAdmin,
  onNavigateToMcp,
  onNavigateToDashboard,
  onOpenClientSubscription
}) => {
  const isBusinessOwnerOrStaff = user?.role === 'admin' || user?.role === 'staff';
  const isClient = user?.role === 'client';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-md border-b border-line no-print">
      {/* Decorative top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-accent via-accent to-transparent opacity-80" />

      <div className="shell h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={onNavigateToDashboard}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 bg-box border border-line flex items-center justify-center group-hover:border-accent transition-colors">
            <ScrollText className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg tracking-[0.16em] text-white uppercase font-bold">
              SRS <span className="text-accent">GENIE</span>
            </span>
            <span className="badge--on text-[10px]">
              SAAS
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-surface border border-line p-1">
            <button
              onClick={onNavigateToDashboard}
              className={`flex items-center gap-2 px-3 py-1.5 font-display text-xs tracking-[0.16em] uppercase transition-all ${
                currentAppState === AppState.DASHBOARD
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-white hover:bg-box'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {isClient ? 'Specifications' : 'Projects'}
            </button>

            <button
              onClick={onNavigateToMcp}
              className={`flex items-center gap-2 px-3 py-1.5 font-display text-xs tracking-[0.16em] uppercase transition-all ${
                currentAppState === AppState.MCP_HUB
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-white hover:bg-box'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              MCP Gateway
            </button>

            {/* ONLY Business Owner / Staff see Admin Console */}
            {isBusinessOwnerOrStaff && (
              <button
                onClick={onNavigateToAdmin}
                className={`flex items-center gap-2 px-3 py-1.5 font-display text-xs tracking-[0.16em] uppercase transition-all ${
                  currentAppState === AppState.ADMIN_CONSOLE
                    ? 'bg-accent text-white font-semibold'
                    : 'text-white hover:bg-accent/20 border-l border-line'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                Console
              </button>
            )}

            {/* Client sees their Subscription & Plan */}
            {isClient && onOpenClientSubscription && (
              <button
                onClick={onOpenClientSubscription}
                className="flex items-center gap-2 px-3 py-1.5 font-display text-xs tracking-[0.16em] uppercase text-muted hover:text-white hover:bg-box transition-all border-l border-line"
              >
                <CreditCard className="w-3.5 h-3.5 text-accent" />
                Billing
              </button>
            )}
          </nav>
        )}

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Role Indicator Badge */}
              <div className="hidden sm:flex items-center">
                {user.role === 'admin' && (
                  <span className="badge--on flex items-center gap-1.5">
                    <Crown className="w-3 h-3 text-accent" />
                    Business Owner
                  </span>
                )}
                {user.role === 'staff' && (
                  <span className="badge--off flex items-center gap-1.5 text-body">
                    <ShieldAlert className="w-3 h-3 text-accent" />
                    Staff Team
                  </span>
                )}
                {user.role === 'client' && (
                  <span className="badge--off flex items-center gap-1.5">
                    <UserIcon className="w-3 h-3 text-muted" />
                    Client
                  </span>
                )}
              </div>

              {/* User Identity */}
              <div className="flex items-center gap-2 pl-3 border-l border-line">
                <div className="text-right hidden sm:block">
                  <div className="font-display text-xs font-semibold tracking-[0.08em] text-white uppercase leading-tight">
                    {user.name}
                  </div>
                  <div className="font-body text-[11px] text-muted tracking-normal">
                    {user.email}
                  </div>
                </div>
                <div className="w-8 h-8 bg-surface border border-line flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-muted" />
                  )}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-muted hover:text-accent hover:bg-box border border-transparent hover:border-line transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-display text-xs tracking-[0.2em] text-muted uppercase">
                AI Agent Documentation
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
