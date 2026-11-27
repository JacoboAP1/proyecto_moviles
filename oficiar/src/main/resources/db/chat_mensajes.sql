-- Tabla del chat por solicitud. El proyecto no usa ddl-auto: correr una vez en la base (local y Aiven).
CREATE TABLE IF NOT EXISTS mensajes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  solicitud_id BIGINT NOT NULL,
  autor_id BIGINT NOT NULL,
  texto VARCHAR(1000) NOT NULL,
  fecha_envio DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_mensajes_solicitud (solicitud_id, id),
  CONSTRAINT fk_mensaje_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes (id),
  CONSTRAINT fk_mensaje_autor FOREIGN KEY (autor_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
