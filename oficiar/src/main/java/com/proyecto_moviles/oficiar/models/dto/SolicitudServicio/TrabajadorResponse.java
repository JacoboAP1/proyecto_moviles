package com.proyecto_moviles.oficiar.models.dto.SolicitudServicio;

import com.proyecto_moviles.oficiar.models.entities.Perfil;
import com.proyecto_moviles.oficiar.models.entities.Users;

import java.util.Comparator;
import java.util.List;

/**
 * Officer que se muestra en el listado de la Vista 1 (sin contraseña).
 * Incluye el id de cada oficio porque la app lo necesita para crear la solicitud.
 */
public record TrabajadorResponse(
        Long id,
        String nombre,
        String telefono,
        String fotoUrl,
        List<OficioResumen> oficios
) {
    public record OficioResumen(Long id, String oficio) {
    }

    public static TrabajadorResponse from(Users u) {
        List<OficioResumen> oficios = u.getPerfiles().stream()
                .sorted(Comparator.comparing(Perfil::getOficio))
                .map(p -> new OficioResumen(p.getId(), p.getOficio()))
                .toList();

        return new TrabajadorResponse(u.getId(), u.getUsername(), u.getTelefono(), u.getFotoUrl(), oficios);
    }
}
