package com.revaisor.cleardraft.model;

/**
 * El prompt del "revisor de gobernanza" - el segundo paso del pipeline. A diferencia de
 * Preset (que varia segun el tipo de contenido), este prompt es el mismo sin importar
 * que preset se uso para generar el borrador: siempre revisa el TEXTO YA GENERADO, nunca
 * el brief original del usuario.
 *
 * Usamos un text block (triple comillas """, feature de Java 15+) para escribir un
 * string multilinea sin tener que concatenar con + en cada salto de linea - mucho mas
 * legible para un prompt largo como este.
 *
 * Le pedimos al modelo JSON estricto (en vez de texto libre) para poder deserializarlo
 * directamente a nuestro ReviewResult con Jackson, sin tener que "parsear" texto suelto.
 */
public final class PresetPrompts {

    private PresetPrompts() {
        // clase de solo constantes y metodos estaticos, no tiene sentido instanciarla
    }

    private static final String REVIEWER_TEMPLATE = """
            You are a governance reviewer for AI-generated business content.
            Review the following draft and identify:
            (1) unsupported or risky claims,
            (2) tone mismatches,
            (3) missing disclaimers,
            (4) potential bias or exclusionary language.

            Respond ONLY with valid JSON in this exact shape, no extra text before or after:
            {
              "risk_level": "low" | "medium" | "high",
              "flags": [
                { "type": "unsupported_claim" | "tone_mismatch" | "missing_disclaimer" | "bias",
                  "excerpt": "...", "explanation": "..." }
              ],
              "summary": "..."
            }

            Keep every JSON key, and the literal values of "risk_level" and "type", exactly
            as specified above and in English - those are fixed codes the caller parses
            programmatically, not natural-language text. For "excerpt", "explanation" and
            "summary", %s

            Draft to review:
            %s
            """;

    /**
     * `language` es el mismo codigo de idioma que recibe Preset.buildGeneratorPrompt
     * ("es" | "en", el boton de la interfaz - ver DraftRequest.language). Cuando viene
     * uno reconocido, lo forzamos: como el borrador que estamos revisando ya salio
     * forzado en ese mismo idioma (Preset usa el mismo codigo), esto simplemente
     * mantiene coherencia en vez de dejarlo "adivinar" de nuevo. Si no viene, caemos al
     * comportamiento anterior: que el revisor siga el idioma del borrador que le
     * pasamos, citando "excerpt" tal cual para que coincida naturalmente.
     */
    public static String buildReviewerPrompt(String draft, String language) {
        String forcedLanguage = PromptLanguage.displayName(language);
        String instruction = forcedLanguage != null
                ? "write in " + forcedLanguage + ", regardless of the language of the draft below."
                : "write in the SAME language as the draft below (quote \"excerpt\" verbatim "
                        + "from the draft, so it will naturally match its language).";
        return REVIEWER_TEMPLATE.formatted(instruction, draft);
    }
}
