package com.proyecto_moviles.oficiar.services.Notificaciones;

import com.proyecto_moviles.oficiar.models.entities.Users;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Envía notificaciones push con el servicio de Expo (Expo las entrega por Firebase).
 * Nunca lanza errores: si el aviso falla, la solicitud ya quedó guardada igual.
 */
@Service
public class NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionService.class);

    private final RestClient expo = RestClient.create("https://exp.host");
    private final UsersRepository usersRepository;

    public NotificacionService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    // Se ejecuta DESPUÉS de que la base de datos confirma el cambio (no avisa algo que no se guardó).
    // REQUIRES_NEW: la transacción original ya terminó; sin esto, borrar el token no se guardaría
    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void alGuardar(AvisoPush aviso) {
        enviar(aviso.destinatario(), aviso.titulo(), aviso.cuerpo(),
                Map.of("tipo", aviso.tipo(), "solicitudId", aviso.solicitudId()));
    }

    public void enviar(Users destinatario, String titulo, String cuerpo, Map<String, Object> datos) {
        String token = destinatario.getExpoPushToken();
        if (token == null || token.isBlank()) return;   // no dio permiso o cerró sesión

        try {
            Map<String, Object> mensaje = Map.of(
                    "to", token, "title", titulo, "body", cuerpo, "data", datos,
                    "sound", "default", "priority", "high", "channelId", "solicitudes");

            Map<?, ?> respuesta = expo.post().uri("/--/api/v2/push/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(mensaje)
                    .retrieve()
                    .body(Map.class);
            log.info("Aviso a {}: \"{}\" | respuesta de Expo: {}", destinatario.getUsername(), cuerpo, respuesta);

            // DeviceNotRegistered = desinstaló la app o quitó el permiso: se borra el token
            if (respuesta != null && respuesta.get("data") instanceof Map<?, ?> data
                    && data.get("details") instanceof Map<?, ?> detalles
                    && "DeviceNotRegistered".equals(detalles.get("error"))) {
                destinatario.setExpoPushToken(null);
                usersRepository.save(destinatario);
            }
        } catch (Exception e) {
            log.warn("No se pudo enviar el aviso a Expo: {}", e.getMessage());
        }
    }
}
