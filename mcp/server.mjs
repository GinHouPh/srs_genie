#!/usr/bin/env node

/**
 * SRS Genie Model Context Protocol (MCP) Server
 * Implements MCP JSON-RPC 2.0 specification over STDIO
 * Hardened with SHA-256 token verification, path traversal defenses, and rate limiting.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import crypto from 'crypto';

const SPECS_DIR = path.resolve(process.cwd(), '.specs');

// CLI args parsing (e.g., --key=srs_live_xxx)
let cliKey = null;
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--key=')) {
    cliKey = arg.slice(6);
  }
}

const REQUIRED_KEY = process.env.SRS_MCP_KEY || cliKey || null;

// Rate limiting state: sliding window (120 reqs/min)
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX = 120;
let requestTimestamps = [];

function checkRateLimit() {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

// Constant-time key comparison using SHA-256
function verifyApiKey(presentedKey) {
  if (!REQUIRED_KEY) return true; // Auth optional if no key is configured in env or CLI
  if (!presentedKey || typeof presentedKey !== 'string') return false;

  try {
    const hashExpected = crypto.createHash('sha256').update(REQUIRED_KEY).digest();
    const hashPresented = crypto.createHash('sha256').update(presentedKey).digest();
    return crypto.timingSafeEqual(hashExpected, hashPresented);
  } catch (e) {
    return false;
  }
}

// Strict path traversal defense
function isPathSafe(baseDir, targetRelPath) {
  if (!targetRelPath || typeof targetRelPath !== 'string') return false;
  if (targetRelPath.includes('\0')) return false; // Null byte protection

  const resolved = path.resolve(baseDir, targetRelPath);
  const rel = path.relative(baseDir, resolved);
  return !rel.startsWith('..') && !path.isAbsolute(rel);
}

const TOOLS = [
  {
    name: 'get_spec_index',
    description: 'Retrieves the root project index, navigation manifest, and file map from .specs/_index.md.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_spec_file',
    description: 'Reads any specification file from the .specs hierarchy (e.g. "foundation/brief.md", "architecture/data_model.md", "contracts/api_contracts.md").',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Relative path within .specs directory (e.g. "architecture/data_model.md")'
        }
      },
      required: ['filePath']
    }
  },
  {
    name: 'list_spec_tasks',
    description: 'Returns the list of atomic development tasks, complexity ratings, and status from .specs/execution/tasks.md.',
    inputSchema: {
      type: 'object',
      properties: {
        filterStatus: {
          type: 'string',
          enum: ['all', 'todo', 'in-progress', 'done'],
          description: 'Filter tasks by status'
        }
      }
    }
  },
  {
    name: 'get_current_state',
    description: 'Reads the active development session state and next unblocked actions from .specs/state/current_state.md.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'append_decision_log',
    description: 'Appends a new Architecture Decision Record (ADR) to .specs/state/decisions_log.md.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Decision title (e.g. ADR-003: Redis for Caching)' },
        context: { type: 'string', description: 'Why this decision was necessary' },
        decision: { type: 'string', description: 'What choice was made' },
        consequences: { type: 'string', description: 'Pros, cons, and downstream effects' }
      },
      required: ['title', 'decision']
    }
  }
];

function handleRequest(request) {
  const { id, method, params } = request;

  // 1. Rate Limiting Check
  if (!checkRateLimit()) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32000, message: 'Rate limit exceeded: Maximum 120 requests per minute.' }
    };
  }

  // 2. Authentication Check for RPC methods requiring access
  if (method === 'tools/call' && REQUIRED_KEY) {
    const presentedKey = params?.apiKey || request.apiKey || (params?.arguments && params.arguments.apiKey);
    if (!verifyApiKey(presentedKey)) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32001, message: 'Unauthorized: Invalid or missing SRS Genie MCP key' }
      };
    }
  }

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {}, resources: {} },
          serverInfo: {
            name: 'srs-genie-mcp-server',
            version: '1.1.0'
          }
        }
      };

    case 'notifications/initialized':
      return null;

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };

    case 'tools/call': {
      const toolName = params?.name;
      const args = params?.arguments || {};

      try {
        if (toolName === 'get_spec_index') {
          const indexPath = path.join(SPECS_DIR, '_index.md');
          const content = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : 'Project index not found.';
          return {
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: content }] }
          };
        }

        if (toolName === 'get_spec_file') {
          if (!isPathSafe(SPECS_DIR, args.filePath)) {
            return {
              jsonrpc: '2.0',
              id,
              result: { isError: true, content: [{ type: 'text', text: 'Access denied: Illegal path traversal detected' }] }
            };
          }

          const targetPath = path.resolve(SPECS_DIR, args.filePath);
          if (!fs.existsSync(targetPath)) {
            return {
              jsonrpc: '2.0',
              id,
              result: { isError: true, content: [{ type: 'text', text: `Spec file not found: ${args.filePath}` }] }
            };
          }
          const content = fs.readFileSync(targetPath, 'utf8');
          return {
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: content }] }
          };
        }

        if (toolName === 'list_spec_tasks') {
          const tasksPath = path.join(SPECS_DIR, 'execution', 'tasks.md');
          const content = fs.existsSync(tasksPath) ? fs.readFileSync(tasksPath, 'utf8') : 'No tasks file found.';
          return {
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: content }] }
          };
        }

        if (toolName === 'get_current_state') {
          const statePath = path.join(SPECS_DIR, 'state', 'current_state.md');
          const content = fs.existsSync(statePath) ? fs.readFileSync(statePath, 'utf8') : 'No current state file found.';
          return {
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: content }] }
          };
        }

        if (toolName === 'append_decision_log') {
          // Input length limits to prevent disk exhaustion attacks
          const title = String(args.title || '').slice(0, 150).replace(/[\r\n]/g, ' ');
          const context = String(args.context || 'N/A').slice(0, 3000);
          const decision = String(args.decision || '').slice(0, 3000);
          const consequences = String(args.consequences || 'None noted').slice(0, 3000);

          if (!title || !decision) {
            return {
              jsonrpc: '2.0',
              id,
              result: { isError: true, content: [{ type: 'text', text: 'Missing required parameters: title and decision are mandatory.' }] }
            };
          }

          const adrPath = path.join(SPECS_DIR, 'state', 'decisions_log.md');
          const date = new Date().toISOString().split('T')[0];
          const newEntry = `\n\n### ${title}\n- **Date:** ${date}\n- **Context:** ${context}\n- **Decision:** ${decision}\n- **Consequences:** ${consequences}\n`;
          fs.appendFileSync(adrPath, newEntry);
          return {
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: `Appended decision record: ${title}` }] }
          };
        }

        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool not found: ${toolName}` }
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          result: { isError: true, content: [{ type: 'text', text: `Execution failed: ${err.message}` }] }
        };
      }
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
      };
  }
}

// Stdio JSON-RPC Stream
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', line => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const response = handleRequest(request);
    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    process.stderr.write(`Error parsing line: ${err.message}\n`);
  }
});
