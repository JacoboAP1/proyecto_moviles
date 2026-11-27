package com.proyecto_moviles.oficiar.models.entities.Chat;

import com.proyecto_moviles.oficiar.models.entities.SolicitudServicio.SolicitudServicio;
import com.proyecto_moviles.oficiar.models.entities.Users;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

/**
 * Mensaje del chat de una solicitud (entre su cliente y su officer).
 * Se mapea a la tabla "mensajes" (se crea a mano: el proyecto no usa ddl-auto).
 */
@Entity
@Table(name = "mensajes")
@Data
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Solicitud a la que pertenece la conversación
    @ManyToOne(optional = false)
    @JoinColumn(name = "solicitud_id", nullable = false)
    private SolicitudServicio solicitud;

    // Quién lo escribió (sale del token, nunca del body)
    @ManyToOne(optional = false)
    @JoinColumn(name = "autor_id", nullable = false)
    private Users autor;

    @Column(nullable = false, length = 1000)
    private String texto;

    // Instant (UTC): la app lo muestra en la hora local del celular
    @Column(name = "fecha_envio", nullable = false, updatable = false)
    private Instant fechaEnvio;

    @PrePersist
    void alCrear() {
        fechaEnvio = Instant.now();
    }
}
