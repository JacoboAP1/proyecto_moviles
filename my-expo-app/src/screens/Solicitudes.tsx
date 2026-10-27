import { Text, View } from 'react-native';

// PROVISIONAL: la Vista 3 la reemplaza Pardo (lista por rol con sus botones).
// Usa el hook useSolicitudes (src/hooks/useSolicitudes.ts).
export default function Solicitudes() {
  return (
    <View className="flex-1 gap-3 bg-oficiar-gray p-6">
      <Text className="text-xl font-bold text-oficiar-very-dark">Solicitudes</Text>
      <Text className="text-neutral-500">Vista en construcción</Text>
    </View>
  );
}
