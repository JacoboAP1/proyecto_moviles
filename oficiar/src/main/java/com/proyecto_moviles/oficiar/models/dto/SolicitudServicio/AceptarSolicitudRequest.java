package com.proyecto_moviles.oficiar.models.dto.SolicitudServicio;

import lombok.Data;

import java.math.BigDecimal;

/**
 * Body de PUT /api/solicitudes/{id}/aceptar.
 * Solo el officer envía el precio; el cliente acepta sin body.
 */
@Data
public class AceptarSolicitudRequest {
    private BigDecimal precio;
}

