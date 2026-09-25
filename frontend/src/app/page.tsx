"use client";
// Esta pagina necesita "use client" porque guarda estado (el resultado, si esta
// cargando, el historial) y reacciona a eventos (el submit del formulario). Es el
// componente "orquestador": sabe COMO se piden los datos (llama a lib/api.ts) pero le
// delega a los componentes hijos COMO se ven (DraftForm, ResultPanel, HistoryList).

import { useEffect, useRef, useState } from "react";
import DraftForm from "@/components/DraftForm";
import ResultPanel from "@/components/ResultPanel";
import HistoryList from "@/components/HistoryList";
import { fetchDraft, fetchHistory } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import type { DraftRequest, InteractionSummary, Language, ReviewResult } from "@/lib/types";

// Los 2 idiomas que soporta el boton del header - mismo codigo que Language (types.ts),
// pero como un array fijo para poder mapearlo al renderizar los 2 botones sin repetir
// "es"/"en" a mano en el JSX.
const LANGUAGE_OPTIONS: Language[] = ["es", "en"];

// Lo que se muestra en ResultPanel puede venir de dos lugares: una generacion recien
// hecha (fromHistory: false) o un click en un item del historial (fromHistory: true,
// historyId presente). Unificamos ambos casos en un solo tipo/estado en vez de tener
// "result" y "selectedHistoryItem" por separado, porque en la UI son mutuamente
// excluyentes - solo se muestra un panel de resultado a la vez.
interface DisplayedResult {
  draft: string;
  review: ReviewResult | null;
  fromHistory: boolean;
  historyId?: number;
}

export default function Home() {
  const { language, t, setLanguage } = useLanguage();
  const [displayed, setDisplayed] = useState<DisplayedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<InteractionSummary[]>([]);
  const resultRef = useRef<HTMLDivElement | null>(null);

  async function loadHistory() {
    try {
      const items = await fetchHistory();
      setHistory(items);
    } catch {
      // El historial es un bonus, no algo critico para el flujo principal: si falla
      // (por ejemplo, el backend todavia no arranco), no interrumpimos el resto de
      // la app con un error - simplemente el historial queda vacio.
    }
  }

  // useEffect con [] como segundo argumento: corre UNA sola vez, justo despues del
  // primer render (el equivalente a "cuando la pagina carga, trae el historial").
  //
  // La guia mas reciente de React (pensada para React Compiler) prefiere traer datos
  // con Suspense/la API `use()`, o una libreria como SWR, en vez de este patron
  // "fetch dentro de un efecto". Lo usamos aqui de forma deliberada: es mas simple de
  // razonar para un historial secundario, y evita acoplar el renderizado de la pagina
  // a que el backend este corriendo en tiempo de build (que es lo que pasaria si
  // este fetch inicial se moviera a un Server Component). Silenciamos la regla del
  // linter que asume el patron nuevo, con el motivo documentado aqui.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHistory();
  }, []);

  async function handleSubmit(request: DraftRequest) {
    setLoading(true);
    setError(null);
    setDisplayed(null);
    try {
      const response = await fetchDraft(request, t);
      setDisplayed({ draft: response.draft, review: response.review, fromHistory: false });
      await loadHistory(); // refresca el historial con la interaccion recien guardada
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  // Al hacer click en un item del historial, lo mostramos en el mismo ResultPanel que
  // usa una generacion recien hecha - el item ya trae draft + review completos (ver
  // InteractionSummary en types.ts), asi que no hace falta pedirle nada mas al backend.
  function handleSelectHistoryItem(item: InteractionSummary) {
    setError(null);
    setDisplayed({
      draft: item.draft,
      review: item.review,
      fromHistory: true,
      historyId: item.id,
    });
    // El panel de resultado queda arriba de la seccion de historial en el layout, asi
    // que sin este scroll el usuario que hizo click abajo no veria que algo cambio.
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.header.title}</h1>
          <p className="text-sm text-slate-500">{t.header.subtitle}</p>
        </div>

        {/* Controla 2 cosas a la vez: el idioma de ESTA interfaz (ve el usuario) y el
            idioma en el que le pedimos a la IA que escriba (ver DraftForm.tsx, que lee
            `language` de este mismo Context y lo manda en el request) - para que una
            demo en ingles quede consistente de punta a punta en vez de tener 2
            selectores separados que se puedan desincronizar. */}
        <div
          role="group"
          aria-label="Idioma / Language"
          className="flex shrink-0 gap-1 rounded-md border border-slate-200 p-1"
        >
          {LANGUAGE_OPTIONS.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              aria-pressed={language === code}
              className={`rounded px-2 py-1 text-xs font-semibold uppercase transition-colors ${
                language === code
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </header>

      <section className="rounded-lg border border-slate-200 p-5">
        <DraftForm onSubmit={handleSubmit} loading={loading} />
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {displayed && (
        <div ref={resultRef}>
          <ResultPanel
            draft={displayed.draft}
            review={displayed.review}
            fromHistory={displayed.fromHistory}
            t={t}
          />
        </div>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.history.heading}
        </h2>
        <HistoryList
          items={history}
          onSelect={handleSelectHistoryItem}
          selectedId={displayed?.fromHistory ? displayed.historyId : null}
          t={t}
        />
      </section>
    </main>
  );
}
