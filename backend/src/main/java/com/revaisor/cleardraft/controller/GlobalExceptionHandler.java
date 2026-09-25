package com.revaisor.cleardraft.controller;

import com.revaisor.cleardraft.dto.ApiError;
import com.revaisor.cleardraft.service.AiProviderException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @RestControllerAdvice: intercepta las excepciones lanzadas por CUALQUIER controller
 * de la app y las convierte en una respuesta HTTP bien formada, en vez de dejar que
 * Spring devuelva su pagina de error por defecto (que expone detalles internos y no es
 * JSON consistente).
 *
 * Cada @ExceptionHandler mapea un tipo de excepcion a un codigo HTTP con significado:
 * - Datos invalidos que mando el usuario -> 400 Bad Request
 * - El proveedor de IA fallo (no es culpa nuestra, ni del usuario) -> 502 Bad Gateway
 * - Cualquier otra cosa no prevista -> 500, pero sin filtrar el stack trace al cliente
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Datos invalidos en la peticion");
        return ResponseEntity.badRequest().body(new ApiError("validation_error", message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
        // Este es el caso de Preset.fromId() cuando el frontend manda un preset que no existe
        return ResponseEntity.badRequest().body(new ApiError("invalid_request", ex.getMessage()));
    }

    @ExceptionHandler(AiProviderException.class)
    public ResponseEntity<ApiError> handleAiProviderError(AiProviderException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ApiError("ai_provider_error", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex) {
        return ResponseEntity.internalServerError()
                .body(new ApiError("internal_error", "Ocurrio un error inesperado"));
    }
}
