// Los ids DEBEN coincidir con Preset.java (ver backend/.../model/Preset.java) - es el
// unico "acoplamiento invisible" entre frontend y backend en todo el proyecto: si
// agregas un preset aqui sin agregarlo alla (o viceversa), el backend devuelve un 400
// "Preset desconocido" (ver Preset.fromId() y GlobalExceptionHandler).
export interface PresetOption {
  id: string;
  label: string;
}

export const PRESETS: PresetOption[] = [
  { id: "outreach_email", label: "Email de outreach" },
  { id: "product_description", label: "Descripción de producto" },
  { id: "internal_memo", label: "Comunicado interno" },
];

export const TONES = ["professional", "friendly", "formal", "persuasive"] as const;

export type Tone = (typeof TONES)[number];
