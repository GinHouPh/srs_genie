import { GoogleGenAI } from '@google/genai';

async function checkGemini() {
  const apiKey = 'AIzaSyAMzGX1Ecar_VGg0BJP5xFZKcG81jul0bw';
  console.log('Testing Google Gemini API...');
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'hello, return one word'
    });
    console.log('Gemini response:', response.text);
  } catch (err: any) {
    console.error('Gemini error:', err.message);
  }
}

checkGemini();

