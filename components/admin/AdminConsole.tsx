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
  RefreshCw
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
  PaymentStatus
} from '../../types';
import { saasStore } from '../../services/saasStore';

interface AdminConsoleProps {
  onBackToDashboard: () => void;
}

type AdminTab = 'overview' | 'customers' | 'staff' | 'plans' | 'billing' | 'mcp_telemetry';

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [metrics, setMetrics] = useState<SaasMetrics>(saasStore.getMetrics());
  const [customers, setCustomers] = useState<SaaSCustomer[]>(saasStore.getCustomers());
  const [staff, setStaff] = useState<StaffMember[]>(saasStore.getStaff());
  const [plans, setPlans] = useState<PricingPlan[]>(saasStore.getPlans());
  const [invoices, setInvoices] = useState<SaaSInvoice[]>(saasStore.getInvoices());
  const [mcpKeys, setMcpKeys] = useState<McpApiKey[]>(saasStore.getMcpKeys());
  const [sessionLogs, setSessionLogs] = useState<McpSessionLog[]>(saasStore.getSessionLogs());

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
  const [planId, setPlanId] = useState('');
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState(49);
  const [planDesc, setPlanDesc] = useState('');
  const [planFeatures, setPlanFeatures] = useState('Unlimited Specs\nPriority AI Queue\n5 MCP Keys');
  const [planQuotaSpecs, setPlanQuotaSpecs] = useState(50);
  const [planQuotaMcp, setPlanQuotaMcp] = useState(5);

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
  };

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
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
      priceYearly: Number(planPrice) * 10,
      description: planDesc,
      isActive: true,
      features: feats,
      quotaSpecsPerMonth: Number(planQuotaSpecs),
      quotaMcpKeys: Number(planQuotaMcp),
      maxTeamSeats: 5,
      prioritySupport: true
    });
    refreshAll();
    setShowNewPlanModal(false);
    setPlanId('');
    setPlanName('');
    setPlanDesc('');
    showToast(`Created custom tier: ${planName}`);
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

      {/* Top Header Bar */}
      <div className="agape-card p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="eyebrow mb-3">SaaS Governance & Ops</div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[0.04em] uppercase">
              Business Operations Console
            </h1>
            <p className="font-body text-xs text-muted mt-2 max-w-2xl">
              Complete administrative authority over client workspaces, staff access roles, subscription pricing tiers, billing ledger, and MCP agent gateway tokens.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="btn btn-sm btn--ghost"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => {
                refreshAll();
                showToast('Synchronized data store.');
              }}
              className="p-2 bg-box border border-line text-muted hover:text-accent hover:border-accent transition-colors"
              title="Refresh Store"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-surface border border-line custom-scrollbar">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: BarChart3 },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'staff', label: `Staff & Team (${staff.length})`, icon: ShieldCheck },
          { id: 'plans', label: `Plans & Pricing (${plans.length})`, icon: Layers },
          { id: 'billing', label: `Billing & Invoices (${invoices.length})`, icon: CreditCard },
          { id: 'mcp_telemetry', label: `MCP Gateway (${mcpKeys.length})`, icon: Network },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 font-display text-xs tracking-[0.16em] uppercase whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-white hover:bg-box'
              }`}
            >
              <Icon className="w-4 h-4" />
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

      {/* TAB 2: CUSTOMERS & USERS CRUD */}
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display text-xl font-semibold text-white tracking-[0.06em] uppercase">Pricing Plans & Feature Tiers</h2>
              <p className="font-body text-xs text-muted">Configure quotas, monthly billing prices, and MCP limits</p>
            </div>
            <button
              onClick={() => setShowNewPlanModal(true)}
              className="btn btn-sm btn--accent"
            >
              <Plus className="w-4 h-4" />
              <span>Add Plan Tier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`agape-card p-6 flex flex-col justify-between ${
                  plan.isPopular ? 'border-accent shadow-xl shadow-accent/5' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-base font-semibold text-white uppercase tracking-[0.08em]">{plan.name}</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="p-1 text-muted hover:text-white"
                        title="Edit plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {['free', 'pro', 'team', 'enterprise'].indexOf(plan.id) === -1 && (
                        <button
                          onClick={() => handleDeletePlan(plan.id, plan.name)}
                          className="p-1 text-muted hover:text-accent"
                          title="Delete plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-body text-xs text-muted mb-4 min-h-[36px]">{plan.description}</p>

                  <div className="mb-6 pb-4 border-b border-line">
                    <span className="font-display text-3xl font-semibold text-white font-mono">${plan.priceMonthly}</span>
                    <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / mo</span>
                  </div>

                  <div className="space-y-2.5 text-xs text-body mb-6">
                    <div className="font-display uppercase text-[10px] tracking-[0.18em] text-muted mb-2">Features</div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="font-body">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-line font-body text-xs text-muted space-y-1">
                  <div>Specs Quota: <strong className="text-white">{plan.quotaSpecsPerMonth} / mo</strong></div>
                  <div>MCP Keys: <strong className="text-accent">{plan.quotaMcpKeys} active</strong></div>
                  <div>Team Seats: <strong className="text-white">{plan.maxTeamSeats} seat(s)</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

      {/* MODAL: ADD PLAN */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">Create Custom Plan Tier</h3>
            <p className="font-body text-xs text-muted mb-6">Define quotas and feature checklist for a new subscription tier.</p>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="field">
                <label className="field__label">Plan Identifier</label>
                <input
                  type="text"
                  required
                  value={planId}
                  onChange={e => setPlanId(e.target.value)}
                  placeholder="startup"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="field">
                <label className="field__label">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="Startup Growth"
                  value={planName}
                  onChange={e => setPlanName(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

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
                <label className="field__label">Description</label>
                <input
                  type="text"
                  value={planDesc}
                  onChange={e => setPlanDesc(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
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
                  className="btn btn-sm btn--accent"
                >
                  Create Plan
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
