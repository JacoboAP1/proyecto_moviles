
package com.proyecto_moviles.oficiar.repositories;

import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.SolicitudServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudServicioRepository extends JpaRepository<SolicitudServicio, Long> {

    // Solicitudes que hizo un cliente, de la más nueva a la más vieja
    List<SolicitudServicio> findByClienteIdOrderByFechaCreacionDesc(Long clienteId);

    // Solicitudes que recibió un officer, de la más nueva a la más vieja
    List<SolicitudServicio> findByOfficerIdOrderByFechaCreacionDesc(Long officerId);

    // Cuántas solicitudes hizo el cliente en cada estado. Cada fila: [estado, cantidad]
    @Query("SELECT s.estado, COUNT(s) FROM SolicitudServicio s WHERE s.cliente.id = :id GROUP BY s.estado")
    List<Object[]> contarPorEstadoComoCliente(@Param("id") Long id);

    // Cuántas solicitudes recibió el officer en cada estado. Cada fila: [estado, cantidad]
    @Query("SELECT s.estado, COUNT(s) FROM SolicitudServicio s WHERE s.officer.id = :id GROUP BY s.estado")
    List<Object[]> contarPorEstadoComoOfficer(@Param("id") Long id);
}
