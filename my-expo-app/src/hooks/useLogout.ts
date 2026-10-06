import { Alert } from 'react-native';
import { useSession } from '../session/context';

export function useLogout() {
  const { signOut } = useSession();

  const logout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, salir', style: 'destructive', onPress: signOut },
    ]);
  };

  return { logout };
}
