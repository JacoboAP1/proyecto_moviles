import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from 'expo-router/react-navigation';
import { useSession } from '../session/context';
import type { Role } from '../types';
import { useLogout } from './useLogout';

const ROL_LABEL: Record<Role, string> = {
  ROLE_ADMIN: 'Administrador',
  ROLE_WORKER: 'Officer',
  ROLE_CLIENT: 'Cliente',
};

export function useDrawerMenu(cerrarMenu?: () => void) {
  const { user } = useSession();
  const { logout } = useLogout();
  const router = useRouter();
  const navigation = useNavigation();

  const abrirMenu = () => navigation.dispatch(DrawerActions.openDrawer());

  const irAPerfil = () => {
    cerrarMenu?.();
    router.push('/profile');
  };

  const irASolicitudes = () => {
    cerrarMenu?.();
    router.push('/solicitudes');
  };

  return {
    nombre: user?.name ?? '',
    email: user?.email ?? '',
    inicial: user?.name?.charAt(0).toUpperCase() ?? '?',
    rol: user ? ROL_LABEL[user.roles[0]] : '',
    // El admin no tiene solicitudes
    verSolicitudes: !!user && !user.roles.includes('ROLE_ADMIN'),
    abrirMenu,
    irAPerfil,
    irASolicitudes,
    cerrarSesion: logout,
  };
}
