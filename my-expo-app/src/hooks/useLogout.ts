import { useAlerta } from '../session/alerta';
import { useSession } from '../session/context';
import { guardarTokenPush } from '../api/notificaciones';

export function useLogout() {
  const { signOut } = useSession();
  const { confirmar } = useAlerta();

  const logout = () => {
    confirmar({
      titulo: 'Cerrar sesión',
      mensaje: '¿Seguro que quieres salir?',
      textoConfirmar: 'Sí, salir',
      peligro: true,
      accion: async () => {
        await guardarTokenPush(null).catch(() => {}); // sin red, se cierra igual
        signOut();
      },
    });
  };

  return { logout };
}
