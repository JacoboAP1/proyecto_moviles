package com.proyecto_moviles.oficiar.services.Notificaciones;

import com.proyecto_moviles.oficiar.models.entities.Users;

// Aviso que se envía cuando la base de datos ya guardó el cambio
public record AvisoPush(Users destinatario, String titulo, String cuerpo, Long solicitudId) {
}
