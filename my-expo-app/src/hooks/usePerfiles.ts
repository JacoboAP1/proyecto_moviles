import { useEffect, useState } from 'react';
import { createPerfil, deletePerfil, getPerfiles } from '../api/perfiles';
import { useAlerta } from '../session/alerta';
import type { Perfil } from '../types';

export function usePerfiles() {
  const { avisar, confirmar } = useAlerta();
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoOficio, setNuevoOficio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cargarTodos = async () => {
    try {
      setPerfiles(await getPerfiles());
    } catch (error) {
      avisar({ tipo: 'error', titulo: 'Error', mensaje: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelado = false;

    getPerfiles()
      .then((data) => {
        if (!cancelado) {
          setPerfiles(data);
        }
      })
      .catch((error) => {
        if (!cancelado) {
          avisar({ tipo: 'error', titulo: 'Error', mensaje: (error as Error).message });
        }
      })
      .finally(() => {
        if (!cancelado) {
          setLoading(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [avisar]);

  const handleCrear = async () => {
    const nombre = nuevoOficio.trim();

    if (!nombre) {
      avisar({ tipo: 'error', titulo: 'Falta el nombre', mensaje: 'Escribe el nombre del oficio' });
      return;
    }

    if (nombre.length > 100) {
      avisar({ tipo: 'error', titulo: 'Nombre muy largo', mensaje: 'Máximo 100 caracteres' });
      return;
    }

    setSubmitting(true);

    try {
      await createPerfil(nombre);
      setNuevoOficio('');
      await cargarTodos();
      avisar({ tipo: 'exito', titulo: 'Listo', mensaje: `"${nombre}" fue agregado` });
    } catch (error) {
      avisar({ tipo: 'error', titulo: 'Error al crear', mensaje: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  // La alerta queda cargando (y bloquea la pantalla) hasta que el servidor responde
  const handleEliminar = (perfil: Perfil) => {
    confirmar({
      titulo: 'Eliminar oficio',
      mensaje: `¿Seguro que quieres eliminar "${perfil.oficio}"?`,
      textoConfirmar: 'Eliminar',
      textoCargando: 'Eliminando…',
      peligro: true,
      tituloError: 'No se pudo eliminar',
      accion: async () => {
        await deletePerfil(perfil.id);
        setPerfiles(await getPerfiles());
        return { titulo: 'Listo', mensaje: `"${perfil.oficio}" fue eliminado` };
      },
    });
  };

  return {
    perfiles,
    setPerfiles,
    loading,
    cargarTodos,
    nuevoOficio,
    setNuevoOficio,
    submitting,
    handleCrear,
    handleEliminar,
  };
}