import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createPerfil, deletePerfil, getPerfiles } from '../api/perfiles';
import type { Perfil } from '../types';

export function usePerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoOficio, setNuevoOficio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cargarTodos = async () => {
    try {
      setPerfiles(await getPerfiles());
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
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
          Alert.alert('Error', (error as Error).message);
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
  }, []);

  const handleCrear = async () => {
    const nombre = nuevoOficio.trim();

    if (!nombre) {
      Alert.alert('Error', 'Escribe el nombre del oficio');
      return;
    }

    if (nombre.length > 100) {
      Alert.alert('Error', 'Maximo 100 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      await createPerfil(nombre);
      setNuevoOficio('');
      await cargarTodos();
      Alert.alert('Listo', `"${nombre}" fue agregado`);
    } catch (error) {
      Alert.alert('Error al crear', (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = (perfil: Perfil) => {
    Alert.alert(
      'Eliminar oficio',
      `¿Seguro que quieres eliminar "${perfil.oficio}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePerfil(perfil.id);
              await cargarTodos();
              Alert.alert('Listo', `"${perfil.oficio}" fue eliminado`);
            } catch (error) {
              Alert.alert(
                'No se pudo eliminar',
                (error as Error).message
              );
            }
          },
        },
      ],
    );
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