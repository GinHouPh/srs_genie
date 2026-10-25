export type UserRole = 'admin' | 'staff' | 'client';
export type StaffRole = 'super_admin' | 'billing_manager' | 'support_lead' | 'tech_architect';
export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  staffRole?: StaffRole;
  avatarUrl?: string;
  company?: string;
  plan?: SubscriptionTier;
  createdAt?: string;
  specsCount?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// SaaS Customer record for Admin Console
export interface SaaSCustomer {
  id: string;
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
}

// SaaS Invoice
export interface SaaSInvoice {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  plan: SubscriptionTier;
  invoiceNumber: string;
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
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  ADMIN_CONSOLE = 'ADMIN_CONSOLE',
  MCP_HUB = 'MCP_HUB'
}
