package com.revaisor.cleardraft.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Lo que el frontend manda en el body de POST /api/draft.
 *
 * Es un "record" (Java 14+): una forma compacta de declarar una clase inmutable que
 * solo carga datos. En 3 lineas, Java genera automaticamente:
 *  - el constructor
 *  - los getters (se llaman igual que el campo: preset(), brief(), tone())
 *  - equals(), hashCode() y toString()
 *
 * No hay logica aqui, solo datos - por eso un record es la eleccion natural para un DTO
 * (Data Transfer Object): su unico trabajo es viajar en el JSON de la peticion.
 *
 * Las anotaciones @NotBlank son validacion automatica: si el frontend manda "preset": ""
 * o no manda el campo, Spring rechaza la peticion con un 400 antes de que llegue a
 * nuestro codigo de negocio. Eso pasa en el Controller, con @Valid (lo veremos ahi).
 */
public record DraftRequest(
        @NotBlank(message = "preset es requerido")
        String preset,

        @NotBlank(message = "brief es requerido")
        String brief,

        String tone, // opcional: si no viene, usamos un valor por defecto en el servicio

        // Opcional: "es" | "en", el boton de idioma de la interfaz (ver
        // PromptLanguage.java). Si viene, forzamos ese idioma en los 2 prompts que le
        // mandamos al modelo; si no viene (o trae un codigo que no reconocemos), el
        // modelo sigue el idioma del brief solo - el comportamiento de antes de que
        // existiera el boton, asi un cliente viejo (o el curl de ejemplo del README)
        // sigue funcionando igual sin este campo.
        String language
) {
}
