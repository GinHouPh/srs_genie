async function listModels() {
  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  try {
    const res = await fetch('https://agentrouter.org/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Originator': 'codex_cli_rs'
      }
    });
    console.log('Models status:', res.status);
    const data = await res.json();
    console.log('Models count:', data.data?.length);
    console.log('Models:', data.data?.map((m: any) => m.id).slice(0, 30));
  } catch (e) {
    console.error('Error:', e);
  }
}

listModels();
