import { Redirect } from 'expo-router';
import { useSession } from '../src/session/context';

export default function Home() {
  const { user } = useSession();
  const role = user?.roles?.[0];

  if (role === 'ROLE_ADMIN') {
    return <Redirect href="/admin" />;
  }

  if (role === 'ROLE_CLIENT') {
    return <Redirect href="/client" />;
  }

  return <Redirect href="/officer" />;
}
