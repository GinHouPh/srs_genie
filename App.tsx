import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { WizardForm } from './components/WizardForm';
import { DocumentPreview } from './components/DocumentPreview';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { AdminConsole } from './components/admin/AdminConsole';
import { McpHub } from './components/McpHub';
import { ClientBillingPage } from './components/ClientBillingPage';
import { UserProfilePage } from './components/UserProfilePage';
import { AppState, ProjectInput, GeneratedContent, User, SubscriptionTier, GenerationProgressState, GenerationPhase, GenerationPhaseId, ProjectSession, PreviewSessionState, SRSFormData } from './types';
import { generateComprehensiveSpecPackage, downloadSpecsZip } from './services/specGeneratorService';
import { AgentGenerationViewport } from './components/AgentGenerationViewport';
import { authService } from './services/authService';
import { projectStore, SavedProjectRecord } from './services/projectStore';
import { sessionStore } from './services/sessionStore';
import { saasStore } from './services/saasStore';
import { ShieldAlert } from 'lucide-react';
import { licenseService } from './services/licenseService';
import { LicenseActivationModal } from './components/LicenseActivationModal';
import { ProductActivationGate } from './components/ProductActivationGate';

function buildGeneratedContentFromProject(proj: SavedProjectRecord): GeneratedContent {
  return {
    srsMarkdown: (proj.specsHierarchy?.['foundation/brief.md'] || '') + '\n\n' + (proj.specsHierarchy?.['architecture/system_design.md'] || ''),
    agentContext: proj.specsHierarchy?.['_index.md'] || '',
    implementationTasks: (proj.vibeTasks && proj.vibeTasks.length > 0)
      ? proj.vibeTasks
      : [
          {
            id: 'TASK-001',
            title: 'Initialize Project Repository & Configuration',
            description: 'Base framework setup, linters, tsconfig, and containerization configs.',
            prompt: 'Initialize the repository using .specs/implementation/coding_standards.md and .specs/implementation/infrastructure.md.',
            type: 'setup',
            status: 'done',
            complexity: 'XS'
          },
          {
            id: 'TASK-002',
            title: 'Configure Database & Run Initial Migrations',
            description: 'Create database tables, indexes, triggers, and migrations from database_schema.md.',
            prompt: 'Execute SQL migrations specified in .specs/contracts/database_schema.md.',
            type: 'database',
            status: 'todo',
            complexity: 'S'
          },
          {
            id: 'TASK-003',
            title: 'Implement Authentication & RBAC Middleware',
            description: 'Build JWT registration, login, and permission verification guards.',
            prompt: 'Implement auth routes per .specs/contracts/api_contracts.md.',
            type: 'backend',
            status: 'todo',
            complexity: 'M'
          }
        ],
    specsHierarchy: proj.specsHierarchy || {},
    strategicPlans: proj.strategicPlans,
    projectMeta: {
      projectName: proj.name,
      description: `Specification suite for ${proj.name}`,
      techStack: ['Node.js', 'PostgreSQL', 'React 19', 'Tailwind CSS'],
      timeline: (proj.formData?.['project_overview']?.['expected_timeline'] as string) || '3-4 months',
      budget: (proj.formData?.['project_overview']?.['budget_range'] as string) || '$25,000'
    }
  };
}

