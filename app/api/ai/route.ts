import { NextRequest, NextResponse } from "next/server";
import { callMistral } from "@/lib/engine/providers/mistral";
import { callGroq } from "@/lib/engine/providers/groq";
import { callOllama } from "@/lib/engine/providers/ollama";
import { callGemini } from "@/lib/engine/providers/gemini";

export const runtime = "edge";

const SYSTEM_PROMPT_MISTRAL = `Tu es un coach d'arabe discret pour un 
adulte francophone qui apprend l'arabe (darija marocaine), niveau A2+/B1.

Tu reçois UNE phrase en arabe, telle que l'utilisateur l'a écrite (en 
caractères arabes).

Fais deux passes, dans l'ordre :

1) CORRECTION — corrige uniquement les erreurs réelles : grammaire, 
conjugaison, genre, accords, confusions fréquentes chez un francophone qui 
apprend l'arabe. Ne change rien d'autre. Si la phrase est déjà correcte, 
"corrected" doit être identique à la phrase reçue.

2) AMÉLIORATION — à partir de la version corrigée, propose une 
reformulation plus naturelle et idiomatique en darija marocaine parlée, 
sans changer le sens. Si la phrase corrigée est déjà naturelle, "improved" 
doit être identique à "corrected".

Pour chaque passe où tu as changé la phrase, donne une explication très 
courte en français (une phrase, simple, jamais de jargon grammatical 
technique).
Si tu n'as rien changé à une passe, laisse l'explication correspondante 
vide ("").

Réponds STRICTEMENT en JSON valide, sans texte ni markdown autour, avec 
exactement ce format:
{"corrected": "...", "correctionChanged": true, "correctionExplanationFr": 
"...", "improved": "...", "improvementChanged": true, 
"improvementExplanationFr": "..."}`;

const SYSTEM_PROMPT_GEMINI = `Tu es un coach d'arabe (darija marocaine) 
pour un francophone qui apprend l'arabe, niveau A2+/B1.

Ta mission :
1. Corriger la phrase (grammaire, conjugaison, genre).
2. Améliorer la phrase pour qu'elle soit plus naturelle en darija parlée.
3. Pour chaque passe modifiée, fournir DEUX explications distinctes :
   - Une explication principale en darija marocaine (écriture arabe), 
courte et simple.
   - Une explication en français, courte et simple, qui dit la même chose 
que l'explication en darija.

Règles importantes sur l'amélioration :
- Vise un niveau de darija correcte et naturelle, ni trop soutenue ni trop 
familière.
- Si la phrase corrigée est déjà naturelle, "improved" doit être identique 
à "corrected".

Règles sur les explications :
- Chaque explication (darija et français) fait une à deux phrases maximum.
- Si tu cites un mot ou une expression arabe dans l'explication française, 
mets-le entre guillemets français comme ceci : «الكلمة».
- Mets en gras le mot ou la règle essentielle à retenir avec des doubles 
astérisques.
- S'il y a plusieurs erreurs, ne fais pas de liste numérotée : relie les 
explications avec des mots simples ("et aussi", "de plus"), pour que ça 
sonne naturel, pas scolaire.
- Si tu n'as rien changé à une passe, laisse les deux explications 
correspondantes vides ("").

La réponse doit être un JSON exactement dans ce format :
{
  "corrected": "الجملة المصححة",
  "correctionChanged": true,
  "correctionExplanationDarija": "شرح بالدارجة",
  "correctionExplanationFr": "explication en français",
  "improved": "الجملة المحسنة",
  "improvementChanged": true,
  "improvementExplanationDarija": "شرح بالدارجة",
  "improvementExplanationFr": "explication en français"
}

Ne réponds jamais avec du texte ou du markdown en dehors du JSON.`;

const SYSTEM_PROMPT_GROQ_DARIJA = `Tu es un coach d'arabe (darija 
marocaine) pour un francophone qui apprend l'arabe, niveau A2+/B1.

Ta mission :
1. Corriger la phrase (grammaire, conjugaison, genre).
2. Améliorer la phrase pour qu'elle soit plus naturelle en darija parlée.
3. Pour chaque passe modifiée, fournir une explication en darija marocaine 
(écriture arabe) ET une explication équivalente en français, chacune 
courte et simple.

Règles :
- Une à deux phrases d'explication maximum, dans chaque langue.
- Mets le mot ou la règle essentielle entre doubles astérisques.
- Si tu n'as rien changé, laisse les explications vides ("").

Réponds uniquement avec ce format JSON, sans texte ni markdown autour :
{"corrected": "...", "correctionChanged": true, 
"correctionExplanationDarija": "...", "correctionExplanationFr": "...", 
"improved": "...", "improvementChanged": true, 
"improvementExplanationDarija": "...", "improvementExplanationFr": 
"..."}`;

