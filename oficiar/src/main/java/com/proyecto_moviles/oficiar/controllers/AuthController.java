package com.proyecto_moviles.oficiar.controllers;

import com.proyecto_moviles.oficiar.auth.JwtService;
import com.proyecto_moviles.oficiar.exceptions.PerfilExceptions.OficioInvalidoException;
import com.proyecto_moviles.oficiar.exceptions.PerfilExceptions.OficioNoEncontradoException;
import com.proyecto_moviles.oficiar.exceptions.RoleExceptions.RolNoPermitidoException;
import com.proyecto_moviles.oficiar.exceptions.UserExceptions.*;
import com.proyecto_moviles.oficiar.models.dto.RegisterRequest;
import com.proyecto_moviles.oficiar.models.entities.Perfil;
import com.proyecto_moviles.oficiar.models.entities.Role;
import com.proyecto_moviles.oficiar.models.entities.Users;
import com.proyecto_moviles.oficiar.repositories.PerfilRepository;
import com.proyecto_moviles.oficiar.repositories.RoleRepository;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Controlador para la autenticación y registro de usuarios.
 * Proporciona endpoints para login y registro, así como manejo de errores de autenticación.
 * Utiliza JWT para la generación de tokens y roles para la autorización.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    /**
     * AuthenticationManager de Spring Security para autenticar usuarios.
     */
    private final AuthenticationManager authManager;
    /**
     * Repositorio para la gestión de usuarios.
     */
    private final UsersRepository usuarioRepo;
    /**
     * Repositorio para la gestión de roles.
     */
    private final RoleRepository rolRepo;
    /**
     * Servicio para la gestión de JWT.
     */
    private final JwtService jwt;

    private final PerfilRepository perfilRepository;

    /**
     * Endpoint para el login de usuarios.
     * Autentica las credenciales y retorna un token JWT si son válidas.
     * @param req mapa con username y password
     * @return mapa con el token, tipo y roles
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");

        if (email == null || password == null) {
            throw new BadCredentialsException("Email y contraseña requeridos");
        }

        // Busca al usuario por su correo electrónico en la base de datos
        var user = usuarioRepo.findByEmail(email)
                .orElseThrow(() -> new InvalidEmailException("Email no encontrado"));

        // Si está inactivo no lo deja logear
        if (Boolean.FALSE.equals(user.getActive())) {
            throw new UsuarioInactivoException("Favor pedirle a soporte volver a habilitar su cuenta");
        }
        // Autentica usando el username interno del usuario y la contraseña recibida
        authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), password));

        var roles = user.getRoles().stream().map(Role::getName).toList();

        // Genera el token JWT
        String token = jwt.generate(user.getUsername(), roles);

        return Map.of(
                "access_token", token,
                "token_type", "Bearer",
                "roles", roles
        );
    }

    /**
     * Endpoint para el registro de nuevos usuarios.
     * Normaliza los roles recibidos a mayúsculas y les asegura el prefijo 'ROLE_'.
     * @param req datos de registro (username, email, password, roles)
     * @return mapa con el token, tipo y roles
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@RequestBody RegisterRequest req) {
        if (req.getUsername() == null || req.getPassword() == null) {
            throw new CamposVaciosException("Falta colocar nombre de usuario o contraseña");
        }
        if (usuarioRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new UsuarioExistenteException("Ese correo de usuario ya existe");
        }

        // Si no se envían roles, por defecto asigna ROLE_CLIENT
        List<String> rawRoles = (req.getRoles() == null || req.getRoles().isEmpty())
                ? List.of("WORKER")
                : req.getRoles();

        // Normalización: convierte a mayúsculas y asegura el prefijo ROLE_
        List<String> normalizedRoleNames = rawRoles.stream()
                .filter(role -> role != null && !role.trim().isEmpty())
                .map(String::trim)
                .map(String::toUpperCase)
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .toList();

        // 3. Validación de seguridad: SOLO se permiten ROLE_CLIENT y ROLE_WORKER en el registro público
        Set<String> rolesPermitidos = Set.of("ROLE_CLIENT", "ROLE_WORKER");
        for (String roleName : normalizedRoleNames) {
            if (!rolesPermitidos.contains(roleName)) {
                throw new RolNoPermitidoException(roleName + "No es posible. Ingrese CLIENT o WORKER, por favor");
            }
        }

        // Asignación de entidades de rol desde la BD evitando duplicados
        Set<Role> roleEntities = new HashSet<>();
        for (String roleName : normalizedRoleNames) {
            Role role = rolRepo.findByName(roleName).orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName(roleName);
                return rolRepo.save(newRole);
            });
            roleEntities.add(role);
        }

        // 2. Crear y llenar la entidad de usuario
        Users user = new Users();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setTelefono(req.getTelefono()); // <-- Guarda el teléfono
        user.setPassword(req.getPassword()); // En texto plano
        user.setRoles(roleEntities);

        // Validar que si es WORKER, traiga al menos un oficio
        if (normalizedRoleNames.contains("ROLE_WORKER")) {
            if (req.getPerfilIds() == null || req.getPerfilIds().isEmpty()) {
                throw new OficioInvalidoException("Ingrese un ID de oficio válido para registrarse");
            }

            // Si pasa la validación, asociamos los perfiles de forma segura
            Set<Perfil> perfiles = new HashSet<>(perfilRepository.findAllById(req.getPerfilIds()));

            // Opcional: Validar que los IDs enviados realmente existan en la BD
            if (perfiles.isEmpty()) {
                throw new OficioNoEncontradoException("Ingrese un perfil de oficio de la lista, por favor");
            }

            user.setPerfiles(perfiles);
        }

        usuarioRepo.save(user);

        List<String> roles = roleEntities.stream().map(Role::getName).toList();
        String token = jwt.generate(user.getUsername(), roles);

        return Map.of(
                "access_token", token,
                "token_type", "Bearer",
                "roles", roles
        );
    }

    /**
     * Maneja errores de autenticación devolviendo un mensaje estándar.
     * @param e excepción de autenticación
     * @return mapa con el error
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public Map<String, String> onAuthError(Exception e) {
        return Map.of("error", "Bad credentials");
    }
}
