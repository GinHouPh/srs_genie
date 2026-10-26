/**
 * SRS Genie - Centralized Server Database API Bridge
 * Connects frontend stores with the Serverbyt MySQL PHP backend,
 * with graceful fallback to localStorage when running in local offline dev.
 */

export const apiService = {
  async checkHealth(): Promise<{ status: string; tables_initialized?: string[]; registered_users?: number } | null> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  },

  // AUTH
  async login(email: string, password: string): Promise<any> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error connecting to auth server.' };
    }
  },

  async register(name: string, email: string, password: string, company?: string): Promise<any> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, company })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during registration.' };
    }
  },

  async verifyEmail(email: string, code: string): Promise<any> {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error verifying code.' };
    }
  },

  async getAllUsers(): Promise<any[]> {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        return data.users || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  // PROJECTS
  async fetchProjects(userId?: string, tenantId?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId);
      if (tenantId) params.set('tenantId', tenantId);
      const res = await fetch(`/api/projects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.projects || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  async saveProject(project: any): Promise<boolean> {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // SAAS SETTINGS
  async getSetting<T>(key: string): Promise<T | null> {
    try {
      const res = await fetch(`/api/saas/settings?key=${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        return data.value as T;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveSetting<T>(key: string, value: T): Promise<boolean> {
    try {
      const res = await fetch('/api/saas/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // SAAS CUSTOMERS
  async getCustomers(): Promise<any[]> {
    try {
      const res = await fetch('/api/saas/customers');
      if (res.ok) {
        const data = await res.json();
        return data.customers || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  async saveCustomer(customer: any): Promise<boolean> {
    try {
      const res = await fetch('/api/saas/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // SAAS TRANSACTIONS
  async getTransactions(): Promise<any[]> {
    try {
      const res = await fetch('/api/saas/transactions');
      if (res.ok) {
        const data = await res.json();
        return data.transactions || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  async saveTransaction(tx: any): Promise<boolean> {
    try {
      const res = await fetch('/api/saas/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // AUDIT LOGS
  async getAuditLogs(): Promise<any[]> {
    try {
      const res = await fetch('/api/saas/audit-logs');
      if (res.ok) {
        const data = await res.json();
        return data.logs || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  async saveAuditLog(log: any): Promise<boolean> {
    try {
      const res = await fetch('/api/saas/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
