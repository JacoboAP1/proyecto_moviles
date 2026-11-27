package com.proyecto_moviles.oficiar.models.dto.Chat;

import com.proyecto_moviles.oficiar.models.entities.Chat.Mensaje;

import java.time.Instant;

/**
 * Lo que el backend devuelve de un mensaje (por REST y por el socket).
 * "mio" se calcula para quien lo recibe: true si él lo escribió.
 */
public record MensajeResponse(
        Long id,
        Long solicitudId,
        Long autorId,
        String autorNombre,
        String texto,
        Instant fechaEnvio,
        boolean mio
) {
    public static MensajeResponse from(Mensaje m, Long lectorId) {
        return new MensajeResponse(
                m.getId(),
                m.getSolicitud().getId(),
                m.getAutor().getId(),
                m.getAutor().getUsername(),
                m.getTexto(),
                m.getFechaEnvio(),
                m.getAutor().getId().equals(lectorId)
        );
    }

    // El mismo mensaje visto por otro lector (el socket lo envía a cada participante)
    public MensajeResponse para(Long lectorId) {
        return new MensajeResponse(id, solicitudId, autorId, autorNombre, texto, fechaEnvio, autorId.equals(lectorId));
    }
}
