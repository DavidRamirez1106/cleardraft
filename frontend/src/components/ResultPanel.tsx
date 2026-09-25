// Este SI puede ser un Server Component (sin "use client") porque no tiene estado
// propio ni maneja eventos - solo recibe datos por props y los pinta. Next.js lo
// renderiza donde sea mas conveniente; para nosotros no cambia nada visible, pero es
// buena practica no marcar "use client" en componentes que no lo necesitan.

import type { Translations } from "@/lib/i18n";
import type { ReviewResult } from "@/lib/types";
import { RISK_STYLES } from "@/lib/ui";

interface ResultPanelProps {
  draft: string;
  // Nullable: cuando este panel muestra un item cargado desde el historial cuyo
  // reviewJson guardado no parseo (ver InteractionSummary.java en el backend), no hay
  // review que mostrar - en ese caso pintamos el borrador igual, con un aviso en vez
  // del reporte de confianza, en lugar de que la pagina explote.
  review: ReviewResult | null;
  // Cuando el resultado viene de un click en el historial (en vez de una generacion
  // recien hecha), se lo aclaramos al usuario para que no piense que volvio a llamar
  // a la IA.
  fromHistory?: boolean;
  // Los textos ya resueltos en el idioma activo (ver lib/i18n.ts). Los recibimos por
  // prop en vez de llamar useLanguage() aca adentro para que este componente pueda
  // seguir siendo un Server Component (ver la nota mas abajo) - page.tsx (que si es
  // "use client") es quien resuelve el idioma y nos lo pasa ya armado.
  t: Translations;
}

export default function ResultPanel({ draft, review, fromHistory, t }: ResultPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {fromHistory && (
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {t.result.fromHistory}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t.result.draftHeading}
          </h2>
          <p className="whitespace-pre-wrap text-sm text-slate-800">{draft}</p>
        </section>

        <section className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {t.result.reviewHeading}
            </h2>
            {review && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${RISK_STYLES[review.risk_level]}`}
              >
                {t.risk[review.risk_level]}
              </span>
            )}
          </div>

          {!review ? (
            <p className="text-sm text-slate-500">{t.result.noReview}</p>
          ) : (
            <>
              <p className="mb-3 text-sm text-slate-700">{review.summary}</p>

              {review.flags.length === 0 ? (
                <p className="text-sm text-slate-500">{t.result.noObservations}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {review.flags.map((flag, index) => (
                    // Usamos el indice como key porque los flags no tienen un id propio y
                    // no se reordenan ni se editan en esta lista - un caso valido para
                    // hacerlo, aunque la regla general en React es preferir un id estable.
                    <li key={index} className="rounded-md bg-slate-50 p-2 text-sm">
                      <span className="mr-2 inline-block rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {t.flags[flag.type]}
                      </span>
                      <span className="text-slate-600">{flag.explanation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
