import { Stack } from 'expo-router';
import '../global.css';
import { SessionProvider, useSession } from '../src/session/context';

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
        headerStyle: { backgroundColor: '#051A26' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '600' },
      }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="client" options={{ headerShown: false }} />
        <Stack.Screen name="officer" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
