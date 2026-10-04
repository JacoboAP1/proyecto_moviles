import { useRouter } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import Logo from '../../src/components/Logo';
import Button from '../../src/components/Button';
import { useSession } from '../../src/session/context';

export default function OfficerHome() {
  const { user, signOut } = useSession();
  const router = useRouter();

  return (
    <View className="flex-1 bg-oficiar-gray">
      <View className="bg-oficiar-very-dark px-6 pb-3 pt-12">
        <View className="items-center gap-1">
          <Logo size="sm" light />
          <Text className="text-lg font-bold text-white">
            Hola, {user?.name}
          </Text>
          <View className="mt-1 rounded-full bg-oficiar-blue/20 px-4 py-1">
            <Text className="text-xs font-semibold text-oficiar-blue">Officer</Text>
          </View>
        </View>

        <View className="mt-3 flex-row justify-center gap-4">
          <Pressable className="rounded-lg bg-oficiar-blue px-4 py-2">
            <Text className="text-sm font-semibold text-white">Inicio</Text>
          </Pressable>
          <Pressable className="rounded-lg px-4 py-2" onPress={() => {}}>
            <Text className="text-sm text-white/70">Solicitudes</Text>
          </Pressable>
          <Pressable className="rounded-lg px-4 py-2" onPress={() => router.push('/profile')}>
            <Text className="text-sm text-white/70">Perfil</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-5 gap-5">
        <Text className="text-xl font-extrabold text-oficiar-very-dark">
          Próximos{' '}
          <Text className="text-oficiar-blue">servicios</Text>
        </Text>

        <View className="rounded-2xl border-l-4 border-oficiar-blue bg-white p-5">
          <Text className="font-semibold text-oficiar-very-dark">
            Sin servicios pendientes
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Aquí aparecerán las solicitudes de tus clientes
          </Text>
        </View>

        <Text className="text-xl font-extrabold text-oficiar-very-dark">
          Tus{' '}
          <Text className="text-oficiar-blue">estadísticas</Text>
        </Text>

        <View className="flex-row gap-3">
          <View className="flex-1 items-center rounded-2xl bg-white p-5">
            <Text className="text-2xl font-black text-oficiar-blue">0</Text>
            <Text className="text-xs text-neutral-500">Servicios</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-white p-5">
            <Text className="text-2xl font-black text-oficiar-yellow">0</Text>
            <Text className="text-xs text-neutral-500">Pendientes</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-white p-5">
            <Text className="text-2xl font-black text-green-500">0</Text>
            <Text className="text-xs text-neutral-500">Completados</Text>
          </View>
        </View>

        <Text className="text-xl font-extrabold text-oficiar-very-dark">
          Ofertas{' '}
          <Text className="text-oficiar-blue">exclusivas</Text>
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {['20% OFF limpieza', 'Descuento flash', 'Plomería gratis'].map(
            (oferta) => (
              <View
                key={oferta}
                className="w-[31%] items-center rounded-xl border border-oficiar-blue/20 bg-white p-4">
                <Text className="text-center text-xs font-medium text-oficiar-very-dark">
                  {oferta}
                </Text>
              </View>
            ),
          )}
        </View>

        <View className="mt-2 pb-4">
          <Button text="Cerrar sesión" onPress={signOut} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}
