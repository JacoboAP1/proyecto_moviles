package com.proyecto_moviles.oficiar.models.dto.Register;

import lombok.Data;

import java.util.List;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String telefono;
    private List<String> roles; // ["CLIENT"] o ["WORKER"]
    private List<Long> perfilIds; // IDs de los oficios seleccionados (Solo si es WORKER)
}
