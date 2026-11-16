async function testARChat() {
  const apiKey = 'sk-2fzyZmibBuOLhqmOzcyyq0UaU9bf2s8LOws0DaIkDim7sy1i';
  const url = 'https://agentrouter.org/v1/chat/completions';
  const model = 'gpt-5.6-sol';

  console.log('Testing /chat/completions on AgentRouter...');
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
        messages: [{ role: 'user', content: 'Say hello in 3 words' }]
      })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Full data:', data);
  } catch (e) {
    console.error('Error:', e);
  }
}

testARChat();
