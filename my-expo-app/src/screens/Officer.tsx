import { useRouter } from 'expo-router';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import EnVivo from '../components/EnVivo';
import Logo from '../components/Logo';
import MenuButton from '../components/MenuButton';
import ResumenEstadisticas from '../components/ResumenEstadisticas';
import StatCard from '../components/StatCard';
import { useEstadisticas } from '../hooks/useEstadisticas';
import { useSession } from '../session/context';
import { oficiar } from '../theme/tokens';

export default function Officer() {
  const { user } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { estadisticas, error } = useEstadisticas();
  const porResponder = estadisticas?.pendientes ?? 0;
  const verSolicitudes = () => router.push('/solicitudes');

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
          <View className="mt-1 rounded-full bg-oficiar-blue/20 px-4 py-1">
            <Text className="text-xs font-semibold text-oficiar-blue">Officer</Text>
          </View>
        </View>

        <View className="mt-3 flex-row justify-center gap-4">
          <Pressable className="rounded-lg bg-oficiar-blue px-4 py-2">
            <Text className="text-sm font-semibold text-white">Inicio</Text>
          </Pressable>
          <Pressable className="rounded-lg px-4 py-2" onPress={() => router.push('/solicitudes')}>
            <Text className="text-sm text-white/70">Solicitudes</Text>
          </Pressable>
          <Pressable className="rounded-lg px-4 py-2" onPress={() => router.push('/profile')}>
            <Text className="text-sm text-white/70">Perfil</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-5 pb-10 gap-5">
        <Text className="text-xl font-extrabold text-oficiar-very-dark">
          Próximos{' '}
          <Text className="text-oficiar-blue">servicios</Text>
        </Text>

        <View className="gap-bento rounded-2xl border-l-4 border-oficiar-blue bg-white p-5">
          {porResponder > 0 ? (
            <>
              <Text className="font-semibold text-oficiar-very-dark">
                Tienes {porResponder} {porResponder === 1 ? 'solicitud' : 'solicitudes'} por responder
              </Text>
              <Button text="Ver solicitudes" icono="document-text-outline" onPress={verSolicitudes} />
            </>
          ) : (
            <>
              <Text className="font-semibold text-oficiar-very-dark">
                Sin solicitudes por responder
              </Text>
              <Text className="text-sm text-oficiar-dark">
                Aquí aparecerán las solicitudes de tus clientes
              </Text>
            </>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-extrabold text-oficiar-very-dark">
            Tus{' '}
            <Text className="text-oficiar-blue">estadísticas</Text>
          </Text>
          <EnVivo conectado={!error} />
        </View>

        {/* Se actualizan solas cada 10 s mientras el home está abierto */}
        <View className="flex-row gap-3">
          <StatCard
            icono="mail-unread-outline"
            valor={estadisticas?.pendientes ?? null}
            etiqueta="Por responder"
            color={oficiar.yellow}
            onPress={verSolicitudes}
          />
          <StatCard
            icono="construct-outline"
            valor={estadisticas?.activos ?? null}
            etiqueta="Activos"
            color={oficiar['blue-btn']}
            onPress={verSolicitudes}
          />
          <StatCard
            icono="checkmark-done-outline"
            valor={estadisticas?.finalizados ?? null}
            etiqueta="Finalizados"
            color={oficiar.dark}
            onPress={verSolicitudes}
          />
        </View>
        {!!error && !estadisticas && (
          <Text className="text-center text-bento-label text-oficiar-dark">
            No se pudieron cargar tus estadísticas
          </Text>
        )}
        {estadisticas && (
          <ResumenEstadisticas
            palabra="trabajos"
            finalizados={estadisticas.finalizados}
            partes={[
              { etiqueta: 'Por responder', valor: estadisticas.pendientes, color: oficiar.yellow },
              { etiqueta: 'Activos', valor: estadisticas.activos, color: oficiar['blue-btn'] },
              { etiqueta: 'Finalizados', valor: estadisticas.finalizados, color: oficiar.dark },
            ]}
          />
        )}

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
