
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchPerfiles } from '../../api/perfiles';
import { usePerfiles } from '../../hooks/usePerfiles';
import { useSearch } from '../../hooks/useSearch';
import { useUpdatePerfil } from '../../hooks/useUpdatePerfil';

export default function TradeList() {
  const {
    perfiles,
    setPerfiles,
    loading,
    cargarTodos,
    nuevoOficio,
    setNuevoOficio,
    submitting,
    handleCrear,
    handleEliminar,
  } = usePerfiles();

  const { texto, setTexto, buscando, buscar } = useSearch(searchPerfiles, setPerfiles, cargarTodos);

  const {
    editingId,
    editingName,
    setEditingName,
    saving,
    comenzarEdicion,
    cancelarEdicion,
    guardarEdicion,
  } = useUpdatePerfil(cargarTodos);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#3D80B7" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="gap-2 border-b border-neutral-200 bg-white px-4 py-3">
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
            placeholder="Nuevo oficio (ej: Soldador)"
            placeholderTextColor="#a3a3a3"
            value={nuevoOficio}
            onChangeText={setNuevoOficio}
            maxLength={100}
            editable={!submitting}
          />
          <Pressable
            onPress={handleCrear}
            disabled={submitting}
            className="items-center justify-center rounded-lg bg-oficiar-blue-btn px-4 active:opacity-80 disabled:opacity-50">
            <Text className="font-semibold text-white">
              {submitting ? '...' : 'Agregar'}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
            placeholder="Buscar oficio..."
            placeholderTextColor="#a3a3a3"
            value={texto}
            onChangeText={setTexto}
            returnKeyType="search"
            onSubmitEditing={buscar}
          />
          <Pressable
            onPress={buscar}
            disabled={buscando}
            className="items-center justify-center rounded-lg bg-oficiar-blue-btn px-4 active:opacity-80 disabled:opacity-50">
            <Text className="font-semibold text-white">
              {buscando ? '...' : 'Buscar'}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={perfiles}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="px-4 py-3 gap-2"
        ListEmptyComponent={
          <Text className="py-8 text-center text-neutral-400">
            {texto.trim() ? 'No hay oficios que coincidan' : 'No hay oficios registrados'}
          </Text>
        }
        renderItem={({ item }) => {
          const editando = editingId === item.id;

          return (
            <View className="rounded-xl bg-white px-4 py-3">
              {editando ? (
                <>
                  <TextInput
                    className="rounded-lg border border-neutral-300 px-3 py-2"
                    placeholder="Nombre del oficio"
                    placeholderTextColor="#a3a3a3"
                    value={editingName}
                    onChangeText={setEditingName}
                    maxLength={100}
                    editable={!saving}
                    autoFocus
                  />

                  <View className="mt-3 flex-row gap-2">
                    <Pressable
                      onPress={cancelarEdicion}
                      disabled={saving}
                      className="flex-1 items-center justify-center rounded-lg border border-neutral-300 px-3 py-2 active:opacity-80 disabled:opacity-50">
                      <Text className="text-sm font-semibold text-neutral-600">
                        Cancelar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => guardarEdicion(item)}
                      disabled={saving}
                      className="flex-1 items-center justify-center rounded-lg bg-oficiar-blue-btn px-3 py-2 active:opacity-80 disabled:opacity-50">
                      <Text className="text-sm font-semibold text-white">
                        {saving ? '...' : 'Guardar'}
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="flex-1 font-semibold text-oficiar-very-dark">
                    {item.oficio}
                  </Text>

                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => comenzarEdicion(item)}
                      className="rounded-lg bg-blue-50 px-3 py-2 active:opacity-80">
                      <Text className="text-sm font-semibold text-oficiar-blue">
                        Editar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleEliminar(item)}
                      className="rounded-lg bg-red-50 px-3 py-2 active:opacity-80">
                      <Text className="text-sm font-semibold text-red-600">
                        Eliminar
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
