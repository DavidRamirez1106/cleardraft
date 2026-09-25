package com.revaisor.cleardraft.dto;

import com.revaisor.cleardraft.model.Interaction;

import java.time.Instant;

/**
 * Version "resumida" de Interaction para el historial (GET /api/history).
 * No devolvemos la entidad JPA directamente en la API - es una buena practica separar
 * "como se guarda" (Interaction, la @Entity) de "que se expone" (este record): asi
 * puedes cambiar la tabla sin romper el contrato de la API, o viceversa.
 */
public record InteractionSummary(
        Long id,
        Instant createdAt,
        String preset,
        String brief,
        String draft,
        String riskLevel
) {
    public static InteractionSummary from(Interaction interaction) {
        return new InteractionSummary(
                interaction.getId(),
                interaction.getCreatedAt(),
                interaction.getPreset(),
                interaction.getBrief(),
                interaction.getDraft(),
                interaction.getRiskLevel()
        );
    }
}
