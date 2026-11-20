export const ROLES = ['ROLE_WORKER', 'ROLE_CLIENT', 'ROLE_ADMIN'] as const;
export type Role = (typeof ROLES)[number];

export interface User {
  name: string;
  email: string;
  telefono: string;
  roles: Role[];
  fotoUrl?: string | null;
}

export interface Perfil {
  id: number;
  oficio: string;
}

export const ESTADOS_SOLICITUD = [
  'PENDIENTE',
  'COTIZADA',
  'ACEPTADA',
  'EN_CURSO',
  'FINALIZADA',
  'RECHAZADA',
  'CANCELADA',
] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

// Officer que devuelve GET /api/usuarios/trabajadores
export interface Trabajador {
  id: number;
  nombre: string;
  telefono: string | null;
  fotoUrl: string | null;
  oficios: Perfil[];
}

// Resumen que devuelve GET /api/solicitudes/estadisticas (el backend agrupa los estados según el rol)
export interface Estadisticas {
  pendientes: number;
  activos: number;
  finalizados: number;
}

// Solicitud que devuelve el backend en /api/solicitudes
export interface Solicitud {
  id: number;
  estado: EstadoSolicitud;
  clienteId: number;
  clienteNombre: string;
  clienteFotoUrl: string | null;
  officerId: number;
  officerNombre: string;
  officerFotoUrl: string | null;
  perfilId: number;
  oficio: string;
  descripcion: string;
  direccion: string | null;
  precioAcordado: number | null;
  fechaCreacion: string;
  fechaActualizacion: string | null;
}
