import { AppState, ProjectSession } from '../types';

const SESSIONS_KEY_PREFIX = 'srs_genie_sessions_v1_';
const ACTIVE_SESSION_KEY_PREFIX = 'srs_genie_active_session_id_v1_';
const LEGACY_DRAFT_KEY = 'srs_genie_active_form_draft';
const MAX_UNPINNED_SESSIONS = 15;

class SessionStore {
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch {}
    });
  }

  private sessionsKey(userId: string): string {
    return `${SESSIONS_KEY_PREFIX}${userId}`;
  }

  private activeKey(userId: string): string {
    return `${ACTIVE_SESSION_KEY_PREFIX}${userId}`;
  }

  private readSessions(userId: string): ProjectSession[] {
    if (!userId || typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.sessionsKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeSessions(userId: string, sessions: ProjectSession[]) {
    if (!userId || typeof localStorage === 'undefined') return;
    // Cap unpinned sessions to avoid localStorage quota exhaustion
    const pinned = sessions.filter(s => s.isPinned);
    const unpinned = sessions
      .filter(s => !s.isPinned)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, MAX_UNPINNED_SESSIONS);

    const merged = [...pinned, ...unpinned].sort((a, b) => {
      if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    try {
      localStorage.setItem(this.sessionsKey(userId), JSON.stringify(merged));
    } catch (e) {
      console.warn('[SessionStore] Failed to persist sessions to localStorage:', e);
    }
    this.notifyListeners();
  }

  /**
   * Migrates any legacy single-slot WizardForm draft into a user-scoped ProjectSession
   * if the user does not yet have any saved sessions.
   */
  migrateLegacyDraftIfNeeded(userId: string, tenantId?: string) {
    if (!userId || typeof localStorage === 'undefined') return;
    try {
      const existing = this.readSessions(userId);
      if (existing.length > 0) return;

      const rawDraft = localStorage.getItem(LEGACY_DRAFT_KEY);
      if (!rawDraft) return;
      const parsed = JSON.parse(rawDraft);
      if (!parsed || !parsed.formData || Object.keys(parsed.formData).length === 0) return;

      const projectName =
        (parsed.formData?.project_overview?.project_name as string) || 'Untitled Draft';
      const now = parsed.savedAt || new Date().toISOString();
      const migrated: ProjectSession = {
        sessionId: `sess_${Date.now()}_migrated`,
        userId,
        tenantId,
        projectName,
        appState: AppState.WIZARD,
        selectedModelId: parsed.selectedModelId || 'gemini-2.5-flash',
        wizardStep: typeof parsed.activeStep === 'number' ? parsed.activeStep : 0,
        formData: parsed.formData,
        createdAt: now,
        updatedAt: now
      };
      this.writeSessions(userId, [migrated]);
      this.setActiveSessionId(userId, migrated.sessionId);
    } catch {}
  }

  getSessions(userId: string): ProjectSession[] {
    const list = this.readSessions(userId);
    return list.sort((a, b) => {
      if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  getSessionById(userId: string, sessionId: string): ProjectSession | null {
    return this.readSessions(userId).find(s => s.sessionId === sessionId) || null;
  }

  getActiveSessionId(userId: string): string | null {
    if (!userId || typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem(this.activeKey(userId));
    } catch {
      return null;
    }
  }

  setActiveSessionId(userId: string, sessionId: string | null) {
    if (!userId || typeof localStorage === 'undefined') return;
    try {
      if (sessionId) {
        localStorage.setItem(this.activeKey(userId), sessionId);
      } else {
        localStorage.removeItem(this.activeKey(userId));
      }
    } catch {}
  }

  getActiveSession(userId: string): ProjectSession | null {
    const activeId = this.getActiveSessionId(userId);
    if (activeId) {
      const match = this.getSessionById(userId, activeId);
      if (match) return match;
    }
    const all = this.getSessions(userId);
    return all[0] || null;
  }

  createSession(
    userId: string,
    partial: Partial<ProjectSession> & { appState: AppState }
  ): ProjectSession {
    const now = new Date().toISOString();
    const session: ProjectSession = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      tenantId: partial.tenantId,
      projectId: partial.projectId,
      projectName: partial.projectName || 'Untitled Project',
      appState: partial.appState,
      selectedModelId: partial.selectedModelId || 'gemini-2.5-flash',
      wizardStep: partial.wizardStep ?? 0,
      formData: partial.formData,
      generationCheckpoint: partial.generationCheckpoint,
      previewState: partial.previewState,
      isPinned: partial.isPinned ?? false,
      createdAt: now,
      updatedAt: now
    };
    const sessions = this.readSessions(userId);
    this.writeSessions(userId, [session, ...sessions]);
    this.setActiveSessionId(userId, session.sessionId);
    return session;
  }

  updateSession(
    userId: string,
    sessionId: string,
    patch: Partial<ProjectSession>
  ): ProjectSession | null {
    const sessions = this.readSessions(userId);
    const idx = sessions.findIndex(s => s.sessionId === sessionId);
    if (idx === -1) return null;

    const updated: ProjectSession = {
      ...sessions[idx],
      ...patch,
      sessionId: sessions[idx].sessionId,
      userId: sessions[idx].userId,
      updatedAt: new Date().toISOString()
    };
    sessions[idx] = updated;
    this.writeSessions(userId, sessions);
    return updated;
  }

  upsertActiveSession(
    userId: string,
    patch: Partial<ProjectSession> & { appState: AppState }
  ): ProjectSession {
    const activeId = this.getActiveSessionId(userId);
    if (activeId) {
      const updated = this.updateSession(userId, activeId, patch);
      if (updated) return updated;
    }
    return this.createSession(userId, patch);
  }

  pinSession(userId: string, sessionId: string, isPinned: boolean): ProjectSession | null {
    return this.updateSession(userId, sessionId, { isPinned });
  }

  deleteSession(userId: string, sessionId: string) {
    const sessions = this.readSessions(userId).filter(s => s.sessionId !== sessionId);
    if (this.getActiveSessionId(userId) === sessionId) {
      this.setActiveSessionId(userId, sessions[0]?.sessionId || null);
    }
    this.writeSessions(userId, sessions);
  }
}

export const sessionStore = new SessionStore();
