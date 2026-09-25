import type { FlagType, RiskLevel } from "./types";

// Centralizar estos mapas en un solo lugar evita que ResultPanel y HistoryList
// pinten el mismo riesgo con colores distintos por accidente.

export const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-emerald-100 text-emerald-800 border-emerald-300",
  medium: "bg-amber-100 text-amber-800 border-amber-300",
  high: "bg-red-100 text-red-800 border-red-300",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Riesgo bajo",
  medium: "Riesgo medio",
  high: "Riesgo alto",
};

export const FLAG_LABELS: Record<FlagType, string> = {
  unsupported_claim: "Claim sin sustento",
  tone_mismatch: "Tono inadecuado",
  missing_disclaimer: "Falta disclaimer",
  bias: "Posible sesgo",
};
