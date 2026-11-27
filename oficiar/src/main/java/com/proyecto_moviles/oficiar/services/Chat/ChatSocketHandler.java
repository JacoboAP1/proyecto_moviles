package com.proyecto_moviles.oficiar.services.Chat;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Conexión WebSocket del chat: /oficiar/ws/chat?solicitudId=7
 * El socket solo RECIBE mensajes nuevos; enviar se hace por REST (POST /api/solicitudes/{id}/mensajes),
 * así se reutilizan la validación, el guardado y las notificaciones.
 */
@Component
public class ChatSocketHandler extends TextWebSocketHandler {

    private final ChatSalas salas;

    public ChatSocketHandler(ChatSalas salas) {
        this.salas = salas;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession sesion) {
        // El decorador hace segura la sesión cuando varios hilos le envían a la vez
        salas.entrar(solicitudId(sesion), new ConcurrentWebSocketSessionDecorator(sesion, 5_000, 64 * 1024));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession sesion, CloseStatus estado) {
        salas.salir(solicitudId(sesion), sesion.getId());
    }

    // La app manda "ping" cada 25 s para que el proxy no cierre la conexión por inactividad: se ignora
    @Override
    protected void handleTextMessage(WebSocketSession sesion, TextMessage mensaje) {
    }

    private static Long solicitudId(WebSocketSession sesion) {
        return (Long) sesion.getAttributes().get("solicitudId");
    }
}
