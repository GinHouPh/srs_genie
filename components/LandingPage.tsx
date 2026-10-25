import React from 'react';
import {
  FolderTree,
  Network,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Terminal,
  FileCode,
  FileArchive,
  Lock,
  Globe
} from 'lucide-react';
import { saasStore } from '../services/saasStore';
import { SubscriptionTier } from '../types';

interface LandingPageProps {
  onStartFree: () => void;
  onSignIn: () => void;
  onSelectPlan: (planId: SubscriptionTier) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onSignIn,
  onSelectPlan
}) => {
  const plans = saasStore.getPlans();

  return (
    <div className="w-full space-y-24 py-8 animate-in fade-in duration-500">
      {/* 1. HERO SECTION */}
      <section className="shell relative">
        <div className="agape-card p-8 sm:p-14 lg:p-16 relative overflow-hidden">
          {/* Corner decorative accent badge */}
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
            <div className="w-32 h-32 bg-accent rotate-45 transform origin-bottom-left translate-x-5 -translate-y-16 opacity-80" />
          </div>

          <div className="max-w-4xl relative z-10">
            <div className="eyebrow mb-4">
              AI Software Architecture // SaaS Documentation Platform
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-[0.03em] uppercase leading-[1.08] mb-6">
              Build Agent-Ready <br />
              <span className="text-accent">Software Specifications</span>
            </h1>

            <p className="font-body text-base sm:text-lg text-muted max-w-2xl leading-relaxed mb-8">
              Transform product requirements into a comprehensive 6-tier, 22-file <code className="text-white bg-box px-2 py-0.5 font-mono text-sm">.specs</code> suite. 
              Eliminate hallucinations and empower autonomous AI agents like Cursor IDE, Windsurf, and Claude Code to execute clean code right on the first prompt.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStartFree}
                className="btn btn--accent"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href="#pricing"
                className="btn btn--ghost"
              >
                View Plans & Pricing
              </a>

              <a
                href="#specs-architecture"
                className="btn btn--ghost text-muted hover:text-white"
              >
                Explore 6-Tier Architecture
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE METRICS & STATS BAR */}
      <section className="shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat">
            <span className="stat__value text-white">22</span>
            <span className="stat__label">Atomic .Specs Documents</span>
          </div>
          <div className="stat">
            <span className="stat__value text-accent">100%</span>
            <span className="stat__label">Agent Prompt Readiness</span>
          </div>
          <div className="stat">
            <span className="stat__value text-white">JSON-RPC</span>
            <span className="stat__label">Model Context Protocol</span>
          </div>
          <div className="stat">
            <span className="stat__value text-accent">Zero</span>
            <span className="stat__label">Context Hallucination</span>
          </div>
        </div>
      </section>

      {/* 3. THE 6-TIER .SPECS ARCHITECTURE SHOWCASE */}
      <section id="specs-architecture" className="shell scroll-mt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="eyebrow mb-2">Modular Specification Engine</div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[0.04em] uppercase">
              The 6-Tier Specification System
            </h2>
          </div>
          <p className="font-body text-xs text-muted max-w-md">
            Rather than a single bloated document, SRS Genie synthesizes 22 compartmentalized markdown files designed specifically for token-budgeted AI coding tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="agape-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <FolderTree className="w-5 h-5" />
              </div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                Tier 1
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
                Foundation & Principles
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Contains <code className="text-white font-mono">brief.md</code> and <code className="text-white font-mono">principles.md</code>. Defines core problem scope, non-goals, architectural philosophy, and user persona boundaries.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line text-xs font-mono text-muted">
              foundation/brief.md
            </div>
          </div>

          <div className="agape-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                Tier 2
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
                Domain Model & Invariants
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Contains <code className="text-white font-mono">glossary.md</code> and <code className="text-white font-mono">invariants.md</code>. Strict domain-driven design vocabulary, business rules, and strict system constraints.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line text-xs font-mono text-muted">
              domain/invariants.md
            </div>
          </div>

          <div className="agape-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                Tier 3
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
                Contracts, DB & Schemas
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Contains OpenAPI REST endpoints in <code className="text-white font-mono">api_contracts.md</code>, relational PostgreSQL tables, indexes, and triggers in <code className="text-white font-mono">database_schema.md</code>.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line text-xs font-mono text-muted">
              contracts/api_contracts.md
            </div>
          </div>

          <div className="agape-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                Tier 4
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
                State & Architecture Records
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Tracks current sprint status in <code className="text-white font-mono">current_state.md</code> and records Architectural Decision Records (ADR) in <code className="text-white font-mono">decisions_log.md</code>.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line text-xs font-mono text-muted">
              state/decisions_log.md
            </div>
          </div>

          <div className="agape-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                Tier 5
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
                UI Tokens & Layout Primitives
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Complete design tokens in <code className="text-white font-mono">design_system.md</code>, component inventory, and UI layout primitives ensuring visual cohesion.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line text-xs font-mono text-muted">
              ui/design_system.md
            </div>
          </div>

          <div className="agape-card p-6 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent mb-4 group-hover:border-accent transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">
                Tier 6
              </div>
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-2">
                Autonomous Execution Tasks
              </h3>
              <p className="font-body text-xs text-muted leading-relaxed">
                Granular, prompt-engineered execution tasks in <code className="text-white font-mono">tasks.md</code> ready to copy straight into Cursor, Windsurf, or Claude Code.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-line text-xs font-mono text-muted">
              execution/tasks.md
            </div>
          </div>
        </div>
      </section>

      {/* 4. MCP AGENT GATEWAY FEATURE SECTION */}
      <section id="mcp" className="shell scroll-mt-24">
        <div className="agape-card p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="eyebrow">Realtime Agent Protocol</div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[0.04em] uppercase">
                Model Context Protocol (MCP) Live Sync
              </h2>
              <p className="font-body text-sm text-muted leading-relaxed">
                Never copy-paste documentation again. External coding agents connect directly to your specifications via standard MCP JSON-RPC. 
                Cursor or Claude Code can call <code className="text-white bg-box px-1.5 py-0.5 font-mono text-xs">get_spec_file</code>, query database schemas, or append ADR decision logs live as code is written.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="badge--on">Cursor IDE</span>
                <span className="badge--on">Windsurf</span>
                <span className="badge--on">Claude Desktop</span>
                <span className="badge--on">Antigravity</span>
                <span className="badge--off">Node / Python CLI</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-ink p-5 border border-line font-mono text-xs text-body space-y-2">
              <div className="text-muted text-[11px] uppercase tracking-wider font-display">
                Agent MCP Configuration:
              </div>
              <pre className="text-accent text-[11px] leading-relaxed overflow-x-auto">
{`{
  "mcpServers": {
    "srs-genie": {
      "url": "https://api.srsgenie.ai/api/mcp/sse",
      "headers": {
        "Authorization": "Bearer srs_live_..."
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING & SUBSCRIPTION TIERS SECTION */}
      <section id="pricing" className="shell scroll-mt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="eyebrow mb-2">Transparent SaaS Model</div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[0.04em] uppercase">
              Subscription Plans & Quotas
            </h2>
          </div>
          <p className="font-body text-xs text-muted max-w-md">
            Choose the tier tailored to your team size and velocity. All plans include 22-file .specs packages and live MCP agent credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(p => (
            <div
              key={p.id}
              className={`agape-card p-6 flex flex-col justify-between transition-all relative ${
                p.isPopular ? 'border-accent shadow-xl shadow-accent/5' : ''
              }`}
            >
              {p.isTrial ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-ink font-display uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 shadow-md">
                  {p.badge || `⚡ ${p.trialDays || 14}-Day Free Trial`}
                </span>
              ) : p.isPopular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge--on text-[10px]">
                  Most Popular
                </span>
              ) : null}

              <div>
                <h3 className="font-display font-semibold text-white text-base uppercase tracking-[0.08em] mb-1">
                  {p.name}
                </h3>
                <p className="font-body text-xs text-muted mb-4 min-h-[32px]">{p.description}</p>

                <div className="mb-4 pb-3 border-b border-line">
                  {p.isTrial ? (
                    <div>
                      <span className="font-display text-3xl font-semibold text-amber-400 font-mono">
                        ${p.priceMonthly}
                      </span>
                      <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / {p.trialDays || 14} days</span>
                      <div className="text-[10px] text-muted font-mono mt-1">
                        {p.trialRequiresCard ? 'Card verification' : 'No credit card needed'} · Renews at ${p.postTrialMonthlyPrice || 29}/mo
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="font-display text-3xl font-semibold text-white font-mono">${p.priceMonthly}</span>
                      <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / month</span>
                      {p.priceMonthly > 0 && (
                        <div className="text-[10px] text-muted font-mono mt-1">${p.priceYearly}/year</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs text-body mb-6">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.isTrial ? 'text-amber-400' : 'text-accent'}`} />
                      <span className="font-body">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-line space-y-4">
                <div className="font-body text-[11px] text-muted space-y-0.5">
                  <div>Specs Quota: <strong className="text-white">{p.quotaSpecsPerMonth} {p.isTrial ? 'in trial' : '/ mo'}</strong></div>
                  <div>MCP Keys: <strong className="text-accent">{p.quotaMcpKeys} active</strong></div>
                  <div>Seats: <strong className="text-white">{p.maxTeamSeats} seat(s)</strong></div>
                </div>

                <button
                  onClick={() => onSelectPlan(p.id)}
                  className={`btn btn-sm w-full justify-center ${
                    p.isTrial
                      ? 'bg-amber-500 text-ink hover:bg-amber-400 font-bold border-none'
                      : p.isPopular
                      ? 'btn--accent'
                      : 'btn--solid'
                  }`}
                >
                  {p.isTrial ? '⚡ Start Free Trial' : p.priceMonthly === 0 ? 'Start Free' : `Select ${p.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ENTERPRISE & SECURITY GUARANTEES */}
      <section className="shell">
        <div className="agape-card p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-box border border-line flex items-center justify-center text-accent mb-2">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">
                Workspace Isolation
              </h4>
              <p className="font-body text-xs text-muted leading-relaxed">
                Client specifications and proprietary intellectual property are strictly isolated with role-based access control.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 bg-box border border-line flex items-center justify-center text-accent mb-2">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">
                Zero Cloud Lock-in
              </h4>
              <p className="font-body text-xs text-muted leading-relaxed">
                Download your full `.specs` suite as a clean, self-contained ZIP archive ready to commit into Git.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 bg-box border border-line flex items-center justify-center text-accent mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-white">
                Audit Logging & Telemetry
              </h4>
              <p className="font-body text-xs text-muted leading-relaxed">
                Real-time tracking of connected MCP agents, tool execution durations, and API key revocations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="shell text-center">
        <div className="agape-card p-12 sm:p-16 max-w-3xl mx-auto space-y-6">
          <div className="eyebrow mx-auto justify-center">Start Today</div>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white tracking-[0.04em] uppercase">
            Ready to Supercharge Your AI Coding Workflow?
          </h2>
          <p className="font-body text-sm text-muted max-w-lg mx-auto">
            Create your account in 30 seconds and generate comprehensive, hallucination-free specification suites.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartFree}
              className="btn btn--accent text-base px-8 py-4"
            >
              <span>Launch Free Project</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. EDITORIAL FOOTER */}
      <footer className="shell border-t border-line pt-8 pb-12 text-xs font-body text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-semibold text-white uppercase tracking-[0.12em]">
            SRS <span className="text-accent">GENIE</span>
          </span>
          <span className="text-line">|</span>
          <span>© {new Date().getFullYear()} SRS Genie AI Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 font-display uppercase tracking-[0.14em] text-[11px]">
          <a href="#specs-architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#mcp" className="hover:text-white transition-colors">MCP Protocol</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <button onClick={onSignIn} className="hover:text-accent transition-colors">Sign In</button>
        </div>
      </footer>
    </div>
  );
};
