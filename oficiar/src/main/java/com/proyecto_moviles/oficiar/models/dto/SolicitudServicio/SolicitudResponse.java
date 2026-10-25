package com.proyecto_moviles.oficiar.models.dto.SolicitudServicio;

import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.EstadoSolicitud;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.SolicitudServicio;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Lo que el backend devuelve de una solicitud.
 * Nunca se devuelve la entidad Users completa porque trae la contraseña.
 */
public record SolicitudResponse(
        Long id,
        EstadoSolicitud estado,
        Long clienteId,
        String clienteNombre,
        String clienteFotoUrl,
        Long officerId,
        String officerNombre,
        String officerFotoUrl,
        Long perfilId,
        String oficio,
        String descripcion,
        String direccion,
        BigDecimal precioAcordado,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion
) {
    public static SolicitudResponse from(SolicitudServicio s) {
        return new SolicitudResponse(
                s.getId(),
                s.getEstado(),
                s.getCliente().getId(),
                s.getCliente().getUsername(),
                s.getCliente().getFotoUrl(),
                s.getOfficer().getId(),
                s.getOfficer().getUsername(),
                s.getOfficer().getFotoUrl(),
                s.getOficio().getId(),
                s.getOficio().getOficio(),
                s.getDescripcion(),
                s.getDireccion(),
                s.getPrecioAcordado(),
                s.getFechaCreacion(),
                s.getFechaActualizacion()
        );
    }
}
