package com.revaisor.cleardraft.dto;

/**
 * Una observacion puntual que el prompt "revisor" encontro en el borrador.
 * El campo `type` viene restringido en el prompt a un vocabulario fijo de 4 valores
 * (ver PresetPrompts.REVIEWER_SYSTEM_PROMPT), para que el frontend pueda pintar un
 * badge de color consistente por tipo sin adivinar que categorias existen.
 */
public record FlagDto(
        String type,        // "unsupported_claim" | "tone_mismatch" | "missing_disclaimer" | "bias"
        String excerpt,      // el fragmento del borrador al que aplica la observacion
        String explanation   // por que se marco
) {
}
