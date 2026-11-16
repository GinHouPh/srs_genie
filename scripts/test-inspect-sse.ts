async function inspectEvents() {
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
      input: 'Say hello in 5 words',
      stream: true
    })
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('output_text.delta')) {
        console.log(lines[i], lines[i + 1]);
      }
    }
  }
}

inspectEvents();
