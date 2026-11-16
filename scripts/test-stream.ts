async function testStream() {
  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  const url = 'https://agentrouter.org/v1/responses';
  const model = 'gpt-5.6-sol';
  const prompt = 'Synthesize a 3-paragraph architecture overview of an autonomous drone logistics system.';

  console.log('Testing streaming on /v1/responses...');
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
        input: prompt,
        stream: true
      })
    });
    console.log('Status:', res.status, 'in', Date.now() - start, 'ms');
    if (!res.body) {
      console.log('No body');
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let totalChunks = 0;
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalChunks++;
      const chunk = decoder.decode(value);
      text += chunk;
      if (totalChunks % 10 === 0) {
        process.stdout.write('.');
      }
    }
    console.log('\nStream completed in', Date.now() - start, 'ms with', totalChunks, 'chunks. Total len:', text.length);
    console.log('Sample text:\n', text.slice(0, 300));
  } catch (e) {
    console.error('Error:', e);
  }
}

testStream();
