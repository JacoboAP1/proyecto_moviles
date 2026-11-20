import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getEstadisticas } from '../api/solicitudes';
import type { Estadisticas } from '../types';

// Cada cuánto se actualizan los números mientras el home está abierto
const CADA_MS = 10_000;

// Números del home: se piden al entrar y cada 10 s mientras la pantalla está visible
export function useEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setEstadisticas(await getEstadisticas());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  // Al salir del home se detiene la consulta periódica
  useFocusEffect(
    useCallback(() => {
      cargar();
      const intervalo = setInterval(cargar, CADA_MS);
      return () => clearInterval(intervalo);
    }, [cargar]),
  );

  return { estadisticas, error, recargar: cargar };
}
