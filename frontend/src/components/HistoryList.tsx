import type { Translations } from "@/lib/i18n";
import { presetLabel } from "@/lib/i18n";
import type { InteractionSummary, RiskLevel } from "@/lib/types";
import { RISK_STYLES } from "@/lib/ui";

interface HistoryListProps {
  items: InteractionSummary[];
  // Que hacer cuando el usuario hace click en un item: le pasamos el item completo
  // (ya trae draft + review, ver InteractionSummary en types.ts) para que quien nos
  // use decida que hacer con el - en nuestro caso, page.tsx lo carga en ResultPanel.
  onSelect: (item: InteractionSummary) => void;
  selectedId?: number | null;
  // Ver el mismo comentario en ResultPanel.tsx: recibimos los textos ya resueltos por
  // prop en vez de leer el Context de idioma aca adentro.
  t: Translations;
}

export default function HistoryList({ items, onSelect, selectedId, t }: HistoryListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{t.history.empty}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id}>
          {/* <button> en vez de <li> clickeable a mano: da foco por teclado, Enter/Space
              lo activan, y un lector de pantalla lo anuncia como interactivo - todo eso
              gratis por usar el elemento semantico correcto en vez de un onClick en un li. */}
          <button
            type="button"
            onClick={() => onSelect(item)}
            aria-pressed={item.id === selectedId}
            className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors hover:border-slate-300 hover:bg-slate-50 ${
              item.id === selectedId
                ? "border-slate-400 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">{presetLabel(t, item.preset)}</p>
              <p className="truncate text-slate-500">{item.brief}</p>
            </div>
            <span
              className={`ml-3 shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${RISK_STYLES[item.riskLevel as RiskLevel]}`}
            >
              {t.risk[item.riskLevel as RiskLevel] ?? item.riskLevel}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
