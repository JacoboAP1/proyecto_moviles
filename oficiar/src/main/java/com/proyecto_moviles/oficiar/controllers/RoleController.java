package com.proyecto_moviles.oficiar.controllers;

import com.proyecto_moviles.oficiar.models.entities.Role;
import com.proyecto_moviles.oficiar.services.RoleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // LISTAR TODOS LOS ROLES
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();

        return ResponseEntity.ok(roles);
    }

    // BUSCAR ROLES POR TEXTO
    @GetMapping("/buscar")
    public ResponseEntity<List<Role>> searchRoles(@RequestParam String texto) {
        return ResponseEntity.ok(roleService.searchRoles(texto));
    }

    // BUSCAR UN ROL POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        Role role = roleService.getRoleById(id);

        return ResponseEntity.ok(role);
    }

    // CREAR UN NUEVO ROL
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        Role newRole = roleService.createRole(role);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newRole);
    }

    // ACTUALIZAR UN ROL
    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(
            @PathVariable Long id,
            @RequestBody Role role
    ) {
        Role updatedRole = roleService.updateRole(id, role);

        return ResponseEntity.ok(updatedRole);
    }

    // ELIMINAR UN ROL
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRole(
            @PathVariable Long id
    ) {
        roleService.deleteRole(id);

        return ResponseEntity.ok(
                Map.of("message", "Rol eliminado correctamente")
        );
    }
}