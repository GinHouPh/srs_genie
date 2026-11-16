async function testCompactPrompt() {
  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  const rawBaseUrl = 'https://agentrouter.org/v1';

  const prompt = `
You are a Principal Product Manager & Lead Architect.
Synthesize the authoritative Product Requirements Document (PRD) for "SkyCourier Autonomous Fleet Logistics".
Industry: Supply Chain & Logistics
Type: Full-Scale Production System
Tech Stack: Node.js 22 LTS, PostgreSQL 16, React 19, Redis 7, Docker

Scope:
1. Executive Vision & Problem Statement
2. Target User Personas & Permissions
3. Functional Specifications (Telemetry, Air Corridors, Dispatch, Proof of Delivery)
4. Non-Functional Requirements (Latency <100ms, 99.99% uptime, SOC 2)
5. Out-of-Scope Boundaries

Output in structured, clean GitHub-flavored Markdown.
`;

  console.log('Prompt length:', prompt.length);
  const t0 = Date.now();
  console.log('Sending focused prompt to AgentRouter...');
  
  const res = await fetch(`${rawBaseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Originator': 'codex_cli_rs'
    },
    body: JSON.stringify({
      model: 'gpt-5.6-sol',
      input: prompt
    })
  });

  console.log('Response Status:', res.status, 'Elapsed:', (Date.now() - t0) + 'ms');
  const data = await res.json();
  const msg = data.output?.find((o: any) => o.type === 'message');
  const text = msg?.content?.[0]?.text || '';
  console.log('Returned Text Length:', text.length);
  console.log('Preview (First 350 chars):\n', text.substring(0, 350));
}

testCompactPrompt().catch(console.error);
