package com.proyecto_moviles.oficiar.services.SolicitudServicio;

import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.AccionNoPermitidaException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.EstadoInvalidoException;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.AccionSolicitud;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.EstadoSolicitud;

import java.util.Map;

import static com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.AccionSolicitud.*;
import static com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.EstadoSolicitud.*;

/**
 * Máquina de estados de la solicitud: todas las reglas en un solo lugar.
 * Es una función pura (no toca la base de datos), por eso se prueba fácil con JUnit.
 */
public final class TransicionesSolicitud {

    public enum Rol { CLIENTE, OFFICER }

    private record Clave(EstadoSolicitud estado, AccionSolicitud accion, Rol rol) {
    }

    // (estado actual, acción, quién la pide) -> estado nuevo
    private static final Map<Clave, EstadoSolicitud> TRANSICIONES = Map.ofEntries(
            Map.entry(new Clave(PENDIENTE, ACEPTAR, Rol.OFFICER), COTIZADA),
            Map.entry(new Clave(PENDIENTE, RECHAZAR, Rol.OFFICER), RECHAZADA),
            Map.entry(new Clave(COTIZADA, ACEPTAR, Rol.CLIENTE), ACEPTADA),
            Map.entry(new Clave(COTIZADA, RECHAZAR, Rol.CLIENTE), RECHAZADA),
            Map.entry(new Clave(ACEPTADA, INICIAR, Rol.OFFICER), EN_CURSO),
            Map.entry(new Clave(EN_CURSO, FINALIZAR, Rol.CLIENTE), FINALIZADA),
            Map.entry(new Clave(PENDIENTE, CANCELAR, Rol.CLIENTE), CANCELADA),
            Map.entry(new Clave(COTIZADA, CANCELAR, Rol.CLIENTE), CANCELADA),
            Map.entry(new Clave(ACEPTADA, CANCELAR, Rol.CLIENTE), CANCELADA)
    );

    private TransicionesSolicitud() {
    }

    public static EstadoSolicitud siguiente(EstadoSolicitud actual, AccionSolicitud accion, Rol rol) {
        // 1. ¿Este rol puede hacer esta acción en algún estado? Si no -> 403
        boolean rolPuede = TRANSICIONES.keySet().stream()
                .anyMatch(c -> c.accion() == accion && c.rol() == rol);
        if (!rolPuede) {
            Rol otro = rol == Rol.CLIENTE ? Rol.OFFICER : Rol.CLIENTE;
            throw new AccionNoPermitidaException(
                    "Solo el " + nombre(otro) + " puede " + verbo(accion) + " la solicitud");
        }

        // 2. ¿Se puede desde el estado actual? Si no -> 409
        EstadoSolicitud nuevo = TRANSICIONES.get(new Clave(actual, accion, rol));
        if (nuevo == null) {
            throw new EstadoInvalidoException(
                    "No se puede " + verbo(accion) + " una solicitud en estado " + actual);
        }
        return nuevo;
    }

    private static String nombre(Rol rol) {
        return rol == Rol.CLIENTE ? "cliente" : "officer";
    }

    private static String verbo(AccionSolicitud accion) {
        return switch (accion) {
            case ACEPTAR -> "aceptar";
            case RECHAZAR -> "rechazar";
            case INICIAR -> "iniciar";
            case FINALIZAR -> "finalizar";
            case CANCELAR -> "cancelar";
        };
    }
}
