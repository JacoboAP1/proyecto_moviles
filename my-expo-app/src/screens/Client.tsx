import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Button from '../components/Button';
import Encabezado from '../components/Encabezado';
import EnVivo from '../components/EnVivo';
import type { NombreIcono } from '../components/Icono';
import OfertaCard from '../components/OfertaCard';
import ResumenEstadisticas from '../components/ResumenEstadisticas';
import ServicioTile from '../components/ServicioTile';
import StatCard from '../components/StatCard';
import TituloSeccion from '../components/TituloSeccion';
import { useEstadisticas } from '../hooks/useEstadisticas';
import { useSession } from '../session/context';
import { oficiar } from '../theme/tokens';

const servicios = [
  'Electricidad',
  'Cerrajería',
  'Gas y Calefacción',
  'Fletes',
  'Limpieza profesional',
  'Refrigeración',
  'Instalación de AC',
  'Carpintería',
  'Pintura',
  'Albañilería',
  'Jardinería',
  'Plomería',
];

const ofertas: { titulo: string; icono: NombreIcono }[] = [
  { titulo: '20% OFF limpieza', icono: 'sparkles-outline' },
  { titulo: 'Descuento flash', icono: 'flash-outline' },
  { titulo: 'Plomería gratis', icono: 'water-outline' },
];

export default function Client() {
  const { user } = useSession();
  const router = useRouter();
  const { estadisticas, error } = useEstadisticas();
  const verSolicitudes = () => router.push('/solicitudes');
  const solicitar = () => router.push('/solicitar');

  return (
    <View className="flex-1 bg-oficiar-gray">
      <Encabezado nombre={user?.name ?? ''} rol="cliente" />

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-5 pb-10 gap-5">
        <TituloSeccion texto="Tus" resaltado="servicios" derecha={<EnVivo conectado={!error} />} />

        {/* Se actualizan solas cada 10 s mientras el home está abierto */}
        <View className="flex-row gap-3">
          <StatCard
            icono="hourglass-outline"
            valor={estadisticas?.pendientes ?? null}
            etiqueta="Esperando"
            color={oficiar.yellow}
            onPress={verSolicitudes}
          />
          <StatCard
            icono="construct-outline"
            valor={estadisticas?.activos ?? null}
            etiqueta="En curso"
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
            palabra="servicios"
            finalizados={estadisticas.finalizados}
            partes={[
              { etiqueta: 'Esperando', valor: estadisticas.pendientes, color: oficiar.yellow },
              { etiqueta: 'En curso', valor: estadisticas.activos, color: oficiar['blue-btn'] },
              { etiqueta: 'Finalizados', valor: estadisticas.finalizados, color: oficiar.dark },
            ]}
          />
        )}

        <TituloSeccion texto="Nuestros" resaltado="servicios" />

        {/* Tocar un servicio lleva a pedirlo */}
        <View className="flex-row flex-wrap gap-3">
          {servicios.map((s) => (
            <ServicioTile key={s} nombre={s} onPress={solicitar} />
          ))}
        </View>

        <Button text="Solicitar un servicio" icono="add-circle-outline" onPress={solicitar} />

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
