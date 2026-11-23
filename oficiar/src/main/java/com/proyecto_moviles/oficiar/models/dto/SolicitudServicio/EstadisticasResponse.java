
package com.proyecto_moviles.oficiar.models.dto.SolicitudServicio;

/**
 * Números del home: solicitudes pendientes, activas y finalizadas del usuario.
 * Qué estados entran en cada grupo depende del rol (lo decide SolicitudService).
 */
public record EstadisticasResponse(long pendientes, long activos, long finalizados) {
}
