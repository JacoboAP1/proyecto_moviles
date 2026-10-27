import { ActivityIndicator, FlatList, Image, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import { useElegirOfficer } from '../hooks/useElegirOfficer';
import type { Trabajador } from '../types';
 
// Vista 2: el cliente elige al officer y envía la solicitud
export default function ElegirOfficer() {
  const {
    oficio,
    texto,
    setTexto,
    trabajadores,
    loading,
    refreshing,
    error,
    enviandoId,
    recargar,
    reintentar,
    solicitar,
  } = useElegirOfficer();
 
  return (
    <View className="flex-1 bg-oficiar-gray">
      <View className="gap-3 bg-white px-4 py-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-neutral-500">Servicio:</Text>
          <View className="rounded-full bg-oficiar-blue-btn px-3 py-1">
            <Text className="font-semibold text-white">{oficio}</Text>
          </View>
        </View>
        <TextInput
          className="rounded-lg border border-neutral-300 px-3 py-3"
          placeholder="Buscar officer por nombre..."
          value={texto}
          onChangeText={setTexto}
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>
 
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Text className="text-center text-oficiar-dark">{error}</Text>
          <Button text="Reintentar" variant="secondary" onPress={reintentar} />
        </View>
      ) : (
        <FlatList
          data={trabajadores}
          keyExtractor={(t) => String(t.id)}
          contentContainerClassName="gap-3 p-4 pb-10"
          refreshing={refreshing}
          onRefresh={recargar}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text className="mt-10 text-center text-neutral-500">
              {texto.trim()
                ? `No hay officers de ${oficio} que coincidan con "${texto.trim()}".`
                : `Por ahora no hay officers de ${oficio} disponibles.`}
            </Text>
          }
          renderItem={({ item }) => (
            <TarjetaProvisional
              trabajador={item}
              enviando={enviandoId === item.id}
              onPress={() => solicitar(item)}
            />
          )}
        />
      )}
    </View>
  );
}
 
// PROVISIONAL: cuando Triana suba OfficerCard, se reemplaza por
// <OfficerCard trabajador={item} onPress={() => solicitar(item)} /> y se borra esta función.
function TarjetaProvisional({
  trabajador,
  enviando,
  onPress,
}: {
  trabajador: Trabajador;
  enviando: boolean;
  onPress: () => void;
}) {
  return (
    <View className="gap-3 rounded-2xl bg-white p-4">
      <View className="flex-row items-center gap-3">
        {trabajador.fotoUrl ? (
          <Image source={{ uri: trabajador.fotoUrl }} className="h-14 w-14 rounded-full" resizeMode="cover" />
        ) : (
          <View className="h-14 w-14 items-center justify-center rounded-full bg-oficiar-blue-btn">
            <Text className="text-xl font-bold text-white">{trabajador.nombre.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="text-lg font-bold text-oficiar-very-dark">{trabajador.nombre}</Text>
          <Text className="text-oficiar-dark">{trabajador.oficios.map((o) => o.oficio).join(' · ')}</Text>
        </View>
      </View>
      <Button text={enviando ? 'Enviando…' : 'Solicitar servicio'} onPress={onPress} disabled={enviando} />
    </View>
  );
}
