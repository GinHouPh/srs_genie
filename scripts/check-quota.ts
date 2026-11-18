async function check() {
  const res = await fetch('https://agentrouter.org/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i',
      'Originator': 'codex_cli_rs'
    },
    body: JSON.stringify({
      model: 'gpt-5.6-sol',
      input: 'hello',
      stream: false
    })
  });
  console.log('Status:', res.status);
  const data = await res.json().catch(() => ({}));
  console.log('Response:', JSON.stringify(data, null, 2));
}

check();
