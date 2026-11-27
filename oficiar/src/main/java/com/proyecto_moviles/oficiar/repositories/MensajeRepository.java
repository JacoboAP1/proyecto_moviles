package com.proyecto_moviles.oficiar.repositories;

import com.proyecto_moviles.oficiar.models.entities.Chat.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    // Los 50 mensajes más recientes de una solicitud, del más nuevo al más viejo (la lista del chat va invertida)
    List<Mensaje> findTop50BySolicitudIdOrderByIdDesc(Long solicitudId);
}
