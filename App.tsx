import React, { useState, useEffect } from 'react';
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
import { AppState, ProjectInput, GeneratedContent, User, SubscriptionTier, GenerationProgressState, GenerationPhase } from './types';
import { generateComprehensiveSpecPackage, downloadSpecsZip } from './services/specGeneratorService';
import { AgentGenerationViewport } from './components/AgentGenerationViewport';
import { authService } from './services/authService';
import { projectStore, SavedProjectRecord } from './services/projectStore';
import { saasStore } from './services/saasStore';

export default function App() {
  // Real persistent session
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [businessSettings, setBusinessSettings] = useState(() => saasStore.getBusinessSettings());

  const [appState, setAppStateState] = useState<AppState>(() => {
    const cur = authService.getCurrentUser();
    if (!cur) {
      try {
        sessionStorage.removeItem('srs_active_app_state');
        sessionStorage.removeItem('srs_admin_active_tab');
      } catch {}
      return AppState.LANDING;
    }
    try {
      const saved = sessionStorage.getItem('srs_active_app_state') as AppState;
      if (saved && Object.values(AppState).includes(saved)) {
        if (saved === AppState.ADMIN_CONSOLE && cur.role !== 'admin' && cur.role !== 'staff') {
          return AppState.DASHBOARD;
        }
        return saved;
      }
    } catch {}
    return AppState.DASHBOARD;
  });

  const setAppState = (nextState: AppState) => {
    setAppStateState(nextState);
    try {
      sessionStorage.setItem('srs_active_app_state', nextState);
    } catch {}
  };

  useEffect(() => {
    return saasStore.subscribe(() => {
      setBusinessSettings(saasStore.getBusinessSettings());
    });
  }, []);

  // Sync latest SaaS store settings (plans, business configs) on navigation and auth transitions
  useEffect(() => {
    saasStore.syncFromServer();
  }, [appState, user]);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('pro');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string>('My Project');
  const [error, setError] = useState<string | null>(null);

  const initialPhases: GenerationPhase[] = [
    { id: 'intake', name: 'Intake & Requirement Validation', description: 'Validate 15-section questionnaire', status: 'completed' },
    { id: 'drafting_plan', name: 'Master Project Plan Synthesis', description: 'Generate comprehensive draft', status: 'pending' },
    { id: 'compiling_specs', name: 'Multi-Tier .specs Hierarchy Compilation', description: '22 canonical files', status: 'pending' },
    { id: 'extracting_tasks', name: 'Dynamic Task Extraction & Dependencies', description: 'Formulate bespoke atomic tasks', status: 'pending' },
    { id: 'finalizing', name: 'Verification & Package Finalization', description: 'Package .specs suite for download and MCP', status: 'pending' }
  ];

  const [activeModelId, setActiveModelId] = useState<string>('gemini-2.5-flash');
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

  // Auth Handlers
  const handleOpenAuth = (mode: 'login' | 'register', plan?: SubscriptionTier) => {
    setAuthMode(mode);
    if (plan) setSelectedPlan(plan);
    setAppState(AppState.AUTH);
    setError(null);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppState(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    try {
      sessionStorage.removeItem('srs_active_app_state');
      sessionStorage.removeItem('srs_admin_active_tab');
    } catch {}
    setAppState(AppState.LANDING);
  };

  // Nav Handlers
  const handleStartNew = () => {
    if (!user) {
      handleOpenAuth('register', 'free');
      return;
    }
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

      if (proj.specsHierarchy && Object.keys(proj.specsHierarchy).length > 0) {
        setGeneratedContent({
          srsMarkdown: (proj.specsHierarchy['foundation/brief.md'] || '') + '\n\n' + (proj.specsHierarchy['architecture/system_design.md'] || ''),
          agentContext: proj.specsHierarchy['_index.md'] || '',
          implementationTasks: [
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
          specsHierarchy: proj.specsHierarchy,
          projectMeta: {
            projectName: proj.name,
            description: `Specification suite for ${proj.name}`,
            techStack: ['Node.js', 'PostgreSQL', 'React 19', 'Tailwind CSS'],
            timeline: (proj.formData?.['project_overview']?.['expected_timeline'] as string) || '3-4 months',
            budget: (proj.formData?.['project_overview']?.['budget_range'] as string) || '$25,000'
          }
        });
      } else {
        const pkg = await generateComprehensiveSpecPackage(proj);
        projectStore.saveFullProject(proj, pkg.specsHierarchy);
        setGeneratedContent(pkg);
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

    setGenerationProgress({
      phases: [
        { id: 'intake', name: 'Intake & Requirement Validation', description: 'Validate 15-section questionnaire', status: 'completed' },
        { id: 'drafting_plan', name: 'Master Project Plan Synthesis', description: 'Generate comprehensive draft', status: 'in_progress' },
        { id: 'extracting_tasks', name: 'Dynamic Task Extraction & Dependencies', description: 'Formulate bespoke atomic tasks', status: 'pending' },
        { id: 'compiling_specs', name: 'Multi-Tier .specs Hierarchy Compilation', description: '22 canonical files', status: 'pending' },
        { id: 'finalizing', name: 'Verification & Package Finalization', description: 'Package .specs suite for download and MCP', status: 'pending' }
      ],
      currentPhaseId: 'drafting_plan',
      logs: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          type: 'thought',
          title: 'Initializing Autonomous Spec Generator',
          content: `Ingested 15-section questionnaire for "${data.name}". Beginning Master Project Plan Draft synthesis.`
        }
      ],
      draftText: '',
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
            let currentPhaseId = prev.currentPhaseId;
            let filesCount = prev.filesGeneratedCount;
            let tasksCount = prev.tasksExtractedCount;
            let draftText = prev.draftText;

            if (logEntry.type === 'file_created') {
              filesCount = Math.min(22, filesCount + 1);
              currentPhaseId = 'compiling_specs';
            } else if (logEntry.type === 'task_extracted') {
              tasksCount = logEntry.meta?.taskCount || tasksCount;
              currentPhaseId = 'extracting_tasks';
            } else if (logEntry.type === 'draft_chunk' || (logEntry.type === 'thought' && logEntry.title?.toLowerCase().includes('draft'))) {
              currentPhaseId = 'drafting_plan';
              if (logEntry.content) {
                draftText = logEntry.content;
              }
            } else if (logEntry.title?.toLowerCase().includes('finaliz') || logEntry.title?.toLowerCase().includes('complete')) {
              currentPhaseId = 'finalizing';
            }

            const updatedPhases = prev.phases.map(p => {
              if (p.id === currentPhaseId) {
                return { ...p, status: 'in_progress' as const };
              }
              if (currentPhaseId === 'drafting_plan' && p.id === 'intake') {
                return { ...p, status: 'completed' as const };
              }
              if (currentPhaseId === 'extracting_tasks' && (p.id === 'intake' || p.id === 'drafting_plan')) {
                return { ...p, status: 'completed' as const };
              }
              if (currentPhaseId === 'compiling_specs' && (p.id === 'intake' || p.id === 'drafting_plan' || p.id === 'extracting_tasks')) {
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
              phases: updatedPhases
            };
          });
        }
      );

      // Persist real project to projectStore
      projectStore.saveFullProject(projectPayload, packageResult.specsHierarchy);
      setGeneratedContent(packageResult);

      setGenerationProgress(prev => ({
        ...prev,
        isComplete: true,
        currentPhaseId: 'finalizing',
        filesGeneratedCount: 22,
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

      <main className="flex-1 flex flex-col items-center justify-start relative z-10 w-full">
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
              onOpenMcpHub={() => setAppState(AppState.MCP_HUB)}
              onOpenAdmin={() => setAppState(AppState.ADMIN_CONSOLE)}
              onOpenSubscription={() => setAppState(AppState.BILLING)}
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
                onSubmit={handleFormSubmit}
                onBack={handleBackToDash}
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
                  downloadSpecsZip(generatedContent.specsHierarchy, activeProjectName || 'project');
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
              content={generatedContent}
              onReset={handleBackToDash}
              onOpenMcpHub={() => setAppState(AppState.MCP_HUB)}
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
      </main>
    </div>
  );
}
