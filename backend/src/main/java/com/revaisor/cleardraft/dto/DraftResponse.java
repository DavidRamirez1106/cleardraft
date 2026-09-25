package com.revaisor.cleardraft.dto;

/**
 * Lo que el backend devuelve al frontend: el borrador generado + su revision.
 * Coincide exactamente con el contrato que definimos en el project brief:
 *
 *   { "draft": "...", "review": { "risk_level": "...", "flags": [...], "summary": "..." } }
 */
public record DraftResponse(
        String draft,
        ReviewResult review
) {
}
