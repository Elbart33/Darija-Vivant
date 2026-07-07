import situationsData from "@/data/situations.json";
import { Situation } from "@/types";

const situations = situationsData as Situation[];

const DAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];

function getLastSevenDayLabels(): string[] {
  const labels: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(DAY_LABELS[d.getDay()]);
  }
  return labels;
}

export default function ProgressVisual({
  situationsCompleted,
  streakDays,
}: {
  situationsCompleted: string[];
  streakDays: number;
}) {
  const dayLabels = getLastSevenDayLabels();

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/40 dark:text-sand/40">
          Votre régularité
        </p>
        <div className="flex items-end gap-3">
          {dayLabels.map((label, i) => {
            // Les jours de streak sont comptés à partir d'aujourd'hui en remontant.
            // i=6 correspond à aujourd'hui (dernier élément du tableau).
            const daysAgo = 6 - i;
            const lit = daysAgo < streakDays;
            const isToday = daysAgo === 0;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 rounded-t-full transition-all ${
                    lit ? "bg-saffron" : "bg-ink/10 dark:bg-sand/10"
                  }`}
                  style={{ height: lit ? `${44 + i * 6}px` : "20px" }}
                />
                <span
                  className={`text-xs font-medium ${
                    isToday
                      ? "text-ink dark:text-sand"
                      : "text-ink/40 dark:text-sand/40"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-base text-ink/60 dark:text-sand/60">
          {streakDays <= 1
            ? "Revenez demain pour construire votre régularité."
            : `Vous pratiquez régulièrement depuis ${streakDays} jours consécutifs.`}
        </p>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40 dark:text-sand/40">
          Les chemins que vous avez explorés
        </p>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
          {situations.map((s) => {
            const done = situationsCompleted.includes(s.id);
            return (
              <div
                key={s.id}
                className={`aspect-square rounded-lg border transition-all ${
                  done
                    ? "border-zellige bg-zellige text-sand shadow-sm shadow-zellige/25"
                    : "border-ink/10 bg-white/40 text-ink/20 dark:border-sand/10 dark:bg-ink/40 dark:text-sand/20"
                } grid place-items-center`}
                title={s.title}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-ink/50 dark:text-sand/50">
          {situationsCompleted.length === 0
            ? "Aucun chemin exploré pour l'instant."
            : situationsCompleted.length === situations.length
            ? "Vous avez exploré toutes les situations disponibles."
            : "Chaque tuile allumée est une situation où vous avez pratiqué."}
        </p>
      </div>
    </div>
  );
}
