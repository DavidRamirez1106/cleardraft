"use client";
// Esta pagina necesita "use client" porque guarda estado (el resultado, si esta
// cargando, el historial) y reacciona a eventos (el submit del formulario). Es el
// componente "orquestador": sabe COMO se piden los datos (llama a lib/api.ts) pero le
// delega a los componentes hijos COMO se ven (DraftForm, ResultPanel, HistoryList).

import { useEffect, useState } from "react";
import DraftForm from "@/components/DraftForm";
import ResultPanel from "@/components/ResultPanel";
import HistoryList from "@/components/HistoryList";
import { fetchDraft, fetchHistory } from "@/lib/api";
import type { DraftRequest, DraftResponse, InteractionSummary } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<DraftResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<InteractionSummary[]>([]);

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
    setResult(null);
    try {
      const response = await fetchDraft(request);
      setResult(response);
      await loadHistory(); // refresca el historial con la interaccion recien guardada
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">ClearDraft</h1>
        <p className="text-sm text-slate-500">
          Genera contenido de negocio y revisa automáticamente su tono, riesgo y sesgo
          antes de enviarlo.
        </p>
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

      {result && <ResultPanel result={result} />}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Historial reciente
        </h2>
        <HistoryList items={history} />
      </section>
    </main>
  );
}
