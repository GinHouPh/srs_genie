export type UserRole = 'admin' | 'staff' | 'client';
export type StaffRole = 'super_admin' | 'billing_manager' | 'support_lead' | 'tech_architect';
export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise' | string;
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled';

// AI Model Provider Configurations
export type AIProviderType = 'google' | 'openai' | 'anthropic' | 'deepseek' | 'ollama' | 'groq' | 'custom';

export interface AIModelDefinition {
  id: string; // e.g. "gemini-2.5-flash", "claude-3-7-sonnet"
  name: string; // e.g. "Gemini 2.5 Flash"
  providerId: string;
  providerName: string;
  contextWindow: string; // e.g. "1M Tokens"
  speed: 'Ultra Fast' | 'Fast' | 'Balanced' | 'Reasoning Deep';
  recommendedFor: string;
  isEnabled: boolean;
  isDefault?: boolean;
}

export interface AIModelProvider {
  id: string;
  name: string;
  type: AIProviderType;
  apiKey: string;
  baseUrl?: string;
  isActive: boolean;
  isDefault: boolean;
  models: AIModelDefinition[];
  createdAt: string;
  updatedAt: string;
}

// Analytics Metrics
export interface AnalyticsDataPoint {
  date: string;
  specsCount: number;
  tokens: number;
  revenue: number;
  activeAgents: number;
}

export interface ModelShareMetric {
  modelName: string;
  provider: string;
  percentage: number;
  tokenCount: number;
  requestCount: number;
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  staffRole?: StaffRole;
  tenantId?: string;
  avatarUrl?: string;
  company?: string;
  plan?: SubscriptionTier;
  createdAt?: string;
  specsCount?: number;
  isEmailVerified?: boolean;
  verificationCode?: string;
  trialEndsAt?: string;
  isTrialActive?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// SaaS Customer record for Admin Console
export interface SaaSCustomer {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  company: string;
  plan: SubscriptionTier;
  status: 'active' | 'suspended' | 'trialing';
  joinedDate: string;
  projectsCount: number;
  monthlySpend: number;
  paymentStatus: PaymentStatus;
  avatarUrl?: string;
  mcpApiKeyCount: number;
  trialEndsAt?: string;
}

// SaaS Staff Member
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'invited' | 'offline';
  joinedDate: string;
  lastActive: string;
  avatarUrl: string;
  permissions: string[];
}

// SaaS Pricing Plan
export interface PricingPlan {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
  isActive: boolean;
  features: string[];
  quotaSpecsPerMonth: number;
  quotaMcpKeys: number;
  maxTeamSeats: number;
  prioritySupport: boolean;
  // Trial Plan Parameters
  isTrial?: boolean;
  trialDays?: number;
  trialRequiresCard?: boolean;
  trialAutoConvertsTo?: string;
  postTrialMonthlyPrice?: number;
  maxTrialsPerUser?: number;
}

// SaaS Invoice
export interface SaaSInvoice {
  id: string;
  tenantId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  plan: SubscriptionTier;
  invoiceNumber: string;
  paymentGateway?: 'cashfree' | 'stripe' | 'manual';
  transactionId?: string;
  currency?: string;
}

// Cashfree PG Configuration for SaaS Owner
export interface CashfreeGatewayConfig {
  appId: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  currency: 'INR' | 'USD';
  apiVersion: string;
  isActive: boolean;
  webhookUrl?: string;
}

// Payment Transaction Record
export interface PaymentTransactionRecord {
  id: string;
  tenantId?: string;
  orderId: string;
  cfOrderId?: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  currency: string;
  planId: SubscriptionTier;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED';
  paymentSessionId?: string;
  paymentMethod?: string;
  gateway: 'cashfree';
  createdAt: string;
}

