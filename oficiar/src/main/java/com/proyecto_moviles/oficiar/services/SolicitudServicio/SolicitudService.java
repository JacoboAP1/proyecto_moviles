package com.proyecto_moviles.oficiar.services.SolicitudServicio;

import com.proyecto_moviles.oficiar.exceptions.PerfilExceptions.OficioNoEncontradoException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.AccionNoPermitidaException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.EstadoInvalidoException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.SolicitudNoEncontradaException;
import com.proyecto_moviles.oficiar.exceptions.UserExceptions.UserNoEncontradoException;
import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.CrearSolicitudRequest;
import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.SolicitudResponse;
import com.proyecto_moviles.oficiar.models.entities.*;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.AccionSolicitud;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.EstadoSolicitud;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.SolicitudServicio;
import com.proyecto_moviles.oficiar.repositories.PerfilRepository;
import com.proyecto_moviles.oficiar.repositories.SolicitudServicioRepository;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SolicitudService {

    private final SolicitudServicioRepository solicitudRepository;
    private final UsersRepository usersRepository;
    private final PerfilRepository perfilRepository;

    public SolicitudService(SolicitudServicioRepository solicitudRepository,
                            UsersRepository usersRepository,
                            PerfilRepository perfilRepository) {
        this.solicitudRepository = solicitudRepository;
        this.usersRepository = usersRepository;
        this.perfilRepository = perfilRepository;
    }

    // CREAR: el cliente le pide un servicio a un officer -> queda PENDIENTE
    @Transactional
    public SolicitudResponse crear(String username, CrearSolicitudRequest req) {
        Users cliente = buscarUsuario(username);

        if (!tieneRol(cliente, "ROLE_CLIENT")) {
            throw new AccionNoPermitidaException("Solo los clientes pueden solicitar servicios");
        }
        if (req.getOfficerId() == null || req.getPerfilId() == null) {
            throw new IllegalArgumentException("Debes elegir un officer y un oficio");
        }
        if (req.getDescripcion() == null || req.getDescripcion().trim().isEmpty()) {
            throw new IllegalArgumentException("Describe el problema que necesitas resolver");
        }

        Users officer = usersRepository.findById(req.getOfficerId())
                .filter(u -> Boolean.TRUE.equals(u.getActive()) && tieneRol(u, "ROLE_WORKER"))
                .orElseThrow(() -> new UserNoEncontradoException("El officer no existe o no está disponible"));

        Perfil oficio = perfilRepository.findById(req.getPerfilId())
                .orElseThrow(() -> new OficioNoEncontradoException("El oficio elegido no existe"));

        boolean ofreceOficio = officer.getPerfiles().stream()
                .anyMatch(p -> p.getId().equals(oficio.getId()));
        if (!ofreceOficio) {
            throw new EstadoInvalidoException("Este officer no ofrece el oficio " + oficio.getOficio());
        }

        SolicitudServicio solicitud = new SolicitudServicio();
        solicitud.setCliente(cliente);
        solicitud.setOfficer(officer);
        solicitud.setOficio(oficio);
        solicitud.setDescripcion(req.getDescripcion().trim());
        solicitud.setDireccion(req.getDireccion() == null || req.getDireccion().isBlank()
                ? null : req.getDireccion().trim());
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);

        return SolicitudResponse.from(solicitudRepository.save(solicitud));
    }

    // LISTAR: el cliente ve las que hizo; el officer, las que recibió
    @Transactional(readOnly = true)
    public List<SolicitudResponse> misSolicitudes(String username) {
        Users usuario = buscarUsuario(username);

        List<SolicitudServicio> lista = tieneRol(usuario, "ROLE_WORKER")
                ? solicitudRepository.findByOfficerIdOrderByFechaCreacionDesc(usuario.getId())
                : solicitudRepository.findByClienteIdOrderByFechaCreacionDesc(usuario.getId());

        return lista.stream().map(SolicitudResponse::from).toList();
    }

    // DETALLE: solo el cliente o el officer de esa solicitud pueden verla
    @Transactional(readOnly = true)
    public SolicitudResponse obtener(Long id, String username) {
        Users usuario = buscarUsuario(username);
        return SolicitudResponse.from(buscarComoParticipante(id, usuario));
    }

    // CAMBIAR ESTADO: aceptar, rechazar, iniciar, finalizar o cancelar
    @Transactional
    public SolicitudResponse ejecutar(Long id, AccionSolicitud accion, String username, BigDecimal precio) {
        Users usuario = buscarUsuario(username);
        SolicitudServicio solicitud = buscarComoParticipante(id, usuario);

        TransicionesSolicitud.Rol rol = solicitud.getOfficer().getId().equals(usuario.getId())
                ? TransicionesSolicitud.Rol.OFFICER
                : TransicionesSolicitud.Rol.CLIENTE;

        // Las reglas viven en la máquina de estados: lanza 403 o 409 si no se puede
        EstadoSolicitud nuevoEstado = TransicionesSolicitud.siguiente(solicitud.getEstado(), accion, rol);

        // El officer acepta proponiendo el precio
        if (accion == AccionSolicitud.ACEPTAR && rol == TransicionesSolicitud.Rol.OFFICER) {
            if (precio == null || precio.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Indica un precio mayor a 0 para aceptar");
            }
            solicitud.setPrecioAcordado(precio);
        }

        solicitud.setEstado(nuevoEstado);
        return SolicitudResponse.from(solicitudRepository.save(solicitud));
    }

    // Si la solicitud no existe o no es suya -> 404 (no se revela que existe)
    private SolicitudServicio buscarComoParticipante(Long id, Users usuario) {
        return solicitudRepository.findById(id)
                .filter(s -> s.getCliente().getId().equals(usuario.getId())
                        || s.getOfficer().getId().equals(usuario.getId()))
                .orElseThrow(() -> new SolicitudNoEncontradaException("Solicitud no encontrada"));
    }

    // El usuario sale del token. Si algún día el token lleva el correo, solo se cambia aquí.
    private Users buscarUsuario(String username) {
        return usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNoEncontradoException("Usuario no encontrado"));
    }

    private boolean tieneRol(Users usuario, String rol) {
        return usuario.getRoles().stream().anyMatch(r -> rol.equals(r.getName()));
    }
}
