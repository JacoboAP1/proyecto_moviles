import { request } from './client';

// --- MOCK: datos de prueba mientras no hay backend ---
export async function getMyProfile() {
  // TODO: cuando el backend esté listo, descomentar la línea de abajo
  // return request('/api/usuarios/obtener-informacion');
  return {
    id: 1,
    username: 'Luz Alba',
    email: 'luzalba@gmail.com',
    telefono: '3205363052',
    roles: ['ROLE_CLIENT'],
  };
}

export async function updateProfile(
  data: { username?: string; telefono?: string }
) {
  // TODO: cuando el backend esté listo, descomentar la línea de abajo
  // return request('/api/usuarios/actualizar', data, 'PUT');
  return { ...data };
}