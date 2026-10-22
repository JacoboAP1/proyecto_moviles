import { request, requestFormData, setToken } from './client';
import { uploadFile } from './client';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  telefono: string;
  fotoUrl?: string;
  fotoPublicId?: string;
  roles: string[];
}

interface UpdateProfileResponse extends UserProfile {
  access_token: string;
  token_type: string;
}

export interface UploadFotoResponse {
  fotoUrl: string;
  fotoPublicId: string;
  message: string;
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

// POST /api/usuarios/foto (Subir o actualizar foto de perfil)
export async function uploadProfilePicture(uri: string): Promise<UploadFotoResponse> {
  return uploadFile<UploadFotoResponse>('/api/usuarios/foto', uri);
}

// DELETE /api/usuarios/foto (Eliminar foto de perfil)
export async function deleteProfilePicture(): Promise<{ message: string }> {
  return request<{ message: string }>('/api/usuarios/foto', undefined, 'DELETE');
}