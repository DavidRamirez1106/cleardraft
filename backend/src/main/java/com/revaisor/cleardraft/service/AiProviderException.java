package com.revaisor.cleardraft.service;

/**
 * Excepcion propia para cualquier fallo al hablar con el proveedor de IA (timeout,
 * clave invalida, rate limit, respuesta con formato inesperado, etc.).
 *
 * ¿Por que crear nuestra propia excepcion en vez de dejar que se propague la de
 * RestClient? Para que el resto de la app (el Controller) pueda manejar "algo salio mal
 * con la IA" de forma generica, sin acoplarse a que libreria HTTP usamos por debajo. Si
 * el dia de manana cambias RestClient por otra cosa, el Controller no se entera.
 */
public class AiProviderException extends RuntimeException {

    public AiProviderException(String message) {
        super(message);
    }

    public AiProviderException(String message, Throwable cause) {
        super(message, cause);
    }
}
