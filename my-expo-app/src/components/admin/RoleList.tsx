
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchRoles } from '../../api/roles';
import { useRoles } from '../../hooks/useRoles';
import { useSearch } from '../../hooks/useSearch';
import { useUpdateRole } from '../../hooks/useUpdateRole';
import { neutro, oficiar } from '../../theme/tokens';
import Badge from '../Badge';
import Button from '../Button';

const input =
  'min-h-toque rounded-bento-sm border border-oficiar-dark/20 px-bento-in text-bento-body text-oficiar-very-dark';

export default function RoleList() {
  const {
    roles,
    setRoles,
    loading,
    cargarTodos,
    nuevoRol,
    setNuevoRol,
    submitting,
    handleCrear,
    handleEliminar,
    normalizarNombre,
    nombreVisual,
    esRolBase,
  } = useRoles();

  const { texto, setTexto, buscando, buscar } = useSearch(
    searchRoles,
    setRoles,
    cargarTodos,
  );

  const {
    editingId,
    editingName,
    setEditingName,
    saving,
    comenzarEdicion,
    cancelarEdicion,
    guardarEdicion,
  } = useUpdateRole(
    cargarTodos,
    normalizarNombre,
    nombreVisual,
  );

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
        {/* Crear rol */}
        <View className="flex-row gap-2">
          <TextInput
            className={`flex-1 ${input}`}
            placeholder="Nuevo rol (ej: Supervisor)"
            placeholderTextColor={neutro.placeholder}
            accessibilityLabel="Nombre del nuevo rol"
            value={nuevoRol}
            onChangeText={setNuevoRol}
            maxLength={50}
            editable={!submitting}
            returnKeyType="done"
            onSubmitEditing={handleCrear}
          />

          <Button text="Agregar" onPress={handleCrear} cargando={submitting} />
        </View>

        {/* Buscar rol */}
        <View className="flex-row gap-2">
          <TextInput
            className={`flex-1 ${input}`}
            placeholder="Buscar rol..."
            placeholderTextColor={neutro.placeholder}
            accessibilityLabel="Buscar rol"
            value={texto}
            onChangeText={setTexto}
            returnKeyType="search"
            onSubmitEditing={buscar}
          />

          <Button text="Buscar" variant="secondary" onPress={buscar} cargando={buscando} />
        </View>
      </View>

      {/* Lista de roles */}
      <FlatList
        data={roles}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-bento p-bento-in pb-10"
        ListEmptyComponent={
          <Text className="py-8 text-center text-bento-body text-oficiar-dark">
            No hay roles registrados
          </Text>
        }
        renderItem={({ item }) => {
          const editando = editingId === item.id;
          const base = esRolBase(item);

          return (
            <View className="gap-bento rounded-bento bg-white p-bento-in">
              {editando ? (
                <>
                  <TextInput
                    className={input}
                    placeholder="Nombre del rol"
                    placeholderTextColor={neutro.placeholder}
                    accessibilityLabel="Nuevo nombre del rol"
                    value={editingName}
                    onChangeText={setEditingName}
                    maxLength={50}
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
                  <View className="flex-row items-center justify-between gap-bento">
                    <View className="flex-1 gap-0.5">
                      <Text className="text-bento-body font-semibold text-oficiar-very-dark">
                        {nombreVisual(item.name)}
                      </Text>
                      <Text className="text-bento-label text-oficiar-dark">
                        {item.name}
                      </Text>
                    </View>

                    {base && <Badge text="Rol base" variant="neutral" />}
                  </View>

                  {/* Los roles base no se pueden editar ni eliminar: no se muestran las opciones */}
                  {base ? (
                    <Text className="text-bento-label text-oficiar-dark">
                      Lo usa la app para dar acceso; no se puede editar ni eliminar.
                    </Text>
                  ) : (
                    <View className="flex-row gap-2">
                      <Button
                        text="Editar"
                        variant="secondary"
                        accessibilityLabel={`Editar el rol ${nombreVisual(item.name)}`}
                        onPress={() => comenzarEdicion(item)}
                        className="flex-1"
                      />
                      <Button
                        text="Eliminar"
                        variant="danger"
                        accessibilityLabel={`Eliminar el rol ${nombreVisual(item.name)}`}
                        onPress={() => handleEliminar(item)}
                        className="flex-1"
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
