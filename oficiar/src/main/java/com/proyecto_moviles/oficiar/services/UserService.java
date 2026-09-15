package com.proyecto_moviles.oficiar.services;

import com.proyecto_moviles.oficiar.exceptions.UserExceptions.UserNoEncontradoException;
import com.proyecto_moviles.oficiar.models.entities.Users;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UsersRepository usersRepository;

    @Autowired
    public UserService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    // READ: Obtener usuario por username (viene del token JWT)
    @Transactional(readOnly = true)
    public Users getByUsername(String username) {
        return usersRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException(
                    "Usuario no encontrado"));
    }

    // UPDATE: Actualizar username y telefono
    @Transactional
    public Users updateUser(String currentUsername,
                            String newUsername,
                            String newTelefono) {
        Users user = usersRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException(
                    "Usuario no encontrado"));

        if (newUsername != null && !newUsername.trim().isEmpty()) {
            usersRepository.findByUsername(newUsername.trim())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(user.getId())) {
                        throw new IllegalArgumentException(
                            "Ese nombre de usuario ya esta en uso");
                    }
                });
            user.setUsername(newUsername.trim());
        }

        if (newTelefono != null) {
            user.setTelefono(newTelefono.trim());
        }

        return usersRepository.save(user);
    }

    // READ: Obtener la lista completa de usuarios
    @Transactional(readOnly = true)
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    // DELETE (Lógico): Desactivar usuario por ID
    @Transactional
    public void softDeleteUser(Long id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new UserNoEncontradoException("Intente ingresando otro ID"));

        user.setActive(false);
        usersRepository.save(user);
    }
}