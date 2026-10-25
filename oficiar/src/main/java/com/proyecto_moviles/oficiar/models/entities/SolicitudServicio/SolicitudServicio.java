package com.proyecto_moviles.oficiar.models.entities.SolicitudServicio;

import com.proyecto_moviles.oficiar.models.entities.Perfil;
import com.proyecto_moviles.oficiar.models.entities.Users;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Solicitud de servicio que un cliente le envía a un officer.
 * Se mapea a la tabla "solicitudes".
 */
@Entity
@Table(name = "solicitudes")
@Data
public class SolicitudServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cliente que pide el servicio (sale del token, nunca del body)
    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Users cliente;

    // Officer al que se le pide el servicio
    @ManyToOne(optional = false)
    @JoinColumn(name = "officer_id", nullable = false)
    private Users officer;

    // Oficio solicitado (Plomero, Electricista...)
    @ManyToOne(optional = false)
    @JoinColumn(name = "oficio_id", nullable = false)
    private Perfil oficio;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(length = 255)
    private String direccion;

    // Lo propone el officer al aceptar; queda vacío mientras está PENDIENTE
    @Column(name = "precio_acordado", precision = 12, scale = 2)
    private BigDecimal precioAcordado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    void alCrear() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = fechaCreacion;
    }

    @PreUpdate
    void alActualizar() {
        fechaActualizacion = LocalDateTime.now();
    }
}
