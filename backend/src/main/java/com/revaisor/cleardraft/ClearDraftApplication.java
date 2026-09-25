package com.revaisor.cleardraft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicacion.
 *
 * @SpringBootApplication es en realidad 3 anotaciones combinadas:
 *  - @Configuration: esta clase puede definir beans (objetos que Spring administra).
 *  - @EnableAutoConfiguration: Spring Boot configura automaticamente Tomcat, Jackson,
 *    la base de datos, etc. segun lo que encuentre en el classpath (por eso "Boot").
 *  - @ComponentScan: Spring escanea este paquete y sus subpaquetes buscando clases
 *    anotadas con @Service, @RestController, @Repository, etc. y las registra.
 *
 * Al correr esto, Spring Boot levanta un servidor Tomcat embebido (por defecto en el
 * puerto 8080) y deja la aplicacion escuchando peticiones HTTP.
 */
@SpringBootApplication
public class ClearDraftApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClearDraftApplication.class, args);
    }
}
