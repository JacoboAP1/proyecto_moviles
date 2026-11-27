package com.proyecto_moviles.oficiar.controllers;

import com.proyecto_moviles.oficiar.models.dto.Chat.EnviarMensajeRequest;
import com.proyecto_moviles.oficiar.models.dto.Chat.MensajeResponse;
import com.proyecto_moviles.oficiar.services.Chat.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Chat de una solicitud por REST: historial y envío.
 * Los mensajes nuevos llegan en tiempo real por el socket /ws/chat.
 */
@RestController
@RequestMapping("/api/solicitudes/{id}/mensajes")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // GET /api/solicitudes/{id}/mensajes (los 50 más recientes)
    @GetMapping
    public ResponseEntity<List<MensajeResponse>> historial(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(chatService.historial(id, auth.getName()));
    }

    // POST /api/solicitudes/{id}/mensajes  { "texto": "..." }
    @PostMapping
    public ResponseEntity<MensajeResponse> enviar(Authentication auth, @PathVariable Long id,
                                                  @RequestBody EnviarMensajeRequest body) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.enviar(id, auth.getName(), body == null ? null : body.texto()));
    }
}
