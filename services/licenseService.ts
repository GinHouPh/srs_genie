/**
 * SRS Genie - Central Licensing Client Service
 * Connects the frontend to /api/license.php and the Agape Central Licensing Server.
 * Supports both CodeCanyon Envato Purchase Codes and Agape Direct Sales.
 */

import { LicenseInfo, LicenseVerificationResponse, SoftwareUpdateInfo } from '../types';

const STORAGE_KEY = 'srs_cached_license_info';

type LicenseListener = (info: LicenseInfo) => void;

class LicenseService {
  private currentLicense: LicenseInfo;
  private listeners: Set<LicenseListener> = new Set();
  private isChecking: boolean = false;

  constructor() {
    this.currentLicense = this.loadFromStorage();
    // Re-verify on initialization
    this.fetchLicenseStatus();
  }

  private isLocalEnvironment(): boolean {
    if (typeof window === 'undefined') return true;
    const hostname = window.location.hostname.toLowerCase();
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.test') ||
      hostname.startsWith('dev.') ||
      hostname.startsWith('staging.')
    );
  }

  private loadFromStorage(): LicenseInfo {
    const isLocal = this.isLocalEnvironment();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          isLocal
        };
      }
    } catch {}

    // Default baseline license state
    return {
      isLicensed: isLocal,
      isLocal,
      licenseKey: isLocal ? 'LOCAL-DEV-SANDBOX-ENVIRONMENT' : '',
      channel: isLocal ? 'offline_dev' : 'envato',
      tier: isLocal ? 'developer' : 'regular',
      buyerName: isLocal ? 'Local Sandbox Developer' : '',
      boundDomain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
      features: {
        mcpGateway: true,
        multiAiProvider: true,
        whiteLabel: false,
        priorityUpdates: true
      },
      status: isLocal ? 'active' : 'unlicensed',
      statusMessage: isLocal
        ? 'Running in local development / staging sandbox mode (Permissive free dev tier).'
        : 'License key not activated. Please activate to enable specification synthesis.'
    };
  }

  private saveToStorage(info: LicenseInfo): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch {}
    this.currentLicense = info;
    this.notify();
  }

  public subscribe(listener: LicenseListener): () => void {
    this.listeners.add(listener);
    listener(this.currentLicense);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn(this.currentLicense));
  }

  public getLicenseInfo(): LicenseInfo {
    return this.currentLicense;
  }

  /**
   * Fetches latest verified status from backend /api/license.php?action=status
   */
  public async fetchLicenseStatus(): Promise<LicenseInfo> {
    if (this.isChecking) return this.currentLicense;
    this.isChecking = true;

    try {
      const res = await fetch('/api/license.php?action=status');
      if (res.ok) {
        const data = await res.json();
        const updated: LicenseInfo = {
          isLicensed: data.isLicensed ?? false,
          isLocal: data.isLocal ?? this.isLocalEnvironment(),
          licenseKey: data.fullKey || data.licenseKey || '',
          channel: data.channel ?? 'envato',
          tier: data.tier ?? 'regular',
          buyerName: data.buyerName ?? '',
          boundDomain: data.boundDomain ?? window.location.hostname,
          supportUntil: data.supportUntil,
          activatedAt: data.activatedAt,
          features: data.features ?? {
            mcpGateway: true,
            multiAiProvider: true,
            whiteLabel: false,
            priorityUpdates: true
          },
          status: data.status ?? (data.isLicensed ? 'active' : 'unlicensed'),
          statusMessage: data.statusMessage ?? ''
        };
        this.saveToStorage(updated);
        return updated;
      }
    } catch {
      // In local Vite standalone dev, backend PHP might be offline; fallback safely
      if (this.isLocalEnvironment()) {
        const localActive: LicenseInfo = {
          ...this.currentLicense,
          isLicensed: true,
          isLocal: true,
          status: 'active',
          statusMessage: 'Local development environment verified (Permissive developer allowance).'
        };
        this.saveToStorage(localActive);
        return localActive;
      }
    } finally {
      this.isChecking = false;
    }

    return this.currentLicense;
  }

  /**
   * Activate an Envato Purchase Code or Agape License Key
   */
  public async activateLicense(key: string): Promise<LicenseVerificationResponse> {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      return { success: false, valid: false, message: 'Please enter a valid license key or purchase code.' };
    }

    try {
      const res = await fetch('/api/license.php?action=activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: trimmedKey })
      });

      const data = await res.json();

      if (res.ok && data.success && data.valid) {
        await this.fetchLicenseStatus();
        return {
          success: true,
          valid: true,
          message: data.message || 'SRS Genie activated successfully!',
          buyer: data.buyer,
          tier: data.tier,
          channel: data.channel,
          support_until: data.supportUntil
        };
      }

      return {
        success: false,
        valid: false,
        message: data.error || data.message || 'Verification rejected by licensing server.'
      };
    } catch (e: any) {
      // If offline in local dev mode
      if (this.isLocalEnvironment()) {
        const localActivated: LicenseInfo = {
          isLicensed: true,
          isLocal: true,
          licenseKey: trimmedKey,
          channel: trimmedKey.startsWith('AGAPE-') ? 'agape_direct' : 'envato',
          tier: 'developer',
          buyerName: 'Local Developer',
          boundDomain: window.location.hostname,
          activatedAt: new Date().toISOString(),
          features: {
            mcpGateway: true,
            multiAiProvider: true,
            whiteLabel: true,
            priorityUpdates: true
          },
          status: 'active',
          statusMessage: 'Simulated license activated successfully in local sandbox.'
        };
        this.saveToStorage(localActivated);
        return {
          success: true,
          valid: true,
          message: 'Simulated sandbox activation successful (Local development).',
          tier: 'developer',
          buyer: 'Local Developer'
        };
      }

      return {
        success: false,
        valid: false,
        message: e.message || 'Network error communicating with licensing server.'
      };
    }
  }

  /**
   * Unbind license from current domain so user can transfer to another server
   */
  public async deactivateLicense(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/license.php?action=deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      await this.fetchLicenseStatus();
      return {
        success: data.success ?? true,
        message: data.message || 'License deactivated successfully.'
      };
    } catch (e: any) {
      // Clear locally
      localStorage.removeItem(STORAGE_KEY);
      this.currentLicense = this.loadFromStorage();
      this.notify();
      return { success: true, message: 'Local license cleared.' };
    }
  }

  /**
   * Check for updates on Agape Central Licensing Server
   */
  public async checkForUpdates(): Promise<SoftwareUpdateInfo> {
    try {
      const res = await fetch('/api/license.php?action=check-update');
      if (res.ok) {
        const data = await res.json();
        return {
          updateAvailable: data.update_available ?? false,
          currentVersion: data.current_version ?? '2.5.0',
          latestVersion: data.latest_version ?? '2.5.0',
          minPhpVersion: data.min_php_version ?? '8.2.0',
          changelog: data.changelog ?? '',
          downloadUrl: data.download_url ?? '',
          sha256: data.sha256 ?? ''
        };
      }
    } catch {}

    return {
      updateAvailable: false,
      currentVersion: '2.5.0',
      latestVersion: '2.5.0'
    };
  }
}

export const licenseService = new LicenseService();
