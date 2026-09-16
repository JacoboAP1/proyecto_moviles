import type { Perfil } from '../types';
import { request } from './client';

export async function getPerfiles(): Promise<Perfil[]> {
  return request<Perfil[]>('/api/perfiles');
}

export async function createPerfil(oficio: string): Promise<Perfil> {
  return request<Perfil>('/api/perfiles', { oficio });
}

export async function searchPerfiles(texto: string): Promise<Perfil[]> {
  return request<Perfil[]>(`/api/perfiles/buscar?texto=${encodeURIComponent(texto)}`);
}

export async function deletePerfil(id: number): Promise<void> {
  await request(`/api/perfiles/${id}`, undefined, 'DELETE');
}
