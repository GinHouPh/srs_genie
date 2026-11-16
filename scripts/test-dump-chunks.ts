import { buildStrategicPlanPrompt } from '../services/specAgentPrompts';

async function dumpChunks() {
  const formattedInputs = `
PROJECT NAME: SkyCourier Autonomous Fleet Logistics
INDUSTRY: Supply Chain & Logistics
TARGET USERS: Autonomous Fleet Operators, Air Traffic Coordinators, Warehouse Dispatchers
`;
  const prompt = buildStrategicPlanPrompt('project_plan', 'SkyCourier Autonomous Fleet Logistics', formattedInputs);

  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  const url = 'https://agentrouter.org/v1/responses';
  const model = 'gpt-5.6-sol';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Originator': 'codex_cli_rs'
    },
    body: JSON.stringify({
      model,
      input: prompt,
      stream: true
    })
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let count = 0;

  while (count < 30) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    count++;
    console.log(`--- Chunk #${count} ---`);
    console.log(text.slice(0, 200));
  }
}

dumpChunks();
