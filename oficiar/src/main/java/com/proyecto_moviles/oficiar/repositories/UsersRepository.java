package com.proyecto_moviles.oficiar.repositories;

import com.proyecto_moviles.oficiar.models.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByUsername(String username);

    Optional<Users> findByEmail(String email);

    List<Users> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username,
            String email
    );

    boolean existsByRoles_Id(Long roleId);

    // Officers activos, filtrando por nombre y/o por oficio si vienen
    @Query("SELECT DISTINCT u FROM Users u JOIN u.roles r LEFT JOIN u.perfiles p " +
            "WHERE r.name = 'ROLE_WORKER' AND u.active = true " +
            "AND (:texto IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :texto, '%'))) " +
            "AND (:perfilId IS NULL OR p.id = :perfilId)")
    List<Users> buscarTrabajadores(@Param("texto") String texto, @Param("perfilId") Long perfilId);

}