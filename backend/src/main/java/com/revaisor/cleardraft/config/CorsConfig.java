package com.revaisor.cleardraft.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS (Cross-Origin Resource Sharing) es una proteccion que el NAVEGADOR aplica por
 * defecto: bloquea que JavaScript corriendo en el origen A (ej. http://localhost:3000,
 * tu app Next.js) le hable a una API en el origen B (ej. http://localhost:8080, este
 * backend), a menos que el origen B diga explicitamente "confio en A".
 *
 * Sin esta clase, el navegador rechazaria las peticiones de Next.js con un error de CORS
 * en la consola, AUNQUE el backend este funcionando perfectamente - es un error muy
 * comun la primera vez que se conectan un frontend y un backend en dominios distintos.
 *
 * El origen permitido viene de una variable de entorno (no hardcodeado), para poder
 * usar http://localhost:3000 en desarrollo y la URL real del frontend una vez desplegado.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final String allowedOrigin;

    public CorsConfig(@Value("${frontend.origin}") String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigin)
                .allowedMethods("GET", "POST")
                .allowedHeaders("*");
    }
}