export default function App() {
  // Real persistent session
  const [user, setUser] = useState<User | null>(() => {
    const cur = authService.getCurrentUser();
    if (cur) {
      sessionStore.migrateLegacyDraftIfNeeded(cur.id, cur.tenantId);
    }
    return cur;
  });
  const [businessSettings, setBusinessSettings] = useState(() => saasStore.getBusinessSettings());
  const [licenseInfo, setLicenseInfo] = useState(() => licenseService.getLicenseInfo());
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);

  const initialRestored = React.useMemo(() => {
    const cur = authService.getCurrentUser();
    if (!cur) return { appState: AppState.LANDING, session: null as ProjectSession | null, content: null as GeneratedContent | null, interrupted: null as ProjectSession | null };
    const active = sessionStore.getActiveSession(cur.id);
    if (!active) {
      try {
        const legacy = sessionStorage.getItem('srs_active_app_state') as AppState;
        if (legacy && Object.values(AppState).includes(legacy)) {
          if (legacy === AppState.ADMIN_CONSOLE && cur.role !== 'admin' && cur.role !== 'staff') {
            return { appState: AppState.DASHBOARD, session: null, content: null, interrupted: null };
          }
          if (legacy !== AppState.RESULT && legacy !== AppState.GENERATING) {
            return { appState: legacy, session: null, content: null, interrupted: null };
          }
        }
      } catch {}
      return { appState: AppState.DASHBOARD, session: null, content: null, interrupted: null };
    }

    if (active.appState === AppState.ADMIN_CONSOLE && cur.role !== 'admin' && cur.role !== 'staff') {
      return { appState: AppState.DASHBOARD, session: active, content: null, interrupted: null };
    }

    if (active.appState === AppState.GENERATING) {
      return { appState: AppState.DASHBOARD, session: active, content: null, interrupted: active };
    }

    if (active.appState === AppState.RESULT) {
      const all = projectStore.getAllProjects(cur);
      const matched =
        (active.projectId ? all.find(p => p.id === active.projectId) : undefined) ||
        all.find(p => p.name.trim().toLowerCase() === active.projectName.trim().toLowerCase());
      if (matched && matched.specsHierarchy && Object.keys(matched.specsHierarchy).length > 0) {
        return {
          appState: AppState.RESULT,
          session: active,
          content: buildGeneratedContentFromProject(matched),
          interrupted: null
        };
      }
      return { appState: AppState.DASHBOARD, session: active, content: null, interrupted: null };
    }

    if (active.appState === AppState.LANDING || active.appState === AppState.AUTH) {
      return { appState: AppState.DASHBOARD, session: active, content: null, interrupted: null };
    }

    return { appState: active.appState, session: active, content: null, interrupted: null };
  }, []);

  const [activeSession, setActiveSession] = useState<ProjectSession | null>(initialRestored.session);
  const [interruptedSession, setInterruptedSession] = useState<ProjectSession | null>(initialRestored.interrupted);
  const [sessionSavedAt, setSessionSavedAt] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(initialRestored.session?.projectId);

  const [appState, setAppStateState] = useState<AppState>(initialRestored.appState);

  const setAppState = useCallback((nextState: AppState) => {
    setAppStateState(nextState);
    try {
      sessionStorage.setItem('srs_active_app_state', nextState);
    } catch {}
    const curUser = authService.getCurrentUser();
    if (curUser && nextState !== AppState.LANDING && nextState !== AppState.AUTH) {
      const updated = sessionStore.upsertActiveSession(curUser.id, {
        appState: nextState,
        tenantId: curUser.tenantId
      });
      setActiveSession(updated);
    }
  }, []);

  useEffect(() => {
    return saasStore.subscribe(() => {
      setBusinessSettings(saasStore.getBusinessSettings());
    });
  }, []);

  useEffect(() => {
    return licenseService.subscribe(info => {
      setLicenseInfo(info);
    });
  }, []);

  // Sync latest SaaS store settings and projects on navigation and auth transitions
  useEffect(() => {
    saasStore.syncFromServer();
    projectStore.syncFromServer();
  }, [appState, user]);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('pro');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(initialRestored.content);
  const [activeProjectName, setActiveProjectName] = useState<string>(initialRestored.session?.projectName || 'My Project');
  const [error, setError] = useState<string | null>(null);

  const initialPhases: GenerationPhase[] = [
    { id: 'intake', name: 'Form Intake & Requirements Consolidation', description: 'Consolidate 15-section questionnaire', status: 'completed' },
    { id: 'strategic_planning', name: '9 Staging Plans Synthesis', description: 'Agent drafts Parent Project Plan, PRD, designs, architecture, tech specs, roadmap, risk, QA, deploy', status: 'pending' },
    { id: 'reading_specs', name: 'Reading .specs Architecture & Rules', description: 'Agent inspects multi-agent hierarchy, AGENTS.md & cascade rules', status: 'pending' },
    { id: 'updating_specs', name: 'Compiling 33 .specs & Multi-Agent Suite', description: 'Agent derives dynamic tasks, coordination manifests & updates canonical specs', status: 'pending' },
    { id: 'finalizing', name: 'Verification & Package Finalization', description: 'Package .specs suite for download and MCP', status: 'pending' }
  ];

  const [activeModelId, setActiveModelId] = useState<string>(initialRestored.session?.selectedModelId || 'gemini-2.5-flash');
  const [generationProgress, setGenerationProgress] = useState<GenerationProgressState>({
    phases: initialPhases,
    currentPhaseId: 'intake',
    logs: [],
    draftText: '',
    filesGeneratedCount: 0,
    tasksExtractedCount: 0,
    tokensStreamed: 28500,
    isComplete: false
  });

  // Subscribe to project store: automatically purge active memory specs when active project is deleted
  useEffect(() => {
    return projectStore.subscribe(() => {
      const all = projectStore.getAllProjects();
      if (activeProjectName) {
        const stillExists = all.some(p => p.name.trim().toLowerCase() === activeProjectName.trim().toLowerCase());
        if (!stillExists && generatedContent) {
          setGeneratedContent(null);
          setActiveProjectName('');
          if (appState === AppState.RESULT) {
            setAppState(AppState.DASHBOARD);
          }
        }
      }
    });
  }, [activeProjectName, generatedContent, appState]);

  const handleDeleteProject = (deletedId: string, deletedName: string) => {
    projectStore.deleteProject(deletedId);

    const isActiveProject =
      (activeProjectName && activeProjectName.trim().toLowerCase() === deletedName.trim().toLowerCase()) ||
      (generatedContent?.projectMeta?.projectName &&
        generatedContent.projectMeta.projectName.trim().toLowerCase() === deletedName.trim().toLowerCase());

    if (isActiveProject) {
      setGeneratedContent(null);
      setActiveProjectName('');
      setGenerationProgress({
        phases: initialPhases,
        currentPhaseId: 'intake',
        logs: [],
        draftText: '',
        filesGeneratedCount: 0,
        tasksExtractedCount: 0,
        tokensStreamed: 0,
        isComplete: false
      });
      if (appState === AppState.RESULT) {
        setAppState(AppState.DASHBOARD);
      }
    }
  };

  // Warn before closing tab during active generation or unsaved editor changes
  useEffect(() => {
    const hasUnsavedEdits = Boolean(
      appState === AppState.RESULT &&
      activeSession?.previewState?.unsavedEdits &&
      Object.keys(activeSession.previewState.unsavedEdits).length > 0
    );
    const isActivelyGenerating = appState === AppState.GENERATING && !generationProgress.isComplete;

    if (!hasUnsavedEdits && !isActivelyGenerating) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [appState, generationProgress.isComplete, activeSession]);

  // Auth Handlers
  const handleOpenAuth = (mode: 'login' | 'register', plan?: SubscriptionTier) => {
    setAuthMode(mode);
    if (plan) setSelectedPlan(plan);
    setAppState(AppState.AUTH);
    setError(null);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    sessionStore.migrateLegacyDraftIfNeeded(loggedInUser.id, loggedInUser.tenantId);
    const existing = sessionStore.getActiveSession(loggedInUser.id);
    setActiveSession(existing);
    setAppState(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveSession(null);
    setInterruptedSession(null);
    try {
      sessionStorage.removeItem('srs_active_app_state');
      sessionStorage.removeItem('srs_admin_active_tab');
    } catch {}
    setAppStateState(AppState.LANDING);
  };

  // Session Handlers
  const handleManualSaveSession = useCallback(() => {
    if (!user) return;
    const saved = sessionStore.upsertActiveSession(user.id, {
      appState,
      tenantId: user.tenantId,
      projectId: activeProjectId,
      projectName: activeProjectName || 'Untitled Project',
      selectedModelId: activeModelId,
      isPinned: true
    });
    setActiveSession(saved);
    setSessionSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [user, appState, activeProjectId, activeProjectName, activeModelId]);

  const handleWizardSessionChange = useCallback(
    (patch: { formData: SRSFormData; selectedModelId: string; wizardStep: number; projectName: string }) => {
      if (!user) return;
      const updated = sessionStore.upsertActiveSession(user.id, {
        appState: AppState.WIZARD,
        tenantId: user.tenantId,
        projectName: patch.projectName,
        selectedModelId: patch.selectedModelId,
        wizardStep: patch.wizardStep,
        formData: patch.formData
      });
      setActiveSession(updated);
      setActiveProjectName(patch.projectName);
      setActiveModelId(patch.selectedModelId);
    },
    [user]
  );

  const handlePreviewStateChange = useCallback(
    (previewState: PreviewSessionState) => {
      if (!user) return;
      const updated = sessionStore.upsertActiveSession(user.id, {
        appState: AppState.RESULT,
        tenantId: user.tenantId,
        projectId: activeProjectId,
        projectName: activeProjectName || 'My Project',
        selectedModelId: activeModelId,
        previewState
      });
      setActiveSession(updated);
    },
    [user, activeProjectId, activeProjectName, activeModelId]
  );

  const handleResumeSession = useCallback(
    async (sess: ProjectSession) => {
      if (!user) return;
      sessionStore.setActiveSessionId(user.id, sess.sessionId);
      setActiveSession(sess);
      setActiveProjectName(sess.projectName || 'My Project');
      setActiveProjectId(sess.projectId);
      setActiveModelId(sess.selectedModelId || 'gemini-2.5-flash');
      setError(null);

      if (sess.appState === AppState.RESULT) {
        const all = projectStore.getAllProjects(user);
        const matched =
          (sess.projectId ? all.find(p => p.id === sess.projectId) : undefined) ||
          all.find(p => p.name.trim().toLowerCase() === sess.projectName.trim().toLowerCase());
        if (matched && matched.specsHierarchy && Object.keys(matched.specsHierarchy).length > 0) {
          setGeneratedContent(buildGeneratedContentFromProject(matched));
          setAppState(AppState.RESULT);
          return;
        }
      }

      if (sess.appState === AppState.GENERATING) {
        setInterruptedSession(sess);
        setAppState(AppState.DASHBOARD);
        return;
      }

      setAppState(sess.appState || AppState.WIZARD);
    },
    [user, setAppState]
  );

  // Nav Handlers
  const handleStartNew = () => {
    if (!user) {
      handleOpenAuth('register', 'free');
      return;
    }
    const fresh = sessionStore.createSession(user.id, {
      appState: AppState.WIZARD,
      tenantId: user.tenantId,
      projectName: 'Untitled Project',
      selectedModelId: activeModelId,
      wizardStep: 0
    });
    setActiveSession(fresh);
    setActiveProjectId(undefined);
    setActiveProjectName('Untitled Project');
    setAppState(AppState.WIZARD);
    setError(null);
  };

  const handleBackToDash = () => {
    if (!user) {
      setAppState(AppState.LANDING);
    } else {
      setAppState(AppState.DASHBOARD);
    }
    setError(null);
  };

  const handleSelectExistingProject = async (proj: SavedProjectRecord) => {
    setAppState(AppState.GENERATING);
    try {
      setActiveProjectName(proj.name);
      setActiveProjectId(proj.id);

      if (proj.specsHierarchy && Object.keys(proj.specsHierarchy).length > 0) {
        setGeneratedContent(buildGeneratedContentFromProject(proj));
      } else {
        const pkg = await generateComprehensiveSpecPackage(proj);
        projectStore.saveFullProject(proj, pkg.specsHierarchy, user, pkg.strategicPlans, pkg.implementationTasks);
        setGeneratedContent(pkg);
      }
      if (user) {
        const existingSess = sessionStore
          .getSessions(user.id)
          .find(s => s.projectId === proj.id || (s.projectName === proj.name && s.appState === AppState.RESULT));
        if (existingSess) {
          sessionStore.setActiveSessionId(user.id, existingSess.sessionId);
          const updated = sessionStore.updateSession(user.id, existingSess.sessionId, {
            appState: AppState.RESULT,
            projectId: proj.id,
            projectName: proj.name
          });
          setActiveSession(updated);
        } else {
          const created = sessionStore.createSession(user.id, {
            appState: AppState.RESULT,
            tenantId: user.tenantId,
            projectId: proj.id,
            projectName: proj.name,
            selectedModelId: activeModelId
          });
          setActiveSession(created);
        }
      }
      setAppState(AppState.RESULT);
    } catch (err: any) {
      setError(err?.message || 'Failed to load project specs.');
      setAppState(AppState.DASHBOARD);
    }
  };

  // Generation Handler for comprehensive .specs
  const handleFormSubmit = async (data: ProjectInput, selectedModelId?: string) => {
    if (!user) {
      handleOpenAuth('register');
      return;
    }

    const chosenModel = selectedModelId || 'gemini-2.5-flash';
    setActiveModelId(chosenModel);
    setAppState(AppState.GENERATING);
    setActiveProjectName(data.name);
    setActiveProjectId(data.id);

    const genSession = sessionStore.upsertActiveSession(user.id, {
      appState: AppState.GENERATING,
      tenantId: user.tenantId,
      projectId: data.id,
      projectName: data.name,
      selectedModelId: chosenModel,
      formData: data.formData,
      generationCheckpoint: {
        currentPhaseId: 'strategic_planning',
        completedPhases: ['intake'],
        filesGeneratedCount: 0,
        tasksExtractedCount: 0,
        wasInterrupted: true,
        lastUpdatedAt: new Date().toISOString()
      }
    });
    setActiveSession(genSession);

    setGenerationProgress({
      phases: [
        { id: 'intake', name: 'Form Intake & Requirements Consolidation', description: 'Consolidate 15-section questionnaire', status: 'completed' },
        { id: 'strategic_planning', name: '9 Staging Plans Synthesis', description: 'Agent drafts Parent Project Plan, PRD, designs, architecture, tech specs, roadmap, risk, QA, deploy', status: 'in_progress' },
        { id: 'reading_specs', name: 'Reading .specs Architecture & Rules', description: 'Agent inspects multi-agent hierarchy, AGENTS.md & cascade rules', status: 'pending' },
        { id: 'updating_specs', name: 'Compiling 33 .specs & Multi-Agent Suite', description: 'Agent derives dynamic tasks, coordination manifests & updates canonical specs', status: 'pending' },
        { id: 'finalizing', name: 'Verification & Package Finalization', description: 'Package .specs suite for download and MCP', status: 'pending' }
      ],
      currentPhaseId: 'strategic_planning',
      logs: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'thought',
          title: 'Initializing SpecAgent Micro-Agent',
          content: `Ingested 15-section questionnaire for "${data.name}". Beginning 8 Staging Planning Documents synthesis.`
        }
      ],
      draftText: '',
      strategicPlans: {},
      filesGeneratedCount: 0,
      tasksExtractedCount: 0,
      tokensStreamed: 28500,
      isComplete: false
    });

    try {
      // Associate with current user
      const projectPayload = {
        ...data,
        userId: user.id
      };

      const packageResult = await generateComprehensiveSpecPackage(
        projectPayload,
        chosenModel,
        (logEntry) => {
          setGenerationProgress(prev => {
            const nextLogs = [...prev.logs, logEntry];
            let currentPhaseId: GenerationPhaseId = prev.currentPhaseId;
            let filesCount = prev.filesGeneratedCount;
            let tasksCount = prev.tasksExtractedCount;
            let draftText = prev.draftText;
            const nextPlans = { ...(prev.strategicPlans || {}) };

            if (logEntry.type === 'draft_chunk' && logEntry.meta?.file) {
              nextPlans[logEntry.meta.file] = logEntry.content;
            }

            if (logEntry.type === 'file_created') {
              filesCount = filesCount + 1;
              currentPhaseId = 'updating_specs';
            } else if (logEntry.type === 'task_extracted') {
              tasksCount = logEntry.meta?.taskCount || tasksCount;
              currentPhaseId = 'updating_specs';
            } else if (logEntry.title?.toLowerCase().includes('reading .specs') || logEntry.title?.toLowerCase().includes('dependency dag')) {
              currentPhaseId = 'reading_specs';
            } else if (logEntry.type === 'draft_chunk' || (logEntry.type === 'thought' && logEntry.title?.toLowerCase().includes('plan'))) {
              if (logEntry.type === 'draft_chunk') {
                draftText = logEntry.content;
              }
            } else if (logEntry.title?.toLowerCase().includes('finaliz') || logEntry.title?.toLowerCase().includes('complete')) {
              currentPhaseId = 'finalizing';
            }

            const updatedPhases = prev.phases.map(p => {
              if (p.id === currentPhaseId) {
                return { ...p, status: 'in_progress' as const };
              }
              if (currentPhaseId === 'reading_specs' && (p.id === 'intake' || p.id === 'strategic_planning')) {
                return { ...p, status: 'completed' as const };
              }
              if (currentPhaseId === 'updating_specs' && (p.id === 'intake' || p.id === 'strategic_planning' || p.id === 'reading_specs')) {
                return { ...p, status: 'completed' as const };
              }
              if (currentPhaseId === 'finalizing') {
                return { ...p, status: 'completed' as const };
              }
              return p;
            });

            return {
              ...prev,
              logs: nextLogs,
              currentPhaseId,
              filesGeneratedCount: filesCount,
              tasksExtractedCount: tasksCount,
              draftText: draftText || prev.draftText,
              strategicPlans: nextPlans,
              phases: updatedPhases
            };
          });
        }
      );

      // Persist real project to projectStore with full specs, all 9 strategic planning documents, and extracted vibeTasks
      const savedProj = projectStore.saveFullProject(
        projectPayload,
        packageResult.specsHierarchy,
        user,
        packageResult.strategicPlans,
        packageResult.implementationTasks
      );
      setActiveProjectId(savedProj.id);
      setGeneratedContent(packageResult);

      const completedSess = sessionStore.upsertActiveSession(user.id, {
        appState: AppState.RESULT,
        tenantId: user.tenantId,
        projectId: savedProj.id,
        projectName: savedProj.name,
        selectedModelId: chosenModel,
        generationCheckpoint: {
          currentPhaseId: 'finalizing',
          completedPhases: ['intake', 'strategic_planning', 'reading_specs', 'updating_specs', 'finalizing'],
          filesGeneratedCount: Object.keys(packageResult.specsHierarchy || {}).length || 33,
          tasksExtractedCount: packageResult.implementationTasks.length,
          wasInterrupted: false,
          lastUpdatedAt: new Date().toISOString()
        }
      });
      setActiveSession(completedSess);
      setInterruptedSession(null);

      setGenerationProgress(prev => ({
        ...prev,
        isComplete: true,
        currentPhaseId: 'finalizing',
        strategicPlans: packageResult.strategicPlans || prev.strategicPlans,
        filesGeneratedCount: Object.keys(packageResult.specsHierarchy || {}).length || 33,
        tasksExtractedCount: packageResult.implementationTasks.length,
        phases: prev.phases.map(p => ({ ...p, status: 'completed' as const }))
      }));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate content. Please try again.');
      setAppState(AppState.WIZARD);
    }
  };

  const handlePlanUpdated = (newPlan: SubscriptionTier) => {
    if (user) {
      setUser({ ...user, plan: newPlan });
    }
  };

  const isAnnouncementVisible =
    Boolean(businessSettings.showAnnouncementBanner) &&
    Boolean(businessSettings.announcementBannerText) &&
    user?.role !== 'admin' &&
    user?.role !== 'staff' &&
    appState !== AppState.ADMIN_CONSOLE;

  return (
    <div className="min-h-screen bg-ink flex flex-col pt-16 relative overflow-hidden font-body text-body selection:bg-accent selection:text-white">
      {/* Background Architectural Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '4rem 4rem'
      }} />

      <Header
        user={user}
        currentAppState={appState}
        onLogout={handleLogout}
        onNavigateToAdmin={() => {
          if (user?.role === 'admin' || user?.role === 'staff') {
            setAppState(AppState.ADMIN_CONSOLE);
          } else {
            setError('Access Denied: The Admin Console is restricted to Business Owners and Staff.');
          }
        }}
        onNavigateToMcp={() => setAppState(AppState.MCP_HUB)}
        onNavigateToDashboard={() => {
          if (user) setAppState(AppState.DASHBOARD);
          else setAppState(AppState.LANDING);
        }}
        onNavigateToLanding={() => setAppState(AppState.LANDING)}
        onOpenClientSubscription={() => setAppState(AppState.BILLING)}
        onNavigateToProfile={() => setAppState(AppState.PROFILE)}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onSaveSession={handleManualSaveSession}
        sessionSavedAt={sessionSavedAt}
      />

      {/* Global Business Announcement Banner (Hidden for Admin & Staff & Admin Console) */}
      {isAnnouncementVisible && (
        <div className="w-full bg-accent/90 text-white py-2 px-4 text-xs font-display uppercase tracking-wider flex items-center justify-center gap-2 relative z-40 border-b border-accent/40 shadow-sm">
          <span className="font-semibold">{businessSettings.announcementBannerText}</span>
        </div>
      )}

      {/* Maintenance Mode Notice if active */}
      {businessSettings.maintenanceMode && (
        <div className="w-full bg-amber-500 text-ink py-2 px-4 text-xs font-display uppercase tracking-wider font-bold flex items-center justify-center gap-2 relative z-40">
          <span>⚠️ Maintenance Mode Active: Public account registrations are temporarily paused for platform upgrades.</span>
        </div>
      )}

      {/* Unlicensed Installation Notice Banner (Shown on live domain if not activated) */}
      {!licenseInfo.isLicensed && !licenseInfo.isLocal && (
        <div className="w-full bg-accent text-white py-2 px-4 text-xs font-display flex flex-col sm:flex-row items-center justify-between gap-2 relative z-40 border-b border-accent/60 shadow-md">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              <strong>UNLICENSED INSTALLATION:</strong> SRS Genie is running in unverified mode on this host. Activate your Envato Purchase Code or Agape License Key to ensure uninterrupted spec synthesis.
            </span>
          </div>
          <button
            onClick={() => setShowLicenseModal(true)}
            className="btn btn-xs bg-white text-ink hover:bg-white/90 uppercase tracking-wider text-[10px] px-3 py-1 font-semibold whitespace-nowrap"
          >
            Activate License
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-start relative z-10 w-full">
        {/* If the installation is unactivated, hard-lock the application behind ProductActivationGate */}
        {!licenseInfo.isLicensed ? (
          <ProductActivationGate
            onActivationSuccess={() => {
              licenseService.fetchLicenseStatus();
            }}
          />
        ) : (
          <>
            {/* Interrupted Generation Recovery Banner */}
            {interruptedSession && appState === AppState.DASHBOARD && user && (
              <div className="w-full max-w-5xl mx-auto mt-4 px-4">
                <div className="p-4 border border-amber-500/50 bg-amber-500/10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-display text-xs uppercase tracking-[0.14em] text-amber-400 font-semibold">
                      Interrupted Generation Detected
                    </div>
                    <p className="font-body text-xs text-muted mt-1">
                      Spec synthesis for <strong className="text-white">{interruptedSession.projectName}</strong> was interrupted when the tab closed. Your questionnaire answers were preserved.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {interruptedSession.formData && (
                      <button
                        onClick={() => {
                          const projInput: ProjectInput = {
                            id: interruptedSession.projectId || `proj_${Date.now()}`,
                            name: interruptedSession.projectName,
                            version: '1.0.0',
                            lastModified: new Date(),
                            status: 'draft',
                            formData: interruptedSession.formData!,
                            tenantId: user.tenantId,
                            userId: user.id
                          };
                          setInterruptedSession(null);
                          handleFormSubmit(projInput, interruptedSession.selectedModelId);
                        }}
                        className="btn btn-sm btn--accent"
                      >
                        Re-run Generation
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const target = interruptedSession;
                        setInterruptedSession(null);
                        sessionStore.updateSession(user.id, target.sessionId, { appState: AppState.WIZARD });
                        handleResumeSession({ ...target, appState: AppState.WIZARD });
                      }}
                      className="btn btn-sm btn--ghost"
                    >
                      Edit Form
                    </button>
                    <button
                      onClick={() => setInterruptedSession(null)}
                      className="font-display text-[11px] uppercase tracking-wider text-muted hover:text-white px-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error notification banner if any */}
            {error && (
              <div className="w-full max-w-4xl mx-auto my-4 p-4 border-l-2 border-accent bg-box border border-line text-white text-xs flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="font-display uppercase tracking-[0.1em] text-accent hover:text-white text-xs ml-4">
                  Dismiss
                </button>
              </div>
            )}

            {/* State: Storefront Landing Page (Public default for visitors) */}
            {appState === AppState.LANDING && (
              <LandingPage
            onStartFree={() => handleOpenAuth('register', 'free')}
            onSignIn={() => handleOpenAuth('login')}
            onSelectPlan={(planId) => handleOpenAuth('register', planId)}
          />
        )}

        {/* State: Auth (Sign In / Register) */}
        {appState === AppState.AUTH && (
          <div className="w-full animate-in fade-in duration-500 py-12">
            <Auth
              onLogin={handleLogin}
              initialMode={authMode}
              initialPlan={selectedPlan}
              onCancel={() => setAppState(AppState.LANDING)}
            />
          </div>
        )}

        {/* State: Dashboard (Strictly requires login) */}
        {appState === AppState.DASHBOARD && user && (
          <div className="w-full animate-in fade-in duration-500">
            <Dashboard
              user={user}
              onNewProject={handleStartNew}
              onSelectProject={handleSelectExistingProject}
              onDeleteProject={handleDeleteProject}
              onOpenMcpHub={() => setAppState(AppState.MCP_HUB)}
              onOpenAdmin={() => setAppState(AppState.ADMIN_CONSOLE)}
              onOpenSubscription={() => setAppState(AppState.BILLING)}
              onResumeSession={handleResumeSession}
            />
          </div>
        )}

        {/* State: SaaS Admin Console (Restricted to Business Owner & Staff) */}
        {appState === AppState.ADMIN_CONSOLE && (
          <div className="w-full animate-in fade-in duration-500">
            {user?.role === 'admin' || user?.role === 'staff' ? (
              <AdminConsole onBackToDashboard={handleBackToDash} />
            ) : (
              <div className="p-10 agape-card max-w-md mx-auto text-center my-12">
                <div className="eyebrow mb-2">Restricted Access</div>
                <h3 className="font-display text-xl font-semibold text-white uppercase tracking-[0.06em] mb-2">
                  Access Restricted
                </h3>
                <p className="font-body text-xs text-muted mb-6">
                  The Admin Console is reserved exclusively for the Business Owner and authorized Staff members.
                </p>
                <button
                  onClick={handleBackToDash}
                  className="btn btn-sm btn--accent"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* State: MCP Agent Live Hub */}
        {appState === AppState.MCP_HUB && (
          <div className="w-full animate-in fade-in duration-500">
            <McpHub
              currentSpecs={generatedContent?.specsHierarchy || {}}
              strategicPlans={generatedContent?.strategicPlans}
              projectName={activeProjectName}
              onBack={handleBackToDash}
            />
          </div>
        )}

        {/* State: Wizard Form (Strictly requires login) */}
        {appState === AppState.WIZARD && (
          user ? (
            <div className="w-full animate-in fade-in duration-500">
              <WizardForm
                key={activeSession?.sessionId || 'wizard_default'}
                onSubmit={handleFormSubmit}
                onBack={handleBackToDash}
                initialSession={activeSession}
                onSessionChange={handleWizardSessionChange}
              />
            </div>
          ) : (
            <div className="p-10 agape-card max-w-md mx-auto text-center my-12">
              <div className="eyebrow mb-2">Account Required</div>
              <h3 className="font-display text-xl font-semibold text-white uppercase tracking-[0.06em] mb-2">
                Sign In to Create Specifications
              </h3>
              <p className="font-body text-xs text-muted mb-6">
                Please create a free client account or sign in to build and save 6-tier .specs packages.
              </p>
              <button
                onClick={() => handleOpenAuth('register')}
                className="btn btn-sm btn--accent"
              >
                Create Free Account
              </button>
            </div>
          )
        )}

        {/* State: Generating Viewport */}
        {appState === AppState.GENERATING && (
          <div className="w-full animate-in fade-in duration-500">
            <AgentGenerationViewport
              projectName={activeProjectName || 'Project'}
              selectedModelName={saasStore.getAvailableModels().find(m => m.id === activeModelId)?.name || 'Gemini 2.5 Flash'}
              progressState={generationProgress}
              onExploreSpecs={() => setAppState(AppState.RESULT)}
              onDownloadZip={() => {
                if (generatedContent?.specsHierarchy) {
                  downloadSpecsZip(generatedContent.specsHierarchy, activeProjectName || 'project', generatedContent.strategicPlans);
                }
              }}
              onOpenMcpHub={() => setAppState(AppState.MCP_HUB)}
              onCancel={() => setAppState(AppState.WIZARD)}
            />
          </div>
        )}

        {/* State: Result & Downloadable .specs */}
        {appState === AppState.RESULT && generatedContent && (
          <div className="w-full animate-in fade-in duration-700">
            <DocumentPreview
              key={activeSession?.sessionId || activeProjectName}
              content={generatedContent}
              onReset={handleBackToDash}
              onOpenMcpHub={() => setAppState(AppState.MCP_HUB)}
              onDeleteProject={handleDeleteProject}
              initialPreviewState={activeSession?.previewState}
              onPreviewStateChange={handlePreviewStateChange}
            />
          </div>
        )}

        {/* State: Client Billing & Subscriptions Page (Pure Page) */}
        {appState === AppState.BILLING && user && (
          <div className="w-full animate-in fade-in duration-500">
            <ClientBillingPage
              user={user}
              onBack={handleBackToDash}
              onPlanUpdated={handlePlanUpdated}
              onNavigateToAdmin={() => setAppState(AppState.ADMIN_CONSOLE)}
            />
          </div>
        )}

        {/* State: User Profile Page */}
        {appState === AppState.PROFILE && user && (
          <div className="w-full animate-in fade-in duration-500">
            <UserProfilePage
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onNavigateToDashboard={handleBackToDash}
              onNavigateToBilling={() => setAppState(AppState.BILLING)}
              onOpenProject={(proj) => handleSelectExistingProject(proj)}
              onLogout={handleLogout}
            />
          </div>
        )}
          </>
        )}
      </main>

      {/* Floating License Activation Modal */}
      <LicenseActivationModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        isMandatory={!licenseInfo.isLicensed}
        onSuccess={() => {
          licenseService.fetchLicenseStatus();
        }}
      />
    </div>
  );
}
