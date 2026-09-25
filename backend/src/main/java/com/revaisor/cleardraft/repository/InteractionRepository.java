package com.revaisor.cleardraft.repository;

import com.revaisor.cleardraft.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Esto es todo lo que hace falta escribir para tener CRUD completo sobre Interaction.
 *
 * JpaRepository<Interaction, Long> le dice a Spring Data: "genera en tiempo de ejecucion
 * una implementacion de esta interfaz que sabe hacer save(), findById(), findAll(),
 * deleteById(), etc. sobre la tabla de Interaction, cuya clave primaria es Long".
 *
 * No escribimos NINGUNA implementacion - Spring crea una clase por detras (un "proxy")
 * que traduce estos metodos a SQL real contra H2. Esto es "magia" de framework, y es
 * exactamente el tipo de cosa que vale la pena poder explicar en la entrevista: no es que
 * no haya codigo, es que Spring lo genera por ti a partir de la firma del metodo.
 *
 * findTop10ByOrderByCreatedAtDesc es un metodo derivado: Spring Data lee el NOMBRE del
 * metodo y arma la consulta SQL a partir de el (equivalente a
 * "SELECT * FROM interaction ORDER BY created_at DESC LIMIT 10").
 */
public interface InteractionRepository extends JpaRepository<Interaction, Long> {

    List<Interaction> findTop10ByOrderByCreatedAtDesc();
}
