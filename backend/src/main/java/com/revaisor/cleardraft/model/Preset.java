package com.revaisor.cleardraft.model;

/**
 * Los 3 tipos de contenido que la app sabe generar. Cada uno es, en el fondo, una
 * plantilla de prompt distinta - por eso el enum guarda el texto de la instruccion
 * junto con su id y su nombre visible.
 *
 * Usar un enum (en vez de, digamos, leer el preset de una base de datos) es la eleccion
 * correcta aqui porque el conjunto de presets es fijo y conocido en tiempo de compilacion -
 * si mas adelante quisieras que los usuarios creen sus propios presets, ahi si tendria
 * sentido moverlo a una tabla.
 */
public enum Preset {

    OUTREACH_EMAIL(
            "outreach_email",
            "Email de outreach",
            "You are a professional business writing assistant. Write a concise, %s email "
                    + "based on this brief: %s. Do not make promises, pricing claims, or "
                    + "guarantees that aren't stated in the brief."
    ),
    PRODUCT_DESCRIPTION(
            "product_description",
            "Descripcion de producto",
            "You are a professional marketing copywriter. Write a concise, %s product "
                    + "description based on this brief: %s. Do not invent specifications, "
                    + "prices, or claims not present in the brief."
    ),
    INTERNAL_MEMO(
            "internal_memo",
            "Comunicado interno",
            "You are a corporate communications assistant. Write a clear, %s internal "
                    + "announcement for employees based on this brief: %s. Keep it factual "
                    + "and avoid alarmist language."
    );

    private final String id;
    private final String label;
    private final String promptTemplate;

    Preset(String id, String label, String promptTemplate) {
        this.id = id;
        this.label = label;
        this.promptTemplate = promptTemplate;
    }

    public String getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    /**
     * Arma el prompt final insertando el tono y el brief del usuario en la plantilla.
     * %s y %s se reemplazan en orden: el primero por el tono, el segundo por el brief.
     *
     * Le agregamos una instruccion final de idioma. Sin esto, el modelo (siguiendo el
     * ingles del resto del prompt) tiende a contestar en ingles sin importar en que
     * idioma haya escrito el usuario - un bug real que reportaron al probar la app con
     * briefs en espanol.
     *
     * `language` es el codigo del boton de idioma de la interfaz ("es" | "en", ver
     * DraftRequest.language). Si viene uno reconocido, lo forzamos explicitamente -
     * asi el usuario puede tipear el brief en un idioma y pedir el borrador en otro, y
     * sobre todo, asi una demo en ingles (boton en "en") no depende de que el usuario
     * se acuerde de escribir el brief en ingles. Si no viene (null, o un codigo que no
     * reconocemos), caemos al comportamiento anterior: que el modelo siga el idioma
     * del brief solo.
     */
    public String buildGeneratorPrompt(String brief, String tone, String language) {
        String effectiveTone = (tone == null || tone.isBlank()) ? "professional" : tone;
        String base = promptTemplate.formatted(effectiveTone, brief);
        String forcedLanguage = PromptLanguage.displayName(language);
        String instruction = forcedLanguage != null
                ? "Write your entire response in " + forcedLanguage
                        + ", regardless of the language of the brief above."
                : "Write your entire response in the same language the brief above is written in.";
        return base + " " + instruction;
    }

    /**
     * Convierte el id que manda el frontend (ej. "outreach_email") en el enum correspondiente.
     * Si no existe, lanzamos una excepcion que el Controller traduce a un 400 - asi el
     * frontend no puede pedir un preset que no existe.
     */
    public static Preset fromId(String id) {
        for (Preset preset : values()) {
            if (preset.id.equalsIgnoreCase(id)) {
                return preset;
            }
        }
        throw new IllegalArgumentException("Preset desconocido: " + id);
    }
}
