import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { Solicitud } from '../types';
import EstadoChip from './EstadoChip';

interface Props {
  solicitud: Solicitud;
  esOfficer: boolean;
  children?: ReactNode;
}

// Tarjeta Bento de una solicitud (Vista 3). En children van los botones de acción.
export default function SolicitudCard({ solicitud, esOfficer, children }: Props) {
  const persona = esOfficer ? solicitud.clienteNombre : solicitud.officerNombre;
  const precio =
    solicitud.precioAcordado != null
      ? `$${solicitud.precioAcordado.toLocaleString('es-CO')}`
      : 'Por cotizar';

  return (
    <View className="gap-bento rounded-bento bg-white p-bento-in">
      <View className="flex-row items-start justify-between gap-bento">
        <Text className="flex-1 text-bento-title font-bold text-oficiar-very-dark">{solicitud.oficio}</Text>
        <EstadoChip estado={solicitud.estado} />
      </View>

      <Text className="text-bento-body text-oficiar-dark">{solicitud.descripcion}</Text>

      <View className="flex-row gap-bento">
        <View className="flex-1 gap-1 rounded-bento-sm bg-oficiar-gray p-3">
          <Text className="text-bento-label text-oficiar-dark">{esOfficer ? 'Cliente' : 'Officer'}</Text>
          <Text className="text-bento-body font-semibold text-oficiar-very-dark">{persona}</Text>
        </View>
        <View className="flex-1 gap-1 rounded-bento-sm bg-oficiar-gray p-3">
          <Text className="text-bento-label text-oficiar-dark">Precio</Text>
          <Text className="text-bento-body font-semibold text-oficiar-very-dark">{precio}</Text>
        </View>
      </View>

      {!!solicitud.direccion && (
        <Text className="text-bento-label text-oficiar-dark">Dirección: {solicitud.direccion}</Text>
      )}

      {children}
    </View>
  );
}