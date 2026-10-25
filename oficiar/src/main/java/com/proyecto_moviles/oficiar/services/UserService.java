package com.proyecto_moviles.oficiar.services;

import com.proyecto_moviles.oficiar.exceptions.UserExceptions.UserNoEncontradoException;
import com.proyecto_moviles.oficiar.models.entities.Users;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.TrabajadorResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UsersRepository usersRepository;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public UserService(UsersRepository usersRepository, CloudinaryService cloudinaryService) {
        this.usersRepository = usersRepository;
        this.cloudinaryService = cloudinaryService;
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

    // REACTIVAR: Volver a activar un usuario desactivado
    @Transactional
    public void reactivateUser(Long id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new UserNoEncontradoException("Intente ingresando otro ID"));

        user.setActive(true);
        usersRepository.save(user);
    }

    // BUSCAR: Buscar usuarios por nombre o email
    @Transactional(readOnly = true)
    public List<Users> searchUsers(String texto) {
        return usersRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(texto, texto);
    }

    // FOTO: Subir / Actualizar foto de perfil
    @Transactional
    public Users updateProfilePicture(String username, MultipartFile file) throws IOException {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNoEncontradoException("Usuario no encontrado"));

        // Si ya tenía foto previa en Cloudinary, la eliminamos primero
        if (user.getFotoPublicId() != null && !user.getFotoPublicId().trim().isEmpty()) {
            cloudinaryService.deleteFile(user.getFotoPublicId());
        }

        // Subimos la nueva foto a Cloudinary
        Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, "oficiar/perfiles");

        user.setFotoUrl(uploadResult.get("secure_url").toString());
        user.setFotoPublicId(uploadResult.get("public_id").toString());

        return usersRepository.save(user);
    }

    // FOTO: Eliminar foto de perfil
    @Transactional
    public Users deleteProfilePicture(String username) throws IOException {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNoEncontradoException("Usuario no encontrado"));

        if (user.getFotoPublicId() != null && !user.getFotoPublicId().trim().isEmpty()) {
            cloudinaryService.deleteFile(user.getFotoPublicId());
        }

        user.setFotoUrl(null);
        user.setFotoPublicId(null);

        return usersRepository.save(user);
    }

    // TRABAJADORES: Officers activos para la Vista 1, con búsqueda por nombre y filtro por oficio
    @Transactional(readOnly = true)
    public List<TrabajadorResponse> buscarTrabajadores(String texto, Long perfilId) {
        String filtro = (texto == null || texto.isBlank()) ? null : texto.trim();
        return usersRepository.buscarTrabajadores(filtro, perfilId).stream()
                .map(TrabajadorResponse::from)
                .toList();
    }
}