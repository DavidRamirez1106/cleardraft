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

            Draft to review:
            %s
            """;

    public static String buildReviewerPrompt(String draft) {
        return REVIEWER_TEMPLATE.formatted(draft);
    }
}
