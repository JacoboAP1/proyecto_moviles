package com.proyecto_moviles.oficiar.services;

import com.proyecto_moviles.oficiar.exceptions.PerfilExceptions.OficioAsociadoException;
import com.proyecto_moviles.oficiar.models.entities.Perfil;
import com.proyecto_moviles.oficiar.repositories.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PerfilService {

    private final PerfilRepository perfilRepository;

    @Autowired
    public PerfilService(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    // CREATE: Crear un nuevo oficio
    @Transactional
    public Perfil createPerfil(Perfil perfil) {
        if (perfil.getOficio() == null || perfil.getOficio().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del oficio no puede estar vacío.");
        }

        String oficioLimpio = perfil.getOficio().trim();
        if (perfilRepository.existsByOficioIgnoreCase(oficioLimpio)) {
            throw new IllegalArgumentException("El oficio '" + oficioLimpio + "' ya existe en el catálogo.");
        }

        perfil.setOficio(oficioLimpio);
        return perfilRepository.save(perfil);
    }

    // READ: Obtener todos los oficios disponibles
    @Transactional(readOnly = true)
    public List<Perfil> getAllPerfiles() {
        return perfilRepository.findAll();
    }

    // READ: Obtener un oficio por ID
    @Transactional(readOnly = true)
    public Perfil getPerfilById(Long id) {
        return perfilRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado con ID: " + id));
    }

    // UPDATE: Actualizar el nombre de un oficio existente
    @Transactional
    public Perfil updatePerfil(Long id, Perfil perfilDetalles) {
        Perfil perfilExistente = perfilRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado con ID: " + id));

        if (perfilDetalles.getOficio() == null || perfilDetalles.getOficio().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del oficio no puede estar vacío.");
        }

        String nuevoOficio = perfilDetalles.getOficio().trim();

        // Si cambió el nombre del oficio, verificar que no exista duplicado
        if (!perfilExistente.getOficio().equalsIgnoreCase(nuevoOficio) &&
                perfilRepository.existsByOficioIgnoreCase(nuevoOficio)) {
            throw new IllegalArgumentException("Ya existe otro perfil registrado con el oficio '" + nuevoOficio + "'.");
        }

        perfilExistente.setOficio(nuevoOficio);
        return perfilRepository.save(perfilExistente);
    }

    // BUSCAR: Buscar oficios por texto parcial
    @Transactional(readOnly = true)
    public List<Perfil> searchPerfiles(String texto) {
        return perfilRepository.findByOficioContainingIgnoreCase(texto);
    }

    // DELETE: Eliminar un oficio por ID solo si no está en uso
    @Transactional
    public void deletePerfil(Long id) {
        if (!perfilRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar. Perfil no encontrado con ID: " + id);
        }

        // Validación del profesor: Verificar si hay usuarios usándolo
        if (perfilRepository.isPerfilInUse(id)) {
            throw new OficioAsociadoException("Este oficio tiene trabajadores asociados y no se puede eliminar");
        }

        perfilRepository.deleteById(id);
    }
}
