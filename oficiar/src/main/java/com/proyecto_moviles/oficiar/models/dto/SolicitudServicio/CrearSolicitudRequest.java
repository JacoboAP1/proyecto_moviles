package com.proyecto_moviles.oficiar.models.dto.SolicitudServicio;

import lombok.Data;

/**
 * Datos que envía la app para crear una solicitud.
 * El cliente NO viene aquí: se toma del token JWT.
 */
@Data
public class CrearSolicitudRequest {
    private Long officerId;     // A quién se le pide el servicio
    private Long perfilId;      // Oficio solicitado
    private String descripcion; // Qué necesita el cliente
    private String direccion;   // Dónde es el trabajo (opcional)
}

