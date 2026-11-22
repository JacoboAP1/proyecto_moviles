import { request } from './client';
 
// PUT /api/usuarios/token-push. null = este celular deja de recibir avisos
export async function guardarTokenPush(token: string | null): Promise<void> {
  await request('/api/usuarios/token-push', { token }, 'PUT');
}
