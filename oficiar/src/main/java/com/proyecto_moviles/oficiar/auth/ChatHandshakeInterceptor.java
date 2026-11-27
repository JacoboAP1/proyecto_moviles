package com.proyecto_moviles.oficiar.auth;

import com.proyecto_moviles.oficiar.models.entities.Users;
import com.proyecto_moviles.oficiar.repositories.SolicitudServicioRepository;
import com.proyecto_moviles.oficiar.repositories.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

/**
 * Valida la conexión al chat ANTES de abrir el socket:
 * - el token JWT (cabecera Authorization en el celular; ?token= en web, porque el navegador no deja poner cabeceras)
 * - que el usuario siga activo
 * - que sea el cliente o el officer de esa solicitud (si no, 403: no puede leer chats ajenos)
 */
@Component
public class ChatHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;
    private final UsersRepository usersRepository;
    private final SolicitudServicioRepository solicitudRepository;

    public ChatHandshakeInterceptor(JwtService jwtService, UsersRepository usersRepository,
                                    SolicitudServicioRepository solicitudRepository) {
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
        this.solicitudRepository = solicitudRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest req, ServerHttpResponse res,
                                   WebSocketHandler handler, Map<String, Object> atributos) {
        MultiValueMap<String, String> params = UriComponentsBuilder.fromUri(req.getURI()).build().getQueryParams();
        String cabecera = req.getHeaders().getFirst("Authorization");
        String token = cabecera != null ? cabecera : params.getFirst("token");

        Users usuario;
        Long solicitudId;
        try {
            String username = jwtService.parse(token).getSubject();
            usuario = usersRepository.findByUsername(username)
                    .filter(u -> Boolean.TRUE.equals(u.getActive()))
                    .orElse(null);
            solicitudId = Long.valueOf(params.getFirst("solicitudId"));
        } catch (Exception e) {
            usuario = null;
            solicitudId = null;
        }
        if (usuario == null || solicitudId == null) {
            res.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        Long usuarioId = usuario.getId();
        boolean participa = solicitudRepository.findById(solicitudId)
                .map(s -> s.getCliente().getId().equals(usuarioId) || s.getOfficer().getId().equals(usuarioId))
                .orElse(false);
        if (!participa) {
            res.setStatusCode(HttpStatus.FORBIDDEN);
            return false;
        }

        // Quedan guardados en la sesión del socket: la sala y quién es
        atributos.put("usuarioId", usuarioId);
        atributos.put("solicitudId", solicitudId);
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest req, ServerHttpResponse res, WebSocketHandler handler, Exception ex) {
    }
}
