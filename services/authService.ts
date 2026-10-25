import { User, UserRole, StaffRole } from '../types';
import { saasStore } from './saasStore';

export interface StoredUser extends User {
  passwordHash: string;
}

const STORAGE_USERS_KEY = 'srs_genie_registered_users_v2';
const STORAGE_SESSION_KEY = 'srs_genie_active_session_v2';

class AuthService {
  private users: StoredUser[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        // Normalize any old roles
        this.users = this.users.map(u => {
          if ((u.role as string) === 'editor' || (u.role as string) === 'viewer') {
            return { ...u, role: 'client' as UserRole };
          }
          return u;
        });
      } else {
        // Seed initial Business Owner (Admin)
        const defaultAdmin: StoredUser = {
          id: 'admin_root',
          name: 'Business Owner (Admin)',
          email: 'admin@srsgenie.ai',
          passwordHash: this.hashPassword('Admin123!'),
          role: 'admin',
          staffRole: 'super_admin',
          company: 'SRS Genie Inc.',
          plan: 'enterprise',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminRoot',
          createdAt: new Date().toISOString()
        };
        this.users = [defaultAdmin];
        this.saveUsers();
      }

      const activeSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (activeSession) {
        let parsed = JSON.parse(activeSession);
        if ((parsed.role as string) === 'editor' || (parsed.role as string) === 'viewer') {
          parsed.role = 'client';
        }
        this.currentUser = parsed;
      } else {
        // Default to admin on first run
        this.currentUser = this.users[0] || null;
        if (this.currentUser) {
          this.saveSession(this.currentUser);
        }
      }
    } catch (e) {
      console.warn('Storage unavailable in auth service:', e);
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
    } catch (e) {}
  }

  private saveSession(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {}
  }

  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}`;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Public registration: ALWAYS creates a client account for customers.
   * Admin and staff can only be created by the Business Owner.
   */
  register(params: {
    name: string;
    email: string;
    password: string;
    company?: string;
  }): { success: boolean; user?: User; error?: string } {
    const emailNormalized = params.email.trim().toLowerCase();

    if (this.users.some(u => u.email.toLowerCase() === emailNormalized)) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    if (params.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Role is strictly 'client' for customer registrations
    const newUser: StoredUser = {
      id: `usr_client_${Date.now()}`,
      name: params.name.trim(),
      email: emailNormalized,
      passwordHash: this.hashPassword(params.password),
      role: 'client',
      company: params.company?.trim() || 'Independent',
      plan: 'pro',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.name)}`,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();

    // Register as a customer in the SaaS Business Store
    saasStore.addCustomer({
      name: newUser.name,
      email: newUser.email,
      company: newUser.company || 'Independent',
      plan: newUser.plan || 'pro',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      projectsCount: 0,
      monthlySpend: 29,
      paymentStatus: 'paid',
      avatarUrl: newUser.avatarUrl,
      mcpApiKeyCount: 0
    });

    const userSafe = this.sanitizeUser(newUser);
    this.currentUser = userSafe;
    this.saveSession(userSafe);

    return { success: true, user: userSafe };
  }

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const emailNormalized = email.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === emailNormalized);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    const hashed = this.hashPassword(password);
    if (user.passwordHash !== hashed) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const userSafe = this.sanitizeUser(user);
    this.currentUser = userSafe;
    this.saveSession(userSafe);

    return { success: true, user: userSafe };
  }

  logout() {
    this.currentUser = null;
    this.saveSession(null);
  }

  updateProfile(userId: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    // Disallow clients from self-promoting to admin or staff
    if (this.users[idx].role === 'client' && updates.role && updates.role !== 'client') {
      delete updates.role;
    }

    this.users[idx] = { ...this.users[idx], ...updates };
    this.saveUsers();

    if (this.currentUser?.id === userId) {
      this.currentUser = this.sanitizeUser(this.users[idx]);
      this.saveSession(this.currentUser);
    }

    return this.currentUser;
  }

  deleteAccount(userId: string): boolean {
    this.users = this.users.filter(u => u.id !== userId);
    this.saveUsers();
    if (this.currentUser?.id === userId) {
      this.logout();
    }
    return true;
  }

  getAllUsers(): User[] {
    return this.users.map(u => this.sanitizeUser(u));
  }

  private sanitizeUser(stored: StoredUser): User {
    const { passwordHash, ...user } = stored;
    return user;
  }
}

export const authService = new AuthService();