function extractString(text: string, key: string): string {
  const re = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "s");
  const m = text.match(re);
  return m ? m[1].replace(/\\n/g, " ").replace(/\\"/g, '"') : "";
}

function extractBool(text: string, key: string): boolean {
  const re = new RegExp(`"${key}"\\s*:\\s*(true|false)`);
  const m = text.match(re);
  return m ? m[1] === "true" : false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sentence: string = body?.sentence || "";
    const situationTitle: string = body?.situationTitle || "";
    const situationTask: string = body?.situationTask || "";

    if (!sentence.trim()) {
      return NextResponse.json({ ok: false, reason: "empty" }, { status: 
400 });
    }

    const provider = (process.env.AI_PROVIDER || "none").toLowerCase();

    if (provider === "none") {
      return NextResponse.json({
        ok: false,
        reason: "ai_disabled",
        debug: {
          rawProviderValue: process.env.AI_PROVIDER ?? null,
          hasMistralKey: Boolean(process.env.MISTRAL_API_KEY),
          hasGroqKey: Boolean(process.env.GROQ_API_KEY),
          hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
        },
      });
    }

    const userPrompt = `Situation: ${situationTitle}\nTâche demandée: 
${situationTask}\nPhrase: "${sentence}"`;

    let raw: string;
    let usedProvider: string = provider;

    try {
      if (provider === "gemini") {
        try {
          const params = { system: SYSTEM_PROMPT_GEMINI, user: userPrompt 
};
          raw = await callGemini(params);
          usedProvider = "gemini";
        } catch (geminiErr) {
          console.error("Gemini failed, falling back to Groq:", 
geminiErr);
          const params = { system: SYSTEM_PROMPT_GROQ_DARIJA, user: 
userPrompt };
          raw = await callGroq(params);
          usedProvider = "groq-darija";
        }
      } else if (provider === "mistral") {
        const params = { system: SYSTEM_PROMPT_MISTRAL, user: userPrompt 
};
        raw = await callMistral(params);
        usedProvider = "mistral";
      } else if (provider === "groq") {
        const params = { system: SYSTEM_PROMPT_MISTRAL, user: userPrompt 
};
        raw = await callGroq(params);
        usedProvider = "groq";
      } else if (provider === "ollama") {
        const params = { system: SYSTEM_PROMPT_MISTRAL, user: userPrompt 
};
        raw = await callOllama(params);
        usedProvider = "ollama";
      } else {
        return NextResponse.json({ ok: false, reason: "unknown_provider" 
});
      }
    } catch (err) {
      console.error("Provider error:", err);
      const isBusy = err instanceof Error && err.message === "COACH_BUSY";
      return NextResponse.json({
        ok: false,
        reason: isBusy ? "coach_busy" : "provider_error",
      });
    }

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    const jsonSlice =
      firstBrace !== -1 && lastBrace !== -1
        ? cleaned.slice(firstBrace, lastBrace + 1)
        : cleaned;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonSlice);
    } catch {
      const corrected = extractString(raw, "corrected");
      if (!corrected) {
        console.error("Parse error (fallback failed). Raw:", raw);
        return NextResponse.json({ ok: false, reason: "parse_error", 
debugRaw: raw });
      }
      parsed = {
        corrected,
        correctionChanged: extractBool(raw, "correctionChanged"),
        correctionExplanationFr: extractString(raw, 
"correctionExplanationFr"),
        correctionExplanationDarija: extractString(raw, 
"correctionExplanationDarija"),
        improved: extractString(raw, "improved") || corrected,
        improvementChanged: extractBool(raw, "improvementChanged"),
        improvementExplanationFr: extractString(raw, 
"improvementExplanationFr"),
        improvementExplanationDarija: extractString(raw, 
"improvementExplanationDarija"),
      };
    }

    if (!parsed.corrected && !parsed.improved) {
      return NextResponse.json({ ok: false, reason: "no_content" });
    }

    const correctionExplanationFr = parsed.correctionExplanationFr || "";
    const correctionExplanationDarija = parsed.correctionExplanationDarija 
|| "";
    const improvementExplanationFr = parsed.improvementExplanationFr || 
"";
    const improvementExplanationDarija = 
parsed.improvementExplanationDarija || "";

    return NextResponse.json({
      ok: true,
      corrected: parsed.corrected || sentence,
      correctionChanged: Boolean(parsed.correctionChanged),
      correctionExplanationFr: correctionExplanationFr,
      correctionExplanationDarija: correctionExplanationDarija,
      improved: parsed.improved || parsed.corrected || sentence,
      improvementChanged: Boolean(parsed.improvementChanged),
      improvementExplanationFr: improvementExplanationFr,
      improvementExplanationDarija: improvementExplanationDarija,
      provider: usedProvider,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ ok: false, reason: "unexpected_error" }, { 
status: 500 });
  }
}
