"use client";
import { useState } from "react";
import { renderExplanation } from "@/lib/renderExplanation";

export default function CoachNote({
  explanationFr,
  explanationDarija,
  tone = "correction",
}: {
  explanationFr: string;
  explanationDarija?: string;
  tone?: "correction" | "amelioration";
}) {
  const [showDarija, setShowDarija] = useState(false);

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-body ${
        tone === "correction"
          ? "border-clay/20 bg-clay/5 text-ink/90 dark:border-rose/25 dark:bg-clay/10 dark:text-sand/90"
          : "border-zellige/20 bg-zellige/5 text-ink/90 dark:border-zellige/30 dark:bg-zellige/10 dark:text-sand/90"
      }`}
    >
      {explanationFr && <p>{renderExplanation(explanationFr, tone)}</p>}

      {explanationDarija && (
        <div className={explanationFr ? "mt-3" : ""}>
          {showDarija ? (
            <p
              dir="rtl"
              lang="ar"
              className="animate-fadeUp text-lg leading-relaxed text-ink dark:text-sand"
            >
              {renderExplanation(explanationDarija, tone)}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setShowDarija(true)}
              dir="rtl"
              lang="ar"
              className={`animate-pulseSoft flex w-full items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-right transition-colors ${
                tone === "correction"
                  ? "border-clay/40 bg-clay/10 hover:border-clay/60 hover:bg-clay/15 dark:border-rose/40 dark:bg-clay/15 dark:hover:border-rose/60 dark:hover:bg-clay/25"
                  : "border-zellige/40 bg-zellige/10 hover:border-zellige/60 hover:bg-zellige/15 dark:border-zellige/50 dark:bg-zellige/15 dark:hover:border-saffron/50 dark:hover:bg-zellige/25"
              }`}
            >
              <span className="text-base font-semibold text-ink dark:text-sand">
                ورك هنا باش تفهم 😊
              </span>
              <span className="text-xl">💬</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
