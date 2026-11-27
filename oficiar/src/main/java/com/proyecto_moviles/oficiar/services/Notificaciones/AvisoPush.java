package com.proyecto_moviles.oficiar.services.Notificaciones;

import com.proyecto_moviles.oficiar.models.entities.Users;

// Aviso que se envía cuando la base de datos ya guardó el cambio.
// tipo le dice a la app qué abrir al tocarlo: "SOLICITUD" (la solicitud) o "MENSAJE" (el chat)
public record AvisoPush(Users destinatario, String titulo, String cuerpo, Long solicitudId, String tipo) {

    // Los avisos de cambio de estado (SolicitudService) siguen igual: abren la solicitud
    public AvisoPush(Users destinatario, String titulo, String cuerpo, Long solicitudId) {
        this(destinatario, titulo, cuerpo, solicitudId, "SOLICITUD");
    }
}
