package com.proyecto_moviles.oficiar.repositories;

import com.proyecto_moviles.oficiar.models.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users,Long> {
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
    List<Users> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email);
}
