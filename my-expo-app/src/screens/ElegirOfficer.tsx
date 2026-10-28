import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import OfficerCard from '../components/OfficerCard';
import { useElegirOfficer } from '../hooks/useElegirOfficer';
import { neutro } from '../theme/tokens';

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
      <View className="p-bento-in pb-0">
        <View className="gap-bento rounded-bento bg-white p-bento-in">
          <View className="flex-row items-center gap-2">
            <Text className="text-bento-body text-oficiar-dark">Servicio:</Text>
            <View className="rounded-full bg-oficiar-blue-btn px-3 py-1">
              <Text className="text-bento-label font-semibold text-white">{oficio}</Text>
            </View>
          </View>
          <TextInput
            className="min-h-toque rounded-bento-sm border border-oficiar-dark/20 px-bento-in text-bento-body text-oficiar-very-dark"
            placeholder="Buscar officer por nombre..."
            placeholderTextColor={neutro.placeholder}
            value={texto}
            onChangeText={setTexto}
            autoCapitalize="words"
            returnKeyType="search"
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center gap-bento p-bento-in">
          <Text className="text-center text-bento-body text-oficiar-dark">{error}</Text>
          <Button text="Reintentar" variant="secondary" onPress={reintentar} />
        </View>
      ) : (
        <FlatList
          data={trabajadores}
          keyExtractor={(t) => String(t.id)}
          contentContainerClassName="gap-bento p-bento-in pb-10"
          refreshing={refreshing}
          onRefresh={recargar}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text className="mt-10 text-center text-bento-body text-oficiar-dark">
              {texto.trim()
                ? `No hay officers de ${oficio} que coincidan con "${texto.trim()}".`
                : `Por ahora no hay officers de ${oficio} disponibles.`}
            </Text>
          }
          renderItem={({ item }) => (
            <OfficerCard
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
