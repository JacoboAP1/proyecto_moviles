import type { Mensaje } from '../types';
import { API_URL, request } from './client';

// Los 50 mensajes más recientes, del más nuevo al más viejo
export async function getMensajes(solicitudId: number): Promise<Mensaje[]> {
  return request<Mensaje[]>(`/api/solicitudes/${solicitudId}/mensajes`);
}

// Se envía por REST; a los dos participantes les llega por el socket
export async function enviarMensaje(solicitudId: number, texto: string): Promise<Mensaje> {
  return request<Mensaje>(`/api/solicitudes/${solicitudId}/mensajes`, { texto });
}

// http(s)://servidor/oficiar -> ws(s)://servidor/oficiar/ws/chat?solicitudId=7
// El token solo va en la URL en web (el navegador no deja poner cabeceras al socket)
export function urlChat(solicitudId: number, token?: string | null): string {
  const base = API_URL.replace(/^http/, 'ws');
  const conToken = token ? `&token=${encodeURIComponent(token)}` : '';
  return `${base}/ws/chat?solicitudId=${solicitudId}${conToken}`;
}
