"use client";
// "use client" es una directiva especifica de Next.js App Router. Por defecto, TODO
// componente en src/app o src/components es un "Server Component": se renderiza en el
// servidor y no puede usar useState, useEffect ni manejar eventos del navegador (onClick,
// onChange). En cuanto un componente necesita interactividad - como este formulario, que
// guarda lo que el usuario escribe - hay que marcarlo explicitamente "use client" para que
// Next.js lo mande al navegador como JavaScript normal de React.
//
// Por que existen los Server Components entonces? Para paginas que solo muestran datos
// (sin interactividad), renderizar en el servidor manda menos JavaScript al navegador,
// lo que hace la pagina mas rapida. En este proyecto casi todo es interactivo, asi que
// usamos "use client" en los componentes que lo necesitan.

import { useState, type FormEvent } from "react";
import { PRESETS, TONES } from "@/lib/presets";
import { presetLabel, toneLabel } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import type { DraftRequest } from "@/lib/types";

interface DraftFormProps {
  onSubmit: (request: DraftRequest) => void;
  loading: boolean;
}

export default function DraftForm({ onSubmit, loading }: DraftFormProps) {
  // Este componente ya era "use client" (maneja su propio estado), asi que consumir el
  // Context de idioma directo aca - en vez de recibirlo por props desde page.tsx, como
  // hacemos con ResultPanel/HistoryList - no agrega ningun costo nuevo. Ademas nos
  // conviene: `language` es justo lo que hace falta mandar en el request (ver
  // handleSubmit), asi que evitamos duplicar esa lectura en el padre.
  const { t, language } = useLanguage();

  // useState es el hook basico de React para guardar datos que, al cambiar, hacen que
  // el componente se vuelva a renderizar. Cada campo del formulario tiene el suyo.
  const [preset, setPreset] = useState(PRESETS[0].id);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [brief, setBrief] = useState("");

  const briefIsValid = brief.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // evita que el navegador recargue la pagina al enviar el form
    if (!briefIsValid || loading) return;
    onSubmit({ preset, tone, brief: brief.trim(), language });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="preset" className="block text-sm font-medium text-slate-700 mb-1">
          {t.form.presetLabel}
        </label>
        <select
          id="preset"
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          {PRESETS.map((option) => (
            <option key={option.id} value={option.id}>
              {presetLabel(t, option.id)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-1">
          {t.form.toneLabel}
        </label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          {TONES.map((option) => (
            <option key={option} value={option}>
              {toneLabel(t, option)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="brief" className="block text-sm font-medium text-slate-700 mb-1">
          {t.form.briefLabel}
        </label>
        <textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={4}
          placeholder={t.form.briefPlaceholder}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        {!briefIsValid && brief.length > 0 && (
          <p className="mt-1 text-sm text-red-600">{t.form.briefRequired}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!briefIsValid || loading}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? t.form.submitLoading : t.form.submitIdle}
      </button>
    </form>
  );
}
