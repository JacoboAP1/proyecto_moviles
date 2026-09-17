package com.proyecto_moviles.oficiar.services;

import com.proyecto_moviles.oficiar.exceptions.RoleExceptions.RolAsignadoException;
import com.proyecto_moviles.oficiar.models.entities.Role;
import com.proyecto_moviles.oficiar.repositories.RoleRepository;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final UsersRepository usersRepository;

    public RoleService(
            RoleRepository roleRepository,
            UsersRepository usersRepository
    ) {
        this.roleRepository = roleRepository;
        this.usersRepository = usersRepository;
    }

    // LISTAR TODOS LOS ROLES
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // BUSCAR UN ROL POR ID
    public Role getRoleById(Long id) {

        return roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rol no encontrado"
                ));
    }

    // CREAR UN NUEVO ROL
    public Role createRole(Role role) {

        if (role == null || role.getName() == null || role.getName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre del rol es obligatorio"
            );
        }

        String roleName = role.getName().trim().toUpperCase();

        Optional<Role> existingRole = roleRepository.findByName(roleName);

        if (existingRole.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un rol con ese nombre"
            );
        }

        role.setId(null);
        role.setName(roleName);

        return roleRepository.save(role);
    }

    // ACTUALIZAR UN ROL (solo si no tiene usuarios asignados)
    public Role updateRole(Long id, Role role) {

        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rol no encontrado"
                ));

        boolean roleAssigned = usersRepository.existsByRoles_Id(id);

        if (roleAssigned) {
            throw new RolAsignadoException("Este rol está asignado a un usuario y no se puede modificar");
        }

        if (role == null || role.getName() == null || role.getName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre del rol es obligatorio"
            );
        }

        String newRoleName = role.getName().trim().toUpperCase();

        Optional<Role> roleWithSameName =
                roleRepository.findByName(newRoleName);

        if (roleWithSameName.isPresent()
                && !roleWithSameName.get().getId().equals(id)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe otro rol con ese nombre"
            );
        }

        existingRole.setName(newRoleName);

        return roleRepository.save(existingRole);
    }

    // BUSCAR: Buscar roles por texto parcial
    public List<Role> searchRoles(String texto) {
        return roleRepository.findByNameContainingIgnoreCase(texto);
    }

    // ELIMINAR UN ROL
    public void deleteRole(Long id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rol no encontrado"
                ));

        boolean roleAssigned =
                usersRepository.existsByRoles_Id(id);

        if (roleAssigned) {
            throw new RolAsignadoException("Este rol está asignado a un usuario y no se puede eliminar");
        }

        roleRepository.delete(role);
    }
}