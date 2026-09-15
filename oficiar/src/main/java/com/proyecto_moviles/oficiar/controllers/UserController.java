package com.proyecto_moviles.oficiar.controllers;

import com.proyecto_moviles.oficiar.auth.JwtService;
import com.proyecto_moviles.oficiar.models.entities.Perfil;
import com.proyecto_moviles.oficiar.models.entities.Role;
import com.proyecto_moviles.oficiar.models.entities.Users;
import com.proyecto_moviles.oficiar.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    // GET /api/usuarios/obtener-informacion
    @GetMapping("/obtener-informacion")
    public ResponseEntity<Map<String, Object>> obtenerInformacion(
            Authentication auth) {

        Users user = userService.getByUsername(auth.getName());

        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "telefono", user.getTelefono() != null
                ? user.getTelefono()
                : "",
            "roles", user.getRoles().stream()
                .map(Role::getName)
                .toList()
        ));
    }

    // PUT /api/usuarios/actualizar
    @PutMapping("/actualizar")
    public ResponseEntity<Map<String, Object>> actualizarInformacion(
            Authentication auth,
            @RequestBody Map<String, String> body) {

        Users user = userService.updateUser(
            auth.getName(),
            body.get("username"),
            body.get("telefono")
        );

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        // Generar un JWT nuevo porque el username pudo cambiar
        String newToken = jwtService.generate(
                user.getUsername(),
                roles
        );

        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "email", user.getEmail(),
            "telefono", user.getTelefono() != null
                ? user.getTelefono()
                : "",
            "roles", roles,
            "access_token", newToken,
            "token_type", "Bearer"
        ));
    }

    @GetMapping("/listar_todos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> getAllPerfiles() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUserLogically(@PathVariable Long id) {
        userService.softDeleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Usuario desactivado correctamente"));
    }
}