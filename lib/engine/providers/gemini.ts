interface GeminiParams {
  system: string;
  user: string;
}

export async function callGemini({ system, user }: GeminiParams) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const maxRetries = 3;
  let attempt = 0;
  let response: Response | undefined;

  while (attempt < maxRetries) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: system }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: user }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
            thinkingConfig: {
              thinkingBudget: 512,
            },
          },
        }),
      }
    );

    if (response.ok || response.status !== 503) {
      break; // Sortir de la boucle si succès ou si l'erreur n'est pas 503
    }

    // Gérer l'erreur 503 avec un backoff exponentiel
    attempt++;
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 500 + Math.random() * 500; // 1s, 2s, 4s (+ jitter)
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  if (!response?.ok) {
    const errorText = await response?.text();
    throw new Error(`Gemini API error: ${response?.status} - ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];

  if (candidate?.finishReason === "SAFETY" || data.promptFeedback?.blockReason) {
    throw new Error(
      `Réponse bloquée par Gemini (finishReason: ${candidate?.finishReason || data.promptFeedback?.blockReason})`
    );
  }

  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Réponse vide de Gemini");
  }

  return text;
}
