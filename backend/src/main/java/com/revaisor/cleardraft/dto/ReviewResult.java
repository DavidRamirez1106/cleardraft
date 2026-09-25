package com.revaisor.cleardraft.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * El resultado de la "segunda pasada" de IA: la revision de gobernanza sobre el borrador.
 * Esta es la forma exacta de JSON que le pedimos al modelo que devuelva (ver el prompt
 * revisor) - por eso List<FlagDto> mapea 1 a 1 con el array "flags" del JSON.
 *
 * El modelo devuelve "risk_level" (snake_case, la convencion del prompt/JSON), pero en
 * Java usamos camelCase (riskLevel) por convencion del lenguaje. @JsonProperty le dice a
 * Jackson exactamente que nombre de JSON corresponde a este campo, en ambas direcciones
 * (deserializar la respuesta del modelo Y, si alguna vez serializamos esto de vuelta).
 *
 * @JsonIgnoreProperties(ignoreUnknown = true): si el modelo agrega algun campo extra que
 * no pedimos, lo ignoramos en vez de fallar - los LLMs no siempre son 100% estrictos con
 * el formato pedido, mejor ser tolerantes aqui que romper toda la feature por un campo de mas.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ReviewResult(
        @JsonProperty("risk_level")
        String riskLevel,      // "low" | "medium" | "high"

        List<FlagDto> flags,
        String summary
) {
}
