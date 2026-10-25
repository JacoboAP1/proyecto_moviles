import { Redirect } from 'expo-router';
import { useSession } from '../src/session/context';

export default function Home() {
  const { user } = useSession();

  // Si no hay usuario en sesión, redirigir a welcome
  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  const role = user?.roles?.[0];

  if (role === 'ROLE_ADMIN') {
    return <Redirect href="/admin" />;
  }

  if (role === 'ROLE_CLIENT') {
    return <Redirect href="/client" />;
  }

  if (role === 'ROLE_WORKER') {
    return <Redirect href="/officer" />;
  }

  return <Redirect href="/(auth)/login" />;
}