import type { DrawerContentComponentProps } from 'expo-router/drawer';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDrawerMenu } from '../hooks/useDrawerMenu';

export default function DrawerMenu({ navigation }: DrawerContentComponentProps) {
  const { nombre, email, inicial, rol, verSolicitudes, irAPerfil, irASolicitudes, cerrarSesion } =
    useDrawerMenu(() => navigation.closeDrawer());
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View
        className="gap-1 bg-oficiar-very-dark px-5 pb-5"
        style={{ paddingTop: insets.top + 24 }}>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-oficiar-blue">
          <Text className="text-2xl font-bold text-white">{inicial}</Text>
        </View>
        <Text className="mt-2 text-base font-bold text-white">{nombre}</Text>
        <Text className="text-bento-label text-white/80">{email}</Text>
        <Text className="mt-1 text-bento-label font-semibold text-oficiar-blue">{rol}</Text>
      </View>

      <View className="gap-1 px-3 py-3">
        <Pressable
          onPress={irAPerfil}
          accessibilityRole="button"
          className="min-h-toque justify-center rounded-bento-sm px-3 active:bg-oficiar-gray">
          <Text className="text-bento-body font-semibold text-oficiar-very-dark">Mi perfil</Text>
        </Pressable>
        {verSolicitudes && (
          <Pressable
            onPress={irASolicitudes}
            accessibilityRole="button"
            className="min-h-toque justify-center rounded-bento-sm px-3 active:bg-oficiar-gray">
            <Text className="text-bento-body font-semibold text-oficiar-very-dark">Solicitudes</Text>
          </Pressable>
        )}
      </View>

      <View
        className="mt-auto border-t border-oficiar-dark/10 px-3 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}>
        <Pressable
          onPress={cerrarSesion}
          accessibilityRole="button"
          className="min-h-toque justify-center rounded-bento-sm px-3 active:bg-peligro-suave">
          <Text className="text-bento-body font-semibold text-peligro">Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}
