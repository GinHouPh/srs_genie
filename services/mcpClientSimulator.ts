import { McpApiKey } from '../types';
import { saasStore } from './saasStore';

export interface McpToolCallResult {
  tool: string;
  args: any;
  resultText: string;
  status: 'success' | 'error';
  executionTimeMs: number;
}

/**
 * Simulates and executes MCP tool calls against current spec state
 */
export function executeMcpToolCall(
  toolName: string,
  args: Record<string, any>,
  specs: Record<string, string>
): McpToolCallResult {
  const start = performance.now();

  try {
    let resultText = '';

    switch (toolName) {
      case 'get_spec_index': {
        resultText = specs['_index.md'] || 'Project index not found in current spec suite.';
        break;
      }
      case 'get_spec_file': {
        const filePath = args.filePath as string;
        if (!filePath) throw new Error('Missing parameter: filePath');
        const content = specs[filePath];
        if (!content) throw new Error(`Spec file "${filePath}" not found in .specs suite.`);
        resultText = content;
        break;
      }
      case 'list_spec_tasks': {
        resultText = specs['execution/tasks.md'] || 'No tasks file available.';
        break;
      }
      case 'get_current_state': {
        resultText = specs['state/current_state.md'] || 'No current state file available.';
        break;
      }
      case 'append_decision_log': {
        const title = args.title || 'Untitled Decision';
        const decision = args.decision || 'No decision text provided.';
        const context = args.context || 'Recorded via MCP Live Sync.';
        const date = new Date().toISOString().split('T')[0];
        const entry = `\n\n### ${title}\n- **Date:** ${date}\n- **Context:** ${context}\n- **Decision:** ${decision}\n`;
        specs['state/decisions_log.md'] = (specs['state/decisions_log.md'] || '') + entry;
        resultText = `Decision successfully recorded: ${title}`;
        break;
      }
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    const duration = Math.round(performance.now() - start);

    saasStore.addSessionLog({
      agentName: 'MCP Web Client',
      method: 'tools/call',
      resourceOrTool: `${toolName}: ${JSON.stringify(args)}`,
      status: '200 OK',
      durationMs: duration
    });

    return {
      tool: toolName,
      args,
      resultText,
      status: 'success',
      executionTimeMs: duration
    };
  } catch (err: any) {
    const duration = Math.round(performance.now() - start);

    saasStore.addSessionLog({
      agentName: 'MCP Web Client',
      method: 'tools/call',
      resourceOrTool: `${toolName}: ${err.message}`,
      status: '500 ERROR',
      durationMs: duration
    });

    return {
      tool: toolName,
      args,
      resultText: `Error: ${err.message}`,
      status: 'error',
      executionTimeMs: duration
    };
  }
}

/**
 * Generates MCP client configuration files for various AI tools
 */
export type McpTransportMode = 'cloud_sse' | 'npx_portable' | 'local_stdio';

export function getEffectiveEndpoint(): string {
  if (typeof window !== 'undefined' && window.location) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      return window.location.origin;
    }
  }
  return 'https://api.srsgenie.ai';
}

export function generateAgentMcpConfig(
  key: McpApiKey,
  mode: McpTransportMode = 'cloud_sse',
  repoPath: string = 'd:/PROJECTS/srs_genie'
): {
  cursorJson: string;
  claudeJson: string;
  windsurfJson: string;
  cliCommand: string;
  endpointUrl: string;
} {
  const isBrowser = typeof window !== 'undefined' && Boolean(window.location);
  const currentOrigin = isBrowser ? window.location.origin : 'https://api.srsgenie.ai';
  const isLocalHost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const liveBase = isLocalHost ? 'https://api.srsgenie.ai' : currentOrigin;
  const sseEndpoint = `${liveBase}/api/mcp/sse`;
  const serverPath = `${repoPath.replace(/\\/g, '/')}/mcp/server.mjs`;

  if (mode === 'cloud_sse') {
    // Native Remote SSE configuration for live cloud deployment
    const cursorConfig = {
      mcpServers: {
        'srs-genie-cloud': {
          url: sseEndpoint,
          headers: {
            Authorization: `Bearer ${key.key}`
          }
        }
      }
    };

    const claudeConfig = {
      mcpServers: {
        'srs-genie': {
          url: sseEndpoint,
          headers: {
            Authorization: `Bearer ${key.key}`
          }
        }
      }
    };

    const windsurfConfig = {
      mcpServers: {
        'srs-genie': {
          url: sseEndpoint,
          headers: {
            Authorization: `Bearer ${key.key}`
          }
        }
      }
    };

    return {
      cursorJson: JSON.stringify(cursorConfig, null, 2),
      claudeJson: JSON.stringify(claudeConfig, null, 2),
      windsurfJson: JSON.stringify(windsurfConfig, null, 2),
      cliCommand: `curl -H "Authorization: Bearer ${key.key}" ${sseEndpoint}`,
      endpointUrl: sseEndpoint
    };
  }

  if (mode === 'npx_portable') {
    // Portable NPX bridge that works on any user machine without hardcoded paths
    const cursorConfig = {
      mcpServers: {
        'srs-genie-specs': {
          command: 'npx',
          args: ['-y', 'srs-genie-mcp@latest'],
          env: {
            SRS_GENIE_API_KEY: key.key,
            SRS_GENIE_ENDPOINT: liveBase,
            SRS_PROJECT_ID: key.projectId
          }
        }
      }
    };

    const claudeConfig = {
      mcpServers: {
        'srs-genie': {
          command: 'npx',
          args: ['-y', 'srs-genie-mcp@latest'],
          env: {
            SRS_GENIE_API_KEY: key.key,
            SRS_GENIE_ENDPOINT: liveBase
          }
        }
      }
    };

    const windsurfConfig = {
      mcpServers: {
        'srs-genie': {
          command: 'npx',
          args: ['-y', 'srs-genie-mcp@latest'],
          env: {
            SRS_GENIE_API_KEY: key.key,
            SRS_GENIE_ENDPOINT: liveBase
          }
        }
      }
    };

    return {
      cursorJson: JSON.stringify(cursorConfig, null, 2),
      claudeJson: JSON.stringify(claudeConfig, null, 2),
      windsurfJson: JSON.stringify(windsurfConfig, null, 2),
      cliCommand: `npx -y srs-genie-mcp@latest --key ${key.key} --endpoint ${liveBase}`,
      endpointUrl: liveBase
    };
  }

  // Fallback: local file stdio execution for local machine testing
  const cursorConfig = {
    mcpServers: {
      'srs-genie-specs': {
        command: 'node',
        args: [serverPath],
        env: {
          SRS_GENIE_API_KEY: key.key,
          SRS_PROJECT_ID: key.projectId
        }
      }
    }
  };

  const claudeConfig = {
    mcpServers: {
      'srs-genie': {
        command: 'node',
        args: [serverPath],
        env: {
          SRS_GENIE_API_KEY: key.key
        }
      }
    }
  };

  const windsurfConfig = {
    mcpServers: {
      'srs-genie': {
        command: 'node',
        args: [serverPath]
      }
    }
  };

  return {
    cursorJson: JSON.stringify(cursorConfig, null, 2),
    claudeJson: JSON.stringify(claudeConfig, null, 2),
    windsurfJson: JSON.stringify(windsurfConfig, null, 2),
    cliCommand: `node ${serverPath} --key ${key.key}`,
    endpointUrl: serverPath
  };
}
