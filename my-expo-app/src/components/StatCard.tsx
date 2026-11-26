import { Pressable, Text, View } from 'react-native';
import { oficiar } from '../theme/tokens';
import Icono, { type NombreIcono } from './Icono';

interface Props {
  icono: NombreIcono;
  valor: number | null; // null = todavía cargando
  etiqueta: string;
  color: string; // color del ícono y del acento (token)
  onPress?: () => void;
}

// Sombra suave de los bloques Bento (iOS usa shadow*, Android usa elevation)
const SOMBRA = {
  shadowColor: oficiar['very-dark'],
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
};

// Tarjeta Bento con un número del home (estadísticas). El número va con texto, no solo color
export default function StatCard({ icono, valor, etiqueta, color, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${etiqueta}: ${valor ?? 'cargando'}`}
      style={SOMBRA}
      className="min-h-toque flex-1 items-center gap-2 rounded-bento bg-white px-2 py-bento-in active:opacity-80">
      {/* Ícono sobre un círculo del mismo color, más claro (12 % de opacidad) */}
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1F` }}>
        <Icono nombre={icono} tamano={22} color={color} />
      </View>
      <Text className="text-3xl font-black text-oficiar-very-dark">{valor ?? '–'}</Text>
      <Text className="text-center text-bento-label font-semibold text-oficiar-dark">{etiqueta}</Text>
      <View className="h-1 w-8 rounded-full" style={{ backgroundColor: color }} />
    </Pressable>
  );
}
