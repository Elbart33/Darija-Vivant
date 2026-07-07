import errorsData from "@/data/errors.json";
import correctionsData from "@/data/corrections.json";
import idiomsData from "@/data/idioms.json";
import { AppliedNote, ErrorRule, CorrectionRule, Idiom } from "@/types";
import { wordDiff } from "./diff";

const errorRules = errorsData as ErrorRule[];
const correctionRules = correctionsData as CorrectionRule[];
const idioms = idiomsData as Idiom[];

/**
 * STAGE 1 — RECALIBRAGE
 * Fixes fossilized grammar / phonology / lexical errors.
 * Purely local, deterministic, no network required.
 */
export function applyRecalibrage(input: string): {
  corrected: string;
  notes: AppliedNote[];
} {
  let text = input;
  const notes: AppliedNote[] = [];

  for (const rule of errorRules) {
    const regex = new RegExp(rule.pattern, rule.flags);
    if (regex.test(text)) {
      const before = text;
      text = text.replace(new RegExp(rule.pattern, rule.flags), rule.replacement);
      if (text !== before) {
        notes.push({
          ruleId: rule.id,
          before,
          after: text,
          explanationFr: rule.explanationFr,
          explanationDarija: rule.explanationDarija,
          stage: "correction",
        });
      }
    }
  }

  return { corrected: text, notes };
}

/**
 * STAGE 2 — DÉVELOPPEMENT
 * Enriches an already-correct sentence toward a more natural, idiomatic register.
 */
export function applyDeveloppement(input: string): {
  improved: string;
  notes: AppliedNote[];
} {
  let text = input;
  const notes: AppliedNote[] = [];

  for (const rule of correctionRules) {
    const regex = new RegExp(rule.pattern, rule.flags);
    if (regex.test(text)) {
      const before = text;
      text = text.replace(new RegExp(rule.pattern, rule.flags), rule.natural);
      if (text !== before) {
        notes.push({
          ruleId: rule.id,
          before,
          after: text,
          explanationFr: rule.explanationFr,
          explanationDarija: rule.explanationDarija,
          stage: "amelioration",
        });
      }
    }
  }

  return { improved: text, notes };
}

export function findMatchingIdioms(text: string, situationIdiomIds: string[]): Idiom[] {
  const lower = text.toLowerCase();
  const fromText = idioms.filter((idiom) =>
    lower.includes(idiom.expression.split(" (")[0].toLowerCase().split("/")[0].trim())
  );
  const fromSituation = idioms.filter((idiom) => situationIdiomIds.includes(idiom.id));

  const merged = new Map<string, Idiom>();
  [...fromSituation, ...fromText].forEach((i) => merged.set(i.id, i));
  return Array.from(merged.values()).slice(0, 3);
}

/**
 * Runs the full local pipeline: recalibrage -> développement -> diff building.
 * This function alone is enough to make the app fully functional with 0 network calls.
 */
export function runLocalPipeline(original: string, situationIdiomIds: string[] = []) {
  const { corrected, notes: correctionNotes } = applyRecalibrage(original);
  const { improved, notes: improvementNotes } = applyDeveloppement(corrected);

  const correctionDiff = wordDiff(original, corrected, "corrected");
  const improvementDiff = wordDiff(corrected, improved, "improved");

  const matchedIdioms = findMatchingIdioms(original, situationIdiomIds);

  return {
    original,
    corrected,
    improved,
    correctionNotes,
    improvementNotes,
    correctionDiff,
    improvementDiff,
    matchedIdioms,
  };
}

export function frequentErrorIds(notes: AppliedNote[]): string[] {
  return notes.map((n) => n.ruleId);
}
