import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { guardarTokenPush } from '../api/notificaciones';
import { useAlerta } from '../session/alerta';
 
// Con la app abierta el aviso también se muestra arriba
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
 
// Android 13+: el canal debe existir ANTES de pedir permiso, o el diálogo no aparece
async function registrarCelular() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('solicitudes', {
      name: 'Solicitudes',
      importance: AndroidImportance.MAX,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;   // lo negó: la app sigue normal
 
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  await guardarTokenPush(data);
}
 
// Al iniciar sesión: si ya dio permiso, registra en silencio; si nunca se le preguntó, explica antes
export function useNotificaciones(conSesion: boolean) {
  const { confirmar } = useAlerta();
  const yaPregunto = useRef(false);
 
  useEffect(() => {
    if (!conSesion) return;
    (async () => {
      const permiso = await Notifications.getPermissionsAsync();
      if (permiso.status === 'granted') return registrarCelular();
      if (!permiso.canAskAgain || yaPregunto.current) return;
 
      yaPregunto.current = true;
      confirmar({
        titulo: 'Activa los avisos',
        mensaje: 'Te avisaremos cuando te coticen, acepten tu presupuesto o cambie el estado de tu servicio.',
        textoConfirmar: 'Activar',
        textoCancelar: 'Ahora no',
        accion: registrarCelular,
      });
    })().catch((e) => console.warn('Notificaciones no disponibles:', (e as Error).message));
  }, [conSesion, confirmar]);

  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(async (nuevo) => {
      const id = nuevo.request.content.data?.solicitudId;
      if (!id) return;
      const presentes = await Notifications.getPresentedNotificationsAsync();
      await Promise.all(
        presentes
          .filter((n) => n.request.identifier !== nuevo.request.identifier
            && n.request.content.data?.solicitudId === id)
          .map((n) => Notifications.dismissNotificationAsync(n.request.identifier)),
      );
    });
    return () => sub.remove();
  }, []);
}
