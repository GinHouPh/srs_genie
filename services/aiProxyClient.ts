import { AIModelProvider } from '../types';
import { GoogleGenAI } from '@google/genai';
import { cryptoService } from './cryptoService';

export interface ProxyRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
}

/**
 * Executes an AI API call through the backend proxy (/api/ai/proxy) to completely
 * eliminate browser CORS restrictions for third-party providers (NVIDIA NIM, Groq, Anthropic, etc.).
 * Gracefully falls back to direct fetch if the proxy is unavailable.
 */
export async function fetchAiProxy(
  targetUrl: string,
  options: ProxyRequestOptions = {}
): Promise<Response> {
  const method = options.method || 'POST';
  const headers = options.headers || {};
  const body = options.body;

  // 1. Attempt server-side proxy first (Vite dev server or PHP backend)
  try {
    const proxyRes = await fetch('/api/ai/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: targetUrl,
        method,
        headers,
        body
      }),
      signal: options.signal
    });

    // If proxy endpoint exists and returned a response (even 4xx/5xx from target)
    if (proxyRes.status !== 404 && proxyRes.status !== 405) {
      return proxyRes;
    }
  } catch (proxyErr) {
    console.warn('[AI Proxy] Local proxy endpoint unreachable, attempting direct browser fetch:', proxyErr);
  }

  // 2. Direct browser fetch fallback
  const directHeaders: Record<string, string> = { ...headers };
  const directOptions: RequestInit = {
    method,
    headers: directHeaders,
    signal: options.signal
  };

  if (body && method !== 'GET' && method !== 'HEAD') {
    directOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    return await fetch(targetUrl, directOptions);
  } catch (directErr: any) {
    if (directErr.name === 'TypeError' || directErr.message?.includes('Failed to fetch')) {
      throw new Error(
        `Browser CORS Blocked: Could not connect to "${targetUrl}". Ensure the backend AI proxy is enabled or use a CORS-friendly endpoint.`
      );
    }
    throw directErr;
  }
}

/**
 * Performs a live connection probe against any AI Provider, testing actual inference
 * and measuring real roundtrip latency.
 */
export async function probeAiProviderConnection(
  provider: AIModelProvider,
  overrideApiKey?: string,
  overrideModelId?: string
): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const startTime = Date.now();

  try {
    let activeKey = overrideApiKey !== undefined ? overrideApiKey : (provider.apiKey || '');
    if (activeKey && (activeKey.startsWith('aes_gcm$') || activeKey.startsWith('enc_b64_'))) {
      try {
        activeKey = await cryptoService.decryptSecret(activeKey);
      } catch {}
    }

    if (provider.type === 'google' && !activeKey) {
      activeKey = (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) || '';
    }

    const isOllama = provider.type === 'ollama';
    const baseUrl = (provider.baseUrl || (isOllama ? 'http://localhost:11434' : 'https://api.openai.com/v1')).replace(/\/+$/, '');
    const modelId = overrideModelId || provider.models?.[0]?.id || (provider.type === 'google' ? 'gemini-2.5-flash' : 'gpt-4o');

    if (!activeKey && !isOllama && !provider.baseUrl) {
      return {
        success: false,
        message: 'Missing API key or Base URL. Configure credentials for live inference.'
      };
    }

    // --- Google Gemini Probe ---
    if (provider.type === 'google') {
      if (!activeKey) {
        return { success: false, message: 'Google Gemini API key is missing or not configured.' };
      }
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const res = await ai.models.generateContent({
        model: modelId.startsWith('gemini') ? modelId : 'gemini-2.5-flash',
        contents: 'Ping test: respond with OK'
      });

      const text = res.text || '';
      const latencyMs = Date.now() - startTime;
      if (text.trim().length > 0) {
        return {
          success: true,
          message: `Live Connection Verified: ${modelId} responded in ${latencyMs}ms ("${text.trim().slice(0, 30)}")`,
          latencyMs
        };
      } else {
        return { success: false, message: `Model responded with empty text output.` };
      }
    }

    // --- AgentRouter Probe ---
    const isAgentRouter = baseUrl.includes('agentrouter') || provider.name.toLowerCase().includes('agentrouter');
    if (isAgentRouter) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Originator': 'codex_cli_rs'
      };
      if (activeKey) headers['Authorization'] = `Bearer ${activeKey}`;

      const res = await fetchAiProxy(`${baseUrl}/responses`, {
        method: 'POST',
        headers,
        body: {
          model: modelId,
          input: 'Ping test: respond with OK'
        }
      });

      const latencyMs = Date.now() - startTime;
      if (res.ok) {
        return {
          success: true,
          message: `Live Connection Verified: AgentRouter (${modelId}) responded in ${latencyMs}ms.`,
          latencyMs
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        return {
          success: false,
          message: `AgentRouter returned HTTP ${res.status}: ${errData.error?.message || errData.message || res.statusText}`
        };
      }
    }

    // --- OpenAI / NVIDIA NIM / Anthropic / Custom Probe ---
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (activeKey && activeKey !== 'ollama-local') {
      headers['Authorization'] = `Bearer ${activeKey}`;
    }

    const payload = {
      model: modelId,
      messages: [
        { role: 'user', content: 'Ping test: respond with "OK"' }
      ],
      max_tokens: 16,
      temperature: 0.1
    };

    const targetEndpoint = `${baseUrl}/chat/completions`;
    const res = await fetchAiProxy(targetEndpoint, {
      method: 'POST',
      headers,
      body: payload
    });

    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const reply = data.choices?.[0]?.message?.content || 'OK';
      return {
        success: true,
        message: `Live Connection Verified: Endpoint reachable, 200 OK (${modelId} responded in ${latencyMs}ms)`,
        latencyMs
      };
    } else {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || errData.message || res.statusText || `HTTP ${res.status}`;
      return {
        success: false,
        message: `Inference Failed (HTTP ${res.status}): ${errMsg}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Connection Error: ${err?.message || 'Failed to connect to AI provider endpoint.'}`
    };
  }
}
