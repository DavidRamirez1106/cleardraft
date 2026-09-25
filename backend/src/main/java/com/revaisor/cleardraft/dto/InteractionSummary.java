package com.revaisor.cleardraft.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.revaisor.cleardraft.model.Interaction;

import java.time.Instant;

/**
 * Version "resumida" de Interaction para el historial (GET /api/history).
 * No devolvemos la entidad JPA directamente en la API - es una buena practica separar
 * "como se guarda" (Interaction, la @Entity) de "que se expone" (este record): asi
 * puedes cambiar la tabla sin romper el contrato de la API, o viceversa.
 *
 * Incluye el `review` completo (no solo `riskLevel`) para que el frontend pueda pintar
 * un item del historial en el mismo panel de resultado que usa para una generacion
 * recien hecha, sin tener que pedirle nada mas al backend.
 */
public record InteractionSummary(
        Long id,
        Instant createdAt,
        String preset,
        String brief,
        String draft,
        String riskLevel,
        ReviewResult review
) {
    public static InteractionSummary from(Interaction interaction, ObjectMapper objectMapper) {
        return new InteractionSummary(
                interaction.getId(),
                interaction.getCreatedAt(),
                interaction.getPreset(),
                interaction.getBrief(),
                interaction.getDraft(),
                interaction.getRiskLevel(),
                parseReview(interaction.getReviewJson(), objectMapper)
        );
    }

    /**
     * El reviewJson guardado ya paso por el mismo parseo en DraftService al momento de
     * generar la interaccion (si no hubiera parseado, ni se habria guardado), asi que en
     * la practica esto no deberia fallar nunca. Aun asi, preferimos degradar a `null`
     * (el item del historial pierde el detalle del review, pero sigue mostrandose) en vez
     * de que un solo registro corrupto tire abajo todo el endpoint de historial.
     */
    private static ReviewResult parseReview(String reviewJson, ObjectMapper objectMapper) {
        try {
            return objectMapper.readValue(reviewJson, ReviewResult.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
