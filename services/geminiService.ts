
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateBlogPost = async (prompt: string): Promise<{ title: string; content: string }> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }

  try {
    const fullPrompt = `Based on the following topic, generate a blog post with a 'title' and 'content'. The content should be in markdown format.
    
    Topic: "${prompt}"
    
    Return the response as a JSON object with two keys: "title" and "content".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    if (parsed.title && parsed.content) {
      return { title: parsed.title, content: parsed.content };
    } else {
      throw new Error("Invalid format from AI response");
    }
  } catch (error) {
    console.error("Error generating blog post with Gemini:", error);
    throw new Error("Failed to generate content from AI. Please try again.");
  }
};
