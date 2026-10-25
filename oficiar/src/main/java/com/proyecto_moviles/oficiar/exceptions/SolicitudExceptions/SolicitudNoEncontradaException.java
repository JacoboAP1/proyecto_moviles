package com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions;

// La solicitud no existe o no es tuya -> 404 (no se revela que existe)
public class SolicitudNoEncontradaException extends RuntimeException {
    public SolicitudNoEncontradaException(String message) {
        super(message);
    }
}
