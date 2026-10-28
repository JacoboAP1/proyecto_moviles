import { Stack } from 'expo-router';
import '../global.css';
import { SessionProvider, useSession } from '../src/session/context';
import { neutro, oficiar } from '../src/theme/tokens';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Navigator />
    </SessionProvider>
  );
}

function Navigator() {
  const { user } = useSession();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: oficiar['very-dark'] },
        headerTintColor: neutro.white,
        headerTitleStyle: { fontWeight: '600' },
      }}>
      {/* 1. La ruta index DEBE estar fuera del guard para resolver el inicio de la app */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* 2. Rutas solo para usuarios AUTENTICADOS */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="client" options={{ headerShown: false }} />
        <Stack.Screen name="officer" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
        <Stack.Screen name="solicitar" options={{ title: 'Solicitar servicio' }} />
        <Stack.Screen name="elegir-officer" options={{ title: 'Elegir officer' }} />
        <Stack.Screen name="solicitudes" options={{ title: 'Solicitudes' }} />
      </Stack.Protected>

      {/* 3. Rutas solo para usuarios NO AUTENTICADOS */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
