import { createContext, use, useCallback, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import Alerta from '../components/Alerta';

export type TipoAviso = 'exito' | 'error' | 'info';

export interface Aviso {
  tipo?: TipoAviso;
  titulo: string;
  mensaje: string;
  textoBoton?: string;
  alCerrar?: () => void;
}

// Lo que devuelve una acción: un aviso de éxito, o nada para cerrar sin aviso
type Resultado = Omit<Aviso, 'tipo'> | void;

export interface Confirmacion {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  textoCargando?: string;
  peligro?: boolean;
  tituloError?: string;
  accion: () => Promise<Resultado> | Resultado;
}

export interface Proceso {
  textoCargando: string;
  tituloError?: string;
  accion: () => Promise<Resultado>;
}

export type Entrada =
  | ({ id: number; tipoEntrada: 'aviso' } & Aviso)
  | ({ id: number; tipoEntrada: 'confirmacion'; cargando: boolean } & Confirmacion)
  | ({ id: number; tipoEntrada: 'proceso' } & Proceso);

type SinId<T> = T extends unknown ? Omit<T, 'id'> : never;

interface AlertaValue {
  avisar: (aviso: Aviso) => void;
  // Pide confirmación y, al aceptar, muestra la carga hasta que la acción termine
  confirmar: (confirmacion: Confirmacion) => void;
  // Muestra la carga sin preguntar (ej: subir una foto)
  procesar: (proceso: Proceso) => void;
}

const AlertaContext = createContext<AlertaValue | null>(null);

export function useAlerta(): AlertaValue {
  const value = use(AlertaContext);
  if (!value) throw new Error('useAlerta debe usarse dentro de <AlertaProvider />');
  return value;
}

// Las alertas van en cola: se muestran de una en una y la que está cargando no se puede cerrar
export function AlertaProvider({ children }: PropsWithChildren) {
  const [cola, setCola] = useState<Entrada[]>([]);
  const siguienteId = useRef(0);
  const actual = cola[0];

  const agregar = useCallback((entrada: SinId<Entrada>) => {
    const id = siguienteId.current++;
    setCola((c) => [...c, { ...entrada, id }]);
    return id;
  }, []);

  // Corre la acción y cambia la carga por el aviso de éxito o de error
  const correr = useCallback(
    async (id: number, accion: () => Promise<Resultado> | Resultado, tituloError?: string) => {
      const reemplazar = (nueva: SinId<Entrada> | null) =>
        setCola((c) => c.flatMap((e) => (e.id !== id ? [e] : nueva ? [{ ...nueva, id }] : [])));
      try {
        const resultado = await accion();
        reemplazar(resultado ? { tipoEntrada: 'aviso', tipo: 'exito', ...resultado } : null);
      } catch (error) {
        reemplazar({
          tipoEntrada: 'aviso',
          tipo: 'error',
          titulo: tituloError ?? 'No se pudo completar',
          mensaje: (error as Error).message,
        });
      }
    },
    [],
  );

  // Estable entre renders, para poder usarlo en dependencias de useEffect/useCallback
  const value = useMemo<AlertaValue>(() => ({
    avisar: (aviso) => agregar({ tipoEntrada: 'aviso', ...aviso }),
    confirmar: (confirmacion) => agregar({ tipoEntrada: 'confirmacion', cargando: false, ...confirmacion }),
    procesar: (proceso) => {
      const id = agregar({ tipoEntrada: 'proceso', ...proceso });
      correr(id, proceso.accion, proceso.tituloError);
    },
  }), [agregar, correr]);

  const confirmarActual = () => {
    if (actual?.tipoEntrada !== 'confirmacion' || actual.cargando) return;
    const { id, accion, tituloError } = actual;
    setCola((c) => c.map((e) => (e.id === id && e.tipoEntrada === 'confirmacion' ? { ...e, cargando: true } : e)));
    correr(id, accion, tituloError);
  };

  const cerrar = () => {
    if (!actual || actual.tipoEntrada === 'proceso') return;
    if (actual.tipoEntrada === 'confirmacion' && actual.cargando) return;
    setCola((c) => c.slice(1));
    if (actual.tipoEntrada === 'aviso') actual.alCerrar?.();
  };

  return (
    <AlertaContext value={value}>
      {children}
      <Alerta entrada={actual} onConfirmar={confirmarActual} onCerrar={cerrar} />
    </AlertaContext>
  );
}
