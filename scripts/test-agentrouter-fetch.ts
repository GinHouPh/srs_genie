async function testAR() {
  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  const url = 'https://agentrouter.org/v1/responses';
  const model = 'gpt-5.6-sol';
  const prompt = 'Hello, write a 2-sentence summary of an autonomous drone logistics platform.';

  console.log('Sending request to', url);
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
    console.log('Response keys:', Object.keys(data));
    console.log('Data:', JSON.stringify(data).slice(0, 300));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testAR();
