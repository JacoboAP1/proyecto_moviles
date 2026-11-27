import { Text, View } from 'react-native';
import { oficiar } from '../theme/tokens';
import Button from './Button';
import Icono, { type NombreIcono } from './Icono';
 
interface Props {
  icono: NombreIcono;
  titulo: string; // ej: "Todavía no tienes solicitudes"
  mensaje?: string; // explicación corta de qué hacer
  textoBoton?: string; // si se pasa junto con onPress, se muestra un botón
  onPress?: () => void;
}
 
// Lo que se ve cuando una lista está vacía: ícono, título, mensaje y una acción opcional
export default function EstadoVacio({ icono, titulo, mensaje, textoBoton, onPress }: Props) {
  return (
    <View className="items-center gap-3 rounded-bento bg-white p-6">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-oficiar-blue-btn/10">
        <Icono nombre={icono} tamano={30} color={oficiar['blue-btn']} />
      </View>
      <Text accessibilityRole="header" className="text-center text-bento-title font-bold text-oficiar-very-dark">
        {titulo}
      </Text>
      {!!mensaje && (
        <Text className="text-center text-bento-body text-oficiar-dark">{mensaje}</Text>
      )}
      {!!textoBoton && !!onPress && (
        <Button text={textoBoton} onPress={onPress} className="mt-1 self-stretch" />
      )}
    </View>
  );
}