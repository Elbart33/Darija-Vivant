export type IconName = "stethoscope" | "phone" | "file" | "basket" | "card";
export interface Comprehension {
  prompt: string;
  question: string;
  options: string[];
  answerIndex: number;
}
export interface Situation {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  context: string;
  comprehension: Comprehension;
  task: string;
  starterHint: string;
  idiomIds: string[];
}
export type ErrorType = "grammar" | "phonology" | "lexical";
export interface ErrorRule {
  id: string;
  pattern: string;
  flags: string;
  replacement: string;
  type: ErrorType;
  explanationFr: string;
  explanationDarija: string;
}
export interface CorrectionRule {
  id: string;
  pattern: string;
  flags: string;
  natural: string;
  registre: "poli" | "naturel" | "soigné" | "chaleureux";
  explanationFr: string;
  explanationDarija: string;
}
export interface Idiom {
  id: string;
  expression: string;
  meaningFr: string;
  meaningDarija: string;
  example: string;
}
export type DiffKind = "same" | "corrected" | "improved";
export interface DiffSegment {
  text: string;
  kind: DiffKind;
  note?: string;
}
export interface AppliedNote {
  ruleId: string;
  before: string;
  after: string;
  explanationFr: string;
  explanationDarija: string;
  stage: "correction" | "amelioration";
}
export interface AnalysisResult {
  original: string;
  corrected: string;
  improved: string;
  correctionNotes: AppliedNote[];
  improvementNotes: AppliedNote[];
  correctionDiff: DiffSegment[];
  improvementDiff: DiffSegment[];
  usedAI: boolean;
  matchedIdioms: Idiom[];
}
export interface SituationAttempt {
  situationId: string;
  timestamp: number;
  original: string;
  corrected: string;
  improved: string;
  correctionNotes: AppliedNote[];
  improvementNotes: AppliedNote[];
}
export interface UserMemory {
  attempts: SituationAttempt[];
  errorFrequency: Record<string, number>;
  situationsCompleted: string[];
  streakDays: number;
  lastVisit: string | null;
}
