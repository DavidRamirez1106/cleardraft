// Estos tipos son el espejo, en TypeScript, de los records Java que definimos en el
// backend (dto/DraftRequest.java, ReviewResult.java, etc.). No hay ninguna magia que
// los mantenga sincronizados automaticamente - si cambias un campo en el backend, hay
// que venir a actualizar esto a mano. Es una decision consciente de mantener el
// contrato consistente en ambos lados, replicada aqui porque el proyecto no usa un
// generador de tipos compartido (algo que si tendria sentido en un proyecto mas grande).

export type RiskLevel = "low" | "medium" | "high";

// El idioma de la interfaz (boton de arriba a la derecha) Y el idioma en el que le
// pedimos a la IA que escriba (ver DraftRequest.language mas abajo) - el mismo codigo
// controla las dos cosas para que una demo en ingles quede consistente de punta a
// punta. Vive aca (no en i18n.ts) porque es parte del contrato con el backend, igual
// que RiskLevel y FlagType.
export type Language = "es" | "en";

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
  // Opcional en el backend (DraftRequest.java) por compatibilidad con clientes viejos
  // (o el curl de ejemplo del README) que no lo manden - si falta, el backend vuelve al
  // comportamiento anterior de detectar el idioma del brief solo. Pero nuestro propio
  // formulario (DraftForm.tsx) SIEMPRE lo manda, tomado del boton de idioma.
  language?: Language;
}

export interface InteractionSummary {
  id: number;
  createdAt: string;
  preset: string;
  brief: string;
  draft: string;
  riskLevel: string;
  // El backend intenta reconstruir el ReviewResult completo a partir del JSON guardado
  // en su momento; en el caso raro de que ese JSON no parsee, manda null en vez de
  // tirar abajo el endpoint entero (ver InteractionSummary.java). Por eso es nullable
  // aca tambien - un item de historial sin review renderiza el borrador pero no el
  // reporte de confianza al hacerle click.
  review: ReviewResult | null;
}

// Forma en la que el backend devuelve los errores (ver ApiError.java) - la usamos para
// mostrar un mensaje de error legible en vez de "algo salio mal".
export interface ApiError {
  error: string;
  message: string;
}
