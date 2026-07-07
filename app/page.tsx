import situationsData from "@/data/situations.json";
import { Situation } from "@/types";
import SituationCard from "@/components/SituationCard";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const situations = situationsData as Situation[];

function situationOfTheDay(): Situation {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return situations[dayOfYear % situations.length];
}

export default function HomePage() {
  const today = situationOfTheDay();
  const rest = situations.filter((s) => s.id !== today.id);

  return (
    <div className="space-y-12">
      <section className="animate-fadeUp relative overflow-hidden rounded-3xl border border-zellige/15 bg-white/50 px-6 py-10 dark:border-sand/10 dark:bg-ink/40 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-saffron/10 blur-2xl dark:bg-saffron/5"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-zellige/10 blur-2xl dark:bg-zellige/10"
        />

        <p className="relative inline-flex items-center gap-2 rounded-full bg-zellige/10 px-3 py-1 text-eyebrow font-semibold uppercase text-zellige dark:bg-sand/10 dark:text-saffron">
          <span className="h-1.5 w-1.5 rounded-full bg-zellige dark:bg-saffron" />
          Situation du jour
        </p>

        <h1 className="relative mt-4 max-w-xl font-display text-h1 font-semibold text-ink dark:text-sand sm:text-h1-lg">
          Aujourd&apos;hui, on parle de{" "}
          <span className="italic text-zellige dark:text-saffron">
            {today.title.toLowerCase()}
          </span>
          .
        </h1>
      </section>

      <section>
        <SituationCard situation={today} featured />
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <p className="text-eyebrow font-semibold uppercase text-ink/40 dark:text-sand/40">
            Autres situations
          </p>
          <span className="h-px flex-1 bg-ink/10 dark:bg-sand/10" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((s) => (
            <SituationCard key={s.id} situation={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
