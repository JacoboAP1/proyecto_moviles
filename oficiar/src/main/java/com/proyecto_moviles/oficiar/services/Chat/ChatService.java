package com.proyecto_moviles.oficiar.services.Chat;

import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.EstadoInvalidoException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.SolicitudNoEncontradaException;
import com.proyecto_moviles.oficiar.exceptions.UserExceptions.UserNoEncontradoException;
import com.proyecto_moviles.oficiar.models.dto.Chat.MensajeResponse;
import com.proyecto_moviles.oficiar.models.entities.Chat.Mensaje;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.EstadoSolicitud;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.SolicitudServicio;
import com.proyecto_moviles.oficiar.models.entities.Users;
import com.proyecto_moviles.oficiar.repositories.MensajeRepository;
import com.proyecto_moviles.oficiar.repositories.SolicitudServicioRepository;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;
import com.proyecto_moviles.oficiar.services.Notificaciones.AvisoPush;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

/**
 * Chat de una solicitud: solo su cliente y su officer pueden leer y escribir.
 */
@Service
public class ChatService {

    private static final int MAX_CARACTERES = 1000;

    // Con la solicitud terminada se puede leer el historial, pero ya no escribir
    private static final Set<EstadoSolicitud> CERRADAS =
            EnumSet.of(EstadoSolicitud.FINALIZADA, EstadoSolicitud.RECHAZADA, EstadoSolicitud.CANCELADA);

    private final MensajeRepository mensajeRepository;
    private final SolicitudServicioRepository solicitudRepository;
    private final UsersRepository usersRepository;
    private final ChatSalas salas;
    private final ApplicationEventPublisher eventos;

    public ChatService(MensajeRepository mensajeRepository, SolicitudServicioRepository solicitudRepository,
                       UsersRepository usersRepository, ChatSalas salas, ApplicationEventPublisher eventos) {
        this.mensajeRepository = mensajeRepository;
        this.solicitudRepository = solicitudRepository;
        this.usersRepository = usersRepository;
        this.salas = salas;
        this.eventos = eventos;
    }

    // HISTORIAL: los 50 más recientes, del más nuevo al más viejo
    @Transactional(readOnly = true)
    public List<MensajeResponse> historial(Long solicitudId, String username) {
        Users yo = buscarUsuario(username);
        buscarComoParticipante(solicitudId, yo);
        return mensajeRepository.findTop50BySolicitudIdOrderByIdDesc(solicitudId).stream()
                .map(m -> MensajeResponse.from(m, yo.getId()))
                .toList();
    }

    // ENVIAR: guarda, lo manda por el socket y, si el otro no tiene el chat abierto, le llega una push
    @Transactional
    public MensajeResponse enviar(Long solicitudId, String username, String texto) {
        Users yo = buscarUsuario(username);
        SolicitudServicio solicitud = buscarComoParticipante(solicitudId, yo);

        String limpio = texto == null ? "" : texto.trim();
        if (limpio.isEmpty()) {
            throw new IllegalArgumentException("Escribe un mensaje");
        }
        if (limpio.length() > MAX_CARACTERES) {
            throw new IllegalArgumentException("El mensaje no puede pasar de " + MAX_CARACTERES + " caracteres");
        }
        if (CERRADAS.contains(solicitud.getEstado())) {
            throw new EstadoInvalidoException("El chat se cerró porque la solicitud está "
                    + solicitud.getEstado().name().toLowerCase());
        }

        Mensaje mensaje = new Mensaje();
        mensaje.setSolicitud(solicitud);
        mensaje.setAutor(yo);
        mensaje.setTexto(limpio);
        MensajeResponse guardado = MensajeResponse.from(mensajeRepository.save(mensaje), yo.getId());

        // ChatSalas lo envía por el socket cuando la base confirma el guardado
        eventos.publishEvent(guardado);

        Users otro = solicitud.getCliente().getId().equals(yo.getId()) ? solicitud.getOfficer() : solicitud.getCliente();
        if (!salas.estaConectado(solicitudId, otro.getId())) {
            eventos.publishEvent(new AvisoPush(otro, "Mensaje de " + yo.getUsername(),
                    resumen(limpio), solicitudId, "MENSAJE"));
        }
        return guardado;
    }

    // El cuerpo de la notificación: el mensaje, recortado si es largo
    private static String resumen(String texto) {
        return texto.length() <= 120 ? texto : texto.substring(0, 117) + "...";
    }

    private Users buscarUsuario(String username) {
        return usersRepository.findByUsername(username)
                .orElseThrow(() -> new UserNoEncontradoException("Usuario no encontrado"));
    }

    // Si la solicitud no existe o no es suya -> 404 (no se revela que existe)
    private SolicitudServicio buscarComoParticipante(Long id, Users usuario) {
        return solicitudRepository.findById(id)
                .filter(s -> s.getCliente().getId().equals(usuario.getId())
                        || s.getOfficer().getId().equals(usuario.getId()))
                .orElseThrow(() -> new SolicitudNoEncontradaException("Solicitud no encontrada"));
    }
}
