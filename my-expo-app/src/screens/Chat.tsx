import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Text, View } from 'react-native';
import { getSolicitud } from '../api/solicitudes';
import BurbujaMensaje from '../components/BurbujaMensaje';
import CampoMensaje from '../components/CampoMensaje';
import EnVivo from '../components/EnVivo';
import EstadoChip from '../components/EstadoChip';
import { useChat } from '../hooks/useChat';
import { useSession } from '../session/context';
import type { EstadoSolicitud, Solicitud } from '../types';

// Con la solicitud terminada el historial se lee, pero ya no se escribe (lo mismo valida el backend)
const CERRADAS: EstadoSolicitud[] = ['FINALIZADA', 'RECHAZADA', 'CANCELADA'];

// "2026-11-27T19:05:00Z" -> "2:05 p. m." en la hora del celular
function horaCorta(iso: string): string {
  const fecha = new Date(iso);
  const h = fecha.getHours();
  const m = String(fecha.getMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

// Chat entre el cliente y el officer de una solicitud
export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const solicitudId = Number(id);
  const { user } = useSession();
  const esOfficer = user?.roles.includes('ROLE_WORKER') ?? false;
  const { mensajes, cargando, error, conectado, enviando, enviar } = useChat(solicitudId);
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);

  // Cuánto espacio hay arriba del chat (encabezado + barra de la solicitud) en ESTE celular.
  // El teclado se mide desde arriba de la pantalla: sin este valor, tapa el campo de texto
  const zonaChat = useRef<ComponentRef<typeof View>>(null);
  const [espacioArriba, setEspacioArriba] = useState(0);
  const medirEspacioArriba = () =>
    zonaChat.current?.measureInWindow((_x: number, y: number) => setEspacioArriba(y));

  useEffect(() => {
    let activo = true;
    getSolicitud(solicitudId)
      .then((s) => activo && setSolicitud(s))
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [solicitudId]);

  const otro = solicitud ? (esOfficer ? solicitud.clienteNombre : solicitud.officerNombre) : 'Chat';
  const cerrada = solicitud && CERRADAS.includes(solicitud.estado);

  return (
    <View className="flex-1 bg-oficiar-gray">
      <Stack.Screen options={{ title: otro }} />

      {/* Barra de contexto: de qué solicitud se habla y si el chat está en vivo */}
      <View className="flex-row items-center justify-between gap-2 border-b border-oficiar-dark/10 bg-white px-bento-in py-2">
        <View className="flex-1 flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="shrink text-bento-body font-semibold text-oficiar-very-dark">
            {solicitud?.oficio ?? 'Solicitud'}
          </Text>
          {solicitud && <EstadoChip estado={solicitud.estado} />}
        </View>
        <EnVivo conectado={conectado} />
      </View>

      <View ref={zonaChat} className="flex-1" onLayout={medirEspacioArriba}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior="padding"
          keyboardVerticalOffset={espacioArriba}>
          {cargando ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          ) : mensajes.length === 0 ? (
            // Fuera de la FlatList: en una lista invertida este texto saldría al revés
            <View className="flex-1 items-center justify-center p-6">
              <Text className="text-center text-bento-body text-oficiar-dark">
                {error ??
                  `Todavía no hay mensajes. Escríbele a ${otro} para coordinar el servicio.`}
              </Text>
            </View>
          ) : (
            <FlatList
              inverted
              data={mensajes}
              keyExtractor={(m) => String(m.id)}
              contentContainerClassName="gap-2 p-bento-in"
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <BurbujaMensaje
                  texto={item.texto}
                  mio={item.mio}
                  hora={horaCorta(item.fechaEnvio)}
                  autor={item.autorNombre}
                />
              )}
            />
          )}

          <CampoMensaje
            onEnviar={enviar}
            enviando={enviando}
            cerrado={
              cerrada
                ? `El chat se cerró porque la solicitud está ${solicitud.estado.toLowerCase()}. Puedes leer los mensajes, pero ya no escribir.`
                : undefined
            }
          />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
