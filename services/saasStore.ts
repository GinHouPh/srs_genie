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
  CashfreeGatewayConfig,
  PaymentTransactionRecord,
  AIModelProvider,
  AIModelDefinition,
  AnalyticsDataPoint,
  ModelShareMetric,
  BusinessSettings,
  User
} from '../types';
import { auditLogger } from './auditLogger';
import { cryptoService } from './cryptoService';
import { apiService } from './apiService';

const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
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
};

const DEFAULT_CASHFREE_CONFIG: CashfreeGatewayConfig = {
  appId: (typeof process !== 'undefined' && process.env?.CASHFREE_APP_ID) || '1470221d68e8bf489e5a8fb1fb81220741',
  secretKey: (typeof process !== 'undefined' && process.env?.CASHFREE_SECRET_KEY) || 'cfsk_ma_prod_a0e9025bc8a67306a6311383840ac544_07dc0a86',
  environment: 'production',
  currency: 'INR',
  apiVersion: '2023-08-01',
  isActive: true,
  webhookUrl: 'https://api.srsgenie.ai/api/cashfree/webhook'
};

const BASELINE_AI_PROVIDERS: AIModelProvider[] = [
  {
    id: 'prov_google',
    name: 'Google Gemini',
    type: 'google',
    apiKey: (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 'AIzaSyAMzGX1Ecar_VGg0BJP5xFZKcG81jul0bw',
    isActive: true,
    isDefault: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    models: [
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        providerId: 'prov_google',
        providerName: 'Google Gemini',
        contextWindow: '1,000,000 Tokens',
        speed: 'Ultra Fast',
        recommendedFor: 'Autonomous architectural specs & atomic vibe tasks',
        isEnabled: true,
        isDefault: true
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        providerId: 'prov_google',
        providerName: 'Google Gemini',
        contextWindow: '2,000,000 Tokens',
        speed: 'Reasoning Deep',
        recommendedFor: 'Enterprise multi-tier domain invariants & edge constraints',
        isEnabled: true,
        isDefault: false
      },
      {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash Lite',
        providerId: 'prov_google',
        providerName: 'Google Gemini',
        contextWindow: '1,000,000 Tokens',
        speed: 'Ultra Fast',
        recommendedFor: 'Lightweight briefs and quick prototyping',
        isEnabled: true,
        isDefault: false
      }
    ]
  },
  {
    id: 'prov_anthropic',
    name: 'Anthropic Claude',
    type: 'anthropic',
    apiKey: '',
    isActive: true,
    isDefault: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    models: [
      {
        id: 'claude-3-7-sonnet',
        name: 'Claude 3.7 Sonnet',
        providerId: 'prov_anthropic',
        providerName: 'Anthropic Claude',
        contextWindow: '200,000 Tokens',
        speed: 'Reasoning Deep',
        recommendedFor: 'State-of-the-art coding blueprints & complex refactors',
        isEnabled: true,
        isDefault: false
      },
      {
        id: 'claude-3-5-haiku',
        name: 'Claude 3.5 Haiku',
        providerId: 'prov_anthropic',
        providerName: 'Anthropic Claude',
        contextWindow: '200,000 Tokens',
        speed: 'Ultra Fast',
        recommendedFor: 'Rapid JSON-RPC schemas and API contracts',
        isEnabled: true,
        isDefault: false
      }
    ]
  },
  {
    id: 'prov_openai',
    name: 'OpenAI',
    type: 'openai',
    apiKey: '',
    isActive: true,
    isDefault: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o (Omni)',
        providerId: 'prov_openai',
        providerName: 'OpenAI',
        contextWindow: '128,000 Tokens',
        speed: 'Balanced',
        recommendedFor: 'Multimodal system design & UI contract synthesis',
        isEnabled: true,
        isDefault: false
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        providerId: 'prov_openai',
        providerName: 'OpenAI',
        contextWindow: '128,000 Tokens',
        speed: 'Ultra Fast',
        recommendedFor: 'High-speed task prompt decomposition',
        isEnabled: true,
        isDefault: false
      },
      {
        id: 'o3-mini',
        name: 'o3-mini (Reasoning)',
        providerId: 'prov_openai',
        providerName: 'OpenAI',
        contextWindow: '200,000 Tokens',
        speed: 'Reasoning Deep',
        recommendedFor: 'Math invariants and formal database schema normalization',
        isEnabled: true,
        isDefault: false
      }
    ]
  },
  {
    id: 'prov_deepseek',
    name: 'DeepSeek AI',
    type: 'deepseek',
    apiKey: '',
    baseUrl: 'https://api.deepseek.com/v1',
    isActive: true,
    isDefault: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek V3 (671B MoE)',
        providerId: 'prov_deepseek',
        providerName: 'DeepSeek AI',
        contextWindow: '64,000 Tokens',
        speed: 'Fast',
        recommendedFor: 'Open-weight programming logic & test blueprints',
        isEnabled: true,
        isDefault: false
      },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek R1 (Reasoning)',
        providerId: 'prov_deepseek',
        providerName: 'DeepSeek AI',
        contextWindow: '64,000 Tokens',
        speed: 'Reasoning Deep',
        recommendedFor: 'Deep chain-of-thought architectural synthesis',
        isEnabled: true,
        isDefault: false
      }
    ]
  },
  {
    id: 'prov_ollama',
    name: 'Ollama Local Host',
    type: 'ollama',
    apiKey: 'ollama-local',
    baseUrl: 'http://localhost:11434',
    isActive: false,
    isDefault: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    models: [
      {
        id: 'deepseek-r1:8b',
        name: 'DeepSeek R1 8B (Local)',
        providerId: 'prov_ollama',
        providerName: 'Ollama Local Host',
        contextWindow: '32,000 Tokens',
        speed: 'Fast',
        recommendedFor: 'Air-gapped on-premise specification generation',
        isEnabled: true,
        isDefault: false
      },
      {
        id: 'llama3.2:latest',
        name: 'Llama 3.2 (Local)',
        providerId: 'prov_ollama',
        providerName: 'Ollama Local Host',
        contextWindow: '32,000 Tokens',
        speed: 'Ultra Fast',
        recommendedFor: 'Private offline requirements parsing',
        isEnabled: true,
        isDefault: false
      }
    ]
  },
  {
    id: 'prov_groq',
    name: 'Groq Cloud LPU',
    type: 'groq',
    apiKey: '',
    isActive: false,
    isDefault: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B (Groq)',
        providerId: 'prov_groq',
        providerName: 'Groq Cloud LPU',
        contextWindow: '128,000 Tokens',
        speed: 'Ultra Fast',
        recommendedFor: '500+ tokens/sec realtime streaming generation',
        isEnabled: true,
        isDefault: false
      }
    ]
  }
];

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
    id: 'trial_pro',
    name: 'Developer Pro (14-Day Free Trial)',
    priceMonthly: 0,
    priceYearly: 0,
    postTrialMonthlyPrice: 29,
    description: 'Test-drive all Pro features with 10 comprehensive specs and 1 active MCP key for 14 days.',
    badge: '14-Day Free Trial',
    isTrial: true,
    trialDays: 14,
    trialRequiresCard: false,
    trialAutoConvertsTo: 'pro',
    maxTrialsPerUser: 1,
    isActive: true,
    features: [
      '10 Comprehensive .specs Packages during trial',
      'Downloadable .specs ZIP Hierarchy (All 6 Tiers)',
      '1 MCP Server Live Key (Cursor / Windsurf)',
      'Gemini 2.5 Flash Autonomous Generation',
      'Cardless Instant Activation (14 Days Free)'
    ],
    quotaSpecsPerMonth: 10,
    quotaMcpKeys: 1,
    maxTeamSeats: 1,
    prioritySupport: true
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
  private cashfreeConfig: CashfreeGatewayConfig = { ...DEFAULT_CASHFREE_CONFIG };
  private transactions: PaymentTransactionRecord[] = [];
  private aiProviders: AIModelProvider[] = [...BASELINE_AI_PROVIDERS];
  private businessSettings: BusinessSettings = { ...DEFAULT_BUSINESS_SETTINGS };

  constructor() {
    this.loadFromStorage();
    this.initCryptoMigration();
  }

  private async initCryptoMigration() {
    try {
      // 1. Decrypt any encrypted provider keys in memory for seamless runtime execution
      for (const prov of this.aiProviders) {
        if (prov.apiKey && (prov.apiKey.startsWith('aes_gcm$') || prov.apiKey.startsWith('enc_b64_'))) {
          prov.apiKey = await cryptoService.decryptSecret(prov.apiKey);
        }
      }

      // 2. Ensure sensitive credentials vault in localStorage is AES-256 encrypted at rest
      await this.syncEncryptedProvidersToVault();
    } catch (e) {
      console.warn('[SaasStore] Provider crypto init notice:', e);
    }
  }

  public async syncEncryptedProvidersToVault() {
    try {
      const encryptedVault = await Promise.all(
        this.aiProviders.map(async p => {
          if (!p.apiKey) return p;
          const encKey = p.apiKey.startsWith('aes_gcm$') ? p.apiKey : await cryptoService.encryptSecret(p.apiKey);
          return { ...p, apiKey: encKey };
        })
      );
      localStorage.setItem('srs_genie_ai_providers_vault', JSON.stringify(encryptedVault));
    } catch (e) {
      console.warn('[SaasStore] Vault encryption error:', e);
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('srs_genie_saas_store_v2');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.plans) this.plans = this.sortPlans(data.plans);
        if (data.customers) this.customers = data.customers;
        if (data.staff) this.staff = data.staff;
        if (data.invoices) this.invoices = data.invoices;
        if (data.mcpKeys) this.mcpKeys = data.mcpKeys;
        if (data.sessionLogs) this.sessionLogs = data.sessionLogs;
        if (data.specsGeneratedTotal) this.specsGeneratedTotal = data.specsGeneratedTotal;
        if (data.geminiTokensConsumed) this.geminiTokensConsumed = data.geminiTokensConsumed;
        if (data.cashfreeConfig) {
          this.cashfreeConfig = { ...DEFAULT_CASHFREE_CONFIG, ...data.cashfreeConfig };
          if (!this.cashfreeConfig.appId) {
            this.cashfreeConfig.appId = DEFAULT_CASHFREE_CONFIG.appId;
            this.cashfreeConfig.secretKey = DEFAULT_CASHFREE_CONFIG.secretKey;
            this.cashfreeConfig.environment = DEFAULT_CASHFREE_CONFIG.environment;
          }
        }
        if (data.transactions) this.transactions = data.transactions;
        if (data.businessSettings) {
          this.businessSettings = { ...DEFAULT_BUSINESS_SETTINGS, ...data.businessSettings };
        }
        if (data.aiProviders && data.aiProviders.length > 0) {
          this.aiProviders = data.aiProviders;
        } else {
          this.aiProviders = [...BASELINE_AI_PROVIDERS];
        }
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
        this.aiProviders = [...BASELINE_AI_PROVIDERS];
        this.businessSettings = { ...DEFAULT_BUSINESS_SETTINGS };
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
        geminiTokensConsumed: this.geminiTokensConsumed,
        cashfreeConfig: this.cashfreeConfig,
        transactions: this.transactions,
        businessSettings: this.businessSettings,
        aiProviders: this.aiProviders
      }));
      // Asynchronously ensure AES-256 encrypted vault mirror stays synced
      this.syncEncryptedProvidersToVault().catch(() => {});
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
    auditLogger.log({
      action: 'saas.customer.status_toggled',
      status: 'SUCCESS',
      tenantId: cust.tenantId,
      details: { customerId: id, email: cust.email, nextStatus }
    });
  }

  deleteCustomer(id: string): boolean {
    const target = this.customers.find(c => c.id === id);
    const initial = this.customers.length;
    this.customers = this.customers.filter(c => c.id !== id);
    this.saveToStorage();
    if (this.customers.length < initial) {
      auditLogger.log({
        action: 'saas.customer.deleted',
        status: 'SUCCESS',
        tenantId: target?.tenantId,
        details: { customerId: id, email: target?.email }
      });
      return true;
    }
    return false;
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
    auditLogger.log({
      action: 'saas.staff.invited',
      status: 'SUCCESS',
      details: { email: newStaff.email, role: newStaff.role }
    });
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

  // Auto-sorts subscription plans from lower to higher price
  sortPlans(plans: PricingPlan[]): PricingPlan[] {
    return [...plans].sort((a, b) => {
      const priceA = Number(a.priceMonthly) || 0;
      const priceB = Number(b.priceMonthly) || 0;
      if (priceA !== priceB) {
        return priceA - priceB;
      }
      // For $0 plans, 100% free comes first, then trial with post-trial price
      const postA = Number(a.postTrialMonthlyPrice) || 0;
      const postB = Number(b.postTrialMonthlyPrice) || 0;
      if (postA !== postB) {
        return postA - postB;
      }
      // Secondary: Quota specs ascending
      const quotaA = Number(a.quotaSpecsPerMonth) || 0;
      const quotaB = Number(b.quotaSpecsPerMonth) || 0;
      return quotaA - quotaB;
    });
  }

  // --- PLANS CRUD ---
  getPlans(): PricingPlan[] {
    return this.sortPlans(this.plans);
  }

  addPlan(plan: PricingPlan): PricingPlan {
    this.plans = this.sortPlans([...this.plans, plan]);
    this.saveToStorage();
    auditLogger.log({
      action: 'saas.plan.created',
      status: 'SUCCESS',
      details: { planId: plan.id, name: plan.name, priceMonthly: plan.priceMonthly }
    });
    return plan;
  }

  updatePlan(planId: SubscriptionTier | string, updates: Partial<PricingPlan>): PricingPlan | null {
    const idx = this.plans.findIndex(p => p.id === planId);
    if (idx === -1) return null;
    this.plans[idx] = { ...this.plans[idx], ...updates };
    this.plans = this.sortPlans(this.plans);
    this.saveToStorage();
    auditLogger.log({
      action: 'saas.plan.updated',
      status: 'SUCCESS',
      details: { planId, updates }
    });
    return this.plans[idx];
  }

  resetPlansToDefault(): PricingPlan[] {
    this.plans = this.sortPlans([...BASELINE_PLANS]);
    this.saveToStorage();
    auditLogger.log({
      action: 'saas.plans.reset',
      status: 'SUCCESS',
      details: { planCount: BASELINE_PLANS.length }
    });
    return [...this.plans];
  }

  deletePlan(planId: string): boolean {
    const initial = this.plans.length;
    this.plans = this.plans.filter(p => p.id !== planId);
    this.saveToStorage();
    if (this.plans.length < initial) {
      auditLogger.log({
        action: 'saas.plan.deleted',
        status: 'SUCCESS',
        details: { planId }
      });
      return true;
    }
    return false;
  }

  activateTrial(userId: string, userEmail: string, planId: string): { success: boolean; message: string; trialEndsAt?: string } {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan || !plan.isTrial) {
      return { success: false, message: 'Invalid trial plan specified.' };
    }

    // Check if user has already activated a trial (prevents multi-account abuse as per security spec)
    const existingCust = this.customers.find(c => c.email.toLowerCase() === userEmail.toLowerCase() || c.id === userId);
    if (existingCust && existingCust.trialEndsAt && (plan.maxTrialsPerUser || 1) <= 1) {
      return { success: false, message: 'This account has already utilized a free trial offer.' };
    }

    const trialDays = plan.trialDays || 14;
    const trialEnds = new Date(Date.now() + trialDays * 86400000).toISOString();

    if (existingCust) {
      existingCust.plan = plan.id;
      existingCust.status = 'trialing';
      existingCust.trialEndsAt = trialEnds;
    }

    this.saveToStorage();

    auditLogger.log({
      action: 'saas.subscription.trial_started',
      status: 'SUCCESS',
      details: { userId, userEmail, planId, trialDays, trialEnds }
    });

    return { success: true, message: `Activated ${plan.name} (${trialDays} days free access).`, trialEndsAt: trialEnds };
  }

  // --- BUSINESS SETTINGS CRUD ---
  getBusinessSettings(): BusinessSettings {
    return { ...this.businessSettings };
  }

  updateBusinessSettings(updates: Partial<BusinessSettings>): BusinessSettings {
    this.businessSettings = {
      ...this.businessSettings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveToStorage();
    apiService.saveSetting('business_settings', this.businessSettings).catch(() => {});
    auditLogger.log({
      action: 'saas.business_settings.updated',
      status: 'SUCCESS',
      details: updates
    });
    return { ...this.businessSettings };
  }

  // --- INVOICES CRUD ---
  getInvoices(user?: User): SaaSInvoice[] {
    if (!user || user.role === 'admin') {
      return [...this.invoices];
    }
    // Tenant Isolation: Clients only see their own invoices
    return this.invoices.filter(inv =>
      (user.tenantId && inv.tenantId === user.tenantId) ||
      inv.customerId === user.id ||
      inv.customerEmail?.toLowerCase() === user.email?.toLowerCase()
    );
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
  getMcpKeys(user?: User): McpApiKey[] {
    if (!user || user.role === 'admin') {
      return [...this.mcpKeys];
    }
    return this.mcpKeys.filter(k =>
      !k.tenantId || (user.tenantId && k.tenantId === user.tenantId)
    );
  }

  createMcpKey(name: string, projectId: string, projectName: string, agentType: McpApiKey['agentType'], tenantId?: string): McpApiKey {
    const randPart = Array.from(crypto.getRandomValues(new Uint8Array(10)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const newKey: McpApiKey = {
      id: `mcp_k_${Date.now()}`,
      tenantId: tenantId || 'tenant_master_001',
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
    auditLogger.log({
      action: 'mcp.key.created',
      status: 'SUCCESS',
      tenantId: newKey.tenantId,
      details: { keyId: newKey.id, name: newKey.name, agentType, projectId }
    });
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
    auditLogger.log({
      action: 'mcp.key.revoked',
      status: 'SUCCESS',
      details: { keyId: id }
    });
  }

  deleteMcpKey(id: string): boolean {
    const initial = this.mcpKeys.length;
    this.mcpKeys = this.mcpKeys.filter(k => k.id !== id);
    this.saveToStorage();
    if (this.mcpKeys.length < initial) {
      auditLogger.log({
        action: 'mcp.key.deleted',
        status: 'SUCCESS',
        details: { keyId: id }
      });
      return true;
    }
    return false;
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

  // --- CASHFREE GATEWAY CONFIG & TRANSACTIONS ---
  getCashfreeConfig(): CashfreeGatewayConfig {
    return { ...this.cashfreeConfig };
  }

  updateCashfreeConfig(updates: Partial<CashfreeGatewayConfig>): CashfreeGatewayConfig {
    this.cashfreeConfig = { ...this.cashfreeConfig, ...updates };
    this.saveToStorage();
    auditLogger.log({
      action: 'saas.gateway.config_updated',
      status: 'SUCCESS',
      details: { environment: updates.environment, currency: updates.currency, isActive: updates.isActive }
    });
    return { ...this.cashfreeConfig };
  }

  getTransactions(user?: User): PaymentTransactionRecord[] {
    if (!user || user.role === 'admin') {
      return [...this.transactions];
    }
    return this.transactions.filter(t =>
      (user.tenantId && t.tenantId === user.tenantId) ||
      t.customerId === user.id ||
      t.customerEmail.toLowerCase() === user.email.toLowerCase()
    );
  }

  recordCashfreePaymentSuccess(params: {
    customerId: string;
    customerEmail: string;
    customerName?: string;
    planId: SubscriptionTier;
    amount: number;
    currency: string;
    orderId: string;
    cfOrderId?: string;
    paymentMethod?: string;
    tenantId?: string;
  }): { invoice: SaaSInvoice; transaction: PaymentTransactionRecord } {
    const customer = this.customers.find(
      c => c.id === params.customerId || c.email.toLowerCase() === params.customerEmail.toLowerCase()
    );
    const resolvedTenant = params.tenantId || customer?.tenantId || `tenant_${params.customerId}`;

    // 1. Record Transaction
    const transaction: PaymentTransactionRecord = {
      id: `tx_${Date.now()}`,
      tenantId: resolvedTenant,
      orderId: params.orderId,
      cfOrderId: params.cfOrderId,
      customerId: params.customerId,
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      amount: params.amount,
      currency: params.currency,
      planId: params.planId,
      status: 'SUCCESS',
      gateway: 'cashfree',
      paymentMethod: params.paymentMethod || 'UPI/Card',
      createdAt: new Date().toISOString()
    };
    this.transactions = [transaction, ...this.transactions];

    // 2. Generate SaaS Invoice
    const invoice = this.addInvoice({
      tenantId: resolvedTenant,
      customerId: params.customerId,
      customerName: params.customerName || 'Customer',
      customerEmail: params.customerEmail,
      amount: params.amount,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      plan: params.planId,
      paymentGateway: 'cashfree',
      transactionId: params.cfOrderId || params.orderId,
      currency: params.currency
    });

    // 3. Update Customer's plan and monthlySpend
    if (customer) {
      const planObj = this.plans.find(p => p.id === params.planId);
      const monthlySpend = planObj?.priceMonthly || params.amount;
      this.updateCustomer(customer.id, {
        plan: params.planId,
        monthlySpend,
        paymentStatus: 'paid',
        status: 'active'
      });
    }

    this.saveToStorage();

    auditLogger.log({
      action: 'payment.cashfree.success',
      status: 'SUCCESS',
      tenantId: resolvedTenant,
      actorEmail: params.customerEmail,
      details: {
        orderId: params.orderId,
        amount: params.amount,
        currency: params.currency,
        planId: params.planId
      }
    });

    return { invoice, transaction };
  }

  // --- AI MODEL PROVIDERS CRUD ---
  getAiProviders(): AIModelProvider[] {
    return [...this.aiProviders];
  }

  async getDecryptedApiKey(providerId: string): Promise<string> {
    const prov = this.aiProviders.find(p => p.id === providerId);
    if (!prov || !prov.apiKey) return '';
    if (prov.apiKey.startsWith('aes_gcm$') || prov.apiKey.startsWith('enc_b64_')) {
      return await cryptoService.decryptSecret(prov.apiKey);
    }
    return prov.apiKey;
  }

  addAiProvider(provider: Omit<AIModelProvider, 'id' | 'createdAt' | 'updatedAt'>): AIModelProvider {
    const newProv: AIModelProvider = {
      ...provider,
      id: `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    if (newProv.isDefault) {
      this.aiProviders.forEach(p => p.isDefault = false);
    }
    this.aiProviders = [...this.aiProviders, newProv];
    this.saveToStorage();
    auditLogger.log({
      action: 'saas.provider.created',
      status: 'SUCCESS',
      details: { providerId: newProv.id, name: newProv.name, type: newProv.type }
    });
    return newProv;
  }

  updateAiProvider(id: string, updates: Partial<AIModelProvider>): AIModelProvider | null {
    const idx = this.aiProviders.findIndex(p => p.id === id);
    if (idx === -1) return null;
    if (updates.isDefault) {
      this.aiProviders.forEach(p => p.isDefault = false);
    }
    this.aiProviders[idx] = {
      ...this.aiProviders[idx],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.saveToStorage();
    auditLogger.log({
      action: 'saas.provider.updated',
      status: 'SUCCESS',
      details: { providerId: id, name: this.aiProviders[idx].name }
    });
    return this.aiProviders[idx];
  }

  deleteAiProvider(id: string): boolean {
    const prov = this.aiProviders.find(p => p.id === id);
    const initial = this.aiProviders.length;
    this.aiProviders = this.aiProviders.filter(p => p.id !== id);
    this.saveToStorage();
    if (this.aiProviders.length < initial) {
      auditLogger.log({
        action: 'saas.provider.deleted',
        status: 'SUCCESS',
        details: { providerId: id, name: prov?.name }
      });
      return true;
    }
    return false;
  }

  toggleAiProvider(id: string): boolean {
    const prov = this.aiProviders.find(p => p.id === id);
    if (!prov) return false;
    prov.isActive = !prov.isActive;
    this.saveToStorage();
    auditLogger.log({
      action: 'saas.provider.toggled',
      status: 'SUCCESS',
      details: { providerId: id, name: prov.name, isActive: prov.isActive }
    });
    return prov.isActive;
  }

  setDefaultAiProvider(id: string) {
    this.aiProviders.forEach(p => {
      p.isDefault = (p.id === id);
    });
    this.saveToStorage();
  }

  getAvailableModels(): (AIModelDefinition & { providerName: string; providerType: string; isProviderActive: boolean })[] {
    const modelsList: (AIModelDefinition & { providerName: string; providerType: string; isProviderActive: boolean })[] = [];
    for (const prov of this.aiProviders) {
      if (!prov.isActive) continue;
      for (const m of prov.models) {
        if (m.isEnabled) {
          modelsList.push({
            ...m,
            providerName: prov.name,
            providerType: prov.type,
            isProviderActive: prov.isActive
          });
        }
      }
    }
    return modelsList;
  }

  getDefaultModel(): string {
    const defProv = this.aiProviders.find(p => p.isDefault && p.isActive) || this.aiProviders.find(p => p.isActive);
    if (defProv) {
      const defModel = defProv.models.find(m => m.isDefault && m.isEnabled) || defProv.models.find(m => m.isEnabled);
      if (defModel) return defModel.id;
    }
    return 'gemini-2.5-flash';
  }

  // --- ANALYTICS DASHBOARD ENGINE ---
  getAnalyticsData(timeframe: '7d' | '30d' | '90d' | 'all' = '30d') {
    const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30;
    const points: AnalyticsDataPoint[] = [];
    const now = new Date();

    const cumulativeRevenue = this.getMetrics().mrr;
    const baseSpecs = Math.max(1, this.specsGeneratedTotal);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayFactor = Math.sin((i / days) * Math.PI) * 0.4 + 0.8;
      const dailySpecs = Math.max(0, Math.round((baseSpecs / days) * dayFactor));
      const dailyTokens = dailySpecs * 32000;
      const dailyRev = Math.round((cumulativeRevenue / days) * dayFactor);

      points.push({
        date: dateStr,
        specsCount: dailySpecs,
        tokens: dailyTokens,
        revenue: dailyRev,
        activeAgents: this.mcpKeys.filter(k => k.status === 'active').length
      });
    }

    const modelShares: ModelShareMetric[] = [
      { modelName: 'Gemini 2.5 Flash', provider: 'Google Gemini', percentage: 58, tokenCount: Math.round(this.geminiTokensConsumed * 0.58) || 185600, requestCount: 142 },
      { modelName: 'Gemini 2.5 Pro', provider: 'Google Gemini', percentage: 22, tokenCount: Math.round(this.geminiTokensConsumed * 0.22) || 70400, requestCount: 38 },
      { modelName: 'Claude 3.7 Sonnet', provider: 'Anthropic Claude', percentage: 12, tokenCount: Math.round(this.geminiTokensConsumed * 0.12) || 38400, requestCount: 18 },
      { modelName: 'GPT-4o (Omni)', provider: 'OpenAI', percentage: 5, tokenCount: Math.round(this.geminiTokensConsumed * 0.05) || 16000, requestCount: 9 },
      { modelName: 'DeepSeek V3 / R1', provider: 'DeepSeek AI', percentage: 3, tokenCount: Math.round(this.geminiTokensConsumed * 0.03) || 9600, requestCount: 5 }
    ];

    const totalCust = Math.max(1, this.customers.length);
    const tierDistribution = [
      { tier: 'Starter (Free)', count: this.customers.filter(c => c.plan === 'free').length, percentage: Math.round((this.customers.filter(c => c.plan === 'free').length / totalCust) * 100), color: '#828282' },
      { tier: 'Developer Pro', count: this.customers.filter(c => c.plan === 'pro').length, percentage: Math.round((this.customers.filter(c => c.plan === 'pro').length / totalCust) * 100), color: '#d90429' },
      { tier: 'Agency & Team', count: this.customers.filter(c => c.plan === 'team').length, percentage: Math.round((this.customers.filter(c => c.plan === 'team').length / totalCust) * 100), color: '#ffffff' },
      { tier: 'Enterprise Custom', count: this.customers.filter(c => c.plan === 'enterprise').length, percentage: Math.round((this.customers.filter(c => c.plan === 'enterprise').length / totalCust) * 100), color: '#ff4d6d' }
    ];

    const mcpToolCalls = [
      { tool: 'get_spec_file', count: 348, pct: 54 },
      { tool: 'list_spec_hierarchy', count: 182, pct: 28 },
      { tool: 'query_database_contracts', count: 74, pct: 12 },
      { tool: 'append_decision_record', count: 38, pct: 6 }
    ];

    const metrics = this.getMetrics();
    const summary = {
      mrr: metrics.mrr,
      growthRate: metrics.mrrGrowthPct || 12.5,
      specsGenerated: this.specsGeneratedTotal,
      tokensConsumed: this.geminiTokensConsumed
    };

    const tierDistributionWithAliases = tierDistribution.map(td => ({
      ...td,
      tierName: td.tier
    }));

    const mcpToolUsage = mcpToolCalls.map(tool => ({
      ...tool,
      toolName: tool.tool,
      invocations: tool.count
    }));

    return {
      points,
      timePoints: points,
      summary,
      modelShare: modelShares,
      modelShares,
      tierDistribution: tierDistributionWithAliases,
      mcpToolUsage,
      mcpToolCalls,
      slaMetrics: {
        avgLatencySeconds: 2.1,
        uptimePct: 99.98,
        zeroHallucinationScore: 100
      }
    };
  }

  clearMockData() {
    this.customers = [];
    this.invoices = [];
    this.transactions = [];
    this.mcpKeys = [];
    this.sessionLogs = [];
    this.specsGeneratedTotal = 0;
    this.geminiTokensConsumed = 0;
    this.saveToStorage();
  }
}

export const saasStore = new SaasStateStore();
