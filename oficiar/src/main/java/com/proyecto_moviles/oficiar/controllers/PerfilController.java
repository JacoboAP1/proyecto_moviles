package com.proyecto_moviles.oficiar.controllers;

import com.proyecto_moviles.oficiar.models.entities.Perfil;
import com.proyecto_moviles.oficiar.services.PerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {

    private final PerfilService perfilService;

    @Autowired
    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping
    public ResponseEntity<List<Perfil>> getAllPerfiles() {
        return ResponseEntity.ok(perfilService.getAllPerfiles());
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Perfil>> searchPerfiles(@RequestParam String texto) {
        return ResponseEntity.ok(perfilService.searchPerfiles(texto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> getPerfilById(@PathVariable Long id) {
        return ResponseEntity.ok(perfilService.getPerfilById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Perfil> createPerfil(@RequestBody Perfil perfil) {
        return ResponseEntity.status(HttpStatus.CREATED).body(perfilService.createPerfil(perfil));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Perfil> updatePerfil(@PathVariable Long id, @RequestBody Perfil perfilDetalles) {
        return ResponseEntity.ok(perfilService.updatePerfil(id, perfilDetalles));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePerfil(@PathVariable Long id) {
        perfilService.deletePerfil(id);
        return ResponseEntity.noContent().build();
    }
}