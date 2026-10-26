import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CreditCard,
  Layers,
  BarChart3,
  Network,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Activity,
  FileText,
  DollarSign,
  RefreshCw,
  Wallet,
  Key,
  Globe,
  Eye,
  EyeOff,
  Copy,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ShieldBan,
  Zap,
  Building2
} from 'lucide-react';
import {
  SaaSCustomer,
  StaffMember,
  PricingPlan,
  SaaSInvoice,
  SaasMetrics,
  McpApiKey,
  McpSessionLog,
  SubscriptionTier,
  StaffRole,
  PaymentStatus,
  CashfreeGatewayConfig,
  PaymentTransactionRecord
} from '../../types';
import { saasStore } from '../../services/saasStore';
import { authService } from '../../services/authService';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminAiProvidersView } from './AdminAiProvidersView';
import { AdminAuditLogView } from './AdminAuditLogView';
import { AdminBlacklistView } from './AdminBlacklistView';
import { AdminBusinessSettingsView } from './AdminBusinessSettingsView';

interface AdminConsoleProps {
  onBackToDashboard: () => void;
}

type AdminTab = 'overview' | 'analytics' | 'customers' | 'staff' | 'plans' | 'ai_providers' | 'billing' | 'cashfree_gateway' | 'mcp_telemetry' | 'security_audit' | 'blacklist' | 'business_settings';

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [metrics, setMetrics] = useState<SaasMetrics>(saasStore.getMetrics());
  const [customers, setCustomers] = useState<SaaSCustomer[]>(saasStore.getCustomers());
  const [staff, setStaff] = useState<StaffMember[]>(saasStore.getStaff());
  const [plans, setPlans] = useState<PricingPlan[]>(saasStore.getPlans());
  const [invoices, setInvoices] = useState<SaaSInvoice[]>(saasStore.getInvoices());
  const [mcpKeys, setMcpKeys] = useState<McpApiKey[]>(saasStore.getMcpKeys());
  const [sessionLogs, setSessionLogs] = useState<McpSessionLog[]>(saasStore.getSessionLogs());

  // Cashfree PG Settings & Transactions State
  const [cfConfig, setCfConfig] = useState<CashfreeGatewayConfig>(saasStore.getCashfreeConfig());
  const [transactions, setTransactions] = useState<PaymentTransactionRecord[]>(saasStore.getTransactions());
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const [testConnStatus, setTestConnStatus] = useState<{ testing: boolean; success?: boolean; message?: string } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);

  // Search & filter states
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerPlanFilter, setCustomerPlanFilter] = useState<string>('all');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNewCustModal, setShowNewCustModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  // Edit Modals
  const [editingCustomer, setEditingCustomer] = useState<SaaSCustomer | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  // Form: Invite Staff
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('tech_architect');

  // Form: New Customer
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustPlan, setNewCustPlan] = useState<SubscriptionTier>('pro');

  // Form: New Plan
  const [isTrialPlan, setIsTrialPlan] = useState(false);
  const [planId, setPlanId] = useState('');
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState(49);
  const [planDesc, setPlanDesc] = useState('');
  const [planFeatures, setPlanFeatures] = useState('Unlimited Specs\nPriority AI Queue\n5 MCP Keys');
  const [planQuotaSpecs, setPlanQuotaSpecs] = useState(50);
  const [planQuotaMcp, setPlanQuotaMcp] = useState(5);
  const [planMaxSeats, setPlanMaxSeats] = useState(1);
  const [planBadge, setPlanBadge] = useState('');
  const [planIsPopular, setPlanIsPopular] = useState(false);
  const [planPrioritySupport, setPlanPrioritySupport] = useState(false);
  // Trial Plan Specific Parameters
  const [planTrialDays, setPlanTrialDays] = useState(14);
  const [planTrialRequiresCard, setPlanTrialRequiresCard] = useState(false);
  const [planTrialAutoConvertsTo, setPlanTrialAutoConvertsTo] = useState('pro');
  const [planPostTrialPrice, setPlanPostTrialPrice] = useState(29);
  const [planMaxTrialsPerUser, setPlanMaxTrialsPerUser] = useState(1);

  const resetNewPlanForm = (trialMode: boolean = false) => {
    setIsTrialPlan(trialMode);
    if (trialMode) {
      setPlanId('pro_trial');
      setPlanName('Developer Pro (14-Day Free Trial)');
      setPlanPrice(0);
      setPlanPostTrialPrice(29);
      setPlanTrialDays(14);
      setPlanDesc('Test-drive all Pro features with 10 comprehensive specs and 1 active MCP key for 14 days.');
      setPlanFeatures('10 Comprehensive .specs Packages during trial\nDownloadable .specs ZIP Hierarchy (All 6 Tiers)\n1 MCP Server Live Key (Cursor / Windsurf)\nGemini 2.5 Flash Autonomous Generation\nCardless Instant Access (14 Days Free)');
      setPlanQuotaSpecs(10);
      setPlanQuotaMcp(1);
      setPlanMaxSeats(1);
      setPlanBadge('14-Day Free Trial');
      setPlanTrialRequiresCard(false);
      setPlanTrialAutoConvertsTo('pro');
      setPlanPrioritySupport(true);
      setPlanIsPopular(false);
      setPlanMaxTrialsPerUser(1);
    } else {
      setPlanId('');
      setPlanName('');
      setPlanPrice(49);
      setPlanPostTrialPrice(49);
      setPlanTrialDays(14);
      setPlanDesc('');
      setPlanFeatures('Unlimited Specs\nPriority AI Queue\n5 MCP Keys');
      setPlanQuotaSpecs(50);
      setPlanQuotaMcp(5);
      setPlanMaxSeats(5);
      setPlanBadge('');
      setPlanTrialRequiresCard(false);
      setPlanTrialAutoConvertsTo('pro');
      setPlanPrioritySupport(false);
      setPlanIsPopular(false);
      setPlanMaxTrialsPerUser(1);
    }
  };

  // Form: New Invoice
  const [invCustomerName, setInvCustomerName] = useState('');
  const [invCustomerEmail, setInvCustomerEmail] = useState('');
  const [invAmount, setInvAmount] = useState(99);
  const [invPlan, setInvPlan] = useState<SubscriptionTier>('team');
  const [invStatus, setInvStatus] = useState<PaymentStatus>('paid');

  const refreshAll = () => {
    setMetrics(saasStore.getMetrics());
    setCustomers(saasStore.getCustomers());
    setStaff(saasStore.getStaff());
    setPlans(saasStore.getPlans());
    setInvoices(saasStore.getInvoices());
    setMcpKeys(saasStore.getMcpKeys());
    setSessionLogs(saasStore.getSessionLogs());
    setCfConfig(saasStore.getCashfreeConfig());
    setTransactions(saasStore.getTransactions());
  };

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // --- CASHFREE PG HANDLERS ---
  const handleSaveCfConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saasStore.updateCashfreeConfig(cfConfig);
    showToast('Cashfree Payment Gateway configuration saved.');
  };

  const handleTestConnection = async () => {
    setTestConnStatus({ testing: true });
    try {
      const res = await fetch('/api/cashfree/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: cfConfig })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestConnStatus({ testing: false, success: true, message: data.message });
      } else {
        setTestConnStatus({ testing: false, success: false, message: data.message || 'Connection failed: Check App ID & Secret Key.' });
      }
    } catch (err: any) {
      setTestConnStatus({ testing: false, success: false, message: err?.message || 'Network test error' });
    }
  };

  // --- CUSTOMER ACTIONS ---
  const handleToggleCustomerStatus = (id: string) => {
    saasStore.toggleCustomerStatus(id);
    refreshAll();
    showToast('Customer account status updated.');
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete customer "${name}"?`)) {
      saasStore.deleteCustomer(id);
      refreshAll();
      showToast(`Deleted customer: ${name}`);
    }
  };

  const handleSaveCustomerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    saasStore.updateCustomer(editingCustomer.id, editingCustomer);
    setEditingCustomer(null);
    refreshAll();
    showToast('Customer details saved.');
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) return;
    const planObj = plans.find(p => p.id === newCustPlan);
    saasStore.addCustomer({
      name: newCustName,
      email: newCustEmail,
      company: newCustCompany || 'Independent',
      plan: newCustPlan,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      projectsCount: 1,
      monthlySpend: planObj?.priceMonthly || 0,
      paymentStatus: 'paid',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newCustName)}`,
      mcpApiKeyCount: 1
    });
    refreshAll();
    setShowNewCustModal(false);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustCompany('');
    showToast(`New customer ${newCustName} successfully onboarded.`);
  };

  // --- STAFF ACTIONS ---
  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    saasStore.inviteStaff({
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newStaffName)}`,
      permissions: ['view_specs', 'mcp_manage']
    });
    refreshAll();
    setShowInviteModal(false);
    setNewStaffName('');
    setNewStaffEmail('');
    showToast(`Invitation sent to ${newStaffEmail}.`);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Remove ${name} from internal staff?`)) {
      saasStore.removeStaff(id);
      refreshAll();
      showToast(`Removed staff member: ${name}`);
    }
  };

  const handleSaveStaffEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    saasStore.updateStaff(editingStaff.id, editingStaff);
    setEditingStaff(null);
    refreshAll();
    showToast('Staff role and permissions updated.');
  };

  // --- PLANS ACTIONS ---
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId || !planName) return;
    const feats = planFeatures.split('\n').map(f => f.trim()).filter(Boolean);
    saasStore.addPlan({
      id: planId.toLowerCase().replace(/[^a-z0-9_-]/g, '_') as SubscriptionTier,
      name: planName,
      priceMonthly: Number(planPrice),
      priceYearly: isTrialPlan ? 0 : Number(planPrice) * 10,
      description: planDesc,
      isActive: true,
      features: feats,
      quotaSpecsPerMonth: Number(planQuotaSpecs),
      quotaMcpKeys: Number(planQuotaMcp),
      maxTeamSeats: Number(planMaxSeats),
      prioritySupport: Boolean(planPrioritySupport),
      isPopular: Boolean(planIsPopular),
      badge: planBadge || (isTrialPlan ? `${planTrialDays}-Day Free Trial` : undefined),
      // Configurable Trial Plan Parameters
      isTrial: isTrialPlan,
      trialDays: isTrialPlan ? Number(planTrialDays) : undefined,
      trialRequiresCard: isTrialPlan ? Boolean(planTrialRequiresCard) : undefined,
      trialAutoConvertsTo: isTrialPlan ? planTrialAutoConvertsTo : undefined,
      postTrialMonthlyPrice: isTrialPlan ? Number(planPostTrialPrice) : undefined,
      maxTrialsPerUser: isTrialPlan ? Number(planMaxTrialsPerUser) : undefined
    });
    refreshAll();
    setShowNewPlanModal(false);
    resetNewPlanForm(false);
    showToast(`Created ${isTrialPlan ? 'free trial plan' : 'subscription plan'}: ${planName}`);
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Delete plan tier "${name}"?`)) {
      saasStore.deletePlan(id);
      refreshAll();
      showToast(`Deleted plan: ${name}`);
    }
  };

  const handleSavePlanEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    saasStore.updatePlan(editingPlan.id, editingPlan);
    setEditingPlan(null);
    refreshAll();
    showToast('Plan tier updated.');
  };

  // --- INVOICES ACTIONS ---
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCustomerName || !invCustomerEmail) return;
    saasStore.addInvoice({
      customerId: `cust_${Date.now()}`,
      customerName: invCustomerName,
      customerEmail: invCustomerEmail,
      amount: Number(invAmount),
      status: invStatus,
      date: new Date().toISOString().split('T')[0],
      plan: invPlan
    });
    refreshAll();
    setShowNewInvoiceModal(false);
    setInvCustomerName('');
    setInvCustomerEmail('');
    showToast('Invoice generated.');
  };

  const handleUpdateInvoiceStatus = (id: string, status: PaymentStatus) => {
    saasStore.updateInvoice(id, { status });
    refreshAll();
    showToast(`Invoice marked as ${status.toUpperCase()}`);
  };

  const handleDeleteInvoice = (id: string, invNum: string) => {
    if (confirm(`Delete invoice ${invNum}?`)) {
      saasStore.deleteInvoice(id);
      refreshAll();
      showToast(`Deleted invoice ${invNum}`);
    }
  };

  // --- MCP KEY ACTIONS ---
  const handleRevokeMcpKey = (id: string) => {
    saasStore.revokeMcpKey(id);
    refreshAll();
    showToast('MCP Agent API Key revoked.');
  };

  const handleDeleteMcpKey = (id: string) => {
    if (confirm('Permanently delete this MCP Key?')) {
      saasStore.deleteMcpKey(id);
      refreshAll();
      showToast('MCP Key deleted.');
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                          c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                          c.company.toLowerCase().includes(customerSearch.toLowerCase());
    const matchesPlan = customerPlanFilter === 'all' || c.plan === customerPlanFilter;
    return matchesSearch && matchesPlan;
  });

  const filteredInvoices = invoices.filter(inv => {
    if (invoiceStatusFilter === 'all') return true;
    return inv.status === invoiceStatusFilter;
  });

  return (
    <div className="shell py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-box border border-accent text-white px-5 py-3 shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="font-display text-xs uppercase tracking-[0.1em]">{feedbackMsg}</span>
        </div>
      )}

      {/* Sleek, Low-Profile Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm tracking-[0.16em] uppercase text-white font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Operations Console
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-box border border-line text-muted">
            MySQL Server Live
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onBackToDashboard}
            className="btn btn-sm btn--ghost text-xs py-1"
          >
            ← Workspace
          </button>
          <button
            onClick={() => {
              refreshAll();
              showToast('Synchronized data store with MySQL.');
            }}
            className="p-1.5 bg-box border border-line text-muted hover:text-accent hover:border-accent transition-colors"
            title="Refresh Data Store"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('Purge all demo data, mock invoices, and test customers? Your live Cashfree credentials will be preserved.')) {
                saasStore.clearMockData();
                authService.clearAllMockData();
                refreshAll();
                showToast('All mock data purged.');
              }
            }}
            className="px-2.5 py-1 bg-box border border-line text-muted hover:text-accent hover:border-accent transition-colors text-[11px] font-display uppercase tracking-[0.08em] flex items-center gap-1.5"
            title="Purge Mock Data"
          >
            <Trash2 className="w-3 h-3 text-accent" />
            <span>Purge Test Data</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-surface border border-line">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'staff', label: `Staff (${staff.length})`, icon: ShieldCheck },
          { id: 'plans', label: `Plans (${plans.length})`, icon: Layers },
          { id: 'ai_providers', label: `AI Providers`, icon: Cpu },
          { id: 'billing', label: `Billing (${invoices.length})`, icon: CreditCard },
          { id: 'cashfree_gateway', label: `Cashfree PG (${transactions.length})`, icon: Wallet },
          { id: 'mcp_telemetry', label: `MCP Gateway (${mcpKeys.length})`, icon: Network },
          { id: 'security_audit', label: 'Security & Audit Logs', icon: ShieldAlert },
          { id: 'blacklist', label: 'Fraud & Blacklist', icon: ShieldBan },
          { id: 'business_settings', label: 'Business Settings', icon: Building2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-1.5 px-3 py-2 font-display text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-accent text-white font-semibold shadow-md shadow-accent/20'
                  : 'text-muted hover:text-white hover:bg-box'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat">
              <span className="stat__value text-white font-mono">${metrics.mrr.toLocaleString()}</span>
              <span className="stat__label">Monthly Recurring Revenue</span>
              <div className="text-[11px] text-accent mt-2 font-body tracking-normal">
                {customers.filter(c => c.status === 'active').length} Active Customer Accounts
              </div>
            </div>

            <div className="stat">
              <span className="stat__value text-white font-mono">${metrics.arr.toLocaleString()}</span>
              <span className="stat__label">Annual Run Rate (ARR)</span>
              <div className="text-[11px] text-muted mt-2 font-body tracking-normal">
                {invoices.filter(i => i.status === 'paid').length} Settled Billing Invoices
              </div>
            </div>

            <div className="stat">
              <span className="stat__value text-accent font-mono">{metrics.specsGeneratedTotal}</span>
              <span className="stat__label">Generated Specifications</span>
              <div className="text-[11px] text-muted mt-2 font-body tracking-normal">
                {metrics.geminiTokensConsumed.toLocaleString()} Gemini Tokens Synced
              </div>
            </div>

            <div className="stat">
              <span className="stat__value text-white font-mono">{metrics.activeMcpAgents}</span>
              <span className="stat__label">Active MCP Agents</span>
              <div className="text-[11px] text-accent mt-2 font-body tracking-normal">
                Live External Agent Connections
              </div>
            </div>
          </div>

          {/* Quick Add Actions */}
          <div className="agape-card p-6">
            <div className="font-display text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">
              Action Panel
            </div>
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-4">
              Quick Management Operations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setShowNewCustModal(true)}
                className="p-4 bg-box border border-line hover:border-accent text-left transition-all group"
              >
                <div className="w-8 h-8 bg-surface border border-line flex items-center justify-center text-accent mb-2 group-hover:border-accent transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="font-display text-xs uppercase tracking-[0.14em] text-white font-semibold">Add Customer</div>
                <div className="font-body text-xs text-muted mt-0.5">Provision account manually</div>
              </button>

              <button
                onClick={() => setShowInviteModal(true)}
                className="p-4 bg-box border border-line hover:border-accent text-left transition-all group"
              >
                <div className="w-8 h-8 bg-surface border border-line flex items-center justify-center text-accent mb-2 group-hover:border-accent transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-display text-xs uppercase tracking-[0.14em] text-white font-semibold">Invite Staff</div>
                <div className="font-body text-xs text-muted mt-0.5">Add internal teammate</div>
              </button>

              <button
                onClick={() => setShowNewPlanModal(true)}
                className="p-4 bg-box border border-line hover:border-accent text-left transition-all group"
              >
                <div className="w-8 h-8 bg-surface border border-line flex items-center justify-center text-accent mb-2 group-hover:border-accent transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="font-display text-xs uppercase tracking-[0.14em] text-white font-semibold">Create Plan Tier</div>
                <div className="font-body text-xs text-muted mt-0.5">Define new pricing model</div>
              </button>

              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="p-4 bg-box border border-line hover:border-accent text-left transition-all group"
              >
                <div className="w-8 h-8 bg-surface border border-line flex items-center justify-center text-accent mb-2 group-hover:border-accent transition-colors">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="font-display text-xs uppercase tracking-[0.14em] text-white font-semibold">Issue Invoice</div>
                <div className="font-body text-xs text-muted mt-0.5">Issue custom billing receipt</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && (
        <AdminAnalyticsView metrics={metrics} />
      )}

      {/* TAB 3: CUSTOMERS & USERS CRUD */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search customer, email..."
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  className="w-full bg-ink border border-line pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-muted focus:border-accent outline-none font-body"
                />
              </div>

              <select
                value={customerPlanFilter}
                onChange={e => setCustomerPlanFilter(e.target.value)}
                className="bg-ink border border-line px-3.5 py-2.5 text-xs text-white uppercase font-display tracking-[0.1em] focus:border-accent outline-none"
              >
                <option value="all">All Plans</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowNewCustModal(true)}
              className="btn btn-sm btn--accent"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>

          {/* Customers Table */}
          <div className="agape-card overflow-hidden">
            {filteredCustomers.length === 0 ? (
              <div className="p-12 text-center text-muted">
                <Users className="w-10 h-10 mx-auto mb-2 text-muted" />
                <p className="font-display uppercase tracking-[0.1em] text-white">No Customers Found</p>
                <p className="text-xs text-muted mt-1">Add your first customer to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-box text-xs font-display text-muted uppercase tracking-[0.2em] border-b border-line">
                    <tr>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Company</th>
                      <th className="px-6 py-3.5">Tier</th>
                      <th className="px-6 py-3.5">Spend</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-box/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={cust.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                              alt=""
                              className="w-8 h-8 bg-surface border border-line object-cover"
                            />
                            <div>
                              <div className="font-display uppercase tracking-[0.08em] font-semibold text-white text-xs">{cust.name}</div>
                              <div className="font-body text-xs text-muted">{cust.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-body text-xs text-body">
                          {cust.company}
                        </td>
                        <td className="px-6 py-4">
                          <span className="badge--off text-[10px]">
                            {cust.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white font-mono text-xs">
                          ${cust.monthlySpend}/mo
                        </td>
                        <td className="px-6 py-4">
                          <span className={cust.status === 'active' ? 'badge--on' : 'badge--off'}>
                            {cust.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingCustomer(cust)}
                            className="p-1.5 text-muted hover:text-white bg-box border border-line transition-all"
                            title="Edit customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleCustomerStatus(cust.id)}
                            className="px-2.5 py-1 text-xs font-display uppercase tracking-[0.12em] bg-box hover:bg-accent hover:text-white border border-line transition-all"
                          >
                            {cust.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                            className="p-1.5 text-muted hover:text-accent bg-box border border-line transition-all"
                            title="Delete customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STAFF & TEAM CRUD */}
      {activeTab === 'staff' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">Staff & Team Register</h2>
              <p className="font-body text-xs text-muted">Manage internal engineering staff, support leads, and architecture governance</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="btn btn-sm btn--accent"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Teammate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staff.map(member => (
              <div key={member.id} className="agape-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-10 h-10 border border-line object-cover bg-surface"
                    />
                    <div>
                      <h4 className="font-display uppercase tracking-[0.08em] font-semibold text-white text-sm">{member.name}</h4>
                      <p className="font-body text-xs text-muted">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="badge--on text-[10px]">
                      {member.role.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => setEditingStaff(member)}
                      className="p-1.5 text-muted hover:text-white bg-box border border-line"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {member.id !== 'staff_root' && (
                      <button
                        onClick={() => handleDeleteStaff(member.id, member.name)}
                        className="p-1.5 text-muted hover:text-accent bg-box border border-line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-line">
                  <div className="font-display text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Granted Access Rights</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.permissions.map((perm, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-ink text-body border border-line">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted mt-4 pt-3 border-t border-line font-body">
                  <span>Joined {member.joinedDate}</span>
                  <span className="text-accent flex items-center font-display uppercase tracking-[0.1em] text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5" />
                    {member.lastActive}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLANS & PRICING CRUD */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">Pricing Plans & Feature Tiers</h2>
              <p className="font-body text-xs text-muted">Configure quotas, monthly billing prices, team seats, and MCP limits with full CRUD capability</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Reset all subscription plans back to baseline standard tiers (Free, Pro, Team, Enterprise, and Pro Trial)?')) {
                    saasStore.resetPlansToDefault();
                    refreshAll();
                    showToast('Subscription plans restored to baseline defaults.');
                  }
                }}
                className="btn btn-sm btn--ghost"
                title="Restore default pricing tiers"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={() => {
                  resetNewPlanForm(true);
                  setShowNewPlanModal(true);
                }}
                className="btn btn-sm btn--ghost text-amber-400 hover:text-amber-300 border-amber-500/40 hover:bg-amber-500/10"
                title="Create a risk-free trial plan tier"
              >
                <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
                <span>Add Trial Plan</span>
              </button>
              <button
                onClick={() => {
                  resetNewPlanForm(false);
                  setShowNewPlanModal(true);
                }}
                className="btn btn-sm btn--accent"
              >
                <Plus className="w-4 h-4" />
                <span>Add Plan Tier</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`agape-card p-6 flex flex-col justify-between transition-all relative ${
                  plan.isTrial ? 'border-amber-500/40 bg-surface/90 shadow-xl shadow-amber-500/5' : ''
                } ${plan.isPopular ? 'border-accent shadow-xl shadow-accent/5' : ''} ${
                  !plan.isActive ? 'opacity-60 bg-ink/70' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-display text-base font-semibold text-white uppercase tracking-[0.08em]">{plan.name}</h3>
                      {plan.isTrial && (
                        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] px-1.5 py-0.5 font-display uppercase tracking-wider font-semibold">
                          ⚡ Trial ({plan.trialDays || 14}d)
                        </span>
                      )}
                      {plan.isPopular && <span className="badge--on text-[9px]">Popular</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          saasStore.updatePlan(plan.id, { isActive: !plan.isActive });
                          refreshAll();
                          showToast(`Plan "${plan.name}" is now ${!plan.isActive ? 'Active' : 'Disabled'}.`);
                        }}
                        className={`px-1.5 py-0.5 text-[9px] font-display uppercase tracking-wider ${
                          plan.isActive ? 'badge--on' : 'badge--off'
                        }`}
                        title="Toggle visibility to customers"
                      >
                        {plan.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="p-1 text-muted hover:text-white"
                        title="Edit plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id, plan.name)}
                        className="p-1 text-muted hover:text-accent"
                        title="Delete plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-body text-xs text-muted mb-4 min-h-[36px]">{plan.description}</p>

                  <div className="mb-6 pb-4 border-b border-line">
                    {plan.isTrial ? (
                      <div>
                        <span className="font-display text-3xl font-semibold text-amber-400 font-mono">
                          ${plan.priceMonthly}
                        </span>
                        <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / {plan.trialDays || 14} days</span>
                        <div className="text-[10px] text-muted font-mono mt-1">
                          Converts to: <strong className="text-white">${plan.postTrialMonthlyPrice || 29}/mo</strong> ({plan.trialAutoConvertsTo || 'pro'})
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-display text-3xl font-semibold text-white font-mono">${plan.priceMonthly}</span>
                        <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / mo</span>
                        <div className="text-[10px] text-muted font-mono mt-1">${plan.priceYearly}/year</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs text-body mb-6">
                    <div className="font-display uppercase text-[10px] tracking-[0.18em] text-muted mb-2">Features</div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.isTrial ? 'text-amber-400' : 'text-accent'}`} />
                        <span className="font-body">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-line font-body text-xs text-muted space-y-1">
                  <div>Specs Quota: <strong className="text-white">{plan.quotaSpecsPerMonth} {plan.isTrial ? 'during trial' : '/ mo'}</strong></div>
                  <div>MCP Keys: <strong className="text-accent">{plan.quotaMcpKeys} active</strong></div>
                  <div>Team Seats: <strong className="text-white">{plan.maxTeamSeats} seat(s)</strong></div>
                  {plan.isTrial && (
                    <div className="text-amber-400/90 text-[11px] font-mono pt-1">
                      ⚡ {plan.trialRequiresCard ? 'Requires Card On Signup' : 'Cardless Instant Access'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI MODEL PROVIDERS CONFIGURATION */}
      {activeTab === 'ai_providers' && (
        <AdminAiProvidersView onToast={showToast} />
      )}

      {/* TAB 5: BILLING & INVOICES CRUD */}
      {activeTab === 'billing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">Invoices & Billing History</h2>
              <p className="font-body text-xs text-muted">Track and manage invoices, payments, and receipts</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={invoiceStatusFilter}
                onChange={e => setInvoiceStatusFilter(e.target.value)}
                className="bg-ink border border-line px-3.5 py-2 text-xs font-display uppercase tracking-[0.1em] text-white focus:border-accent outline-none"
              >
                <option value="all">All Invoices</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>

              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="btn btn-sm btn--accent"
              >
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>
            </div>
          </div>

          <div className="agape-card overflow-hidden">
            {filteredInvoices.length === 0 ? (
              <div className="p-12 text-center text-muted">
                <CreditCard className="w-10 h-10 text-muted mx-auto mb-2" />
                <p className="font-display uppercase tracking-[0.1em] text-white">No Invoices Recorded</p>
                <p className="text-xs text-muted mt-1">Create an invoice or onboard customers to generate billing receipts.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-box text-xs font-display text-muted uppercase tracking-[0.2em] border-b border-line">
                    <tr>
                      <th className="px-6 py-3.5">Invoice #</th>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Tier</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-box/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-white text-xs">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-display uppercase tracking-[0.06em] font-semibold text-white text-xs">{inv.customerName}</div>
                          <div className="font-body text-xs text-muted">{inv.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="badge--off text-[10px]">
                            {inv.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted font-body">
                          {inv.date}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-white text-xs">
                          ${inv.amount}.00
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={inv.status}
                            onChange={e => handleUpdateInvoiceStatus(inv.id, e.target.value as PaymentStatus)}
                            className="bg-ink border border-line px-2.5 py-1 text-xs font-display uppercase tracking-[0.1em] text-white focus:border-accent cursor-pointer"
                          >
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refunded</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => showToast(`Receipt generated for ${inv.invoiceNumber}`)}
                            className="px-2.5 py-1 bg-box hover:bg-accent hover:text-white border border-line text-xs font-display uppercase tracking-[0.1em]"
                          >
                            Receipt
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                            className="p-1.5 text-muted hover:text-accent bg-box border border-line"
                            title="Delete invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: MCP AGENT GATEWAY CRUD */}
      {activeTab === 'mcp_telemetry' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">MCP Agent Credentials & Telemetry</h2>
              <p className="font-body text-xs text-muted">Active API Keys connected from Cursor, Windsurf, Claude Desktop, and CLI agents</p>
            </div>
          </div>

          <div className="agape-card overflow-hidden">
            {mcpKeys.length === 0 ? (
              <div className="p-12 text-center text-muted">
                <Network className="w-10 h-10 text-muted mx-auto mb-2" />
                <p className="font-display uppercase tracking-[0.1em] text-white">No Active MCP Keys</p>
                <p className="text-xs text-muted mt-1">Generate a key in the MCP Gateway to connect external AI agents.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-box text-xs font-display text-muted uppercase tracking-[0.2em] border-b border-line">
                    <tr>
                      <th className="px-6 py-3.5">Key Label</th>
                      <th className="px-6 py-3.5">Agent Platform</th>
                      <th className="px-6 py-3.5">Key Token</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {mcpKeys.map(k => (
                      <tr key={k.id} className="hover:bg-box/40 transition-colors">
                        <td className="px-6 py-4 font-display uppercase tracking-[0.06em] font-semibold text-white text-xs">
                          {k.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="badge--off text-[10px]">
                            {k.agentType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted">
                          {k.key.slice(0, 14)}••••••••
                        </td>
                        <td className="px-6 py-4">
                          <span className={k.status === 'active' ? 'badge--on' : 'badge--off'}>
                            {k.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {k.status === 'active' ? (
                            <button
                              onClick={() => handleRevokeMcpKey(k.id)}
                              className="px-2.5 py-1 bg-box text-accent hover:bg-accent hover:text-white border border-accent/40 text-xs font-display uppercase tracking-[0.1em]"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteMcpKey(k.id)}
                              className="p-1.5 text-muted hover:text-accent bg-box border border-line"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: CASHFREE PAYMENT GATEWAY CONFIG & TRANSACTIONS */}
      {activeTab === 'cashfree_gateway' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="eyebrow mb-1">Payment Gateway Integration</div>
              <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">
                Cashfree PG Configuration & Ledger
              </h2>
              <p className="font-body text-xs text-muted">
                Accept subscriptions via Cashfree PG (UPI, Cards, NetBanking, Wallets) using JS SDK v3 and verified server callbacks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={cfConfig.appId && cfConfig.secretKey ? 'badge--on' : 'badge--off'}>
                {cfConfig.appId && cfConfig.secretKey ? `${cfConfig.environment.toUpperCase()} ACTIVE` : 'CREDENTIALS NEEDED'}
              </span>
            </div>
          </div>

          {/* Test Connection Banner */}
          {testConnStatus && (
            <div className={`p-4 border ${testConnStatus.success ? 'bg-surface border-accent text-white' : 'bg-box border-accent text-white'} flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-xs">
                {testConnStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-accent shrink-0" />
                )}
                <span>{testConnStatus.message}</span>
              </div>
              <button onClick={() => setTestConnStatus(null)} className="font-display text-[11px] uppercase tracking-wider text-muted hover:text-white">
                Dismiss
              </button>
            </div>
          )}

          {/* 4 Metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat">
              <span className="stat__value text-white font-mono">{cfConfig.environment.toUpperCase()}</span>
              <span className="stat__label">Active Gateway Mode</span>
              <div className="text-[11px] text-muted mt-2 font-body">
                {cfConfig.environment === 'production' ? 'Live Settlement Pipeline' : 'Sandbox Test Sandbox'}
              </div>
            </div>

            <div className="stat">
              <span className="stat__value text-accent font-mono">{transactions.filter(t => t.status === 'SUCCESS').length}</span>
              <span className="stat__label">Settled Transactions</span>
              <div className="text-[11px] text-muted mt-2 font-body">
                Verified via Cashfree PG API
              </div>
            </div>

            <div className="stat">
              <span className="stat__value text-white font-mono">
                {cfConfig.currency} {transactions.filter(t => t.status === 'SUCCESS').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </span>
              <span className="stat__label">Processed Revenue</span>
              <div className="text-[11px] text-accent mt-2 font-body">
                Across Developer Pro, Team & Enterprise
              </div>
            </div>

            <div className="stat">
              <span className="stat__value text-white font-mono">{cfConfig.apiVersion}</span>
              <span className="stat__label">Cashfree REST API</span>
              <div className="text-[11px] text-muted mt-2 font-body">
                JS SDK v3 Hosted Checkout
              </div>
            </div>
          </div>

          {/* Credentials Form & Guidelines (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-7 agape-card p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line">
                <Key className="w-4 h-4 text-accent" />
                <h3 className="font-display text-sm font-semibold text-white uppercase tracking-[0.08em]">
                  Cashfree PG API Credentials
                </h3>
              </div>

              <form onSubmit={handleSaveCfConfig} className="space-y-4">
                <div className="field">
                  <label className="field__label flex items-center justify-between">
                    <span>Cashfree App ID (Client ID)</span>
                    <span className="text-[10px] text-muted font-mono">Header: x-client-id</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CF1234567890..."
                    value={cfConfig.appId}
                    onChange={e => setCfConfig({ ...cfConfig, appId: e.target.value.trim() })}
                    className="w-full bg-ink border border-line px-3.5 py-2.5 text-xs text-white font-mono focus:border-accent outline-none"
                  />
                </div>

                <div className="field">
                  <label className="field__label flex items-center justify-between">
                    <span>Cashfree Secret Key (Client Secret)</span>
                    <span className="text-[10px] text-muted font-mono">Header: x-client-secret</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSecretKey ? 'text' : 'password'}
                      required
                      placeholder="e.g. cfsk_ma_prod_..."
                      value={cfConfig.secretKey}
                      onChange={e => setCfConfig({ ...cfConfig, secretKey: e.target.value.trim() })}
                      className="w-full bg-ink border border-line px-3.5 py-2.5 pr-10 text-xs text-white font-mono focus:border-accent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                      title={showSecretKey ? 'Hide secret key' : 'Show secret key'}
                    >
                      {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="field">
                    <label className="field__label">Environment Mode</label>
                    <select
                      value={cfConfig.environment}
                      onChange={e => setCfConfig({ ...cfConfig, environment: e.target.value as 'sandbox' | 'production' })}
                      className="w-full bg-ink border border-line px-3.5 py-2.5 text-xs text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                    >
                      <option value="sandbox">Sandbox (Testing / Test Cards)</option>
                      <option value="production">Production (Live Settlements)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="field__label">Default Gateway Currency</label>
                    <select
                      value={cfConfig.currency}
                      onChange={e => setCfConfig({ ...cfConfig, currency: e.target.value as 'INR' | 'USD' })}
                      className="w-full bg-ink border border-line px-3.5 py-2.5 text-xs text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                    >
                      <option value="INR">INR (Indian Rupee - Primary)</option>
                      <option value="USD">USD (US Dollar - Global)</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="field__label flex items-center justify-between">
                    <span>Webhook Notify URL</span>
                    <span className="text-[10px] text-muted font-mono">HMAC-SHA256 signature</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={cfConfig.webhookUrl || `${window.location.origin}/api/cashfree/webhook`}
                      className="w-full bg-box border border-line px-3.5 py-2 text-xs text-muted font-mono outline-none cursor-default"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(cfConfig.webhookUrl || `${window.location.origin}/api/cashfree/webhook`);
                        setCopiedWebhook(true);
                        setTimeout(() => setCopiedWebhook(false), 2000);
                      }}
                      className="btn btn-sm btn--ghost shrink-0"
                    >
                      {copiedWebhook ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
                  <button
                    type="button"
                    disabled={testConnStatus?.testing}
                    onClick={handleTestConnection}
                    className="btn btn-sm btn--ghost"
                  >
                    {testConnStatus?.testing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-3.5 h-3.5 mr-1" />
                        <span>Test Connection</span>
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    className="btn btn-sm btn--accent"
                  >
                    <span>Save Configuration</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Architecture & Verification Guide */}
            <div className="lg:col-span-5 space-y-4">
              <div className="agape-card p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-line">
                  <Globe className="w-4 h-4 text-accent" />
                  <h3 className="font-display text-sm font-semibold text-white uppercase tracking-[0.08em]">
                    Cashfree PG Integration Blueprint
                  </h3>
                </div>

                <p className="font-body text-xs text-muted leading-relaxed">
                  The SaaS checkout flow uses Cashfree's modern <strong>v3 PG JS SDK</strong> (no legacy payment links). Orders are created via backend server API, returning a secure <code className="text-white font-mono bg-box px-1 py-0.5">payment_session_id</code>.
                </p>

                <div className="space-y-2 text-xs font-body">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span><strong>Hosted Modal Checkout:</strong> Native in-page checkout modal without leaving the app.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span><strong>All Indian Payment Modes:</strong> UPI (GPay, PhonePe, Paytm), RuPay/Visa/Mastercard, NetBanking, Wallets.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span><strong>Dual Source Verification:</strong> Orders are verified via Cashfree status API before granting plan entitlements.</span>
                  </div>
                </div>

                <div className="bg-ink p-3 border border-line text-[11px] font-mono text-muted space-y-1">
                  <div className="text-white uppercase font-display tracking-wider text-[10px]">SDK Status:</div>
                  <div className="text-accent">https://sdk.cashfree.com/js/v3/cashfree.js</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Payment Transactions Ledger */}
          <div className="agape-card overflow-hidden">
            <div className="p-5 border-b border-line flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-semibold text-white uppercase tracking-[0.08em]">
                  Cashfree Transaction Ledger ({transactions.length})
                </h3>
                <p className="font-body text-xs text-muted">
                  Real-time log of payments processed via Cashfree Payment Gateway
                </p>
              </div>

              <span className="badge--on text-[10px]">
                Auto-Synced
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center text-muted">
                <Wallet className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
                <p className="font-display uppercase tracking-[0.1em] text-white">No Transactions Recorded Yet</p>
                <p className="text-xs text-muted mt-1">
                  When clients subscribe to Developer Pro, Team, or Enterprise, transactions will stream live here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-box text-xs font-display text-muted uppercase tracking-[0.2em] border-b border-line">
                    <tr>
                      <th className="px-6 py-3.5">Order ID</th>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Plan</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Method</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-box/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-white">
                          <div>{tx.orderId}</div>
                          {tx.cfOrderId && (
                            <div className="text-[10px] text-muted">CF: {tx.cfOrderId}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-display text-xs text-white font-semibold uppercase tracking-[0.04em]">
                            {tx.customerName || 'Customer'}
                          </div>
                          <div className="text-xs text-muted">{tx.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="badge--off text-[10px] uppercase font-mono">
                            {tx.planId}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-white">
                          {tx.currency} {tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted">
                          {tx.paymentMethod || 'UPI/Card'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={tx.status === 'SUCCESS' ? 'badge--on' : 'badge--off'}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-muted font-mono">
                          {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: ENTERPRISE SECURITY AUDIT TRAIL */}
      {activeTab === 'security_audit' && (
        <AdminAuditLogView onToast={showToast} />
      )}

      {/* TAB: FRAUD DETECTION & BLACKLIST CONTROL */}
      {activeTab === 'blacklist' && (
        <AdminBlacklistView onToast={showToast} />
      )}

      {/* TAB: BUSINESS & ENTERPRISE SETTINGS */}
      {activeTab === 'business_settings' && (
        <AdminBusinessSettingsView onToast={showToast} />
      )}

      {/* MODAL: ADD CUSTOMER */}
      {showNewCustModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">Onboard Customer</h3>
            <p className="font-body text-xs text-muted mb-6">Manually provision a client workspace or enterprise account.</p>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="field">
                <label className="field__label">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="Thomas Wayne"
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Email</label>
                <input
                  type="email"
                  required
                  placeholder="thomas@waynecorp.com"
                  value={newCustEmail}
                  onChange={e => setNewCustEmail(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Company / Organization</label>
                <input
                  type="text"
                  placeholder="Wayne Enterprises"
                  value={newCustCompany}
                  onChange={e => setNewCustCompany(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Subscription Plan</label>
                <select
                  value={newCustPlan}
                  onChange={e => setNewCustPlan(e.target.value as SubscriptionTier)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (${p.priceMonthly}/mo)</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewCustModal(false)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CUSTOMER */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">Edit Customer Account</h3>
            <p className="font-body text-xs text-muted mb-6">Modify customer details, subscription plan, and status.</p>

            <form onSubmit={handleSaveCustomerEdit} className="space-y-4">
              <div className="field">
                <label className="field__label">Name</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Company</label>
                <input
                  type="text"
                  value={editingCustomer.company}
                  onChange={e => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Plan Tier</label>
                <select
                  value={editingCustomer.plan}
                  onChange={e => setEditingCustomer({ ...editingCustomer, plan: e.target.value as SubscriptionTier })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (${p.priceMonthly}/mo)</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INVITE STAFF */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">Invite New Teammate</h3>
            <p className="font-body text-xs text-muted mb-6">Send an administrative or support invitation to join SRS Genie staff.</p>

            <form onSubmit={handleInviteStaff} className="space-y-4">
              <div className="field">
                <label className="field__label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jordan Lee"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@srsgenie.ai"
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Administrative Role</label>
                <select
                  value={newStaffRole}
                  onChange={e => setNewStaffRole(e.target.value as StaffRole)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                >
                  <option value="super_admin">Super Admin (Full Access)</option>
                  <option value="tech_architect">Solutions Architect (Specs + MCP)</option>
                  <option value="billing_manager">Billing Manager (Invoices + Plans)</option>
                  <option value="support_lead">Support Lead (User Management)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PLAN (FULL CRUD WITH TRIAL PLAN SUPPORT) */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-xl shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase">
                  {isTrialPlan ? '⚡ Create Risk-Free Trial Tier' : 'Create Custom Plan Tier'}
                </h3>
                <p className="font-body text-xs text-muted">
                  {isTrialPlan
                    ? 'Configure trial duration, quotas, post-trial conversion, and cardless parameters.'
                    : 'Define quotas, monthly billing prices, and feature checklists for client subscriptions.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPlanModal(false)}
                className="text-muted hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Plan Category Switcher */}
            <div className="flex items-center gap-2 p-1 bg-ink border border-line mb-5">
              <button
                type="button"
                onClick={() => resetNewPlanForm(false)}
                className={`flex-1 py-1.5 px-3 text-xs font-display uppercase tracking-[0.1em] transition-all text-center ${
                  !isTrialPlan ? 'bg-accent text-white font-semibold' : 'text-muted hover:text-white'
                }`}
              >
                Standard Subscription
              </button>
              <button
                type="button"
                onClick={() => resetNewPlanForm(true)}
                className={`flex-1 py-1.5 px-3 text-xs font-display uppercase tracking-[0.1em] transition-all text-center flex items-center justify-center gap-1.5 ${
                  isTrialPlan ? 'bg-amber-500 text-ink font-bold' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Free Trial Plan</span>
              </button>
            </div>

            {isTrialPlan && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs mb-4 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Trial Plan Engine Active:</span> Clients can activate this tier without payment upfront. The system enforces duration limits, automated post-trial downgrade or conversion, and abuse prevention.
                </div>
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="field">
                  <label className="field__label">Plan Identifier (Slug)</label>
                  <input
                    type="text"
                    required
                    value={planId}
                    onChange={e => setPlanId(e.target.value)}
                    placeholder={isTrialPlan ? 'pro_trial' : 'startup'}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>

                <div className="field">
                  <label className="field__label">Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder={isTrialPlan ? 'Developer Pro (14-Day Free Trial)' : 'Startup Growth'}
                    value={planName}
                    onChange={e => setPlanName(e.target.value)}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* Trial Specific Controls */}
              {isTrialPlan ? (
                <div className="p-4 bg-box border border-line space-y-3">
                  <div className="font-display uppercase text-[10px] tracking-[0.16em] text-amber-400 font-semibold">
                    Trial Specifications & Duration
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="field">
                      <label className="field__label">Duration (Days)</label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        required
                        value={planTrialDays}
                        onChange={e => setPlanTrialDays(Number(e.target.value))}
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                      />
                    </div>

                    <div className="field">
                      <label className="field__label">Price In Trial ($)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={planPrice}
                        onChange={e => setPlanPrice(Number(e.target.value))}
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                      />
                    </div>

                    <div className="field">
                      <label className="field__label">Post-Trial ($/mo)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={planPostTrialPrice}
                        onChange={e => setPlanPostTrialPrice(Number(e.target.value))}
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="field">
                      <label className="field__label">Auto-Converts To Plan</label>
                      <select
                        value={planTrialAutoConvertsTo}
                        onChange={e => setPlanTrialAutoConvertsTo(e.target.value)}
                        className="w-full bg-ink border border-line px-3 py-2 text-xs text-white focus:border-accent outline-none font-display uppercase tracking-wider"
                      >
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} {p.priceMonthly > 0 ? `($${p.priceMonthly}/mo)` : '(Free)'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label className="field__label">Max Trials Per Account</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        required
                        value={planMaxTrialsPerUser}
                        onChange={e => setPlanMaxTrialsPerUser(Number(e.target.value))}
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        checked={planTrialRequiresCard}
                        onChange={e => setPlanTrialRequiresCard(e.target.checked)}
                        className="accent-accent"
                      />
                      <span>Require Payment Method on Trial Activation (Unchecked = Cardless Instant Access)</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="field">
                    <label className="field__label">Monthly Price ($)</label>
                    <input
                      type="number"
                      required
                      value={planPrice}
                      onChange={e => setPlanPrice(Number(e.target.value))}
                      className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                    />
                  </div>
                  <div className="field">
                    <label className="field__label">Annual Price ($)</label>
                    <input
                      type="number"
                      value={planPrice * 10}
                      readOnly
                      className="w-full bg-box border border-line px-3.5 py-2 text-sm text-muted outline-none font-mono cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              {/* Usage Quotas */}
              <div className="grid grid-cols-3 gap-3">
                <div className="field">
                  <label className="field__label">Specs Quota {isTrialPlan ? '(In Trial)' : '(/Mo)'}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={planQuotaSpecs}
                    onChange={e => setPlanQuotaSpecs(Number(e.target.value))}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>
                <div className="field">
                  <label className="field__label">MCP Live Keys</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={planQuotaMcp}
                    onChange={e => setPlanQuotaMcp(Number(e.target.value))}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>
                <div className="field">
                  <label className="field__label">Team Seats</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={planMaxSeats}
                    onChange={e => setPlanMaxSeats(Number(e.target.value))}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="field">
                  <label className="field__label">Custom Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder={isTrialPlan ? '14-Day Free Trial' : 'Most Popular'}
                    value={planBadge}
                    onChange={e => setPlanBadge(e.target.value)}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
                <div className="field">
                  <label className="field__label">Description</label>
                  <input
                    type="text"
                    value={planDesc}
                    onChange={e => setPlanDesc(e.target.value)}
                    placeholder="Short summary of this tier"
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={planFeatures}
                  onChange={e => setPlanFeatures(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-white focus:border-accent outline-none font-body"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-xs font-display uppercase tracking-wider">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={planPrioritySupport}
                    onChange={e => setPlanPrioritySupport(e.target.checked)}
                    className="accent-accent"
                  />
                  <span>Priority 24/7 SLA</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={planIsPopular}
                    onChange={e => setPlanIsPopular(e.target.checked)}
                    className="accent-accent"
                  />
                  <span>Featured / Popular</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-sm ${isTrialPlan ? 'bg-amber-500 text-ink hover:bg-amber-400 font-bold' : 'btn--accent'}`}
                >
                  {isTrialPlan ? 'Create Trial Plan' : 'Create Subscription Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PLAN (FULL CRUD WITH TRIAL EXTENSIONS) */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">
              Customize Plan: {editingPlan.name}
            </h3>
            <p className="font-body text-xs text-muted mb-4">Modify pricing, quotas, trial duration, features, and availability.</p>

            <form onSubmit={handleSavePlanEdit} className="space-y-4">
              <div className="p-3 bg-ink border border-line">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-display uppercase tracking-wider text-amber-400 font-semibold">
                  <input
                    type="checkbox"
                    checked={Boolean(editingPlan.isTrial)}
                    onChange={e => setEditingPlan({ ...editingPlan, isTrial: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>⚡ Set as Risk-Free Trial Plan Tier</span>
                </label>
              </div>

              <div className="field">
                <label className="field__label">Plan Display Name</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name}
                  onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              {editingPlan.isTrial ? (
                <div className="p-3 bg-box border border-line space-y-3">
                  <div className="font-display uppercase text-[10px] tracking-[0.16em] text-amber-400 font-semibold">
                    Trial Controls
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="field">
                      <label className="field__label">Trial Days</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={editingPlan.trialDays || 14}
                        onChange={e => setEditingPlan({ ...editingPlan, trialDays: Number(e.target.value) })}
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label">Trial Fee ($)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={editingPlan.priceMonthly}
                        onChange={e => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label">Post-Trial ($/mo)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={editingPlan.postTrialMonthlyPrice || 29}
                        onChange={e => setEditingPlan({ ...editingPlan, postTrialMonthlyPrice: Number(e.target.value) })}
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="field">
                      <label className="field__label">Converts To Plan</label>
                      <select
                        value={editingPlan.trialAutoConvertsTo || 'pro'}
                        onChange={e => setEditingPlan({ ...editingPlan, trialAutoConvertsTo: e.target.value })}
                        className="w-full bg-ink border border-line px-3 py-2 text-xs text-white focus:border-accent outline-none font-display uppercase tracking-wider"
                      >
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} {p.priceMonthly > 0 ? `($${p.priceMonthly}/mo)` : '(Free)'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label className="field__label">Badge</label>
                      <input
                        type="text"
                        value={editingPlan.badge || ''}
                        onChange={e => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                        placeholder="14-Day Free Trial"
                        className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                    <input
                      type="checkbox"
                      checked={Boolean(editingPlan.trialRequiresCard)}
                      onChange={e => setEditingPlan({ ...editingPlan, trialRequiresCard: e.target.checked })}
                      className="accent-accent"
                    />
                    <span>Requires Payment Card on Trial Signup</span>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="field">
                    <label className="field__label">Monthly Price ($)</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.priceMonthly}
                      onChange={e => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                      className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                    />
                  </div>
                  <div className="field">
                    <label className="field__label">Yearly Price ($)</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.priceYearly}
                      onChange={e => setEditingPlan({ ...editingPlan, priceYearly: Number(e.target.value) })}
                      className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <label className="field__label">Description</label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="field">
                  <label className="field__label">Specs / Mo</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.quotaSpecsPerMonth}
                    onChange={e => setEditingPlan({ ...editingPlan, quotaSpecsPerMonth: Number(e.target.value) })}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>
                <div className="field">
                  <label className="field__label">MCP Keys</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.quotaMcpKeys}
                    onChange={e => setEditingPlan({ ...editingPlan, quotaMcpKeys: Number(e.target.value) })}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>
                <div className="field">
                  <label className="field__label">Team Seats</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.maxTeamSeats}
                    onChange={e => setEditingPlan({ ...editingPlan, maxTeamSeats: Number(e.target.value) })}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Features (One per line)</label>
                <textarea
                  rows={4}
                  value={editingPlan.features.join('\n')}
                  onChange={e => setEditingPlan({
                    ...editingPlan,
                    features: e.target.value.split('\n').map(f => f.trim()).filter(Boolean)
                  })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-white focus:border-accent outline-none font-body"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line text-xs font-display uppercase tracking-wider">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={e => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="accent-accent"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular || false}
                    onChange={e => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                    className="accent-accent"
                  />
                  <span>Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingPlan.prioritySupport}
                    onChange={e => setEditingPlan({ ...editingPlan, prioritySupport: e.target.checked })}
                    className="accent-accent"
                  />
                  <span>Priority SLA</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE INVOICE */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">Issue New Invoice</h3>
            <p className="font-body text-xs text-muted mb-6">Create a billing receipt or invoice for a customer.</p>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="field">
                <label className="field__label">Customer Name</label>
                <input
                  type="text"
                  required
                  value={invCustomerName}
                  onChange={e => setInvCustomerName(e.target.value)}
                  placeholder="Apex Tech Ltd."
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Customer Email</label>
                <input
                  type="email"
                  required
                  value={invCustomerEmail}
                  onChange={e => setInvCustomerEmail(e.target.value)}
                  placeholder="billing@apextech.com"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="field">
                  <label className="field__label">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={invAmount}
                    onChange={e => setInvAmount(Number(e.target.value))}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                </div>
                <div className="field">
                  <label className="field__label">Payment Status</label>
                  <select
                    value={invStatus}
                    onChange={e => setInvStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
