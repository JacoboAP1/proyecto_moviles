import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Button from '../components/Button';
import Encabezado from '../components/Encabezado';
import EnVivo from '../components/EnVivo';
import type { NombreIcono } from '../components/Icono';
import OfertaCard from '../components/OfertaCard';
import ResumenEstadisticas from '../components/ResumenEstadisticas';
import StatCard from '../components/StatCard';
import TituloSeccion from '../components/TituloSeccion';
import { useEstadisticas } from '../hooks/useEstadisticas';
import { useSession } from '../session/context';
import { oficiar } from '../theme/tokens';

const ofertas: { titulo: string; icono: NombreIcono }[] = [
  { titulo: '20% OFF limpieza', icono: 'sparkles-outline' },
  { titulo: 'Descuento flash', icono: 'flash-outline' },
  { titulo: 'Plomería gratis', icono: 'water-outline' },
];

export default function Officer() {
  const { user } = useSession();
  const router = useRouter();
  const { estadisticas, error } = useEstadisticas();
  const porResponder = estadisticas?.pendientes ?? 0;
  const verSolicitudes = () => router.push('/solicitudes');

  return (
    <View className="flex-1 bg-oficiar-gray">
      <Encabezado nombre={user?.name ?? ''} rol="officer" />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-5 pb-10 gap-5">
        <TituloSeccion texto="Próximos" resaltado="servicios" />

        <View className="gap-bento rounded-2xl border-l-4 border-oficiar-blue bg-white p-5">
          {porResponder > 0 ? (
            <>
              <Text className="font-semibold text-oficiar-very-dark">
                Tienes {porResponder} {porResponder === 1 ? 'solicitud' : 'solicitudes'} por
                responder
              </Text>
              <Button
                text="Ver solicitudes"
                icono="document-text-outline"
                onPress={verSolicitudes}
              />
            </>
          ) : (
            <>
              <Text className="font-semibold text-oficiar-very-dark">
                Sin solicitudes por responder
              </Text>
              <Text className="text-sm text-oficiar-dark">
                Aquí aparecerán las solicitudes de tus clientes
              </Text>
            </>
          )}
        </View>

        <TituloSeccion
          texto="Tus"
          resaltado="estadísticas"
          derecha={<EnVivo conectado={!error} />}
        />

        {/* Se actualizan solas cada 10 s mientras el home está abierto */}
        <View className="flex-row gap-3">
          <StatCard
            icono="mail-unread-outline"
            valor={estadisticas?.pendientes ?? null}
            etiqueta="Por responder"
            color={oficiar.yellow}
            onPress={verSolicitudes}
          />
          <StatCard
            icono="construct-outline"
            valor={estadisticas?.activos ?? null}
            etiqueta="Activos"
            color={oficiar['blue-btn']}
            onPress={verSolicitudes}
          />
          <StatCard
            icono="checkmark-done-outline"
            valor={estadisticas?.finalizados ?? null}
            etiqueta="Finalizados"
            color={oficiar.dark}
            onPress={verSolicitudes}
          />
        </View>
        {!!error && !estadisticas && (
          <Text className="text-center text-bento-label text-oficiar-dark">
            No se pudieron cargar tus estadísticas
          </Text>
        )}
        {estadisticas && (
          <ResumenEstadisticas
            palabra="trabajos"
            finalizados={estadisticas.finalizados}
            partes={[
              { etiqueta: 'Por responder', valor: estadisticas.pendientes, color: oficiar.yellow },
              { etiqueta: 'Activos', valor: estadisticas.activos, color: oficiar['blue-btn'] },
              { etiqueta: 'Finalizados', valor: estadisticas.finalizados, color: oficiar.dark },
            ]}
          />
        )}

        <TituloSeccion texto="Ofertas" resaltado="exclusivas" />

        <View className="flex-row flex-wrap gap-3">
          {ofertas.map((o) => (
            <OfertaCard key={o.titulo} titulo={o.titulo} icono={o.icono} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
