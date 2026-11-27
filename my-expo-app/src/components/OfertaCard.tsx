import { Text, View } from 'react-native';
import { oficiar } from '../theme/tokens';
import Icono, { type NombreIcono } from './Icono';
 
interface Props {
  titulo: string; // ej: "20% OFF limpieza"
  icono?: NombreIcono;
}
 
// Bloque Bento oscuro con acento amarillo para las ofertas: se distingue de los servicios.
// Contraste: blanco sobre fondo oscuro 17.8:1, amarillo sobre fondo oscuro 10.9:1
export default function OfertaCard({ titulo, icono = 'pricetag-outline' }: Props) {
  return (
    <View
      accessible
      accessibilityLabel={`Oferta: ${titulo}`}
      className="w-[31%] gap-2 rounded-bento bg-oficiar-very-dark p-3">
      <View className="flex-row items-center justify-between">
        <Icono nombre={icono} tamano={20} color={oficiar.yellow} />
        <View className="rounded-full bg-oficiar-yellow px-2 py-0.5">
          <Text className="text-[10px] font-bold text-oficiar-very-dark">OFERTA</Text>
        </View>
      </View>
      <Text className="text-bento-label font-semibold text-white">{titulo}</Text>
    </View>
  );
}