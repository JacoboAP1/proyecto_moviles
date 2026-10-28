
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import {
  cambiarEstado,
  cotizarSolicitud,
  getMisSolicitudes,
  type AccionSolicitud,
} from '../api/solicitudes';
import { useSession } from '../session/context';
import type { Solicitud } from '../types';

// Lista de "mis solicitudes" y sus acciones. Sirve para cliente y officer.
export function useSolicitudes() {
  const { user } = useSession();
  const esOfficer = user?.roles.includes('ROLE_WORKER') ?? false;

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    try {
      setError(null);
      setSolicitudes(await getMisSolicitudes());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recarga cada vez que la pantalla vuelve a estar visible
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  // Deslizar hacia abajo
  const recargar = () => {
    setRefreshing(true);
    cargar();
  };

  // Botón "Reintentar" del estado de error
  const reintentar = () => {
    setLoading(true);
    cargar();
  };

  const ejecutar = async (id: number, accion: () => Promise<Solicitud>) => {
    setProcesandoId(id);
    try {
      const actualizada = await accion();
      setSolicitudes((lista) =>
        lista.map((s) => (s.id === id ? actualizada : s)),
      );
    } catch (e) {
      // Mensaje que devuelve el backend (403, 409, 400...)
      Alert.alert('No se pudo completar', (e as Error).message);
    } finally {
      setProcesandoId(null);
    }
  };

  return {
    esOfficer,
    solicitudes,
    loading,
    refreshing,
    error,
    procesandoId,
    recargar,
    reintentar,
    cotizar: (id: number, precio: number) =>
      ejecutar(id, () => cotizarSolicitud(id, precio)),
    cambiarEstado: (id: number, accion: AccionSolicitud) =>
      ejecutar(id, () => cambiarEstado(id, accion)),
  };
}
