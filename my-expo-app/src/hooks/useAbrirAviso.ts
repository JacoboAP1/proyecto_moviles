import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
 
// Al tocar un aviso (app abierta, en segundo plano o cerrada) abre esa solicitud
export function useAbrirAviso() {
  const router = useRouter();
  const respuesta = Notifications.useLastNotificationResponse();
 
  useEffect(() => {
    const id = respuesta?.notification.request.content.data?.solicitudId;
    if (!id) return;
    Notifications.clearLastNotificationResponse(); // si no, lo reabre en el próximo login

    // Actualiza el estado de la solicitud cuando llega una nueva notificación
    // Borra los avisos viejos de esa solicitud de la bandeja (si el usuario tocó uno, los demás ya no sirven)
    Notifications.getPresentedNotificationsAsync()
      .then((presentes) =>
        Promise.all(
          presentes
            .filter((n) => n.request.content.data?.solicitudId === id)
            .map((n) => Notifications.dismissNotificationAsync(n.request.identifier)),
        ),
      )
      .catch(() => {});
    router.push({ pathname: '/solicitudes', params: { id: String(id) } });
  }, [respuesta, router]);
}
