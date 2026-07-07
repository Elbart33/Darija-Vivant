import Link from "next/link";
import { Situation } from "@/types";
import Icon from "./Icon";

export default function SituationCard({
  situation,
  featured = false,
}: {
  situation: Situation;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/situation/${situation.id}`}
      className={`group block rounded-2xl border transition-all ${
        featured
          ? "border-zellige/20 bg-zellige text-sand shadow-lg shadow-zellige/20 hover:shadow-xl"
          : "border-ink/10 bg-white/60 hover:border-zellige/30 hover:bg-white dark:border-sand/10 dark:bg-ink/40 dark:hover:border-saffron/30 dark:hover:bg-ink/60"
      } p-5 sm:p-6`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`mb-3 inline-grid h-10 w-10 place-items-center rounded-xl ${
              featured
                ? "bg-sand/15 text-sand"
                : "bg-saffron/15 text-saffronDeep dark:bg-saffron/10 dark:text-saffron"
            }`}
          >
            <Icon name={situation.icon} />
          </span>
          <h3
            className={`font-display text-xl font-semibold ${
              featured ? "text-sand" : "text-ink dark:text-sand"
            }`}
          >
            {situation.title}
          </h3>
          <p
            className={`mt-1.5 text-sm leading-relaxed ${
              featured ? "text-sand/80" : "text-ink/60 dark:text-sand/60"
            }`}
          >
            {situation.summary}
          </p>
        </div>
      </div>
      <div
        className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${
          featured ? "text-sand" : "text-zellige dark:text-saffron"
        }`}
      >
        Commencer
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
