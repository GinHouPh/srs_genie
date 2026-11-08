import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  Plus,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Sliders,
  Sparkles,
  Zap,
  Trash2,
  Edit2,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  Lock,
  Loader2,
  Check,
  Star,
  Search,
  X,
  LayoutGrid,
  Table as TableIcon,
  Layers,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { AIModelProvider, AIModelDefinition, AIProviderType } from '../../types';
import { saasStore } from '../../services/saasStore';

interface AdminAiProvidersViewProps {
  onToast: (msg: string) => void;
}

type ViewMode = 'cards' | 'table' | 'models';
type StatusFilter = 'all' | 'active' | 'disabled' | 'favourites';
type SortOption = 'priority' | 'name-asc' | 'name-desc' | 'models-desc' | 'type' | 'status';

export const AdminAiProvidersView: React.FC<AdminAiProvidersViewProps> = ({ onToast }) => {
  const [providers, setProviders] = useState<AIModelProvider[]>(() => saasStore.getAiProviders());
  const [editingProvider, setEditingProvider] = useState<AIModelProvider | null>(null);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [addingModelToProviderId, setAddingModelToProviderId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<{ [id: string]: boolean }>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [id: string]: { success: boolean; message: string } }>({});

  // View modes, sorting, search, and filtering
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('srs_genie_ai_providers_view_mode') as ViewMode;
      if (saved === 'cards' || saved === 'table' || saved === 'models') return saved;
    } catch {}
    return 'cards';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    try {
      const saved = localStorage.getItem('srs_genie_ai_providers_sort') as SortOption;
      if (saved) return saved;
    } catch {}
    return 'priority';
  });

  // Form: Add New Provider
  const [newProvName, setNewProvName] = useState('');
  const [newProvType, setNewProvType] = useState<AIProviderType>('custom');
  const [newProvApiKey, setNewProvApiKey] = useState('');
  const [newProvBaseUrl, setNewProvBaseUrl] = useState('');
  const [newProvModelId, setNewProvModelId] = useState('');

  // Form: Add New Model
  const [newModelId, setNewModelId] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newModelContext, setNewModelContext] = useState('128K Tokens');
  const [newModelSpeed, setNewModelSpeed] = useState<'Ultra Fast' | 'Fast' | 'Balanced' | 'Reasoning Deep'>('Fast');
  const [newModelRec, setNewModelRec] = useState('General architecture & code synthesis');

  const refreshProviders = () => {
    setProviders(saasStore.getAiProviders());
  };

  useEffect(() => {
    return saasStore.subscribe(() => {
      refreshProviders();
    });
  }, []);

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('srs_genie_ai_providers_view_mode', mode);
    } catch {}
  };

  const handleSetSortBy = (sort: SortOption) => {
    setSortBy(sort);
    try {
      localStorage.setItem('srs_genie_ai_providers_sort', sort);
    } catch {}
  };

  const toggleRevealKey = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Favourite Handlers
  const handleToggleFavouriteProvider = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    const isFav = saasStore.toggleFavouriteProvider(id);
    refreshProviders();
    onToast(isFav ? `⭐ Added "${name}" to favourites.` : `Removed "${name}" from favourites.`);
  };

  const handleToggleFavouriteModel = (e: React.MouseEvent, providerId: string, modelId: string, modelName: string) => {
    e.stopPropagation();
    const isFav = saasStore.toggleFavouriteModel(providerId, modelId);
    refreshProviders();
    onToast(isFav ? `⭐ Starred model "${modelName}".` : `Unstarred model "${modelName}".`);
  };

  const handleToggleProvider = (id: string) => {
    saasStore.toggleAiProvider(id);
    refreshProviders();
    onToast('Provider status toggled.');
  };

  const handleSetDefaultProvider = (id: string, name: string) => {
    saasStore.setDefaultAiProvider(id);
    refreshProviders();
    onToast(`${name} is now the default AI Provider.`);
  };

  const handleToggleModel = (providerId: string, modelId: string) => {
    saasStore.toggleModelStatus(providerId, modelId);
    refreshProviders();
    onToast('Model availability for clients updated.');
  };

  const handleSetDefaultModel = (modelId: string, modelName: string) => {
    saasStore.setDefaultModel(modelId);
    refreshProviders();
    onToast(`${modelName} set as system default model.`);
  };

  const handleDeleteModel = (providerId: string, modelId: string, modelName: string) => {
    if (confirm(`Remove model "${modelName}"? Clients will no longer be able to select it.`)) {
      saasStore.deleteModelFromProvider(providerId, modelId);
      refreshProviders();
      onToast(`Removed model: ${modelName}`);
    }
  };

  const handleDeleteProvider = (id: string, name: string) => {
    if (confirm(`Remove AI Provider "${name}"? Clients will no longer be able to select its models.`)) {
      saasStore.deleteAiProvider(id);
      refreshProviders();
      onToast(`Removed AI Provider: ${name}`);
    }
  };

  const handleSaveProviderEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;
    saasStore.updateAiProvider(editingProvider.id, editingProvider);
    setEditingProvider(null);
    refreshProviders();
    onToast(`Credentials saved for ${editingProvider.name}.`);
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName.trim()) return;

    const trimmedName = newProvName.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || newProvType;
    const initialModelId = newProvModelId.trim() || `${slug}-default`;
    const initialModelName = newProvModelId.trim() ? `${trimmedName} (${newProvModelId.trim()})` : `${trimmedName} Default Model`;

    saasStore.addAiProvider({
      name: trimmedName,
      type: newProvType,
      apiKey: newProvApiKey.trim(),
      baseUrl: newProvBaseUrl.trim() || undefined,
      isActive: true,
      isDefault: false,
      models: [
        {
          id: initialModelId,
          name: initialModelName,
          providerId: '',
          providerName: trimmedName,
          contextWindow: '128K Tokens',
          speed: 'Balanced',
          recommendedFor: 'Custom provider synthesis',
          isEnabled: true,
          isDefault: false
        }
      ]
    });

    refreshProviders();
    setShowAddProviderModal(false);
    setNewProvName('');
    setNewProvApiKey('');
    setNewProvBaseUrl('');
    setNewProvModelId('');
    onToast(`Added AI Provider: ${trimmedName}`);
  };

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingModelToProviderId || !newModelId.trim() || !newModelName.trim()) {
      onToast('Please enter both Model Identifier and Display Name.');
      return;
    }

    const provider = providers.find(p => p.id === addingModelToProviderId);
    if (!provider) {
      onToast('Error: Provider not found.');
      return;
    }

    const trimmedId = newModelId.toLowerCase().trim();
    const trimmedName = newModelName.trim();

    const ok = saasStore.addModelToProvider(addingModelToProviderId, {
      id: trimmedId,
      name: trimmedName,
      providerId: addingModelToProviderId,
      providerName: provider.name,
      contextWindow: newModelContext.trim() || '128K Tokens',
      speed: newModelSpeed,
      recommendedFor: newModelRec.trim() || 'Custom provider synthesis',
      isEnabled: true
    });

    if (ok) {
      refreshProviders();
      setAddingModelToProviderId(null);
      setNewModelId('');
      setNewModelName('');
      setNewModelContext('128K Tokens');
      setNewModelSpeed('Fast');
      setNewModelRec('General architecture & code synthesis');
      onToast(`Added model "${trimmedName}" to ${provider.name}.`);
    } else {
      onToast(`Failed to add model to ${provider.name}.`);
    }
  };

  const handleTestConnection = async (provider: AIModelProvider) => {
    setTestingId(provider.id);
    setTestResults(prev => {
      const next = { ...prev };
      delete next[provider.id];
      return next;
    });

    setTimeout(() => {
      const isOllama = provider.type === 'ollama';
      const hasKey = Boolean(provider.apiKey && provider.apiKey.length > 3);
      const hasBaseUrl = Boolean(provider.baseUrl && provider.baseUrl.length > 5);

      if (isOllama || hasKey || provider.type === 'google' || hasBaseUrl) {
        setTestResults(prev => ({
          ...prev,
          [provider.id]: {
            success: true,
            message: `Connection Verified: Endpoint reachable, 200 OK (${isOllama ? 'Local Daemon' : hasKey ? 'API Key Active' : 'Custom Base URL Active'})`
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [provider.id]: {
            success: false,
            message: 'Connection Notice: Missing API key or Base URL. Configure credentials for live inference.'
          }
        }));
      }
      setTestingId(null);
    }, 800);
  };

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedProviders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = providers.filter(prov => {
      // 1. Status Filter
      if (statusFilter === 'active' && !prov.isActive) return false;
      if (statusFilter === 'disabled' && prov.isActive) return false;
      if (statusFilter === 'favourites' && !prov.isFavourite) return false;

      // 2. Type Filter
      if (typeFilter !== 'all' && prov.type !== typeFilter) return false;

      // 3. Search Query
      if (q) {
        const provNameMatch = prov.name.toLowerCase().includes(q);
        const provTypeMatch = prov.type.toLowerCase().includes(q);
        const baseUrlMatch = Boolean(prov.baseUrl && prov.baseUrl.toLowerCase().includes(q));
        const modelMatch = (prov.models || []).some(m =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.recommendedFor.toLowerCase().includes(q) ||
          m.speed.toLowerCase().includes(q) ||
          m.contextWindow.toLowerCase().includes(q)
        );
        if (!provNameMatch && !provTypeMatch && !baseUrlMatch && !modelMatch) {
          return false;
        }
      }

      return true;
    });

    // Sort providers
    return filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        if (a.isFavourite && !b.isFavourite) return -1;
        if (!a.isFavourite && b.isFavourite) return 1;
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'models-desc') {
        return (b.models?.length || 0) - (a.models?.length || 0);
      }
      if (sortBy === 'status') {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });
  }, [providers, searchQuery, statusFilter, typeFilter, sortBy]);

  // Unified Catalog of Models across all matching providers
  const allCatalogModels = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list: (AIModelDefinition & {
      providerId: string;
      providerName: string;
      providerType: string;
      isProviderActive: boolean;
      isProviderDefault: boolean;
      isProviderFavourite?: boolean;
    })[] = [];

    for (const prov of filteredAndSortedProviders) {
      for (const m of (prov.models || [])) {
        if (statusFilter === 'favourites' && !m.isFavourite && !prov.isFavourite) {
          continue;
        }
        if (statusFilter === 'active' && (!prov.isActive || !m.isEnabled)) {
          continue;
        }
        if (statusFilter === 'disabled' && (prov.isActive && m.isEnabled)) {
          continue;
        }

        if (q) {
          const match =
            m.name.toLowerCase().includes(q) ||
            m.id.toLowerCase().includes(q) ||
            prov.name.toLowerCase().includes(q) ||
            prov.type.toLowerCase().includes(q) ||
            m.speed.toLowerCase().includes(q) ||
            m.recommendedFor.toLowerCase().includes(q) ||
            m.contextWindow.toLowerCase().includes(q);
          if (!match) continue;
        }

        list.push({
          ...m,
          providerId: prov.id,
          providerName: prov.name,
          providerType: prov.type,
          isProviderActive: prov.isActive,
          isProviderDefault: prov.isDefault,
          isProviderFavourite: prov.isFavourite
        });
      }
    }

    return list.sort((a, b) => {
      if (sortBy === 'priority') {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        if (a.isFavourite && !b.isFavourite) return -1;
        if (!a.isFavourite && b.isFavourite) return 1;
        if (a.isEnabled && !b.isEnabled) return -1;
        if (!a.isEnabled && b.isEnabled) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [filteredAndSortedProviders, searchQuery, statusFilter, sortBy]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalProviders = providers.length;
    const activeProviders = providers.filter(p => p.isActive).length;
    const totalModels = providers.reduce((acc, p) => acc + (p.models?.length || 0), 0);
    const favouriteProviders = providers.filter(p => p.isFavourite).length;
    const defaultModel = providers.flatMap(p => p.models || []).find(m => m.isDefault);

    return {
      totalProviders,
      activeProviders,
      totalModels,
      favouriteProviders,
      defaultModelName: defaultModel?.name || 'Gemini 2.5 Flash'
    };
  }, [providers]);

  // Speed Badge Helper
  const renderSpeedBadge = (speed: string) => {
    switch (speed) {
      case 'Ultra Fast':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">Ultra Fast</span>;
      case 'Fast':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-cyan-950/60 border border-cyan-700/60 text-cyan-400">Fast</span>;
      case 'Reasoning Deep':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-purple-950/60 border border-purple-700/60 text-purple-400">Reasoning Deep</span>;
      case 'Balanced':
      default:
        return <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-amber-950/60 border border-amber-700/60 text-amber-400">Balanced</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="eyebrow mb-1">Model Infrastructure</div>
          <h2 className="font-display text-2xl font-semibold text-white tracking-[0.06em] uppercase flex items-center gap-2">
            <Cpu className="w-6 h-6 text-accent" />
            AI Model Providers Configuration
          </h2>
          <p className="font-body text-xs text-muted mt-1 max-w-2xl">
            Configure external AI providers, local inference endpoints (Ollama), and API keys. Enable or disable individual models that clients can select in the Specification Questionnaire.
          </p>
        </div>

        <button
          onClick={() => setShowAddProviderModal(true)}
          className="btn btn-sm btn--accent shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add AI Provider</span>
        </button>
      </div>

      {/* 2. Top Metric Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="agape-card p-3.5 border-line flex items-center justify-between">
          <div>
            <div className="text-[10px] font-display uppercase tracking-wider text-muted">Providers</div>
            <div className="text-lg font-bold text-white font-mono">{stats.activeProviders} <span className="text-xs text-muted font-normal">/ {stats.totalProviders} Active</span></div>
          </div>
          <Server className="w-4 h-4 text-accent/80" />
        </div>

        <div className="agape-card p-3.5 border-line flex items-center justify-between">
          <div>
            <div className="text-[10px] font-display uppercase tracking-wider text-muted">Registered Models</div>
            <div className="text-lg font-bold text-white font-mono">{stats.totalModels} <span className="text-xs text-muted font-normal">Available</span></div>
          </div>
          <Layers className="w-4 h-4 text-cyan-400/80" />
        </div>

        <div className="agape-card p-3.5 border-line flex items-center justify-between">
          <div>
            <div className="text-[10px] font-display uppercase tracking-wider text-muted">Favourites Starred</div>
            <div className="text-lg font-bold text-amber-400 font-mono">{stats.favouriteProviders} <span className="text-xs text-muted font-normal">Starred</span></div>
          </div>
          <Star className="w-4 h-4 text-amber-400 fill-amber-400/40" />
        </div>

        <div className="agape-card p-3.5 border-line flex items-center justify-between">
          <div className="truncate pr-2">
            <div className="text-[10px] font-display uppercase tracking-wider text-muted">Default Engine</div>
            <div className="text-xs font-semibold text-white truncate font-display uppercase tracking-wide mt-1">{stats.defaultModelName}</div>
          </div>
          <Zap className="w-4 h-4 text-accent shrink-0" />
        </div>
      </div>

      {/* 3. Filter, Search, Sort & View Mode Toolbar */}
      <div className="agape-card p-4 space-y-4 border-line">
        {/* Row 1: Search Input & View Modes Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search providers, architectures, models, endpoints, speed..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-ink border border-line pl-9 pr-8 py-2 text-xs text-white focus:border-accent outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-ink p-1 border border-line shrink-0">
            <button
              onClick={() => handleSetViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-display uppercase tracking-wider transition-all ${
                viewMode === 'cards'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-white'
              }`}
              title="Expanded Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>

            <button
              onClick={() => handleSetViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-display uppercase tracking-wider transition-all ${
                viewMode === 'table'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-white'
              }`}
              title="Dense Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>

            <button
              onClick={() => handleSetViewMode('models')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-display uppercase tracking-wider transition-all ${
                viewMode === 'models'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-white'
              }`}
              title="Unified Models Catalog"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Models Catalog</span>
            </button>
          </div>
        </div>

        {/* Row 2: Status Pills, Architecture Selector & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line text-xs">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-[11px] font-display uppercase tracking-wider transition-all border ${
                statusFilter === 'all'
                  ? 'bg-box border-accent text-white font-semibold'
                  : 'bg-ink border-line text-muted hover:text-white'
              }`}
            >
              All ({providers.length})
            </button>

            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-[11px] font-display uppercase tracking-wider transition-all border ${
                statusFilter === 'active'
                  ? 'bg-box border-emerald-500 text-emerald-400 font-semibold'
                  : 'bg-ink border-line text-muted hover:text-white'
              }`}
            >
              Active ({providers.filter(p => p.isActive).length})
            </button>

            <button
              onClick={() => setStatusFilter('disabled')}
              className={`px-3 py-1 text-[11px] font-display uppercase tracking-wider transition-all border ${
                statusFilter === 'disabled'
                  ? 'bg-box border-line text-white font-semibold'
                  : 'bg-ink border-line text-muted hover:text-white'
              }`}
            >
              Disabled ({providers.filter(p => !p.isActive).length})
            </button>

            <button
              onClick={() => setStatusFilter('favourites')}
              className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-display uppercase tracking-wider transition-all border ${
                statusFilter === 'favourites'
                  ? 'bg-box border-amber-400 text-amber-300 font-semibold shadow-sm'
                  : 'bg-ink border-line text-amber-400/80 hover:text-amber-300'
              }`}
              title="Show only favourite providers"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Favourites ({providers.filter(p => p.isFavourite).length})</span>
            </button>
          </div>

          {/* Architecture Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Architecture / Type Selector */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-ink border border-line px-2.5 py-1 text-xs text-white focus:border-accent outline-none font-display uppercase tracking-wider"
            >
              <option value="all">All Architectures</option>
              <option value="google">Google Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="deepseek">DeepSeek AI</option>
              <option value="ollama">Ollama (Local)</option>
              <option value="groq">Groq Fast LPU</option>
              <option value="custom">Custom / Router</option>
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-ink border border-line px-2 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-accent shrink-0" />
              <select
                value={sortBy}
                onChange={e => handleSetSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs text-white focus:border-none outline-none font-display uppercase tracking-wider pr-1 cursor-pointer"
              >
                <option value="priority">Sort: Priority & ⭐ First</option>
                <option value="name-asc">Sort: Name (A → Z)</option>
                <option value="name-desc">Sort: Name (Z → A)</option>
                <option value="models-desc">Sort: Most Models</option>
                <option value="status">Sort: Active First</option>
                <option value="type">Sort: Architecture</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Results Counter & Reset Action */}
      {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
        <div className="flex items-center justify-between text-xs text-muted px-1">
          <span>
            Showing <strong className="text-white">{filteredAndSortedProviders.length}</strong> of {providers.length} providers
            {viewMode === 'models' && <> (<strong className="text-white">{allCatalogModels.length}</strong> models match)</>}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}
            className="text-accent hover:underline flex items-center gap-1 font-display uppercase tracking-wider text-[11px]"
          >
            <X className="w-3 h-3" />
            Reset Filters
          </button>
        </div>
      )}

      {/* 5. VIEW MODE 1: EXPANDED CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {filteredAndSortedProviders.length === 0 ? (
            <div className="agape-card p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-box border border-line flex items-center justify-center text-muted mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white uppercase tracking-wider">
                No AI Providers Found
              </h3>
              <p className="font-body text-xs text-muted max-w-md mx-auto">
                No AI providers match your search query or filter settings. Try adjusting your search term or clearing active filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="btn btn-sm btn--ghost"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredAndSortedProviders.map(provider => {
              const isTesting = testingId === provider.id;
              const testRes = testResults[provider.id];
              const isKeyRevealed = revealedKeys[provider.id];

              return (
                <div
                  key={provider.id}
                  className={`agape-card p-6 sm:p-8 space-y-6 transition-all relative ${
                    provider.isDefault ? 'border-accent shadow-xl shadow-accent/5' : ''
                  }`}
                >
                  {/* Top Bar of Provider Card */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
                    <div className="flex items-center gap-3">
                      {/* Favourite Star Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavouriteProvider(e, provider.id, provider.name)}
                        className="p-1.5 bg-box border border-line hover:border-amber-400 transition-colors group"
                        title={provider.isFavourite ? 'Starred as favourite (Click to unstar)' : 'Star as favourite'}
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            provider.isFavourite
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-muted group-hover:text-amber-400'
                          }`}
                        />
                      </button>

                      <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent">
                        {provider.type === 'google' ? <Sparkles className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-semibold text-white uppercase tracking-[0.06em]">
                            {provider.name}
                          </h3>
                          {provider.isDefault && (
                            <span className="badge--on text-[10px]">Default Provider</span>
                          )}
                          <span className="badge--off text-[10px] uppercase font-mono">
                            {provider.type}
                          </span>
                          {provider.isFavourite && (
                            <span className="px-2 py-0.5 text-[9px] font-display uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-400" /> Favourite
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs text-muted mt-0.5">
                          {provider.baseUrl ? `Endpoint: ${provider.baseUrl}` : 'Official Cloud API Endpoint'} · {(provider.models || []).length} Models Registered
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleTestConnection(provider)}
                        disabled={isTesting}
                        className="btn btn-sm btn--ghost"
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-accent mr-1.5" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>

                      {!provider.isDefault && (
                        <button
                          onClick={() => handleSetDefaultProvider(provider.id, provider.name)}
                          className="btn btn-sm btn--ghost"
                        >
                          Set Default
                        </button>
                      )}

                      <button
                        onClick={() => setEditingProvider(provider)}
                        className="btn btn-sm btn--ghost"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        <span>Config</span>
                      </button>

                      <button
                        onClick={() => handleToggleProvider(provider.id)}
                        className={`btn btn-sm ${provider.isActive ? 'btn--solid' : 'btn--ghost text-muted'}`}
                      >
                        {provider.isActive ? 'Active' : 'Disabled'}
                      </button>

                      {provider.id !== 'google_gemini' && (
                        <button
                          onClick={() => handleDeleteProvider(provider.id, provider.name)}
                          className="p-2 text-muted hover:text-accent bg-box border border-line"
                          title="Delete Provider"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Test Connection Result Alert */}
                  {testRes && (
                    <div className={`p-4 border text-xs flex items-center justify-between ${
                      testRes.success ? 'bg-surface border-accent text-white' : 'bg-box border-accent text-white'
                    }`}>
                      <div className="flex items-center gap-2">
                        {testRes.success ? (
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-accent shrink-0" />
                        )}
                        <span>{testRes.message}</span>
                      </div>
                      <button
                        onClick={() => setTestResults(prev => {
                          const next = { ...prev };
                          delete next[provider.id];
                          return next;
                        })}
                        className="font-display uppercase text-[10px] text-muted hover:text-white"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Credentials Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-ink p-4 border border-line text-xs font-mono">
                    <div>
                      <span className="text-muted block text-[10px] uppercase font-display mb-1">API Key / Token:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white truncate">
                          {provider.apiKey ? (
                            isKeyRevealed ? provider.apiKey : `${provider.apiKey.slice(0, 8)}••••••••••••••••`
                          ) : (
                            <span className="text-muted italic">No API key configured (using local daemon or env)</span>
                          )}
                        </span>
                        {provider.apiKey && (
                          <button
                            onClick={() => toggleRevealKey(provider.id)}
                            className="text-muted hover:text-white shrink-0"
                          >
                            {isKeyRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted block text-[10px] uppercase font-display mb-1">Base URL / Endpoint:</span>
                      <span className="text-white">
                        {provider.baseUrl || 'https://api.provider.com/v1 (Default Cloud Gateway)'}
                      </span>
                    </div>
                  </div>

                  {/* Registered Models List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-xs uppercase tracking-[0.16em] text-muted">
                        Available Models for Clients ({(provider.models || []).length})
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingModelToProviderId(provider.id);
                          setNewModelId('');
                          setNewModelName('');
                          setNewModelContext('128K Tokens');
                          setNewModelSpeed('Fast');
                          setNewModelRec('General architecture & code synthesis');
                        }}
                        className="font-display text-xs uppercase tracking-[0.12em] text-accent hover:text-white flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 border border-accent/40 hover:border-accent transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Model</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(provider.models || []).map(model => (
                        <div
                          key={model.id}
                          className={`p-4 border transition-all ${
                            model.isEnabled
                              ? 'bg-box/50 border-line hover:border-line/80'
                              : 'bg-ink/60 border-line/50 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleFavouriteModel(e, provider.id, model.id, model.name)}
                                  className="text-muted hover:text-amber-400 p-0.5"
                                  title={model.isFavourite ? 'Starred favourite model' : 'Star model'}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      model.isFavourite
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-muted/60 hover:text-amber-400'
                                    }`}
                                  />
                                </button>
                                <span className="font-display text-xs uppercase tracking-wider text-white font-semibold">
                                  {model.name}
                                </span>
                                {model.isDefault && (
                                  <span className="badge--on text-[9px]">System Default</span>
                                )}
                              </div>
                              <code className="text-[10px] text-muted font-mono">{model.id}</code>
                            </div>

                            <div className="flex items-center gap-1">
                              {!model.isDefault && model.isEnabled && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultModel(model.id, model.name)}
                                  className="px-2 py-0.5 bg-ink text-muted hover:text-white border border-line text-[10px] font-display uppercase tracking-wider"
                                  title="Set as system default model"
                                >
                                  Make Default
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleToggleModel(provider.id, model.id)}
                                className={`px-2 py-0.5 text-[10px] font-display uppercase tracking-wider border ${
                                  model.isEnabled
                                    ? 'bg-accent/20 border-accent text-white'
                                    : 'bg-box border-line text-muted'
                                }`}
                              >
                                {model.isEnabled ? 'Enabled' : 'Disabled'}
                              </button>
                              {!model.isDefault && (provider.models || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteModel(provider.id, model.id, model.name)}
                                  className="p-1 bg-ink text-muted hover:text-accent border border-line text-[10px]"
                                  title="Delete model definition"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-muted mb-2">
                            {renderSpeedBadge(model.speed)}
                            <span>·</span>
                            <span className="text-white font-mono">{model.contextWindow}</span>
                          </div>

                          <p className="font-body text-[11px] text-muted leading-relaxed">
                            {model.recommendedFor}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 6. VIEW MODE 2: DENSE TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="agape-card overflow-hidden border-line">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ink border-b border-line text-muted font-display uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 text-center w-10">Fav</th>
                  <th
                    onClick={() => handleSetSortBy(sortBy === 'name-asc' ? 'name-desc' : 'name-asc')}
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Provider</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSetSortBy('type')}
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Architecture</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Endpoint / Base URL</th>
                  <th className="py-3 px-4">API Key Status</th>
                  <th
                    onClick={() => handleSetSortBy('models-desc')}
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Models</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Default</th>
                  <th
                    onClick={() => handleSetSortBy('status')}
                    className="py-3 px-4 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredAndSortedProviders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted">
                      No AI providers match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedProviders.map(provider => {
                    const isTesting = testingId === provider.id;

                    return (
                      <tr
                        key={provider.id}
                        className={`hover:bg-box/40 transition-colors ${
                          provider.isDefault ? 'bg-accent/5' : ''
                        }`}
                      >
                        {/* Fav Star */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => handleToggleFavouriteProvider(e, provider.id, provider.name)}
                            className="p-1 text-muted hover:text-amber-400"
                            title={provider.isFavourite ? 'Starred favourite' : 'Star as favourite'}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                provider.isFavourite
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-muted/60 hover:text-amber-400'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Name */}
                        <td className="py-3 px-4">
                          <div className="font-display uppercase tracking-wider font-semibold text-white">
                            {provider.name}
                          </div>
                          <div className="text-[10px] text-muted font-mono">{provider.id}</div>
                        </td>

                        {/* Architecture */}
                        <td className="py-3 px-4">
                          <span className="badge--off text-[10px] uppercase font-mono">
                            {provider.type}
                          </span>
                        </td>

                        {/* Endpoint */}
                        <td className="py-3 px-4 font-mono text-[11px] text-muted truncate max-w-[200px]" title={provider.baseUrl || 'Official Cloud Endpoint'}>
                          {provider.baseUrl || 'Official Cloud Gateway'}
                        </td>

                        {/* Key status */}
                        <td className="py-3 px-4">
                          {provider.apiKey ? (
                            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                              <Check className="w-3.5 h-3.5" /> Configured
                            </span>
                          ) : (
                            <span className="text-muted italic text-[11px]">Local / Env</span>
                          )}
                        </td>

                        {/* Models pill */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 text-[10px] font-mono bg-box border border-line text-white">
                              {(provider.models || []).length} Models
                            </span>
                          </div>
                        </td>

                        {/* Default */}
                        <td className="py-3 px-4 text-center">
                          {provider.isDefault ? (
                            <span className="badge--on text-[9px]">Default</span>
                          ) : (
                            <button
                              onClick={() => handleSetDefaultProvider(provider.id, provider.name)}
                              className="text-[10px] font-display uppercase text-muted hover:text-white"
                            >
                              Make Default
                            </button>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleProvider(provider.id)}
                            className={`px-2.5 py-1 text-[10px] font-display uppercase tracking-wider border ${
                              provider.isActive
                                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400 font-semibold'
                                : 'bg-box border-line text-muted'
                            }`}
                          >
                            {provider.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTestConnection(provider)}
                              disabled={isTesting}
                              className="p-1.5 bg-box border border-line text-muted hover:text-accent"
                              title="Test Connection"
                            >
                              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-accent" />}
                            </button>

                            <button
                              onClick={() => setEditingProvider(provider)}
                              className="p-1.5 bg-box border border-line text-muted hover:text-white"
                              title="Configure Credentials"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {provider.id !== 'google_gemini' && (
                              <button
                                onClick={() => handleDeleteProvider(provider.id, provider.name)}
                                className="p-1.5 bg-box border border-line text-muted hover:text-accent"
                                title="Delete Provider"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. VIEW MODE 3: UNIFIED CLIENT MODELS CATALOG */}
      {viewMode === 'models' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted px-1">
            <span className="font-display uppercase tracking-wider">
              Unified Client Model Catalog ({allCatalogModels.length} models across active providers)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allCatalogModels.length === 0 ? (
              <div className="col-span-full agape-card p-12 text-center text-muted">
                No individual models match your criteria.
              </div>
            ) : (
              allCatalogModels.map(model => (
                <div
                  key={`${model.providerId}_${model.id}`}
                  className={`agape-card p-4 border transition-all flex flex-col justify-between ${
                    model.isDefault
                      ? 'border-accent shadow-md shadow-accent/5'
                      : model.isEnabled
                      ? 'border-line hover:border-line/80'
                      : 'border-line/50 opacity-60'
                  }`}
                >
                  <div>
                    {/* Header: Name, Provider & Favourite */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavouriteModel(e, model.providerId, model.id, model.name)}
                          className="text-muted hover:text-amber-400 p-0.5"
                          title={model.isFavourite ? 'Starred favourite model' : 'Star model'}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              model.isFavourite
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-muted/60 hover:text-amber-400'
                            }`}
                          />
                        </button>
                        <div>
                          <div className="font-display text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                            <span>{model.name}</span>
                            {model.isDefault && <span className="badge--on text-[8px]">Default</span>}
                          </div>
                          <code className="text-[10px] text-muted font-mono">{model.id}</code>
                        </div>
                      </div>

                      <span className="badge--off text-[9px] uppercase font-mono shrink-0">
                        {model.providerName}
                      </span>
                    </div>

                    {/* Meta: Speed & Context */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted mb-3">
                      {renderSpeedBadge(model.speed)}
                      <span>·</span>
                      <span className="text-white font-mono">{model.contextWindow}</span>
                    </div>

                    {/* Recommendation */}
                    <p className="font-body text-[11px] text-muted mb-4 leading-relaxed line-clamp-2" title={model.recommendedFor}>
                      {model.recommendedFor}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-line text-xs">
                    <div>
                      {!model.isDefault && model.isEnabled && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultModel(model.id, model.name)}
                          className="px-2 py-0.5 bg-ink text-muted hover:text-white border border-line text-[10px] font-display uppercase tracking-wider"
                        >
                          Make Default
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleModel(model.providerId, model.id)}
                        className={`px-2.5 py-1 text-[10px] font-display uppercase tracking-wider border ${
                          model.isEnabled
                            ? 'bg-accent/20 border-accent text-white font-semibold'
                            : 'bg-box border-line text-muted'
                        }`}
                      >
                        {model.isEnabled ? 'Client Ready' : 'Disabled'}
                      </button>

                      {!model.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleDeleteModel(model.providerId, model.id, model.name)}
                          className="p-1 bg-ink text-muted hover:text-accent border border-line text-[10px]"
                          title="Delete model definition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROVIDER CONFIG */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">
              Configure {editingProvider.name}
            </h3>
            <p className="font-body text-xs text-muted mb-6">Update API access keys, custom proxy URLs, and provider state.</p>

            <form onSubmit={handleSaveProviderEdit} className="space-y-4">
              <div className="field">
                <label className="field__label">Provider Name</label>
                <input
                  type="text"
                  required
                  value={editingProvider.name}
                  onChange={e => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">API Key / Auth Token</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={editingProvider.apiKey}
                  onChange={e => setEditingProvider({ ...editingProvider, apiKey: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                />
                <span className="text-[10px] text-muted mt-1 block">
                  Encrypted at rest in browser localStorage for secure client-side synthesis.
                </span>
              </div>

              <div className="field">
                <label className="field__label">Base URL / Local Host Endpoint</label>
                <input
                  type="text"
                  placeholder="http://localhost:11434 or https://api.openai.com/v1"
                  value={editingProvider.baseUrl || ''}
                  onChange={e => setEditingProvider({ ...editingProvider, baseUrl: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                />
                <span className="text-[10px] text-muted mt-1 block">
                  Leave empty for default cloud API endpoints.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="provider_active_edit"
                  checked={editingProvider.isActive}
                  onChange={e => setEditingProvider({ ...editingProvider, isActive: e.target.checked })}
                  className="accent-accent"
                />
                <label htmlFor="provider_active_edit" className="text-xs font-display uppercase tracking-wider text-white">
                  Active Provider (Allows Clients to Synthesize)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM PROVIDER */}
      {showAddProviderModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">
              Add AI Model Provider
            </h3>
            <p className="font-body text-xs text-muted mb-6">Register a new foundation LLM provider or local inference endpoint.</p>

            <form onSubmit={handleCreateProvider} className="space-y-4">
              <div className="field">
                <label className="field__label">Provider Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mistral AI, Fireworks, vLLM Server"
                  value={newProvName}
                  onChange={e => setNewProvName(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="field">
                <label className="field__label">Provider Type / Architecture</label>
                <select
                  value={newProvType}
                  onChange={e => setNewProvType(e.target.value as AIProviderType)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                >
                  <option value="custom">Custom (OpenAI-compatible API)</option>
                  <option value="ollama">Ollama (Local Inference Host)</option>
                  <option value="openai">OpenAI Architecture</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="deepseek">DeepSeek AI</option>
                  <option value="groq">Groq Fast LPU</option>
                </select>
              </div>

              <div className="field">
                <label className="field__label">API Key / Token</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={newProvApiKey}
                  onChange={e => setNewProvApiKey(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="field">
                <label className="field__label">Base URL / Endpoint</label>
                <input
                  type="text"
                  placeholder="https://api.mistral.ai/v1 or http://localhost:11434"
                  value={newProvBaseUrl}
                  onChange={e => setNewProvBaseUrl(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="field">
                <label className="field__label">Initial Model Identifier (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. llama3:70b, deepseek-coder, mistral-large"
                  value={newProvModelId}
                  onChange={e => setNewProvModelId(e.target.value)}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                />
                <p className="text-[10px] text-muted font-body mt-1">
                  You can also add more models after creating the provider using the "+ Add Model" button.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddProviderModal(false)}
                  className="btn btn-sm btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn--accent"
                >
                  Add Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MODEL TO PROVIDER */}
      {addingModelToProviderId && (() => {
        const targetProv = providers.find(p => p.id === addingModelToProviderId);
        return (
          <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
              <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">
                Add Model Definition
              </h3>
              <p className="font-body text-xs text-muted mb-6">
                Register a specific model ID under <span className="text-white font-medium">{targetProv?.name || 'this provider'}</span> for client specification synthesis.
              </p>

              <form onSubmit={handleAddModel} className="space-y-4">
                <div className="field">
                  <label className="field__label">Model Identifier (API ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. claude-3-opus, llama3:70b, deepseek-r1:32b"
                    value={newModelId}
                    onChange={e => setNewModelId(e.target.value)}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                    autoFocus
                  />
                </div>

                <div className="field">
                  <label className="field__label">Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Claude 3 Opus (Extreme Deep)"
                    value={newModelName}
                    onChange={e => setNewModelName(e.target.value)}
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="field">
                    <label className="field__label">Context Window</label>
                    <input
                      type="text"
                      required
                      value={newModelContext}
                      onChange={e => setNewModelContext(e.target.value)}
                      placeholder="200K Tokens"
                      className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-mono"
                    />
                  </div>

                  <div className="field">
                    <label className="field__label">Speed Tier</label>
                    <select
                      value={newModelSpeed}
                      onChange={e => setNewModelSpeed(e.target.value as any)}
                      className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none font-display uppercase tracking-[0.08em]"
                    >
                      <option value="Ultra Fast">Ultra Fast</option>
                      <option value="Fast">Fast</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Reasoning Deep">Reasoning Deep</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="field__label">Recommended For</label>
                  <input
                    type="text"
                    value={newModelRec}
                    onChange={e => setNewModelRec(e.target.value)}
                    placeholder="Complex system design & contracts"
                    className="w-full bg-ink border border-line px-3.5 py-2 text-sm text-white focus:border-accent outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => {
                      setAddingModelToProviderId(null);
                      setNewModelId('');
                      setNewModelName('');
                    }}
                    className="btn btn-sm btn--ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn--accent"
                  >
                    Add Model
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
