async function testEffort() {
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
      input: 'Provide 3 key architecture components of a drone dispatch backend in Markdown.',
      reasoning: { effort: 'low' },
      stream: true
    })
  });

  console.log('Status:', res.status);
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  const start = Date.now();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const l of lines) {
      if (!l.startsWith('data:')) continue;
      try {
        const p = JSON.parse(l.slice(5).trim());
        if (typeof p.delta === 'string') text += p.delta;
      } catch {}
    }
  }
  console.log('Finished in', Date.now() - start, 'ms. Text length:', text.length);
  console.log(text.slice(0, 200));
}

testEffort();
