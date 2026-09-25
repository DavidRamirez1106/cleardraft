import type { RiskLevel } from "./types";

// Centralizar este mapa en un solo lugar evita que ResultPanel y HistoryList pinten el
// mismo riesgo con colores distintos por accidente. Los COLORES no dependen del idioma
// (por eso siguen aca) - los LABELS de texto ("Riesgo bajo" / "Low risk", etc.) si, asi
// que esos se movieron a i18n.ts (t.risk / t.flags) cuando agregamos el boton ES/EN.
export const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-emerald-100 text-emerald-800 border-emerald-300",
  medium: "bg-amber-100 text-amber-800 border-amber-300",
  high: "bg-red-100 text-red-800 border-red-300",
};
