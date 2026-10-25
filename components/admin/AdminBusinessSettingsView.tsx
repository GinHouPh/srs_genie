import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  DollarSign,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Save,
  RotateCcw,
  Sliders,
  Zap,
  CreditCard
} from 'lucide-react';
import { BusinessSettings } from '../../types';
import { saasStore } from '../../services/saasStore';

interface AdminBusinessSettingsViewProps {
  onToast: (msg: string) => void;
}

export const AdminBusinessSettingsView: React.FC<AdminBusinessSettingsViewProps> = ({ onToast }) => {
  const [settings, setSettings] = useState<BusinessSettings>(saasStore.getBusinessSettings());
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = <K extends keyof BusinessSettings>(key: K, value: BusinessSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      saasStore.updateBusinessSettings(settings);
      onToast('Business & Platform settings successfully saved.');
    } catch (err: any) {
      onToast(`Failed to save settings: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Restore baseline company and operational settings to default presets?')) {
      const reset = saasStore.updateBusinessSettings({
        companyName: 'SRS Genie Inc.',
        brandName: 'SRS Genie',
        legalEntityName: 'SRS Genie Technologies Private Limited',
        taxRegistrationNumber: 'GSTIN29AAACS1429B1ZB',
        supportEmail: 'support@srsgenie.ai',
        billingEmail: 'billing@srsgenie.ai',
        websiteUrl: 'https://srsgenie.ai',
        headquartersAddress: 'Cyber Park, Sector 62, Bangalore, KA, India - 560100',
        defaultCurrency: 'INR',
        timezone: 'Asia/Kolkata (IST)',
        defaultTrialDays: 14,
        defaultTrialQuotaSpecs: 10,
        maxTrialsPerCustomer: 1,
        requireCardForTrials: false,
        enforceEmailVerification: true,
        allowSelfRegistration: true,
        invoicePrefix: 'INV-SRS-',
        taxRatePercent: 18,
        invoiceFooterNote: 'Thank you for building autonomous agent-ready software specifications with SRS Genie. All generated intellectual property remains 100% yours.',
        invoiceDueDays: 14,
        maintenanceMode: false,
        announcementBannerText: '⚡ SRS Genie v2.5 Online: Multi-Provider AI Architecture, Cashfree Instant Settlement & Autonomous MCP Gateway Active.',
        showAnnouncementBanner: true
      });
      setSettings(reset);
      onToast('Business settings restored to defaults.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-line">
        <div>
          <div className="eyebrow mb-1">Organization Profile</div>
          <h2 className="font-display text-2xl font-semibold text-white tracking-[0.04em] uppercase">
            Business & Enterprise Settings
          </h2>
          <p className="font-body text-xs text-muted mt-1">
            Configure legal entity identity, support & billing channels, default currency, free trial policies, and system broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-sm btn--ghost"
            title="Reset to default company configuration"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-sm btn--accent"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Live Announcement Banner Preview */}
      {settings.showAnnouncementBanner && (
        <div className="p-3.5 bg-accent/15 border border-accent/40 text-white flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-4 h-4 text-accent shrink-0" />
            <span className="font-display text-xs uppercase tracking-wider font-semibold">
              Broadcast Active:
            </span>
            <span className="font-body text-xs text-white/90">
              {settings.announcementBannerText}
            </span>
          </div>
          <span className="badge--on text-[9px] shrink-0">Live Storefront Banner</span>
        </div>
      )}

      {/* Maintenance Mode Warning */}
      {settings.maintenanceMode && (
        <div className="p-3.5 bg-amber-500/20 border border-amber-500/50 text-amber-200 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="font-body text-xs">
            <strong className="font-display uppercase tracking-wider text-amber-300">Maintenance Mode Is Active:</strong> Public user workspace registrations and external MCP execution are restricted to administrative staff.
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: COMPANY & BRAND IDENTITY */}
        <div className="agape-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-line">
            <Building2 className="w-4 h-4 text-accent" />
            <h3 className="font-display text-base font-semibold text-white tracking-[0.08em] uppercase">
              Company & Legal Entity Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="field">
              <label className="field__label">Brand / Product Name</label>
              <input
                type="text"
                required
                value={settings.brandName}
                onChange={e => handleChange('brandName', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
              />
            </div>

            <div className="field">
              <label className="field__label">Company Legal Entity</label>
              <input
                type="text"
                required
                value={settings.legalEntityName}
                onChange={e => handleChange('legalEntityName', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
              />
            </div>

            <div className="field">
              <label className="field__label">Tax / GSTIN / VAT ID</label>
              <input
                type="text"
                required
                value={settings.taxRegistrationNumber}
                onChange={e => handleChange('taxRegistrationNumber', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>

            <div className="field">
              <label className="field__label">Primary Website URL</label>
              <input
                type="url"
                required
                value={settings.websiteUrl}
                onChange={e => handleChange('websiteUrl', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="field">
              <label className="field__label">Customer Support Email</label>
              <input
                type="email"
                required
                value={settings.supportEmail}
                onChange={e => handleChange('supportEmail', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>

            <div className="field">
              <label className="field__label">Billing & Invoicing Email</label>
              <input
                type="email"
                required
                value={settings.billingEmail}
                onChange={e => handleChange('billingEmail', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>

            <div className="field">
              <label className="field__label">Corporate Headquarters Address</label>
              <input
                type="text"
                value={settings.headquartersAddress}
                onChange={e => handleChange('headquartersAddress', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: REGIONAL & FINANCIAL POLICIES */}
        <div className="agape-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-line">
            <DollarSign className="w-4 h-4 text-accent" />
            <h3 className="font-display text-base font-semibold text-white tracking-[0.08em] uppercase">
              Financial, Regional & Invoicing Defaults
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="field">
              <label className="field__label">Default Platform Currency</label>
              <select
                value={settings.defaultCurrency}
                onChange={e => handleChange('defaultCurrency', e.target.value as any)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-wider"
              >
                <option value="INR">INR (₹) - Indian Rupee (Cashfree Native)</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div className="field">
              <label className="field__label">Operating Timezone</label>
              <select
                value={settings.timezone}
                onChange={e => handleChange('timezone', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-wider"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - UTC+5:30)</option>
                <option value="America/New_York (EST)">America/New York (EST - UTC-5)</option>
                <option value="America/Los_Angeles (PST)">America/Los Angeles (PST - UTC-8)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT/BST - UTC+0)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
              </select>
            </div>

            <div className="field">
              <label className="field__label">Invoice Number Prefix</label>
              <input
                type="text"
                required
                value={settings.invoicePrefix}
                onChange={e => handleChange('invoicePrefix', e.target.value)}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>

            <div className="field">
              <label className="field__label">Applicable Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={settings.taxRatePercent}
                onChange={e => handleChange('taxRatePercent', Number(e.target.value))}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">Invoice Footer Legal Terms & Disclaimer</label>
            <textarea
              rows={2}
              value={settings.invoiceFooterNote}
              onChange={e => handleChange('invoiceFooterNote', e.target.value)}
              className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-white focus:border-accent outline-none font-body leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 3: FREE TRIAL & CLIENT SECURITY POLICIES */}
        <div className="agape-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-line">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-display text-base font-semibold text-white tracking-[0.08em] uppercase">
              Free Trial & Workspace Governance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="field">
              <label className="field__label">Default Trial Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="90"
                required
                value={settings.defaultTrialDays}
                onChange={e => handleChange('defaultTrialDays', Number(e.target.value))}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>

            <div className="field">
              <label className="field__label">Default Trial Specs Quota</label>
              <input
                type="number"
                min="1"
                required
                value={settings.defaultTrialQuotaSpecs}
                onChange={e => handleChange('defaultTrialQuotaSpecs', Number(e.target.value))}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>

            <div className="field">
              <label className="field__label">Max Free Trials Per Account</label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={settings.maxTrialsPerCustomer}
                onChange={e => handleChange('maxTrialsPerCustomer', Number(e.target.value))}
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-line">
            <label className="flex items-center gap-3 p-3 bg-ink border border-line cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enforceEmailVerification}
                onChange={e => handleChange('enforceEmailVerification', e.target.checked)}
                className="accent-accent"
              />
              <div>
                <span className="font-display text-xs uppercase tracking-wider text-white font-semibold block">
                  Mandatory OTP Email Verification
                </span>
                <span className="font-body text-[11px] text-muted">
                  Requires 6-digit email confirmation code before granting workspace access.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-ink border border-line cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowSelfRegistration}
                onChange={e => handleChange('allowSelfRegistration', e.target.checked)}
                className="accent-accent"
              />
              <div>
                <span className="font-display text-xs uppercase tracking-wider text-white font-semibold block">
                  Public Client Registrations
                </span>
                <span className="font-body text-[11px] text-muted">
                  Enables public visitors to create workspaces self-service.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-ink border border-line cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireCardForTrials}
                onChange={e => handleChange('requireCardForTrials', e.target.checked)}
                className="accent-accent"
              />
              <div>
                <span className="font-display text-xs uppercase tracking-wider text-white font-semibold block">
                  Require Payment Card for Trials
                </span>
                <span className="font-body text-[11px] text-muted">
                  When checked, trials require Cashfree card authorization on signup.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* SECTION 4: BROADCAST & MAINTENANCE CONTROLS */}
        <div className="agape-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-line">
            <Megaphone className="w-4 h-4 text-accent" />
            <h3 className="font-display text-base font-semibold text-white tracking-[0.08em] uppercase">
              Broadcast Banner & System Maintenance
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-ink border border-line">
              <div>
                <span className="font-display text-xs uppercase tracking-wider text-white font-semibold block">
                  Show Top Announcement Banner
                </span>
                <span className="font-body text-[11px] text-muted">
                  Displays a prominent notification message across client headers and storefront.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.showAnnouncementBanner}
                onChange={e => handleChange('showAnnouncementBanner', e.target.checked)}
                className="accent-accent w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="field">
              <label className="field__label">Announcement Banner Text</label>
              <input
                type="text"
                value={settings.announcementBannerText}
                onChange={e => handleChange('announcementBannerText', e.target.value)}
                placeholder="e.g. ⚡ Welcome to SRS Genie v2.5! Multi-AI model providers are now live."
                className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30">
              <div>
                <span className="font-display text-xs uppercase tracking-wider text-amber-300 font-semibold block">
                  Platform Maintenance Mode
                </span>
                <span className="font-body text-[11px] text-amber-200/80">
                  Suspends external client task submission and new account signups for system upgrades.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => handleChange('maintenanceMode', e.target.checked)}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-sm btn--ghost"
          >
            Reset Presets
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-sm btn--accent"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Business Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
