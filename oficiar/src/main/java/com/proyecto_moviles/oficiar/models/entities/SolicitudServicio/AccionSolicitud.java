package com.proyecto_moviles.oficiar.models.entities.SolicitudServicio;

/**
 * Acciones que un cliente o un officer pueden pedir sobre una solicitud.
 * Cada acción corresponde a un endpoint PUT /api/solicitudes/{id}/{accion}.
 */
public enum AccionSolicitud {
    ACEPTAR,
    RECHAZAR,
    INICIAR,
    FINALIZAR,
    CANCELAR
}
