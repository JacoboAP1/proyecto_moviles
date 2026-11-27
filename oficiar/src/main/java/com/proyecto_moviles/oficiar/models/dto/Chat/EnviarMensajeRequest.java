package com.proyecto_moviles.oficiar.models.dto.Chat;

// Body de POST /api/solicitudes/{id}/mensajes: { "texto": "Hola, ¿a qué hora llega?" }
public record EnviarMensajeRequest(String texto) {
}
