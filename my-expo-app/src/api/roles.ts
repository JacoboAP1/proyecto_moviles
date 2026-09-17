import { request } from './client';

export interface Role {
  id: number;
  name: string;
}

// Obtener todos los roles
export async function getRoles(): Promise<Role[]> {
  return request<Role[]>('/api/roles');
}

// Buscar roles por texto
export async function searchRoles(texto: string): Promise<Role[]> {
  return request<Role[]>(`/api/roles/buscar?texto=${encodeURIComponent(texto)}`);
}

// Obtener un rol por ID
export async function getRoleById(id: number): Promise<Role> {
  return request<Role>(`/api/roles/${id}`);
}

// Crear un rol
export async function createRole(name: string): Promise<Role> {
  return request<Role>(
    '/api/roles',
    { name },
    'POST',
  );
}

// Actualizar un rol
export async function updateRole(
  id: number,
  name: string,
): Promise<Role> {
  return request<Role>(
    `/api/roles/${id}`,
    { name },
    'PUT',
  );
}

// Eliminar un rol
export async function deleteRole(id: number): Promise<void> {
  await request(
    `/api/roles/${id}`,
    undefined,
    'DELETE',
  );
}