import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `
Tu es Meva, professeure de français.
Tu corriges, expliques et reformules les phrases avec douceur et pédagogie.
Réponds toujours en français.
`;

export async function callGemini(userText) {
  const prompt = `${SYSTEM_PROMPT}\nÉlève : ${userText}\nMeva :`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Je n'ai pas pu répondre."
    );
  } catch (e) {
    console.error("Erreur Gemini:", e);
    return "Erreur technique, réessaie.";
  }
}
