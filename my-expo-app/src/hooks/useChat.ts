import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { enviarMensaje, getMensajes, urlChat } from '../api/chat';
import { getToken } from '../api/client';
import { useAlerta } from '../session/alerta';
import type { Mensaje } from '../types';

// Cada cuánto se avisa "sigo aquí" (el proxy de Render cierra sockets callados) y cuánto esperar para reconectar
const PING_MS = 25_000;
const REINTENTO_MS = 3_000;

// React Native acepta un tercer parámetro con cabeceras; el tipo del navegador no lo trae
type SocketConCabeceras = new (
  url: string,
  protocolos: null,
  opciones: { headers: Record<string, string> },
) => WebSocket;

// Une mensajes sin duplicar (Map por id) y los deja del más nuevo al más viejo (la lista del chat va invertida)
function combinar(actuales: Mensaje[], nuevos: Mensaje[]): Mensaje[] {
  const porId = new Map(actuales.map((m) => [m.id, m]));
  nuevos.forEach((m) => porId.set(m.id, m));
  return [...porId.values()].sort((a, b) => b.id - a.id);
}

/**
 * Chat de una solicitud en tiempo real.
 * - Historial por REST al entrar (y otra vez al reconectar: lo que llegó sin señal no se repite por el socket).
 * - Mensajes nuevos por WebSocket, guardado en un ref (cambiarlo no debe redibujar).
 * - Enviar es por REST: el backend valida, guarda, lo reparte por el socket y avisa por push si hace falta.
 */
export function useChat(solicitudId: number) {
  const { avisar } = useAlerta();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conectado, setConectado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Si el usuario sale del chat, las respuestas que lleguen tarde se ignoran
    let activo = true;
    let primeraConexion = true;
    let reintento: ReturnType<typeof setTimeout> | undefined;

    const cargarRecientes = () => {
      getMensajes(solicitudId)
        .then((lista) => {
          if (!activo) return;
          setMensajes((actuales) => combinar(actuales, lista));
          setError(null);
        })
        .catch((e: Error) => activo && setError(e.message))
        .finally(() => activo && setCargando(false));
    };

    const conectar = () => {
      const token = getToken();
      // En el celular el token va en la cabecera; en web va en la URL
      const socket =
        Platform.OS === 'web'
          ? new WebSocket(urlChat(solicitudId, token))
          : new (WebSocket as unknown as SocketConCabeceras)(urlChat(solicitudId), null, {
              headers: { Authorization: `Bearer ${token}` },
            });
      socketRef.current = socket;

      socket.onopen = () => {
        if (!activo) return;
        setConectado(true);
        // Al reconectar se recupera lo que llegó mientras no había señal
        if (!primeraConexion) cargarRecientes();
        primeraConexion = false;
      };
      socket.onmessage = (evento) => {
        if (!activo) return;
        try {
          const mensaje = JSON.parse(String(evento.data)) as Mensaje;
          setMensajes((actuales) => combinar(actuales, [mensaje]));
        } catch {
          // Algo que no es un mensaje: se ignora
        }
      };
      socket.onclose = () => {
        if (!activo) return;
        setConectado(false);
        reintento = setTimeout(conectar, REINTENTO_MS);
      };
    };

    cargarRecientes();
    conectar();
    const ping = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send('ping');
    }, PING_MS);

    return () => {
      activo = false;
      clearTimeout(reintento);
      clearInterval(ping);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [solicitudId]);

  // Devuelve true si se envió (el campo de texto solo se limpia en ese caso)
  const enviar = useCallback(
    async (texto: string): Promise<boolean> => {
      setEnviando(true);
      try {
        const mensaje = await enviarMensaje(solicitudId, texto);
        setMensajes((actuales) => combinar(actuales, [mensaje]));
        return true;
      } catch (e) {
        avisar({ tipo: 'error', titulo: 'No se envió el mensaje', mensaje: (e as Error).message });
        return false;
      } finally {
        setEnviando(false);
      }
    },
    [solicitudId, avisar],
  );

  return { mensajes, cargando, error, conectado, enviando, enviar };
}
