"use client";
import errorsData from "@/data/errors.json";
import correctionsData from "@/data/corrections.json";
import { ErrorRule, CorrectionRule } from "@/types";
import { useUserMemory } from "@/hooks/useUserMemory";
import { topErrorIds } from "@/lib/storage/userMemory";
import CoachNote from "@/components/CoachNote";

const errorRules = errorsData as ErrorRule[];
const correctionRules = correctionsData as CorrectionRule[];

function ruleById(id: string): { fr: string; darija: string } | null {
  const err = errorRules.find((r) => r.id === id);
  if (err) return { fr: err.explanationFr, darija: err.explanationDarija };
  const corr = correctionRules.find((r) => r.id === id);
  if (corr) return { fr: corr.explanationFr, darija: corr.explanationDarija };
  return null;
}

export default function ReviewPage() {
  const { memory } = useUserMemory();

  if (!memory) {
    return <p className="text-ink/50 dark:text-sand/50">Chargement...</p>;
  }

  const frequent = topErrorIds(memory, 5);
  const recentAttempts = [...memory.attempts].reverse().slice(0, 8);

  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-zellige dark:text-saffron">
          À revoir
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink dark:text-sand">
          Ce qui revient souvent
        </h1>
        <p className="mt-2 text-ink/60 dark:text-sand/60">
          Ces points reviennent plusieurs fois dans vos réponses. Les revoir aide à
          les fixer durablement.
        </p>
      </section>
      <section className="space-y-3">
        {frequent.length === 0 ? (
          <p className="rounded-2xl border border-ink/10 bg-white/50 p-6 text-ink/50 dark:border-sand/10 dark:bg-ink/40 dark:text-sand/50">
            Pas encore assez de pratique pour dégager une tendance. Faites une
            situation pour commencer.
          </p>
        ) : (
          frequent.map((id) => {
            const rule = ruleById(id);
            if (!rule) return null;
            return (
              <CoachNote
                key={id}
                explanationFr={rule.fr}
                explanationDarija={rule.darija}
                tone="correction"
              />
            );
          })
        )}
      </section>
      <section>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/40 dark:text-sand/40">
          Phrases récentes à revoir
        </p>
        {recentAttempts.length === 0 ? (
          <p className="text-ink/50 dark:text-sand/50">Aucune phrase enregistrée pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {recentAttempts.map((a, i) => (
              <div
                key={i}
                className="rounded-2xl border border-ink/10 bg-white/50 p-5 dark:border-sand/10 dark:bg-ink/40"
              >
                <p className="text-sm text-ink/50 line-through decoration-clay/40 dark:text-sand/50 dark:decoration-rose/40">
                  {a.original}
                </p>
                <p className="mt-1.5 font-display text-lg text-zellige2 dark:text-saffron">
                  {a.improved}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
