import {
  SaaSCustomer,
  StaffMember,
  PricingPlan,
  SaaSInvoice,
  SaasMetrics,
  McpApiKey,
  McpSessionLog,
  SubscriptionTier,
  StaffRole
} from '../types';

// Default baseline plans for any SaaS operation
const BASELINE_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter / Hobby',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Perfect for indie hackers exploring AI-generated specifications and prototypes.',
    isActive: true,
    features: [
      '3 SRS Specifications / month',
      'Standard IEEE 830 Markdown Export',
      'Basic Task Prompts',
      'Community Support',
      '1 Concurrent Project'
    ],
    quotaSpecsPerMonth: 3,
    quotaMcpKeys: 0,
    maxTeamSeats: 1,
    prioritySupport: false
  },
  {
    id: 'pro',
    name: 'Developer Pro',
    priceMonthly: 29,
    priceYearly: 290,
    description: 'For professional software engineers and technical leads needing full agent specs.',
    isPopular: true,
    badge: 'Most Popular',
    isActive: true,
    features: [
      '25 Comprehensive .specs Packages / month',
      'Downloadable .specs ZIP Hierarchy (All 6 Tiers)',
      '1 MCP Server Live Key (Cursor / Windsurf)',
      'Gemini 2.5 Flash Priority Queue',
      'Architecture & API Contract Generation',
      'Email Support'
    ],
    quotaSpecsPerMonth: 25,
    quotaMcpKeys: 1,
    maxTeamSeats: 1,
    prioritySupport: true
  },
  {
    id: 'team',
    name: 'Agency & Team',
    priceMonthly: 99,
    priceYearly: 990,
    description: 'For dev agencies and product teams scoping complex multi-platform systems.',
    badge: 'Scale',
    isActive: true,
    features: [
      '150 Comprehensive .specs Packages / month',
      'Downloadable .specs ZIP + Automated ADR Logs',
      '5 MCP Live Sync Keys for Entire Engineering Team',
      'White-label SRS Branding & Custom Watermark',
      'Team Collaboration & Role Permissions (5 Seats)',
      'Priority 24/7 Slack / Discord Support'
    ],
    quotaSpecsPerMonth: 150,
    quotaMcpKeys: 5,
    maxTeamSeats: 5,
    prioritySupport: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Custom',
    priceMonthly: 299,
    priceYearly: 2990,
    description: 'Tailored compliance, unlimited MCP agent pipelines, and dedicated solutions architect.',
    isActive: true,
    features: [
      'Unlimited Comprehensive .specs Generations',
      'Unlimited MCP Server Live Connections',
      'Custom LLM Fine-tuning & On-premise Connectors',
      'SOC2, HIPAA, GDPR Security Blueprinting',
      'Unlimited Team Seats & SSO / SAML 2.0',
      'Dedicated Account Manager & SLA Guarantee'
    ],
    quotaSpecsPerMonth: 9999,
    quotaMcpKeys: 999,
    maxTeamSeats: 999,
    prioritySupport: true
  }
];

