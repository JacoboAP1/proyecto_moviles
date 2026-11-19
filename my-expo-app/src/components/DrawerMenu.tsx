import type { DrawerContentComponentProps } from 'expo-router/drawer';
import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDrawerMenu } from '../hooks/useDrawerMenu';
import { oficiar, peligro } from '../theme/tokens';
import Icono, { type NombreIcono } from './Icono';

export default function DrawerMenu({ navigation }: DrawerContentComponentProps) {
  const { nombre, email, inicial, fotoUrl, rol, verSolicitudes, irAPerfil, irASolicitudes, cerrarSesion } =
    useDrawerMenu(() => navigation.closeDrawer());
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View
        className="gap-1.5 bg-oficiar-very-dark px-6 pb-7"
        style={{ paddingTop: insets.top + 32 }}>
        <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-oficiar-blue">
          {fotoUrl ? (
            <Image
              source={{ uri: fotoUrl }}
              className="h-full w-full"
              resizeMode="cover"
              accessibilityLabel={`Foto de ${nombre}`}
            />
          ) : (
            <Text className="text-3xl font-bold text-white">{inicial}</Text>
          )}
        </View>
        <Text className="mt-3 text-xl font-bold text-white" numberOfLines={1}>{nombre}</Text>
        <Text className="text-sm text-white/80" numberOfLines={1}>{email}</Text>
        <View className="mt-2 self-start rounded-full bg-white/15 px-4 py-1.5">
          <Text className="text-sm font-semibold text-white">{rol}</Text>
        </View>
      </View>

      <View className="gap-1 px-4 py-5">
        <Opcion icono="person-circle-outline" texto="Mi perfil" onPress={irAPerfil} />
        {verSolicitudes && (
          <Opcion icono="document-text-outline" texto="Solicitudes" onPress={irASolicitudes} />
        )}
      </View>

      <View
        className="mt-auto border-t border-oficiar-dark/10 px-4 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable
          onPress={cerrarSesion}
          accessibilityRole="button"
          className="min-h-[56px] flex-row items-center gap-4 rounded-bento-sm px-4 active:bg-peligro-suave">
          <Icono nombre="log-out-outline" tamano={24} color={peligro.DEFAULT} />
          <Text className="text-base font-semibold text-peligro">Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Opcion({ icono, texto, onPress }: { icono: NombreIcono; texto: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="min-h-[56px] flex-row items-center gap-4 rounded-bento-sm px-4 active:bg-oficiar-gray">
      <Icono nombre={icono} tamano={24} color={oficiar['blue-btn']} />
      <Text className="flex-1 text-base font-semibold text-oficiar-very-dark">{texto}</Text>
      <Icono nombre="chevron-forward" tamano={20} color={oficiar.dark} />
    </Pressable>
  );
}
