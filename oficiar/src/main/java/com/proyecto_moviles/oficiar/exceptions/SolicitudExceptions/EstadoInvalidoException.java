package com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions;

// El estado actual no permite la acción (ej: aceptar una cancelada) -> 409
public class EstadoInvalidoException extends RuntimeException {
    public EstadoInvalidoException(String message) {
        super(message);
    }
}
