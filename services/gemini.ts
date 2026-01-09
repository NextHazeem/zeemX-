
import { GoogleGenAI } from "@google/genai";

export async function askGemini(prompt: string) {
  try {
    // Fix: Always use new GoogleGenAI({apiKey: process.env.API_KEY}); without fallbacks
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are zeemX Assistant, a calm, gentle, and helpful writing companion. Your tone is introverted, minimalist, and deeply empathetic. You help users with writing, brainstorming, and finding peace. Keep answers concise and beautiful.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a quiet moment of reflection. Please try again in a bit.";
  }
}
