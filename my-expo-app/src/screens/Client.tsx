import { useRouter } from 'expo-router';
import { Alert, ScrollView, Text, View, Pressable } from 'react-native';
import Logo from '../components/Logo';
import Button from '../components/Button';
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

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-5 gap-5">
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

        <View className="mt-2 pb-4">
          <Button text="Cerrar sesión" onPress={() => {
            Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sí, salir', style: 'destructive', onPress: signOut },
            ]);
          }} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}
