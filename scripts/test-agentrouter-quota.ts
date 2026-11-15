async function checkAgentRouterResponses() {
  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  const url = 'https://agentrouter.org/v1/responses';

  console.log('Sending test request to AgentRouter /responses with Originator: codex_cli_rs...');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Originator': 'codex_cli_rs'
    },
    body: JSON.stringify({
      model: 'gpt-5.6-sol',
      input: 'hello'
    })
  });

  console.log('HTTP Status:', res.status);
  const data = await res.json().catch(e => ({ error: e.message }));
  console.log('Response body:', JSON.stringify(data, null, 2));
}

checkAgentRouterResponses();
