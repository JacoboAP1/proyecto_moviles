import { useAlerta } from '../session/alerta';
import { useSession } from '../session/context';

export function useLogout() {
  const { signOut } = useSession();
  const { confirmar } = useAlerta();

  const logout = () => {
    confirmar({
      titulo: 'Cerrar sesión',
      mensaje: '¿Seguro que quieres salir?',
      textoConfirmar: 'Sí, salir',
      peligro: true,
      accion: signOut,
    });
  };

  return { logout };
}
