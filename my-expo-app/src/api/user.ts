import { request, setToken } from './client';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  telefono: string;
  roles: string[];
}

interface UpdateProfileResponse extends UserProfile {
  access_token: string;
  token_type: string;
}

export async function getMyProfile(): Promise<UserProfile> {
  return request<UserProfile>(
    '/api/usuarios/obtener-informacion'
  );
}

export async function updateProfile(
  data: {
    username?: string;
    telefono?: string;
  }
): Promise<UpdateProfileResponse> {
  const response = await request<UpdateProfileResponse>(
    '/api/usuarios/actualizar',
    data,
    'PUT'
  );

  // Guardar el JWT nuevo que devuelve el backend
  setToken(response.access_token);

  return response;
}