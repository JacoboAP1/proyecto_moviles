import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { crearSolicitud } from '../api/solicitudes';
import { getTrabajadores } from '../api/usuarios';
import { useAlerta } from '../session/alerta';
import type { Trabajador } from '../types';
 
type Params = {
  perfilId: string;
  oficio: string;
  descripcion: string;
  direccion: string;
};
 
// Vista 2: officers del oficio elegido en la Vista 1 + crear la solicitud
export function useElegirOfficer() {
  const router = useRouter();
  const { confirmar } = useAlerta();
  const { perfilId, oficio, descripcion, direccion } = useLocalSearchParams<Params>();
 
  const [texto, setTexto] = useState('');
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviandoId, setEnviandoId] = useState<number | null>(null);
 
  const cargar = useCallback(
    async (busqueda: string) => {
      try {
        setError(null);
        setTrabajadores(await getTrabajadores(Number(perfilId), busqueda));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [perfilId],
  );
 
  // Busca 400 ms después de la última letra, para no llamar al backend en cada tecla
  useEffect(() => {
    const espera = setTimeout(() => cargar(texto), 400);
    return () => clearTimeout(espera);
  }, [texto, cargar]);
 
  const recargar = () => {
    setRefreshing(true);
    cargar(texto);
  };
 
  const reintentar = () => {
    setLoading(true);
    cargar(texto);
  };
 
  // Si el backend responde error (409, 403, 400...), la alerta muestra su mensaje
  const enviar = async (trabajador: Trabajador) => {
    setEnviandoId(trabajador.id);
    try {
      await crearSolicitud({
        officerId: trabajador.id,
        perfilId: Number(perfilId),
        descripcion,
        direccion: direccion || undefined,
      });
      return {
        titulo: 'Solicitud enviada',
        mensaje: `${trabajador.nombre} recibirá tu solicitud.`,
        textoBoton: 'Ver mis solicitudes',
        alCerrar: () => router.replace('/solicitudes'),
      };
    } finally {
      setEnviandoId(null);
    }
  };

  const solicitar = (trabajador: Trabajador) => {
    if (enviandoId) return; // evita crear dos solicitudes con doble toque
    confirmar({
      titulo: 'Confirmar solicitud',
      mensaje: `¿Enviar la solicitud de ${oficio} a ${trabajador.nombre}?`,
      textoConfirmar: 'Enviar',
      textoCargando: 'Enviando…',
      tituloError: 'No se pudo enviar',
      accion: () => enviar(trabajador),
    });
  };
 
  return {
    oficio,
    texto,
    setTexto,
    trabajadores,
    loading,
    refreshing,
    error,
    enviandoId,
    recargar,
    reintentar,
    solicitar,
  };
}