// SaaS Business & Enterprise Settings
export interface BusinessSettings {
  companyName: string;
  brandName: string;
  legalEntityName: string;
  taxRegistrationNumber: string;
  supportEmail: string;
  billingEmail: string;
  websiteUrl: string;
  headquartersAddress: string;
  defaultCurrency: 'INR' | 'USD' | 'EUR' | 'GBP';
  timezone: string;
  // SaaS & Trial Parameters
  defaultTrialDays: number;
  defaultTrialQuotaSpecs: number;
  maxTrialsPerCustomer: number;
  requireCardForTrials: boolean;
  enforceEmailVerification: boolean;
  allowSelfRegistration: boolean;
  // Invoicing & Branding
  invoicePrefix: string;
  taxRatePercent: number;
  invoiceFooterNote: string;
  invoiceDueDays: number;
  // System Notice & Operational Status
  maintenanceMode: boolean;
  announcementBannerText: string;
  showAnnouncementBanner: boolean;
  updatedAt?: string;
}

// SaaS Business KPI Metrics
export interface SaasMetrics {
  mrr: number;
  arr: number;
  mrrGrowthPct: number;
  totalCustomers: number;
  activeSubscriptions: number;
  churnRatePct: number;
  specsGeneratedTotal: number;
  specsGeneratedThisMonth: number;
  activeMcpAgents: number;
  geminiTokensConsumed: number;
}

// MCP Server Key & Session
export interface McpApiKey {
  id: string;
  tenantId?: string;
  name: string;
  key: string;
  projectId: string;
  projectName: string;
  createdAt: string;
  lastUsedAt?: string;
  agentType: 'cursor' | 'claude_desktop' | 'windsurf' | 'antigravity' | 'custom_agent';
  status: 'active' | 'revoked';
}

export interface McpSessionLog {
  id: string;
  timestamp: string;
  agentName: string;
  method: string;
  resourceOrTool: string;
  status: '200 OK' | '404 NOT_FOUND' | '500 ERROR';
  durationMs: number;
}

// Flexible structure for the dynamic form data
export interface SRSFormData {
  [sectionId: string]: {
    [fieldId: string]: string | string[];
  };
}

export interface ProjectInput {
  id: string;
  name: string;
  version: string;
  lastModified: Date;
  status: 'draft' | 'generated';
  formData: SRSFormData;
  tenantId?: string;
  userId?: string;
}

// Hierarchical .specs File item
export interface SpecFileItem {
  path: string;
  tier: string;
  category: string;
  title: string;
  content: string;
  description: string;
}

// Comprehensive generated content containing the full .specs suite
export interface GeneratedContent {
  srsMarkdown: string;
  agentContext: string;
  implementationTasks: VibeTask[];
  // Complete .specs files hierarchy
  specsHierarchy: Record<string, string>;
  projectMeta: {
    projectName: string;
    description: string;
    techStack: string[];
    timeline: string;
    budget: string;
  };
}

export interface VibeTask {
  id: string;
  title: string;
  description: string;
  prompt: string;
  fileContext?: string;
  type: 'setup' | 'backend' | 'frontend' | 'database' | 'testing' | 'deployment';
  status?: 'todo' | 'in-progress' | 'blocked' | 'done';
  complexity?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  dependsOn?: string;
}

export enum AppState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ADMIN_CONSOLE = 'ADMIN_CONSOLE',
  MCP_HUB = 'MCP_HUB',
  BILLING = 'BILLING'
}

// Fraud & Blacklist Types
export type BlacklistType = 'email' | 'domain' | 'ip';

export interface BlacklistEntry {
  id: string;
  type: BlacklistType;
  value: string;
  reason: string;
  addedAt: string;
  addedBy: string;
  isActive: boolean;
}

export interface FraudEvaluationResult {
  allowed: boolean;
  riskScore: number;
  reason?: string;
  violations: string[];
  isDisposable: boolean;
  isBlacklisted: boolean;
  isRateLimited: boolean;
  isDummyOrReserved?: boolean;
  mxActive?: boolean;
}
