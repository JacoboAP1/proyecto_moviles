import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from './Logo';
import MenuButton from './MenuButton';
 
type Pestana = 'inicio' | 'solicitudes' | 'perfil';
 
interface Props {
  nombre: string; // nombre del usuario para el saludo
  rol: 'cliente' | 'officer';
  activa?: Pestana; // pestaña resaltada (por defecto, Inicio)
}
 
const PESTANAS: { clave: Pestana; texto: string }[] = [
  { clave: 'inicio', texto: 'Inicio' },
  { clave: 'solicitudes', texto: 'Solicitudes' },
  { clave: 'perfil', texto: 'Perfil' },
];
 
// Pastilla del rol: cada rol con su color y siempre con texto (no solo color).
// Contraste sobre el fondo oscuro: Cliente 4.9:1, Officer (texto blanco) 12.7:1
const PASTILLA = {
  cliente: { fondo: 'bg-exito/20', texto: 'text-exito', etiqueta: 'Cliente' },
  officer: { fondo: 'bg-oficiar-blue-btn/30', texto: 'text-white', etiqueta: 'Officer' },
};
 
// Encabezado oscuro de los inicios: menú, logo, saludo, rol y pestañas
export default function Encabezado({ nombre, rol, activa = 'inicio' }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pastilla = PASTILLA[rol];
 
  const ir = (clave: Pestana) => {
    if (clave === activa) return;
    if (clave === 'solicitudes') router.push('/solicitudes');
    else if (clave === 'perfil') router.push('/profile');
    else router.back();
  };
 
  return (
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
        <Text accessibilityRole="header" className="text-lg font-bold text-white">
          Hola, {nombre}
        </Text>
        <View className={`mt-1 rounded-full px-4 py-1 ${pastilla.fondo}`}>
          <Text className={`text-xs font-semibold ${pastilla.texto}`}>{pastilla.etiqueta}</Text>
        </View>
      </View>
 
      {/* Pestañas: la activa con fondo azul de botón (texto blanco 4.9:1) */}
      <View accessibilityRole="tablist" className="mt-3 flex-row justify-center gap-2">
        {PESTANAS.map(({ clave, texto }) => {
          const seleccionada = clave === activa;
          return (
            <Pressable
              key={clave}
              onPress={() => ir(clave)}
              accessibilityRole="tab"
              accessibilityState={{ selected: seleccionada }}
              className={`min-h-toque justify-center rounded-bento-sm px-4 active:opacity-80 ${
                seleccionada ? 'bg-oficiar-blue-btn' : ''
              }`}>
              <Text
                className={`text-sm ${seleccionada ? 'font-semibold text-white' : 'text-white/80'}`}>
                {texto}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}