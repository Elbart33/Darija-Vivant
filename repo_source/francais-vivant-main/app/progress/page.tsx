"use client";
import { useUserMemory } from "@/hooks/useUserMemory";
import ProgressVisual from "@/components/ProgressVisual";

export default function ProgressPage() {
  const { memory, clear } = useUserMemory();

  if (!memory) {
    return <p className="text-ink/50 dark:text-sand/50">Chargement...</p>;
  }

  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-zellige dark:text-saffron">
          Mon chemin
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink dark:text-sand">
          Votre progression
        </h1>
        <p className="mt-2 text-ink/60 dark:text-sand/60">
          Pas de score, pas de niveau — juste le chemin que vous avez parcouru.
        </p>
      </section>
      <ProgressVisual
        situationsCompleted={memory.situationsCompleted}
        streakDays={memory.streakDays}
      />
      {memory.attempts.length > 0 && (
        <section>
          <button
            onClick={() => {
              if (confirm("Effacer toute votre progression locale ?")) clear();
            }}
            className="text-xs font-medium text-ink/40 underline decoration-dotted hover:text-clay dark:text-sand/40 dark:hover:text-rose"
          >
            Réinitialiser ma progression
          </button>
        </section>
      )}
    </div>
  );
}
