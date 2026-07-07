export interface AIAnalysisResult {
  corrected: string;
  correctionChanged: boolean;
  correctionExplanationFr: string;
  correctionExplanationDarija: string;
  improved: string;
  improvementChanged: boolean;
  improvementExplanationFr: string;
  improvementExplanationDarija: string;
  provider: string;
}

/**
 * Couche IA optionnelle : correction + enrichissement en un seul appel.
 * Tente le provider configuré (Mistral / Groq / Ollama) via /api/ai.
 * Retourne null en cas d'échec (réseau, quota, provider mal configuré...) —
 * les appelants doivent toujours avoir le moteur local en secours.
 * L'app est 100% fonctionnelle si cette fonction retourne toujours null.
 */
export async function tryAIAnalysis(
  rawSentence: string,
  situationTitle: string,
  situationTask: string = ""
): Promise<AIAnalysisResult | null> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence: rawSentence, situationTitle, situationTask }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.ok) return null;
    return {
      corrected: data.corrected,
      correctionChanged: Boolean(data.correctionChanged),
      correctionExplanationFr: data.correctionExplanationFr || "",
      correctionExplanationDarija: data.correctionExplanationDarija || "",
      improved: data.improved,
      improvementChanged: Boolean(data.improvementChanged),
      improvementExplanationFr: data.improvementExplanationFr || "",
      improvementExplanationDarija: data.improvementExplanationDarija || "",
      provider: data.provider || "ia",
    };
  } catch {
    return null;
  }
}
