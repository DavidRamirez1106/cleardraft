package com.revaisor.cleardraft.dto;

/**
 * Forma unica y consistente para cualquier error que devuelva la API.
 * Sin esto, cada excepcion no manejada devolveria el stack trace por defecto de Spring
 * (un JSON gigante y poco util para un cliente) - con GlobalExceptionHandler, todo error
 * llega al frontend en esta misma forma, sin importar donde ocurrio.
 */
public record ApiError(String error, String message) {
}
