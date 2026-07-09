interface GeminiParams {
  system: string;
  user: string;
}

export async function callGemini({ system, user }: GeminiParams) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 secondes max

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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
              thinkingBudget: 0,
            },
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 503 || response.status === 429) {
        throw new Error("COACH_BUSY");
      }
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
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
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("COACH_BUSY");
    }
    throw err;
  }
}
