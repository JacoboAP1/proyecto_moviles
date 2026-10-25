package com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions;

// El rol no puede hacer esa acción (ej: un cliente intenta iniciar) -> 403
public class AccionNoPermitidaException extends RuntimeException {
    public AccionNoPermitidaException(String message) {
        super(message);
    }
}
