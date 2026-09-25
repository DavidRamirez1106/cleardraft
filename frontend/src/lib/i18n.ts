// El diccionario de textos de la interfaz, en los 2 idiomas que soporta el boton de
// arriba a la derecha (ver language-context.tsx). Con solo 2 idiomas fijos no vale la
// pena meter una libreria de internacionalizacion (next-intl, i18next, etc.) - esas
// resuelven problemas que no tenemos aca (plurales complejos, decenas de idiomas,
// carga perezosa de traducciones). Un objeto plano alcanza y sobra.
//
// OJO: esto traduce la INTERFAZ (labels, botones, headings). El idioma en el que la IA
// ESCRIBE el borrador es un concepto relacionado pero distinto - lo maneja el backend
// (ver Preset.java / PresetPrompts.java), y el mismo codigo "es"/"en" de aca es el que
// le mandamos en el campo `language` de DraftRequest para que ambas cosas queden
// consistentes (ver DraftForm.tsx).

import type { FlagType, Language, RiskLevel } from "./types";

export interface Translations {
  header: {
    title: string;
    subtitle: string;
  };
  form: {
    presetLabel: string;
    toneLabel: string;
    briefLabel: string;
    briefPlaceholder: string;
    briefRequired: string;
    submitIdle: string;
    submitLoading: string;
  };
  // Los ids/valores (las claves de estos dos mapas) viajan tal cual al backend - ver
  // presets.ts - asi que NUNCA se traducen. Lo unico que cambia con el idioma es el
  // texto que ve el usuario en el <option>.
  presets: Record<string, string>;
  tones: Record<string, string>;
  result: {
    fromHistory: string;
    draftHeading: string;
    reviewHeading: string;
    noReview: string;
    noObservations: string;
  };
  history: {
    heading: string;
    empty: string;
  };
  risk: Record<RiskLevel, string>;
  flags: Record<FlagType, string>;
  errors: {
    generic: string;
    serverStatus: (status: number) => string;
  };
}

const es: Translations = {
  header: {
    title: "ClearDraft",
    subtitle:
      "Genera contenido de negocio y revisa automáticamente su tono, riesgo y sesgo antes de enviarlo.",
  },
  form: {
    presetLabel: "Tipo de contenido",
    toneLabel: "Tono",
    briefLabel: "Resumen (brief)",
    briefPlaceholder:
      "Ej: invitar a un cliente a renovar su plan, tono cercano pero profesional",
    briefRequired: "El brief no puede estar vacío.",
    submitIdle: "Generar",
    submitLoading: "Generando…",
  },
  presets: {
    outreach_email: "Email de outreach",
    product_description: "Descripción de producto",
    internal_memo: "Comunicado interno",
  },
  tones: {
    professional: "Profesional",
    friendly: "Cercano",
    formal: "Formal",
    persuasive: "Persuasivo",
  },
  result: {
    fromHistory: "Cargado desde el historial",
    draftHeading: "Borrador generado",
    reviewHeading: "Reporte de confianza",
    noReview: "Esta interacción antigua no guardó un reporte de confianza legible.",
    noObservations: "Sin observaciones.",
  },
  history: {
    heading: "Historial reciente",
    empty: "Todavía no hay interacciones guardadas.",
  },
  risk: {
    low: "Riesgo bajo",
    medium: "Riesgo medio",
    high: "Riesgo alto",
  },
  flags: {
    unsupported_claim: "Claim sin sustento",
    tone_mismatch: "Tono inadecuado",
    missing_disclaimer: "Falta disclaimer",
    bias: "Posible sesgo",
  },
  errors: {
    generic: "Ocurrió un error inesperado",
    serverStatus: (status) => `El servidor respondió con estado ${status}`,
  },
};

const en: Translations = {
  header: {
    title: "ClearDraft",
    subtitle:
      "Generates business content and automatically reviews its tone, risk and bias before you send it.",
  },
  form: {
    presetLabel: "Content type",
    toneLabel: "Tone",
    briefLabel: "Brief",
    briefPlaceholder:
      "E.g.: invite a client to renew their plan, warm but professional tone",
    briefRequired: "The brief can't be empty.",
    submitIdle: "Generate",
    submitLoading: "Generating…",
  },
  presets: {
    outreach_email: "Outreach email",
    product_description: "Product description",
    internal_memo: "Internal memo",
  },
  tones: {
    professional: "Professional",
    friendly: "Friendly",
    formal: "Formal",
    persuasive: "Persuasive",
  },
  result: {
    fromHistory: "Loaded from history",
    draftHeading: "Generated draft",
    reviewHeading: "Confidence report",
    noReview: "This older interaction didn't save a readable confidence report.",
    noObservations: "No observations.",
  },
  history: {
    heading: "Recent history",
    empty: "No interactions saved yet.",
  },
  risk: {
    low: "Low risk",
    medium: "Medium risk",
    high: "High risk",
  },
  flags: {
    unsupported_claim: "Unsupported claim",
    tone_mismatch: "Tone mismatch",
    missing_disclaimer: "Missing disclaimer",
    bias: "Possible bias",
  },
  errors: {
    generic: "Something went wrong",
    serverStatus: (status) => `The server responded with status ${status}`,
  },
};

export const TRANSLATIONS: Record<Language, Translations> = { es, en };

// Los presets y tonos guardan su id/valor "de maquina" en ingles (presets.ts) - esta
// funcion resuelve el texto que ve el usuario para ese id, con el id como fallback si
// algun dia queda un id sin traducir (mejor mostrar el id crudo que un string vacio).
export function presetLabel(t: Translations, id: string): string {
  return t.presets[id] ?? id;
}

export function toneLabel(t: Translations, tone: string): string {
  return t.tones[tone] ?? tone;
}
