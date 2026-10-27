import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// PROVISIONAL: la Vista 2 la reemplaza Jacobo (FlatList de officers + "Solicitar servicio").
// Usa getTrabajadores (src/api/usuarios.ts) y crearSolicitud (src/api/solicitudes.ts).
export default function ElegirOfficer() {
  const { perfilId, oficio, descripcion, direccion } = useLocalSearchParams<{
    perfilId: string;
    oficio: string;
    descripcion: string;
    direccion: string;
  }>();

  return (
    <View className="flex-1 gap-3 bg-oficiar-gray p-6">
      <Text className="text-xl font-bold text-oficiar-very-dark">Vista 2 en construcción</Text>
      <Text className="text-neutral-500">Datos que llegaron de la Vista 1:</Text>
      <View className="gap-1 rounded-xl bg-white p-4">
        <Text>Servicio: {oficio} (id {perfilId})</Text>
        <Text>Descripción: {descripcion}</Text>
        <Text>Dirección: {direccion || '—'}</Text>
      </View>
    </View>
  );
}
