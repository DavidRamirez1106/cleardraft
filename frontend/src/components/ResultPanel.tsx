// Este SI puede ser un Server Component (sin "use client") porque no tiene estado
// propio ni maneja eventos - solo recibe datos por props y los pinta. Next.js lo
// renderiza donde sea mas conveniente; para nosotros no cambia nada visible, pero es
// buena practica no marcar "use client" en componentes que no lo necesitan.

import type { DraftResponse } from "@/lib/types";
import { FLAG_LABELS, RISK_LABELS, RISK_STYLES } from "@/lib/ui";

interface ResultPanelProps {
  result: DraftResponse;
}

export default function ResultPanel({ result }: ResultPanelProps) {
  const { draft, review } = result;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-lg border border-slate-200 p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Borrador generado
        </h2>
        <p className="whitespace-pre-wrap text-sm text-slate-800">{draft}</p>
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Reporte de confianza
          </h2>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${RISK_STYLES[review.risk_level]}`}
          >
            {RISK_LABELS[review.risk_level]}
          </span>
        </div>

        <p className="mb-3 text-sm text-slate-700">{review.summary}</p>

        {review.flags.length === 0 ? (
          <p className="text-sm text-slate-500">Sin observaciones.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {review.flags.map((flag, index) => (
              // Usamos el indice como key porque los flags no tienen un id propio y no
              // se reordenan ni se editan en esta lista - un caso valido para hacerlo,
              // aunque la regla general en React es preferir un id estable.
              <li key={index} className="rounded-md bg-slate-50 p-2 text-sm">
                <span className="mr-2 inline-block rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {FLAG_LABELS[flag.type]}
                </span>
                <span className="text-slate-600">{flag.explanation}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
