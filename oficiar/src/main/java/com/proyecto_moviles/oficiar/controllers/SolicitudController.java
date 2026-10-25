package com.proyecto_moviles.oficiar.controllers;

import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.AceptarSolicitudRequest;
import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.CrearSolicitudRequest;
import com.proyecto_moviles.oficiar.models.dto.SolicitudServicio.SolicitudResponse;
import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.AccionSolicitud;
import com.proyecto_moviles.oficiar.services.SolicitudServicio.SolicitudService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints de las solicitudes de servicio.
 * Quién puede hacer qué lo decide SolicitudService (no la app).
 */
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    // POST /api/solicitudes (cliente crea una solicitud -> PENDIENTE)
    @PostMapping
    public ResponseEntity<SolicitudResponse> crear(Authentication auth, @RequestBody CrearSolicitudRequest body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitudService.crear(auth.getName(), body));
    }

    // GET /api/solicitudes/mias (cliente: las que hizo; officer: las que recibió)
    @GetMapping("/mias")
    public ResponseEntity<List<SolicitudResponse>> mias(Authentication auth) {
        return ResponseEntity.ok(solicitudService.misSolicitudes(auth.getName()));
    }

    // GET /api/solicitudes/{id} (solo los dos participantes)
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudResponse> obtener(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.obtener(id, auth.getName()));
    }

    // PUT /api/solicitudes/{id}/aceptar  (el officer envía { "precio": 50000 })
    @PutMapping("/{id}/aceptar")
    public ResponseEntity<SolicitudResponse> aceptar(Authentication auth, @PathVariable Long id,
                                                     @RequestBody(required = false) AceptarSolicitudRequest body) {
        return ResponseEntity.ok(solicitudService.ejecutar(
                id, AccionSolicitud.ACEPTAR, auth.getName(), body == null ? null : body.getPrecio()));
    }

    // PUT /api/solicitudes/{id}/rechazar
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<SolicitudResponse> rechazar(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.ejecutar(id, AccionSolicitud.RECHAZAR, auth.getName(), null));
    }

    // PUT /api/solicitudes/{id}/iniciar (solo el officer)
    @PutMapping("/{id}/iniciar")
    public ResponseEntity<SolicitudResponse> iniciar(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.ejecutar(id, AccionSolicitud.INICIAR, auth.getName(), null));
    }

    // PUT /api/solicitudes/{id}/finalizar (solo el cliente confirma)
    @PutMapping("/{id}/finalizar")
    public ResponseEntity<SolicitudResponse> finalizar(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.ejecutar(id, AccionSolicitud.FINALIZAR, auth.getName(), null));
    }

    // PUT /api/solicitudes/{id}/cancelar (solo el cliente)
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<SolicitudResponse> cancelar(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.ejecutar(id, AccionSolicitud.CANCELAR, auth.getName(), null));
    }
}
