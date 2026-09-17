package com.proyecto_moviles.oficiar.repositories;

import com.proyecto_moviles.oficiar.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad Role.
 * Gestiona los roles de usuario y proporciona métodos para buscar roles por nombre o identificador.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);

    // Buscar roles por texto parcial (ignorando mayúsculas)
    List<Role> findByNameContainingIgnoreCase(String name);
}
