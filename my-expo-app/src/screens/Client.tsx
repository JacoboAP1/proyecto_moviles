import { useRouter } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import Button from '../components/Button';
import MenuButton from '../components/MenuButton';
import { useSession } from '../session/context';

const servicios = [
  'Electricidad',
  'Cerrajería',
  'Gas y Calefacción',
  'Fletes',
  'Limpieza profesional',
  'Refrigeración',
  'Instalación de AC',
  'Carpintería',
  'Pintura',
  'Albañilería',
  'Jardinería',
  'Plomería',
];

export default function Client() {
  const { user } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-oficiar-gray">
      <View className="bg-oficiar-very-dark px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center">
          <View className="w-10">
            <MenuButton />
          </View>
          <View className="flex-1 items-center">
            <Logo size="sm" light />
          </View>
          <View className="w-10" />
        </View>
        <View className="items-center gap-1">
          <Text className="text-lg font-bold text-white">
            Hola, {user?.name}
          </Text>
          <View className="mt-1 rounded-full bg-green-500/20 px-4 py-1">
            <Text className="text-xs font-semibold text-green-400">Cliente</Text>
          </View>
        </View>

        <View className="mt-3 flex-row justify-center gap-4">
          <Pressable className="rounded-lg bg-oficiar-blue px-4 py-2">
            <Text className="text-sm font-semibold text-white">Inicio</Text>
          </Pressable>
          <Pressable className="rounded-lg px-4 py-2" onPress={() => {}}>
            <Text className="text-sm text-white/70">Servicios</Text>
          </Pressable>
          <Pressable className="rounded-lg px-4 py-2" onPress={() => router.push('/profile')}>
            <Text className="text-sm text-white/70">Perfil</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-5 pb-10 gap-5">
        <Text className="text-xl font-extrabold text-oficiar-very-dark">
          Nuestros{' '}
          <Text className="text-oficiar-blue">servicios</Text>
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {servicios.map((s) => (
            <Pressable
              key={s}
              className="w-[31%] items-center rounded-xl bg-white p-4 active:opacity-80">
              <Text className="text-center text-xs font-medium text-oficiar-very-dark">
                {s}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button
          text="Solicitar un servicio"
          onPress={() => {}}
        />

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
      </ScrollView>
    </View>
  );
}
