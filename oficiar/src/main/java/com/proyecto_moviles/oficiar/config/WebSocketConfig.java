package com.proyecto_moviles.oficiar.config;

import com.proyecto_moviles.oficiar.auth.ChatHandshakeInterceptor;
import com.proyecto_moviles.oficiar.services.Chat.ChatSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * Registra el socket del chat en /ws/chat (con el context path: /oficiar/ws/chat).
 * La seguridad la hace ChatHandshakeInterceptor con el token.
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatSocketHandler chatHandler;
    private final ChatHandshakeInterceptor chatInterceptor;

    public WebSocketConfig(ChatSocketHandler chatHandler, ChatHandshakeInterceptor chatInterceptor) {
        this.chatHandler = chatHandler;
        this.chatInterceptor = chatInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatHandler, "/ws/chat")
                .addInterceptors(chatInterceptor)
                // La app nativa no envía Origin; el acceso lo controla el token, no el origen
                .setAllowedOriginPatterns("*");
    }
}
