import type { Estadisticas, Solicitud } from '../types';
import { request } from './client';

export interface NuevaSolicitud {
  officerId: number;
  perfilId: number;
  descripcion: string;
  direccion?: string;
}

// Acciones que no llevan body: PUT /api/solicitudes/{id}/{accion}
export type AccionSolicitud = 'aceptar' | 'rechazar' | 'iniciar' | 'finalizar' | 'cancelar';

// El cliente crea la solicitud; queda PENDIENTE
export async function crearSolicitud(data: NuevaSolicitud): Promise<Solicitud> {
  return request<Solicitud>('/api/solicitudes', data);
}

// Cliente: las que hizo. Officer: las que recibió
export async function getMisSolicitudes(): Promise<Solicitud[]> {
  return request<Solicitud[]>('/api/solicitudes/mias');
}

// Una solicitud (solo si soy su cliente o su officer; si no, 404)
export async function getSolicitud(id: number): Promise<Solicitud> {
  return request<Solicitud>(`/api/solicitudes/${id}`);
}

// Conteo de mis solicitudes por grupo de estado (lo calcula el backend según el rol)
export async function getEstadisticas(): Promise<Estadisticas> {
  return request<Estadisticas>('/api/solicitudes/estadisticas');
}

// El officer acepta proponiendo el precio; queda COTIZADA
export async function cotizarSolicitud(id: number, precio: number): Promise<Solicitud> {
  return request<Solicitud>(`/api/solicitudes/${id}/aceptar`, { precio }, 'PUT');
}

// El backend decide si el rol y el estado permiten la acción (403 / 409 si no)
export async function cambiarEstado(id: number, accion: AccionSolicitud): Promise<Solicitud> {
  return request<Solicitud>(`/api/solicitudes/${id}/${accion}`, undefined, 'PUT');
}
