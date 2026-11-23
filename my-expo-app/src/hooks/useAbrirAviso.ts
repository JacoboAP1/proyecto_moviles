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
    Notifications.clearLastNotificationResponse();   // si no, lo reabre en el próximo login
    router.push({ pathname: '/solicitudes', params: { id: String(id) } });
  }, [respuesta, router]);
}
