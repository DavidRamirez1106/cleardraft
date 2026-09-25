import type { InteractionSummary, RiskLevel } from "@/lib/types";
import { RISK_LABELS, RISK_STYLES } from "@/lib/ui";
import { PRESETS } from "@/lib/presets";

interface HistoryListProps {
  items: InteractionSummary[];
}

function presetLabel(id: string): string {
  return PRESETS.find((p) => p.id === id)?.label ?? id;
}

export default function HistoryList({ items }: HistoryListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Todavía no hay interacciones guardadas.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800">{presetLabel(item.preset)}</p>
            <p className="truncate text-slate-500">{item.brief}</p>
          </div>
          <span
            className={`ml-3 shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${RISK_STYLES[item.riskLevel as RiskLevel]}`}
          >
            {RISK_LABELS[item.riskLevel as RiskLevel] ?? item.riskLevel}
          </span>
        </li>
      ))}
    </ul>
  );
}
