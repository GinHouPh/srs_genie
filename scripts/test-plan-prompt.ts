import { buildStrategicPlanPrompt } from '../services/specAgentPrompts';

async function testFocusedPrompt() {
  const formattedInputs = `
PROJECT NAME: SkyCourier Autonomous Fleet Logistics
INDUSTRY: Supply Chain & Logistics
TARGET USERS: Autonomous Fleet Operators, Air Traffic Coordinators, Warehouse Dispatchers
EXPECTED TIMELINE: 3-4 months
BACKEND: Node.js 22 LTS / Express TypeScript
DATABASE: PostgreSQL 16 + Redis 7
FRONTEND: React 19 / TypeScript / Tailwind CSS
SECURITY: SOC 2 Type II, ISO 27001, OWASP Top 10
CLOUD: Serverbyt Cloud StackCP / Docker Containers
`;
  const prompt = `You are a Principal Solutions Architect.
Synthesize the authoritative Parent Project Plan for "SkyCourier Autonomous Fleet Logistics" based on these requirements:
${formattedInputs}

Provide:
1. Executive Architecture Summary & Vision
2. Core Subsystems & Component Register (ARC-001 to ARC-006)
3. Data Models & Entity Schemas (PostgreSQL DDL)
4. Key Functional Features (FEAT-001 to FEAT-008)
5. Zero-Trust Security & Compliance Matrix
6. Production Deployment Strategy

Format in clean GitHub-Flavored Markdown.`;

  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  const url = 'https://agentrouter.org/v1/responses';
  const model = 'gpt-5.6-sol';

  console.log('Sending focused prompt (length:', prompt.length, ')...');
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Originator': 'codex_cli_rs'
      },
      body: JSON.stringify({
        model,
        input: prompt
      })
    });
    console.log('Status:', res.status, 'in', Date.now() - start, 'ms');
    const data = await res.json();
    const msg = data.output?.find((o: any) => o.type === 'message');
    const text = msg?.content?.[0]?.text || '';
    console.log('Returned text length:', text.length);
    console.log('Preview:\n', text.slice(0, 300));
  } catch (e) {
    console.error('Error:', e);
  }
}

testFocusedPrompt();
