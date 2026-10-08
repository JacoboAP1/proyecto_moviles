
import { useState } from 'react';
import type { UsuarioAdmin } from '../api/usuarios';

type Filtro = 'todos' | 'activos' | 'inactivos';

const opciones: Filtro[] = [
  'todos',
  'activos',
  'inactivos',
];

export function useUserFilter(usuarios: UsuarioAdmin[]) {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtro === 'activos') return u.active;
    if (filtro === 'inactivos') return !u.active;
    return true;
  });

  return {
    filtro,
    setFiltro,
    opciones,
    usuariosFiltrados,
  };
}
