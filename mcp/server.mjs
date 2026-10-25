#!/usr/bin/env node

/**
 * SRS Genie Model Context Protocol (MCP) Server
 * Implements MCP JSON-RPC 2.0 specification over STDIO
 * Enables AI Agents (Claude Desktop, Cursor, Antigravity, Windsurf) to access .specs directly.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const SPECS_DIR = path.resolve(process.cwd(), '.specs');

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
            version: '1.0.0'
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
          const targetPath = path.resolve(SPECS_DIR, args.filePath);
          if (!targetPath.startsWith(SPECS_DIR)) {
            return {
              jsonrpc: '2.0',
              id,
              result: { isError: true, content: [{ type: 'text', text: 'Access denied: Path outside .specs' }] }
            };
          }
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
          const adrPath = path.join(SPECS_DIR, 'state', 'decisions_log.md');
          const date = new Date().toISOString().split('T')[0];
          const newEntry = `\n\n### ${args.title}\n- **Date:** ${date}\n- **Context:** ${args.context || 'N/A'}\n- **Decision:** ${args.decision}\n- **Consequences:** ${args.consequences || 'None noted'}\n`;
          fs.appendFileSync(adrPath, newEntry);
          return {
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: `Appended decision record: ${args.title}` }] }
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
