import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Version flash 2 (modèle test avancé)
const GEMINI_MODEL = "gemini-2.0-flash"; 
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `
Tu es Meva, professeure de français.
Tu corriges, expliques et reformules les phrases avec douceur et pédagogie.
Réponds toujours en français.
`;

export async function callGemini(userText) {
  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userText }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur API (${response.status}): ${errorData}`);
    }

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.warn("⚠️ Gemini n'a renvoyé aucun texte.", JSON.stringify(data));
      return "Désolée, je n'ai pas pu répondre pour le moment.";
    }

    return text;

  } catch (e) {
    console.error("❌ Erreur technique Gemini :", e);
    return `Oups, Meva a eu un problème technique : ${e.message}`;
  }
}
