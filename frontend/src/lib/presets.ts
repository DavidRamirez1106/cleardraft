// Los ids/valores de aca DEBEN coincidir con el backend (Preset.java para los presets,
// el %s de tono en cada plantilla de prompt) - es el unico "acoplamiento invisible"
// entre frontend y backend en todo el proyecto: si agregas un preset aqui sin
// agregarlo alla (o viceversa), el backend devuelve un 400 "Preset desconocido" (ver
// Preset.fromId() y GlobalExceptionHandler).
//
// A proposito NO guardamos el texto que ve el usuario aca: estos ids/valores viajan
// tal cual al backend (nunca se traducen), mientras que el label que se muestra si
// cambia con el idioma de la interfaz - ese texto vive en i18n.ts (presetLabel() /
// toneLabel()) para no tener 2 lugares con la lista de presets desincronizables.
export interface PresetOption {
  id: string;
}

export const PRESETS: PresetOption[] = [
  { id: "outreach_email" },
  { id: "product_description" },
  { id: "internal_memo" },
];

export const TONES = ["professional", "friendly", "formal", "persuasive"] as const;

export type Tone = (typeof TONES)[number];
