package com.revaisor.cleardraft.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Una fila del historial de interacciones. @Entity le dice a Hibernate (el ORM que usa
 * Spring Data JPA por debajo) "esta clase es una tabla" - Hibernate crea la tabla
 * automaticamente al arrancar (ver spring.jpa.hibernate.ddl-auto en application.properties),
 * asi que no escribimos ningun SQL a mano para esto.
 *
 * ¿Por que esta clase (Entity) es distinta de DraftResponse (DTO)? Porque no siempre
 * quieres exponer tu tabla tal cual en la API: una entidad describe como se GUARDA el
 * dato, un DTO describe como VIAJA en el JSON. Aqui son parecidas porque el caso es
 * simple, pero separarlas evita acoplar tu base de datos a tu contrato de API.
 */
@Entity
public class Interaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp // Hibernate llena este campo solo, con la fecha/hora del INSERT
    private Instant createdAt;

    @Column(nullable = false)
    private String preset;

    @Lob // "Large Object": para textos que pueden ser largos (el brief, el borrador)
    @Column(length = 4000)
    private String brief;

    @Lob
    @Column(length = 4000)
    private String draft;

    @Column(nullable = false)
    private String riskLevel;

    @Lob
    @Column(length = 4000)
    private String reviewJson; // guardamos el ReviewResult completo, serializado a texto

    protected Interaction() {
        // constructor vacio que JPA necesita para poder reconstruir el objeto al leer de la DB
    }

    public Interaction(String preset, String brief, String draft, String riskLevel, String reviewJson) {
        this.preset = preset;
        this.brief = brief;
        this.draft = draft;
        this.riskLevel = riskLevel;
        this.reviewJson = reviewJson;
    }

    public Long getId() {
        return id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getPreset() {
        return preset;
    }

    public String getBrief() {
        return brief;
    }

    public String getDraft() {
        return draft;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public String getReviewJson() {
        return reviewJson;
    }
}
