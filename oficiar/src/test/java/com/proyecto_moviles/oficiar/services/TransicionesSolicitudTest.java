package com.proyecto_moviles.oficiar.services;

import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.AccionNoPermitidaException;
import com.proyecto_moviles.oficiar.exceptions.SolicitudExceptions.EstadoInvalidoException;
import com.proyecto_moviles.oficiar.services.SolicitudServicio.TransicionesSolicitud;
import org.junit.jupiter.api.Test;

import static com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.AccionSolicitud.*;
import static com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.EstadoSolicitud.*;
import static com.proyecto_moviles.oficiar.services.SolicitudServicio.TransicionesSolicitud.Rol.CLIENTE;
import static com.proyecto_moviles.oficiar.services.SolicitudServicio.TransicionesSolicitud.Rol.OFFICER;
import static org.junit.jupiter.api.Assertions.*;

class TransicionesSolicitudTest {

    @Test
    void flujoCompletoFeliz() {
        assertEquals(COTIZADA, TransicionesSolicitud.siguiente(PENDIENTE, ACEPTAR, OFFICER));
        assertEquals(ACEPTADA, TransicionesSolicitud.siguiente(COTIZADA, ACEPTAR, CLIENTE));
        assertEquals(EN_CURSO, TransicionesSolicitud.siguiente(ACEPTADA, INICIAR, OFFICER));
        assertEquals(FINALIZADA, TransicionesSolicitud.siguiente(EN_CURSO, FINALIZAR, CLIENTE));
    }

    @Test
    void ambosPuedenRechazarEnSuTurno() {
        assertEquals(RECHAZADA, TransicionesSolicitud.siguiente(PENDIENTE, RECHAZAR, OFFICER));
        assertEquals(RECHAZADA, TransicionesSolicitud.siguiente(COTIZADA, RECHAZAR, CLIENTE));
    }

    @Test
    void clienteNoPuedeIniciar() {
        AccionNoPermitidaException ex = assertThrows(AccionNoPermitidaException.class,
                () -> TransicionesSolicitud.siguiente(ACEPTADA, INICIAR, CLIENTE));
        assertEquals("Solo el officer puede iniciar la solicitud", ex.getMessage());
    }

    @Test
    void officerNoPuedeFinalizarNiCancelar() {
        assertThrows(AccionNoPermitidaException.class, () -> TransicionesSolicitud.siguiente(EN_CURSO, FINALIZAR, OFFICER));
        assertThrows(AccionNoPermitidaException.class, () -> TransicionesSolicitud.siguiente(PENDIENTE, CANCELAR, OFFICER));
    }

    @Test
    void noSeAceptaUnaSolicitudCancelada() {
        assertThrows(EstadoInvalidoException.class, () -> TransicionesSolicitud.siguiente(CANCELADA, ACEPTAR, OFFICER));
    }

    @Test
    void noSeIniciaSinQueElClienteAcepteElPrecio() {
        assertThrows(EstadoInvalidoException.class, () -> TransicionesSolicitud.siguiente(COTIZADA, INICIAR, OFFICER));
    }

    @Test
    void elClienteNoAceptaLoQueElOfficerAunNoCotizo() {
        assertThrows(EstadoInvalidoException.class, () -> TransicionesSolicitud.siguiente(PENDIENTE, ACEPTAR, CLIENTE));
    }

    @Test
    void noSeCancelaUnaSolicitudEnCurso() {
        assertThrows(EstadoInvalidoException.class, () -> TransicionesSolicitud.siguiente(EN_CURSO, CANCELAR, CLIENTE));
    }
}
