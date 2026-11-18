async function testGemini() {
  const key = 'AIzaSyAMzGX1Ecar_VGg0BJP5xFZKcG81jul0bw';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  const data = await res.json();
  console.log('Gemini API status:', res.status);
  console.log('Gemini API response:', data);
}

testGemini();