class SaasStateStore {
  private plans: PricingPlan[] = [...BASELINE_PLANS];
  private customers: SaaSCustomer[] = [];
  private staff: StaffMember[] = [];
  private invoices: SaaSInvoice[] = [];
  private mcpKeys: McpApiKey[] = [];
  private sessionLogs: McpSessionLog[] = [];
  private specsGeneratedTotal: number = 0;
  private geminiTokensConsumed: number = 0;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('srs_genie_saas_store_v2');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.plans) this.plans = data.plans;
        if (data.customers) this.customers = data.customers;
        if (data.staff) this.staff = data.staff;
        if (data.invoices) this.invoices = data.invoices;
        if (data.mcpKeys) this.mcpKeys = data.mcpKeys;
        if (data.sessionLogs) this.sessionLogs = data.sessionLogs;
        if (data.specsGeneratedTotal) this.specsGeneratedTotal = data.specsGeneratedTotal;
        if (data.geminiTokensConsumed) this.geminiTokensConsumed = data.geminiTokensConsumed;
      } else {
        // Start with clean initial staff (Active Admin)
        this.staff = [
          {
            id: 'staff_root',
            name: 'Super Admin',
            email: 'admin@srsgenie.ai',
            role: 'super_admin',
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
            lastActive: 'Active now',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminRoot',
            permissions: ['all_access', 'billing_admin', 'user_ban', 'system_config', 'mcp_manage']
          }
        ];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Storage error in SaasStateStore:', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('srs_genie_saas_store_v2', JSON.stringify({
        plans: this.plans,
        customers: this.customers,
        staff: this.staff,
        invoices: this.invoices,
        mcpKeys: this.mcpKeys,
        sessionLogs: this.sessionLogs,
        specsGeneratedTotal: this.specsGeneratedTotal,
        geminiTokensConsumed: this.geminiTokensConsumed
      }));
    } catch (e) {}
  }

  // --- DYNAMIC METRICS ---
  getMetrics(): SaasMetrics {
    const activeCustomers = this.customers.filter(c => c.status === 'active');
    const totalMrr = activeCustomers.reduce((acc, c) => acc + (c.monthlySpend || 0), 0);
    const activeMcp = this.mcpKeys.filter(k => k.status === 'active').length;

    return {
      mrr: totalMrr,
      arr: totalMrr * 12,
      mrrGrowthPct: activeCustomers.length > 0 ? 12.5 : 0,
      totalCustomers: this.customers.length,
      activeSubscriptions: activeCustomers.length,
      churnRatePct: 0.0,
      specsGeneratedTotal: this.specsGeneratedTotal,
      specsGeneratedThisMonth: this.specsGeneratedTotal,
      activeMcpAgents: activeMcp,
      geminiTokensConsumed: this.geminiTokensConsumed
    };
  }

  // --- CUSTOMERS CRUD ---
  getCustomers(): SaaSCustomer[] {
    return [...this.customers];
  }

  addCustomer(customer: Omit<SaaSCustomer, 'id'>): SaaSCustomer {
    const newCust: SaaSCustomer = {
      ...customer,
      id: `cust_${Date.now()}`
    };
    this.customers = [newCust, ...this.customers];

    // Automatically create first invoice if paid plan
    if (newCust.monthlySpend > 0) {
      this.addInvoice({
        customerId: newCust.id,
        customerName: newCust.name,
        customerEmail: newCust.email,
        amount: newCust.monthlySpend,
        status: 'paid',
        date: new Date().toISOString().split('T')[0],
        plan: newCust.plan
      });
    }

    this.saveToStorage();
    return newCust;
  }

  updateCustomer(id: string, updates: Partial<SaaSCustomer>): SaaSCustomer | null {
    const idx = this.customers.findIndex(c => c.id === id);
    if (idx === -1) return null;

    if (updates.plan && updates.plan !== this.customers[idx].plan) {
      const planObj = this.plans.find(p => p.id === updates.plan);
      updates.monthlySpend = planObj?.priceMonthly || 0;
    }

    this.customers[idx] = { ...this.customers[idx], ...updates };
    this.saveToStorage();
    return this.customers[idx];
  }

  updateCustomerPlan(id: string, newPlan: SubscriptionTier) {
    this.updateCustomer(id, { plan: newPlan });
  }

  toggleCustomerStatus(id: string) {
    const cust = this.customers.find(c => c.id === id);
    if (!cust) return;
    const nextStatus = cust.status === 'active' ? 'suspended' : 'active';
    this.updateCustomer(id, { status: nextStatus });
  }

  deleteCustomer(id: string): boolean {
    const initial = this.customers.length;
    this.customers = this.customers.filter(c => c.id !== id);
    this.saveToStorage();
    return this.customers.length < initial;
  }

  // --- STAFF CRUD ---
  getStaff(): StaffMember[] {
    return [...this.staff];
  }

  inviteStaff(member: Omit<StaffMember, 'id' | 'status' | 'joinedDate' | 'lastActive'>): StaffMember {
    const newStaff: StaffMember = {
      ...member,
      id: `staff_${Date.now()}`,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now'
    };
    this.staff = [newStaff, ...this.staff];
    this.saveToStorage();
    return newStaff;
  }

  updateStaff(id: string, updates: Partial<StaffMember>): StaffMember | null {
    const idx = this.staff.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.staff[idx] = { ...this.staff[idx], ...updates };
    this.saveToStorage();
    return this.staff[idx];
  }

  removeStaff(id: string): boolean {
    const initial = this.staff.length;
    this.staff = this.staff.filter(s => s.id !== id);
    this.saveToStorage();
    return this.staff.length < initial;
  }

  // --- PLANS CRUD ---
  getPlans(): PricingPlan[] {
    return [...this.plans];
  }

  addPlan(plan: PricingPlan): PricingPlan {
    this.plans = [...this.plans, plan];
    this.saveToStorage();
    return plan;
  }

  updatePlan(planId: SubscriptionTier | string, updates: Partial<PricingPlan>): PricingPlan | null {
    const idx = this.plans.findIndex(p => p.id === planId);
    if (idx === -1) return null;
    this.plans[idx] = { ...this.plans[idx], ...updates };
    this.saveToStorage();
    return this.plans[idx];
  }

  deletePlan(planId: string): boolean {
    const initial = this.plans.length;
    this.plans = this.plans.filter(p => p.id !== planId);
    this.saveToStorage();
    return this.plans.length < initial;
  }

  // --- INVOICES CRUD ---
  getInvoices(): SaaSInvoice[] {
    return [...this.invoices];
  }

  addInvoice(invoice: Omit<SaaSInvoice, 'id' | 'invoiceNumber'>): SaaSInvoice {
    const seq = String(this.invoices.length + 1001).padStart(4, '0');
    const newInv: SaaSInvoice = {
      ...invoice,
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${seq}`
    };
    this.invoices = [newInv, ...this.invoices];
    this.saveToStorage();
    return newInv;
  }

  updateInvoice(id: string, updates: Partial<SaaSInvoice>): SaaSInvoice | null {
    const idx = this.invoices.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.invoices[idx] = { ...this.invoices[idx], ...updates };
    this.saveToStorage();
    return this.invoices[idx];
  }

  deleteInvoice(id: string): boolean {
    const initial = this.invoices.length;
    this.invoices = this.invoices.filter(i => i.id !== id);
    this.saveToStorage();
    return this.invoices.length < initial;
  }

  // --- MCP KEYS CRUD ---
  getMcpKeys(): McpApiKey[] {
    return [...this.mcpKeys];
  }

  createMcpKey(name: string, projectId: string, projectName: string, agentType: McpApiKey['agentType']): McpApiKey {
    const randPart = Array.from(crypto.getRandomValues(new Uint8Array(10)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const newKey: McpApiKey = {
      id: `mcp_k_${Date.now()}`,
      name: name.trim(),
      key: `srs_live_${randPart}`,
      projectId,
      projectName,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsedAt: 'Never',
      agentType,
      status: 'active'
    };
    this.mcpKeys = [newKey, ...this.mcpKeys];
    this.saveToStorage();
    return newKey;
  }

  updateMcpKey(id: string, updates: Partial<McpApiKey>): McpApiKey | null {
    const idx = this.mcpKeys.findIndex(k => k.id === id);
    if (idx === -1) return null;
    this.mcpKeys[idx] = { ...this.mcpKeys[idx], ...updates };
    this.saveToStorage();
    return this.mcpKeys[idx];
  }

  revokeMcpKey(id: string) {
    this.updateMcpKey(id, { status: 'revoked' });
  }

  deleteMcpKey(id: string): boolean {
    const initial = this.mcpKeys.length;
    this.mcpKeys = this.mcpKeys.filter(k => k.id !== id);
    this.saveToStorage();
    return this.mcpKeys.length < initial;
  }

  // --- SESSION LOGS ---
  getSessionLogs(): McpSessionLog[] {
    return [...this.sessionLogs];
  }

  addSessionLog(log: Omit<McpSessionLog, 'id' | 'timestamp'>) {
    const newLog: McpSessionLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0]
    };
    this.sessionLogs = [newLog, ...this.sessionLogs.slice(0, 49)];
    this.saveToStorage();
  }

  clearSessionLogs() {
    this.sessionLogs = [];
    this.saveToStorage();
  }

  recordSpecGeneration(tokens: number = 32000) {
    this.specsGeneratedTotal += 1;
    this.geminiTokensConsumed += tokens;
    this.saveToStorage();
  }
}

export const saasStore = new SaasStateStore();
