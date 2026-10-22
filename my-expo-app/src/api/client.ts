import * as FileSystem from 'expo-file-system/legacy';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/oficiar';

let token: string | null = null;

export function setToken(value: string | null): void {
  token = value;
}

export function getToken(): string | null {
  return token;
}

export async function request<T>(
  path: string,
  body?: unknown,
  method?: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: method ?? (body === undefined ? 'GET' : 'POST'),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(`No se pudo conectar con ${API_URL}. ¿Está encendido el servidor?`);
  }

  if (method === 'DELETE' && response.status === 204) {
    return {} as T;
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const raw =
      typeof data['message'] === 'string' ? data['message'] :
      typeof data['error'] === 'string' ? data['error'] : null;
    const message = raw === 'Bad credentials' ? 'Credenciales incorrectas' : raw;
    throw new Error(message ?? `Error ${response.status} al llamar ${path}`);
  }

  return data as T;
}

export async function requestFormData<T>(
  path: string,
  formData: FormData,
  method = 'POST'
): Promise<T> {
  const fullUrl = `${API_URL}${path}`;
  console.log('Enviando petición FormData a:', fullUrl);

  let response: Response;

  try {
    response = await fetch(fullUrl, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
  } catch (err: any) {
    console.error('Error real atrapado en fetch FormData:', err);
    throw new Error(`No se pudo conectar con ${API_URL}. ¿Está encendido el servidor?`);
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const raw =
      typeof data['message'] === 'string' ? data['message'] :
      typeof data['error'] === 'string' ? data['error'] : null;
    throw new Error(raw ?? `Error ${response.status} al llamar ${path}`);
  }

  return data as T;
}

export async function uploadFile<T>(
  path: string,
  fileUri: string,
  fieldName = 'file'
): Promise<T> {
  const fullUrl = `${API_URL}${path}`;
  console.log('Subiendo archivo nativamente vía FileSystem a:', fullUrl);

  try {
    // Usar la función getToken() en lugar de AsyncStorage para garantizar el token activo
    const currentToken = getToken();

    const response = await FileSystem.uploadAsync(fullUrl, fileUri, {
      httpMethod: 'POST',
      uploadType: 1, // FileSystemUploadType.MULTIPART
      fieldName,
      mimeType: 'image/jpeg', // Obligatorio para que Cloudinary identifique la imagen
      headers: {
        Accept: 'application/json',
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
      },
    });

    let data: any = {};

    if (response.body && response.body.trim() !== '') {
      try {
        data = JSON.parse(response.body);
      } catch {
        data = { message: 'Operación realizada' };
      }
    }

    if (response.status >= 200 && response.status < 300) {
      return data as T;
    }

    const raw =
      typeof data['message'] === 'string'
        ? data['message']
        : typeof data['error'] === 'string'
        ? data['error']
        : null;
    throw new Error(raw ?? `Error ${response.status} al llamar ${path}`);
  } catch (err: any) {
    console.error('Error en FileSystem upload:', err);
    throw new Error(err.message || 'No se pudo subir la imagen al servidor.');
  }
}