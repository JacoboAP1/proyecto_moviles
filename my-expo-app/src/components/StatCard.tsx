import { Pressable, Text } from 'react-native';
import Icono, { type NombreIcono } from './Icono';

interface Props {
  icono: NombreIcono;
  valor: number | null; // null = todavía cargando
  etiqueta: string;
  color: string; // color del ícono (token)
  onPress?: () => void;
}

// Tarjeta Bento con un número del home (estadísticas). El número va con texto, no solo color
export default function StatCard({ icono, valor, etiqueta, color, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${etiqueta}: ${valor ?? 'cargando'}`}
      className="min-h-toque flex-1 items-center gap-1 rounded-bento bg-white p-bento-in active:opacity-80">
      <Icono nombre={icono} tamano={24} color={color} />
      <Text className="text-2xl font-black text-oficiar-very-dark">{valor ?? '–'}</Text>
      <Text className="text-center text-bento-label text-oficiar-dark">{etiqueta}</Text>
    </Pressable>
  );
}
