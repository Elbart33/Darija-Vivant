"use client";
import { useCallback, useState } from "react";
import { AnalysisResult, AppliedNote } from "@/types";
import { runLocalPipeline } from "@/lib/engine/correctionEngine";
import { tryAIAnalysis } from "@/lib/engine/aiLayer";
import { wordDiff } from "@/lib/engine/diff";

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback(
    async (
      rawSentence: string,
      situationTitle: string,
      situationIdiomIds: string[],
      situationTask: string = ""
    ) => {
      setLoading(true);

      const local = runLocalPipeline(rawSentence, situationIdiomIds);
      let corrected = local.corrected;
      let improved = local.improved;
      let correctionNotes: AppliedNote[] = local.correctionNotes;
      let improvementNotes: AppliedNote[] = local.improvementNotes;
      let correctionDiff = local.correctionDiff;
      let improvementDiff = local.improvementDiff;
      let usedAI = false;

      const ai = await tryAIAnalysis(rawSentence, situationTitle, situationTask);
      if (ai) {
        usedAI = true;
        corrected = ai.corrected;
        improved = ai.improved;
        const hasAiCorrectionOccurred = ai.corrected !== rawSentence;

        correctionNotes = hasAiCorrectionOccurred
          ? [
              {
                ruleId: `ai-correction-${ai.provider}`,
                before: rawSentence,
                after: ai.corrected,
                explanationFr:
                  ai.provider === "gemini"
                    ? ""
                    : ai.correctionExplanationFr || "Une petite correction a été apportée.",
                explanationDarija:
                  ai.provider === "gemini"
                    ? ai.correctionExplanationDarija || "تم إجراء تصحيح بسيط."
                    : ai.correctionExplanationDarija || "",
                stage: "correction",
              },
            ]
          : [];

        let improvementExplanationFr = "";
        let improvementExplanationDarija = "";

        const defaultImprovementExplanationFr = "Reformulation proposée pour sonner plus naturel.";
        const defaultImprovementExplanationDarijaGemini = "تم اقتراح إعادة صياغة لجعلها تبدو أكثر طبيعية.";

        const hasAiImprovementOccurred = ai.improved !== ai.corrected;

        if (hasAiImprovementOccurred) {
          if (ai.provider === "gemini") {
            improvementExplanationFr = "";
            improvementExplanationDarija = ai.improvementExplanationDarija || defaultImprovementExplanationDarijaGemini;
          } else {
            improvementExplanationFr = ai.improvementExplanationFr || defaultImprovementExplanationFr;
            improvementExplanationDarija = ai.improvementExplanationDarija || "";
          }

          improvementNotes = [{
            ruleId: `ai-improvement-${ai.provider}`,
            before: ai.corrected,
            after: ai.improved,
            explanationFr: improvementExplanationFr,
            explanationDarija: improvementExplanationDarija,
            stage: "amelioration",
          }];
        } else {
          improvementNotes = [];
        }
        correctionDiff = wordDiff(rawSentence, corrected, "corrected");
        improvementDiff = wordDiff(corrected, improved, "improved");
      }

      const finalResult: AnalysisResult = {
        original: local.original,
        corrected,
        improved,
        correctionNotes,
        improvementNotes,
        correctionDiff,
        improvementDiff,
        usedAI,
        matchedIdioms: local.matchedIdioms,
      };
      setResult(finalResult);
      setLoading(false);
      return finalResult;
    },
    []
  );

  const reset = useCallback(() => setResult(null), []);
  return { result, loading, analyze, reset };
}
