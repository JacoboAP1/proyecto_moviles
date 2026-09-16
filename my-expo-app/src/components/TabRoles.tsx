import { Text, View } from 'react-native';

export default function TabRoles() {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-6">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-oficiar-dark/10">
        <Text className="text-3xl">🔒</Text>
      </View>
      <Text className="text-xl font-bold text-oficiar-very-dark">Roles</Text>
      <Text className="text-center text-neutral-500">
        La gestion de roles estara disponible proximamente.
        {'\n'}Este modulo sera implementado por el equipo.
      </Text>
    </View>
  );
}
