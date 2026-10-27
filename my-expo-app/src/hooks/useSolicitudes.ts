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
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  const recargar = useCallback(async () => {
    try {
      setSolicitudes(await getMisSolicitudes());
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga cada vez que la pantalla vuelve a estar visible
  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

  const ejecutar = async (id: number, accion: () => Promise<Solicitud>) => {
    setProcesandoId(id);
    try {
      const actualizada = await accion();
      setSolicitudes((lista) => lista.map((s) => (s.id === id ? actualizada : s)));
    } catch (error) {
      Alert.alert('No se pudo completar', (error as Error).message);
    } finally {
      setProcesandoId(null);
    }
  };

  return {
    esOfficer,
    solicitudes,
    loading,
    procesandoId,
    recargar,
    cotizar: (id: number, precio: number) => ejecutar(id, () => cotizarSolicitud(id, precio)),
    cambiarEstado: (id: number, accion: AccionSolicitud) =>
      ejecutar(id, () => cambiarEstado(id, accion)),
  };
}
