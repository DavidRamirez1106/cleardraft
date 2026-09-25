package com.revaisor.cleardraft.model;

/**
 * Traduce el codigo de idioma que manda el frontend ("es" | "en", el mismo valor del
 * boton de idioma de la interfaz - ver DraftRequest.language) al nombre de idioma que
 * metemos en ingles dentro de cada prompt. Tanto Preset (el prompt generador) como
 * PresetPrompts (el prompt revisor) lo necesitan, asi que vive en un solo lugar en vez
 * de duplicarse.
 *
 * Sin paquete public a proposito: solo lo usan las otras 2 clases de este mismo
 * paquete (model), no hace falta exponerlo mas alla.
 */
final class PromptLanguage {

    private PromptLanguage() {
        // clase de solo metodos estaticos, no tiene sentido instanciarla
    }

    /**
     * Devuelve el nombre del idioma a forzar ("English", "Spanish (español)"), o
     * {@code null} cuando no hay un idioma reconocido que forzar - el codigo vino
     * vacio/nulo (un cliente viejo, o el curl de ejemplo del README, que no mandan
     * `language`) o no es "es"/"en". En el caso null, quien llama cae de vuelta a su
     * propio comportamiento anterior: dejar que el modelo siga el idioma del texto de
     * entrada en vez de forzar uno.
     */
    static String displayName(String languageCode) {
        if (languageCode == null) {
            return null;
        }
        return switch (languageCode.toLowerCase()) {
            case "en" -> "English";
            case "es" -> "Spanish (español)";
            default -> null;
        };
    }
}
