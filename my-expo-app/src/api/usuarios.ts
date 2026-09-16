import { request } from './client';

export interface UsuarioAdmin {
  id: number;
  username: string;
  email: string;
  telefono: string;
  active: boolean;
  roles: { id: number; name: string }[];
}

export async function getAllUsers(): Promise<UsuarioAdmin[]> {
  return request<UsuarioAdmin[]>('/api/usuarios/listar_todos');
}

export async function searchUsers(texto: string): Promise<UsuarioAdmin[]> {
  return request<UsuarioAdmin[]>(`/api/usuarios/buscar?texto=${encodeURIComponent(texto)}`);
}

export async function softDeleteUser(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/usuarios/eliminar/${id}`, undefined, 'DELETE');
}

export async function reactivateUser(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/usuarios/reactivar/${id}`, undefined, 'PUT');
}
