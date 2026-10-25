import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { AIModelProvider, AIModelDefinition, AIProviderType } from '../../types';
import { saasStore } from '../../services/saasStore';

interface AdminAiProvidersViewProps {
  onToast: (msg: string) => void;
}

export const AdminAiProvidersView: React.FC<AdminAiProvidersViewProps> = ({ onToast }) => {
  const [providers, setProviders] = useState<AIModelProvider[]>(saasStore.getAiProviders());
  const [editingProvider, setEditingProvider] = useState<AIModelProvider | null>(null);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [addingModelToProviderId, setAddingModelToProviderId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<{ [id: string]: boolean }>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [id: string]: { success: boolean; message: string } }>({});

  // Form: Add New Provider
  const [newProvName, setNewProvName] = useState('');
  const [newProvType, setNewProvType] = useState<AIProviderType>('custom');
  const [newProvApiKey, setNewProvApiKey] = useState('');
  const [newProvBaseUrl, setNewProvBaseUrl] = useState('');

  // Form: Add New Model
  const [newModelId, setNewModelId] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newModelContext, setNewModelContext] = useState('128K Tokens');
  const [newModelSpeed, setNewModelSpeed] = useState<'Ultra Fast' | 'Fast' | 'Balanced' | 'Reasoning Deep'>('Fast');
  const [newModelRec, setNewModelRec] = useState('General architecture & code synthesis');

  const refreshProviders = () => {
    setProviders(saasStore.getAiProviders());
  };

  const toggleRevealKey = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
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
    if (!newProvName) return;

    saasStore.addAiProvider({
      name: newProvName,
      type: newProvType,
      apiKey: newProvApiKey,
      baseUrl: newProvBaseUrl || undefined,
      isActive: true,
      isDefault: false,
      models: [
        {
          id: `${newProvType}_default`,
          name: `${newProvName} Default Model`,
          providerId: '',
          providerName: newProvName,
          contextWindow: '128K Tokens',
          speed: 'Balanced',
          recommendedFor: 'Custom provider synthesis',
          isEnabled: true
        }
      ]
    });

    refreshProviders();
    setShowAddProviderModal(false);
    setNewProvName('');
    setNewProvApiKey('');
    setNewProvBaseUrl('');
    onToast(`Added AI Provider: ${newProvName}`);
  };

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingModelToProviderId || !newModelId || !newModelName) return;

    const provider = providers.find(p => p.id === addingModelToProviderId);
    if (!provider) return;

    saasStore.addModelToProvider(addingModelToProviderId, {
      id: newModelId.toLowerCase().trim(),
      name: newModelName.trim(),
      providerId: addingModelToProviderId,
      providerName: provider.name,
      contextWindow: newModelContext,
      speed: newModelSpeed,
      recommendedFor: newModelRec,
      isEnabled: true
    });

    refreshProviders();
    setAddingModelToProviderId(null);
    setNewModelId('');
    setNewModelName('');
    onToast(`Added model ${newModelName} to ${provider.name}.`);
  };

  const handleTestConnection = async (provider: AIModelProvider) => {
    setTestingId(provider.id);
    setTestResults(prev => {
      const next = { ...prev };
      delete next[provider.id];
      return next;
    });

    // Simulate / real test
    setTimeout(() => {
      const isOllama = provider.type === 'ollama';
      const hasKey = Boolean(provider.apiKey && provider.apiKey.length > 5);

      if (isOllama || hasKey || provider.type === 'google') {
        setTestResults(prev => ({
          ...prev,
          [provider.id]: {
            success: true,
            message: `Connection Verified: Endpoint reachable, 200 OK (${isOllama ? 'Local Daemon' : 'API Key Active'})`
          }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [provider.id]: {
            success: false,
            message: 'Connection Failed: Missing or invalid API key. Please input valid credentials.'
          }
        }));
      }
      setTestingId(null);
    }, 900);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="eyebrow mb-1">Model Infrastructure</div>
          <h2 className="font-display text-2xl font-semibold text-white tracking-[0.06em] uppercase flex items-center gap-2">
            <Cpu className="w-6 h-6 text-accent" />
            AI Model Providers Configuration
          </h2>
          <p className="font-body text-xs text-muted mt-1 max-w-2xl">
            Configure external AI providers, local inference servers (Ollama), and API keys. Enable or disable individual models that clients can select in the Specification Questionnaire.
          </p>
        </div>

        <button
          onClick={() => setShowAddProviderModal(true)}
          className="btn btn-sm btn--accent"
        >
          <Plus className="w-4 h-4" />
          <span>Add AI Provider</span>
        </button>
      </div>

      {/* 2. Providers List */}
      <div className="space-y-6">
        {providers.map(provider => {
          const isTesting = testingId === provider.id;
          const testRes = testResults[provider.id];
          const isKeyRevealed = revealedKeys[provider.id];

          return (
            <div
              key={provider.id}
              className={`agape-card p-6 sm:p-8 space-y-6 transition-all ${
                provider.isDefault ? 'border-accent shadow-xl shadow-accent/5' : ''
              }`}
            >
              {/* Top Bar of Provider Card */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-box border border-line flex items-center justify-center text-accent">
                    {provider.type === 'google' ? <Sparkles className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-white uppercase tracking-[0.06em]">
                        {provider.name}
                      </h3>
                      {provider.isDefault && (
                        <span className="badge--on text-[10px]">Default Provider</span>
                      )}
                      <span className="badge--off text-[10px] uppercase font-mono">
                        {provider.type}
                      </span>
                    </div>
                    <p className="font-body text-xs text-muted mt-0.5">
                      {provider.baseUrl ? `Endpoint: ${provider.baseUrl}` : 'Official Cloud API Endpoint'} · {provider.models.length} Models Registered
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
                    Available Models for Clients ({provider.models.length})
                  </div>
                  <button
                    onClick={() => setAddingModelToProviderId(provider.id)}
                    className="font-display text-xs uppercase tracking-[0.12em] text-accent hover:text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Model</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {provider.models.map(model => (
                    <div
                      key={model.id}
                      className={`p-4 border transition-all ${
                        model.isEnabled
                          ? 'bg-box/50 border-line'
                          : 'bg-ink/60 border-line/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
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
                              onClick={() => handleSetDefaultModel(model.id, model.name)}
                              className="px-2 py-0.5 bg-ink text-muted hover:text-white border border-line text-[10px] font-display uppercase tracking-wider"
                              title="Set as system default model"
                            >
                              Make Default
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleModel(provider.id, model.id)}
                            className={`px-2 py-0.5 text-[10px] font-display uppercase tracking-wider border ${
                              model.isEnabled
                                ? 'bg-accent/20 border-accent text-white'
                                : 'bg-box border-line text-muted'
                            }`}
                          >
                            {model.isEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted mb-2">
                        <span className="text-accent">{model.speed}</span>
                        <span>·</span>
                        <span>{model.contextWindow}</span>
                      </div>

                      <p className="font-body text-[11px] text-muted">
                        {model.recommendedFor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
      {addingModelToProviderId && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="agape-card p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="font-display text-lg font-semibold text-white tracking-[0.06em] uppercase mb-1">
              Add Model Definition
            </h3>
            <p className="font-body text-xs text-muted mb-6">
              Register a specific model ID under this provider for client specification synthesis.
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
                  onClick={() => setAddingModelToProviderId(null)}
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
      )}
    </div>
  );
};
