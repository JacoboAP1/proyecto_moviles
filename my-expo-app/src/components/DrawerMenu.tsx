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
        <Text className="text-xs text-white/70">{email}</Text>
        <Text className="mt-1 text-xs font-semibold text-oficiar-blue">{rol}</Text>
      </View>

      <View className="px-3 py-3">
        <Pressable onPress={irAPerfil} className="rounded-lg px-3 py-3 active:bg-neutral-100">
          <Text className="font-semibold text-oficiar-very-dark">Mi perfil</Text>
        </Pressable>
        {verSolicitudes && (
          <Pressable onPress={irASolicitudes} className="rounded-lg px-3 py-3 active:bg-neutral-100">
            <Text className="font-semibold text-oficiar-very-dark">Solicitudes</Text>
          </Pressable>
        )}
      </View>

      <View
        className="mt-auto border-t border-neutral-200 px-3 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}>
        <Pressable onPress={cerrarSesion} className="rounded-lg px-3 py-3 active:bg-red-50">
          <Text className="font-semibold text-red-600">Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}
