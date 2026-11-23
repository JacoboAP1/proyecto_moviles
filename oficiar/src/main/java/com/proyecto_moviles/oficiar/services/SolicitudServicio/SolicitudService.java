
package com.proyecto_moviles.oficiar.services.SolicitudServicio;

import com.proyecto_moviles.oficiar.exceptions.PerfilExceptions.OficioNoEncontradoException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.AccionNoPermitidaException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.EstadoInvalidoException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.SolicitudNoEncontradaException;
import com.proyecto_moviles.oficiar.exceptions.UserExceptions.UserNoEncontradoException;
import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.CrearSolicitudRequest;
import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.EstadisticasResponse;
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
import com.proyecto_moviles.oficiar.services.Notificaciones.AvisoPush;
import org.springframework.context.ApplicationEventPublisher;
import java.util.Locale;

import java.math.BigDecimal;
import java.util.List;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

@Service
public class SolicitudService {

    private final SolicitudServicioRepository solicitudRepository;
    private final UsersRepository usersRepository;
    private final PerfilRepository perfilRepository;
    private final ApplicationEventPublisher eventos;

    public SolicitudService(SolicitudServicioRepository solicitudRepository,
                            UsersRepository usersRepository,
                            PerfilRepository perfilRepository,
                            ApplicationEventPublisher eventos) {
        this.solicitudRepository = solicitudRepository;
        this.usersRepository = usersRepository;
        this.perfilRepository = perfilRepository;
        this.eventos = eventos;
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

        SolicitudServicio guardada = solicitudRepository.save(solicitud);

        // Aviso al officer: le llegó una solicitud nueva
        eventos.publishEvent(new AvisoPush(officer, "Nueva solicitud",
                cliente.getUsername() + " necesita un servicio de " + oficio.getOficio(), guardada.getId()));

        return SolicitudResponse.from(guardada);
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

    // ESTADÍSTICAS: mis solicitudes contadas por grupo de estado, según el rol (números del home)
    @Transactional(readOnly = true)
    public EstadisticasResponse estadisticas(String username) {
        Users usuario = buscarUsuario(username);
        boolean esOfficer = tieneRol(usuario, "ROLE_WORKER");

        List<Object[]> filas = esOfficer
                ? solicitudRepository.contarPorEstadoComoOfficer(usuario.getId())
                : solicitudRepository.contarPorEstadoComoCliente(usuario.getId());

        Map<EstadoSolicitud, Long> porEstado = new EnumMap<>(EstadoSolicitud.class);
        for (Object[] fila : filas) {
            porEstado.put((EstadoSolicitud) fila[0], (Long) fila[1]);
        }

        // Al officer le toca responder las PENDIENTE; el cliente también espera mientras está COTIZADA
        Set<EstadoSolicitud> pendientes = esOfficer
                ? EnumSet.of(EstadoSolicitud.PENDIENTE)
                : EnumSet.of(EstadoSolicitud.PENDIENTE, EstadoSolicitud.COTIZADA);
        Set<EstadoSolicitud> activos = esOfficer
                ? EnumSet.of(EstadoSolicitud.COTIZADA, EstadoSolicitud.ACEPTADA, EstadoSolicitud.EN_CURSO)
                : EnumSet.of(EstadoSolicitud.ACEPTADA, EstadoSolicitud.EN_CURSO);

        // RECHAZADA y CANCELADA no se cuentan
        return new EstadisticasResponse(
                sumar(porEstado, pendientes),
                sumar(porEstado, activos),
                porEstado.getOrDefault(EstadoSolicitud.FINALIZADA, 0L));
    }

    private static long sumar(Map<EstadoSolicitud, Long> porEstado, Set<EstadoSolicitud> estados) {
        return estados.stream().mapToLong(e -> porEstado.getOrDefault(e, 0L)).sum();
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
        SolicitudServicio guardada = solicitudRepository.save(solicitud);
        avisar(guardada, accion, rol);
        return SolicitudResponse.from(guardada);
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

    // Arma el aviso según la acción y quién la hizo, y se lo envía al otro participante
    private void avisar(SolicitudServicio s, AccionSolicitud accion, TransicionesSolicitud.Rol rol) {
        boolean loHizoOfficer = rol == TransicionesSolicitud.Rol.OFFICER;
        Users destino = loHizoOfficer ? s.getCliente() : s.getOfficer();
        String cliente = s.getCliente().getUsername();
        String officer = s.getOfficer().getUsername();
        String oficio = s.getOficio().getOficio();
        String precio = pesos(s.getPrecioAcordado());

        String[] aviso = switch (accion) {
            // ACEPTAR: el officer cotiza o el cliente acepta el precio (mismo endpoint)
            case ACEPTAR -> loHizoOfficer
                    ? new String[]{"Te cotizaron el servicio", officer + " cotizó tu servicio de " + oficio + " por " + precio}
                    : new String[]{"Cotización aceptada", cliente + " aceptó tu cotización de " + precio};
            case INICIAR -> new String[]{"Tu servicio comenzó", officer + " comenzó tu servicio de " + oficio};
            case FINALIZAR -> new String[]{"Servicio finalizado", cliente + " finalizó el servicio de " + oficio};
            case RECHAZAR -> loHizoOfficer
                    ? new String[]{"Solicitud rechazada", officer + " rechazó tu solicitud de " + oficio}
                    : new String[]{"Cotización rechazada", cliente + " rechazó la cotización de " + oficio};
            case CANCELAR -> new String[]{"Solicitud cancelada", cliente + " canceló la solicitud de " + oficio};
        };
        eventos.publishEvent(new AvisoPush(destino, aviso[0], aviso[1], s.getId()));
    }

    // 80000 -> "$80.000"
    private static String pesos(BigDecimal valor) {
        return valor == null ? "" : "$" + String.format(Locale.of("es", "CO"), "%,.0f", valor);
    }
}
