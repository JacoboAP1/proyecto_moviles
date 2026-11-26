import { Text, View } from 'react-native';

export interface ParteResumen {
  etiqueta: string;
  valor: number;
  color: string; // mismo color que su StatCard
}

interface Props {
  partes: ParteResumen[]; // en orden: pendientes, activos, finalizados
  finalizados: number;
  palabra: string; // "servicios" (cliente) o "trabajos" (officer)
}

// Barra con la proporción de cada grupo y una leyenda con los números (no depende solo del color)
export default function ResumenEstadisticas({ partes, finalizados, palabra }: Props) {
  const total = partes.reduce((suma, p) => suma + p.valor, 0);
  const porcentaje = total > 0 ? Math.round((finalizados / total) * 100) : 0;

  if (total === 0) {
    return (
      <View className="rounded-bento bg-white p-bento-in">
        <Text className="text-center text-bento-body text-oficiar-dark">
          Cuando tengas {palabra}, aquí verás tu avance.
        </Text>
      </View>
    );
  }

  const descripcion = partes.map((p) => `${p.valor} ${p.etiqueta.toLowerCase()}`).join(', ');

  return (
    <View
      accessible
      accessibilityLabel={`Llevas ${finalizados} de ${total} ${palabra} finalizados, ${porcentaje} por ciento. ${descripcion}`}
      className="gap-3 rounded-bento bg-white p-bento-in">
      <View className="flex-row items-end justify-between">
        <Text className="flex-1 text-bento-body text-oficiar-dark">
          Llevas <Text className="font-bold text-oficiar-very-dark">{finalizados}</Text> de{' '}
          <Text className="font-bold text-oficiar-very-dark">{total}</Text> {palabra} finalizados
        </Text>
        <Text className="text-2xl font-black text-oficiar-blue-btn">{porcentaje}%</Text>
      </View>

      {/* Cada tramo ocupa lo que le corresponde del total */}
      <View className="h-3 flex-row gap-0.5 overflow-hidden rounded-full bg-oficiar-gray">
        {partes
          .filter((p) => p.valor > 0)
          .map((p) => (
            <View key={p.etiqueta} style={{ flex: p.valor, backgroundColor: p.color }} />
          ))}
      </View>

      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        {partes.map((p) => (
          <View key={p.etiqueta} className="flex-row items-center gap-1.5">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <Text className="text-bento-label text-oficiar-dark">
              {p.valor} {p.etiqueta}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
