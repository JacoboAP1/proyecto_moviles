
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  cambiarEstado,
  cotizarSolicitud,
  getMisSolicitudes,
  type AccionSolicitud,
} from '../api/solicitudes';
import { useAlerta } from '../session/alerta';
import { useSession } from '../session/context';
import type { Solicitud } from '../types';

// Lista de "mis solicitudes" y sus acciones. Sirve para cliente y officer.
export function useSolicitudes() {
  const { user } = useSession();
  const { avisar, confirmar } = useAlerta();
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
    } finally {
      setProcesandoId(null);
    }
  };

  // Acciones directas: si falla, se muestra el mensaje que devuelve el backend (403, 409, 400...)
  const intentar = (id: number, accion: () => Promise<Solicitud>) =>
    ejecutar(id, accion).catch((e) =>
      avisar({ tipo: 'error', titulo: 'No se pudo completar', mensaje: (e as Error).message }),
    );

  // Rechazar y cancelar cierran la solicitud: se confirma y la alerta queda cargando hasta que responde
  const cerrarSolicitud = (id: number, accion: 'rechazar' | 'cancelar') =>
    confirmar({
      titulo: accion === 'rechazar' ? 'Rechazar solicitud' : 'Cancelar solicitud',
      mensaje: 'Esta acción cierra la solicitud. ¿Continuar?',
      textoConfirmar: accion === 'rechazar' ? 'Rechazar' : 'Cancelar solicitud',
      textoCargando: accion === 'rechazar' ? 'Rechazando…' : 'Cancelando…',
      peligro: true,
      accion: () => ejecutar(id, () => cambiarEstado(id, accion)),
    });

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
      intentar(id, () => cotizarSolicitud(id, precio)),
    cambiarEstado: (id: number, accion: AccionSolicitud) =>
      intentar(id, () => cambiarEstado(id, accion)),
    cerrarSolicitud,
  };
}
