package com.proyecto_moviles.oficiar.models.entities.SolicitudServicio;

/**
 * Estados por los que pasa una solicitud de servicio.
 * PENDIENTE -> COTIZADA -> ACEPTADA -> EN_CURSO -> FINALIZADA
 * y los estados de cierre RECHAZADA y CANCELADA.
 */
public enum EstadoSolicitud {
    PENDIENTE,
    COTIZADA,
    ACEPTADA,
    EN_CURSO,
    FINALIZADA,
    RECHAZADA,
    CANCELADA
}
