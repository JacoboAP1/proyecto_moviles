
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchPerfiles } from '../../api/perfiles';
import { usePerfiles } from '../../hooks/usePerfiles';
import { useSearch } from '../../hooks/useSearch';
import { useUpdatePerfil } from '../../hooks/useUpdatePerfil';
import { neutro, oficiar } from '../../theme/tokens';
import Button from '../Button';

const input =
  'min-h-toque rounded-bento-sm border border-oficiar-dark/20 px-bento-in text-bento-body text-oficiar-very-dark';

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
        <ActivityIndicator size="large" color={oficiar.blue} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="gap-bento border-b border-oficiar-dark/10 bg-white p-bento-in">
        <View className="flex-row gap-2">
          <TextInput
            className={`flex-1 ${input}`}
            placeholder="Nuevo oficio (ej: Soldador)"
            placeholderTextColor={neutro.placeholder}
            accessibilityLabel="Nombre del nuevo oficio"
            value={nuevoOficio}
            onChangeText={setNuevoOficio}
            maxLength={100}
            editable={!submitting}
          />
          <Button text="Agregar" onPress={handleCrear} cargando={submitting} />
        </View>

        <View className="flex-row gap-2">
          <TextInput
            className={`flex-1 ${input}`}
            placeholder="Buscar oficio..."
            placeholderTextColor={neutro.placeholder}
            accessibilityLabel="Buscar oficio"
            value={texto}
            onChangeText={setTexto}
            returnKeyType="search"
            onSubmitEditing={buscar}
          />
          <Button text="Buscar" variant="secondary" onPress={buscar} cargando={buscando} />
        </View>
      </View>

      <FlatList
        data={perfiles}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-bento p-bento-in pb-10"
        ListEmptyComponent={
          <Text className="py-8 text-center text-bento-body text-oficiar-dark">
            {texto.trim() ? 'No hay oficios que coincidan' : 'No hay oficios registrados'}
          </Text>
        }
        renderItem={({ item }) => {
          const editando = editingId === item.id;

          return (
            <View className="gap-bento rounded-bento bg-white p-bento-in">
              {editando ? (
                <>
                  <TextInput
                    className={input}
                    placeholder="Nombre del oficio"
                    placeholderTextColor={neutro.placeholder}
                    accessibilityLabel="Nuevo nombre del oficio"
                    value={editingName}
                    onChangeText={setEditingName}
                    maxLength={100}
                    editable={!saving}
                    autoFocus
                  />

                  <View className="flex-row gap-2">
                    <Button
                      text="Cancelar"
                      variant="secondary"
                      onPress={cancelarEdicion}
                      disabled={saving}
                      className="flex-1"
                    />
                    <Button
                      text="Guardar"
                      textoCargando="Guardando…"
                      onPress={() => guardarEdicion(item)}
                      cargando={saving}
                      className="flex-1"
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-bento-title font-semibold text-oficiar-very-dark">
                    {item.oficio}
                  </Text>

                  <View className="flex-row gap-2">
                    <Button
                      text="Editar"
                      variant="secondary"
                      accessibilityLabel={`Editar el oficio ${item.oficio}`}
                      onPress={() => comenzarEdicion(item)}
                      className="flex-1"
                    />
                    <Button
                      text="Eliminar"
                      variant="danger"
                      accessibilityLabel={`Eliminar el oficio ${item.oficio}`}
                      onPress={() => handleEliminar(item)}
                      className="flex-1"
                    />
                  </View>
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
