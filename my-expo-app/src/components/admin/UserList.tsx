
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchUsers } from '../../api/usuarios';
import { useUsers } from '../../hooks/useUsers';
import { useSearch } from '../../hooks/useSearch';
import { useUserFilter } from '../../hooks/useUserFilter';
import { neutro, oficiar } from '../../theme/tokens';
import Badge from '../Badge';
import Button from '../Button';

export default function UserList() {
  const {
    usuarios,
    setUsuarios,
    loading,
    cargarTodos,
    handleDesactivar,
    handleReactivar,
    getRol,
  } = useUsers();

  const { texto, setTexto, buscando, buscar } = useSearch(
    searchUsers,
    setUsuarios,
    cargarTodos,
  );

  const {
    filtro,
    setFiltro,
    opciones,
    usuariosFiltrados,
  } = useUserFilter(usuarios);

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
            className="min-h-toque flex-1 rounded-bento-sm border border-oficiar-dark/20 px-bento-in text-bento-body text-oficiar-very-dark"
            placeholder="Buscar por nombre o email..."
            placeholderTextColor={neutro.placeholder}
            accessibilityLabel="Buscar usuario por nombre o email"
            value={texto}
            onChangeText={setTexto}
            returnKeyType="search"
            onSubmitEditing={buscar}
          />

          <Button text="Buscar" icono="search" variant="secondary" onPress={buscar} cargando={buscando} />
        </View>

        {/* Filtros de usuarios */}
        <View className="flex-row gap-2">
          {opciones.map((opcion) => {
            const activo = filtro === opcion;
            const nombre = opcion.charAt(0).toUpperCase() + opcion.slice(1);

            return (
              <Pressable
                key={opcion}
                onPress={() => setFiltro(opcion)}
                accessibilityRole="button"
                accessibilityLabel={`Mostrar ${opcion}`}
                accessibilityState={{ selected: activo }}
                className={`min-h-toque flex-1 items-center justify-center rounded-full px-3 active:opacity-80 ${
                  activo
                    ? 'bg-oficiar-blue-btn'
                    : 'border border-oficiar-dark/20 bg-white'
                }`}>
                <Text
                  className={`text-bento-body font-semibold ${
                    activo ? 'text-white' : 'text-oficiar-dark'
                  }`}>
                  {nombre}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Lista de usuarios */}
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-bento p-bento-in pb-10"
        ListEmptyComponent={
          <Text className="py-8 text-center text-bento-body text-oficiar-dark">
            {texto.trim()
              ? 'No hay usuarios que coincidan'
              : 'No hay usuarios registrados'}
          </Text>
        }
        renderItem={({ item }) => {
          const rol = getRol(item.roles);
          const isAdmin = item.roles[0]?.name === 'ROLE_ADMIN';

          return (
            <View className="gap-bento rounded-bento bg-white p-bento-in">
              <View className="flex-row items-center gap-bento">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-oficiar-dark">
                  <Text className="text-xl font-bold text-white">
                    {item.username.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View className="flex-1 gap-0.5">
                  <Text
                    className="text-bento-body font-semibold text-oficiar-very-dark"
                    numberOfLines={1}>
                    {item.username}
                  </Text>

                  <Text
                    className="text-bento-label text-oficiar-dark"
                    numberOfLines={1}>
                    {item.email}
                  </Text>

                  {item.telefono ? (
                    <Text className="text-bento-label text-oficiar-dark">
                      {item.telefono}
                    </Text>
                  ) : null}
                </View>

                <View className="items-end gap-1">
                  <Badge text={rol.label} variant={rol.variant} />
                  <Badge
                    text={item.active ? 'Activo' : 'Inactivo'}
                    variant={item.active ? 'green' : 'red'}
                  />
                </View>
              </View>

              {/* El administrador no se puede desactivar: no se muestra la opción */}
              {!isAdmin && (
                item.active ? (
                  <Button
                    text="Desactivar"
                    icono="person-remove-outline"
                    variant="danger"
                    accessibilityLabel={`Desactivar a ${item.username}`}
                    onPress={() => handleDesactivar(item)}
                  />
                ) : (
                  <Button
                    text="Reactivar"
                    icono="person-add-outline"
                    accessibilityLabel={`Reactivar a ${item.username}`}
                    onPress={() => handleReactivar(item)}
                  />
                )
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
