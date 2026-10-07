import { useState } from 'react';
import { Alert } from 'react-native';
 
export function useSearch<T>(
  buscarEnApi: (texto: string) => Promise<T[]>,
  setResultados: (items: T[]) => void,
  cargarTodos: () => void,
) {
  const [texto, setTexto] = useState('');
  const [buscando, setBuscando] = useState(false);
 
  const buscar = async () => {
    const q = texto.trim();
    if (!q) {
      cargarTodos();
      return;
    }
    setBuscando(true);
    try {
      setResultados(await buscarEnApi(q));
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setBuscando(false);
    }
  };
 
  return { texto, setTexto, buscando, buscar };
}
