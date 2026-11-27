import { Pressable, Text, View } from 'react-native';
import { oficiar } from '../theme/tokens';
import Icono, { type NombreIcono } from './Icono';
 
interface Props {
  nombre: string; // nombre del servicio (ej: "Plomería")
  onPress?: () => void;
}
 
// Ícono de cada servicio del inicio; si no está en la lista, se usa una herramienta
const ICONOS: Record<string, NombreIcono> = {
  Electricidad: 'flash-outline',
  Cerrajería: 'key-outline',
  'Gas y Calefacción': 'flame-outline',
  Fletes: 'car-outline',
  'Limpieza profesional': 'sparkles-outline',
  Refrigeración: 'snow-outline',
  'Instalación de AC': 'thermometer-outline',
  Carpintería: 'hammer-outline',
  Pintura: 'brush-outline',
  Albañilería: 'construct-outline',
  Jardinería: 'leaf-outline',
  Plomería: 'water-outline',
};
 
// Bloque Bento de "Nuestros servicios": ícono en círculo + nombre. Ocupa un tercio de la fila
export default function ServicioTile({ nombre, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={nombre}
      className="min-h-toque w-[31%] items-center gap-2 rounded-bento bg-white px-2 py-bento-in active:opacity-80">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-oficiar-blue-btn/10">
        <Icono nombre={ICONOS[nombre] ?? 'construct-outline'} tamano={22} color={oficiar['blue-btn']} />
      </View>
      <Text className="text-center text-bento-label font-semibold text-oficiar-very-dark">
        {nombre}
      </Text>
    </Pressable>
  );
}