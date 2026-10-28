import { Text, View } from 'react-native';
import type { EstadoSolicitud } from '../types';

interface Props {
  estado: EstadoSolicitud;
}

// Cada estado lleva texto + color (nunca solo color) y contraste >= 4.5:1
const ESTILO: Record<EstadoSolicitud, { texto: string; fondo: string; color: string }> = {
  PENDIENTE: { texto: 'Pendiente', fondo: 'bg-oficiar-yellow/30', color: 'text-oficiar-very-dark' },
  COTIZADA: { texto: 'Cotizada', fondo: 'bg-oficiar-blue/20', color: 'text-oficiar-dark' },
  ACEPTADA: { texto: 'Aceptada', fondo: 'bg-oficiar-blue-btn/20', color: 'text-oficiar-dark' },
  EN_CURSO: { texto: 'En curso', fondo: 'bg-oficiar-dark', color: 'text-white' },
  FINALIZADA: { texto: 'Finalizada', fondo: 'bg-oficiar-gray', color: 'text-oficiar-very-dark' },
  RECHAZADA: { texto: 'Rechazada', fondo: 'bg-peligro-suave', color: 'text-peligro' },
  CANCELADA: { texto: 'Cancelada', fondo: 'bg-oficiar-gray', color: 'text-oficiar-dark' },
};

export default function EstadoChip({ estado }: Props) {
  const { texto, fondo, color } = ESTILO[estado];

  return (
    <View
      accessible
      accessibilityLabel={`Estado: ${texto}`}
      className={`self-start rounded-full px-3 py-1 ${fondo}`}>
      <Text className={`text-bento-label font-semibold ${color}`}>{texto}</Text>
    </View>
  );
}