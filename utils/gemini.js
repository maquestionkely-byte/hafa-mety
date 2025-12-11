import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();

    // 🔹 Logs pour debug complet
    console.log("💬 Réponse brute Gemini :", JSON.stringify(data, null, 2));

    // 🔹 Vérification complète des chemins possibles
    const text =
      data?.candidates?.[0]?.content?.[0]?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.output?.[0]?.content ||
      data?.error?.message;

    if (!text) {
      console.warn("⚠️ Gemini n'a renvoyé aucun texte ni erreur.");
      return "Je ne peux pas répondre.";
    }

    return text;
  } catch (e) {
    console.error("❌ Erreur technique Gemini :", e);
    return `Erreur technique Gemini : ${e.message}`;
  }
}
