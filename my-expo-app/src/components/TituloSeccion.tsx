import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
 
interface Props {
  texto: string; // primera parte, en oscuro (ej: "Tus")
  resaltado: string; // segunda parte, en azul (ej: "servicios")
  derecha?: ReactNode; // algo opcional a la derecha (ej: el indicador "En vivo")
}
 
// Título de cada bloque del inicio: "Tus servicios", "Nuestros servicios", "Ofertas exclusivas".
// Es texto grande y en negrita, por eso el azul de marca cumple contraste (3:1 para texto grande)
export default function TituloSeccion({ texto, resaltado, derecha }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <Text accessibilityRole="header" className="text-xl font-extrabold text-oficiar-very-dark">
        {texto} <Text className="text-oficiar-blue">{resaltado}</Text>
      </Text>
      {derecha}
    </View>
  );
}