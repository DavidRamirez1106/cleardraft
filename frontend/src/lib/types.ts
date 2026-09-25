// Estos tipos son el espejo, en TypeScript, de los records Java que definimos en el
// backend (dto/DraftRequest.java, ReviewResult.java, etc.). No hay ninguna magia que
// los mantenga sincronizados automaticamente - si cambias un campo en el backend, hay
// que venir a actualizar esto a mano. Es una decision consciente de mantener el
// contrato consistente en ambos lados, replicada aqui porque el proyecto no usa un
// generador de tipos compartido (algo que si tendria sentido en un proyecto mas grande).

export type RiskLevel = "low" | "medium" | "high";

export type FlagType =
  | "unsupported_claim"
  | "tone_mismatch"
  | "missing_disclaimer"
  | "bias";

export interface Flag {
  type: FlagType;
  excerpt: string;
  explanation: string;
}

export interface ReviewResult {
  // risk_level en snake_case porque asi lo serializa @JsonProperty en el backend
  risk_level: RiskLevel;
  flags: Flag[];
  summary: string;
}

export interface DraftResponse {
  draft: string;
  review: ReviewResult;
}

export interface DraftRequest {
  preset: string;
  brief: string;
  tone?: string;
}

export interface InteractionSummary {
  id: number;
  createdAt: string;
  preset: string;
  brief: string;
  draft: string;
  riskLevel: string;
}

// Forma en la que el backend devuelve los errores (ver ApiError.java) - la usamos para
// mostrar un mensaje de error legible en vez de "algo salio mal".
export interface ApiError {
  error: string;
  message: string;
}
