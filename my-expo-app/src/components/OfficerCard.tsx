import { Image, Text, View } from 'react-native';
import type { Trabajador } from '../types';
import Button from './Button';

interface Props {
  trabajador: Trabajador;
  onPress: () => void;
}

// Tarjeta Bento de un officer (Vista 2)
export default function OfficerCard({ trabajador, onPress }: Props) {
  const oficios = trabajador.oficios.map((o) => o.oficio).join(' · ');

  return (
    <View className="gap-bento rounded-bento bg-white p-bento-in">
      <View className="flex-row items-center gap-bento">
        {trabajador.fotoUrl ? (
          <Image
            source={{ uri: trabajador.fotoUrl }}
            className="h-14 w-14 rounded-full"
            resizeMode="cover"
            accessibilityLabel={`Foto de ${trabajador.nombre}`}
          />
        ) : (
          <View className="h-14 w-14 items-center justify-center rounded-full bg-oficiar-blue-btn">
            <Text className="text-xl font-bold text-white">
              {trabajador.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View className="flex-1 gap-1">
          <Text className="text-bento-title font-bold text-oficiar-very-dark">{trabajador.nombre}</Text>
          <Text className="text-bento-body text-oficiar-dark">{oficios}</Text>
        </View>
      </View>

      <Button text="Solicitar servicio" onPress={onPress} />
    </View>
  );
}