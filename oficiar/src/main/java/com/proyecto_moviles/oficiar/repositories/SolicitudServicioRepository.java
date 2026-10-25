package com.proyecto_moviles.oficiar.repositories;

import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.SolicitudServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {

    // Solicitudes que hizo un cliente, de la más nueva a la más vieja
    List<SolicitudServicio> findByClienteIdOrderByFechaCreacionDesc(Long clienteId);

    // Solicitudes que recibió un officer, de la más nueva a la más vieja
    List<SolicitudServicio> findByOfficerIdOrderByFechaCreacionDesc(Long officerId);
}
