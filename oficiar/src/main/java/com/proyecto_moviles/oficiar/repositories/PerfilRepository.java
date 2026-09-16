package com.proyecto_moviles.oficiar.repositories;

import com.proyecto_moviles.oficiar.models.entities.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    // Método para verificar duplicados por nombre de oficio antes de guardar
    boolean existsByOficioIgnoreCase(String oficio);

    // Búsqueda por oficio exacto
    Optional<Perfil> findByOficioIgnoreCase(String oficio);

    // Consulta si existen usuarios asociados a este id de perfil en la relación M:M
    @Query("SELECT COUNT(u) > 0 FROM Users u JOIN u.perfiles p WHERE p.id = :perfilId")
    boolean isPerfilInUse(@Param("perfilId") Long perfilId);

    // Buscar oficios por texto parcial (ignorando mayúsculas)
    List<Perfil> findByOficioContainingIgnoreCase(String oficio);
}
