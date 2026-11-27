package com.proyecto_moviles.oficiar.services.Chat;

import com.proyecto_moviles.oficiar.models.dto.Chat.MensajeResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.json.JsonMapper;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Quién está conectado al chat de cada solicitud ("sala" = solicitud).
 * Cuando se guarda un mensaje, se lo envía a todos los conectados a esa sala.
 */
@Component
public class ChatSalas {

    private static final Logger log = LoggerFactory.getLogger(ChatSalas.class);

    // solicitudId -> (id de la sesión -> sesión). Concurrent: varios hilos conectan y envían a la vez
    private final Map<Long, Map<String, WebSocketSession>> salas = new ConcurrentHashMap<>();
    private final JsonMapper json;

    public ChatSalas(JsonMapper json) {
        this.json = json;
    }

    public void entrar(Long solicitudId, WebSocketSession sesion) {
        salas.computeIfAbsent(solicitudId, k -> new ConcurrentHashMap<>()).put(sesion.getId(), sesion);
    }

    public void salir(Long solicitudId, String sesionId) {
        salas.computeIfPresent(solicitudId, (k, sala) -> {
            sala.remove(sesionId);
            return sala.isEmpty() ? null : sala;
        });
    }

    // Si el otro participante tiene el chat abierto, no hace falta mandarle notificación push
    public boolean estaConectado(Long solicitudId, Long usuarioId) {
        return salas.getOrDefault(solicitudId, Map.of()).values().stream()
                .anyMatch(s -> usuarioId.equals(s.getAttributes().get("usuarioId")));
    }

    // Se ejecuta DESPUÉS de que la base de datos guardó el mensaje (no se envía algo que no quedó guardado)
    @TransactionalEventListener
    public void alGuardar(MensajeResponse mensaje) {
        for (WebSocketSession sesion : salas.getOrDefault(mensaje.solicitudId(), Map.of()).values()) {
            Long lectorId = (Long) sesion.getAttributes().get("usuarioId");
            try {
                // A cada uno le llega con "mio" calculado para él
                sesion.sendMessage(new TextMessage(json.writeValueAsString(mensaje.para(lectorId))));
            } catch (Exception e) {
                log.warn("No se pudo enviar el mensaje {} por el socket: {}", mensaje.id(), e.getMessage());
            }
        }
    }
}
