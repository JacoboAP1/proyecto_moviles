import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getAllUsers, searchUsers, softDeleteUser, reactivateUser, type UsuarioAdmin } from '../api/usuarios';
import Badge from './Badge';

export default function TabUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState('');
  const [buscando, setBuscando] = useState(false);

  const cargarTodos = async () => {
    try {
      setUsuarios(await getAllUsers());
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const buscar = async () => {
    const q = texto.trim();
    if (!q) {
      cargarTodos();
      return;
    }
    setBuscando(true);
    try {
      setUsuarios(await searchUsers(q));
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => { cargarTodos(); }, []);

  const handleDesactivar = (u: UsuarioAdmin) => {
    Alert.alert(
      'Desactivar usuario',
      `¿Seguro que quieres desactivar a "${u.username}"?\n\nNo podra iniciar sesion hasta que se reactive.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: async () => {
            try {
              await softDeleteUser(u.id);
              await cargarTodos();
              Alert.alert('Listo', `"${u.username}" fue desactivado`);
            } catch (error) {
              Alert.alert('Error', (error as Error).message);
            }
          },
        },
      ],
    );
  };

  const handleReactivar = (u: UsuarioAdmin) => {
    Alert.alert(
      'Reactivar usuario',
      `¿Quieres reactivar a "${u.username}"?\n\nPodra volver a iniciar sesion.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reactivar',
          onPress: async () => {
            try {
              await reactivateUser(u.id);
              await cargarTodos();
              Alert.alert('Listo', `"${u.username}" fue reactivado`);
            } catch (error) {
              Alert.alert('Error', (error as Error).message);
            }
          },
        },
      ],
    );
  };

  const getRol = (roles: { name: string }[]) => {
    const name = roles[0]?.name ?? '';
    if (name === 'ROLE_ADMIN') return { label: 'Admin', variant: 'red' as const };
    if (name === 'ROLE_WORKER') return { label: 'Officer', variant: 'blue' as const };
    return { label: 'Cliente', variant: 'green' as const };
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#3D80B7" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row gap-2 border-b border-neutral-200 bg-white px-4 py-3">
        <TextInput
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
          placeholder="Buscar por nombre o email..."
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

      <FlatList
        data={usuarios}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="px-4 py-3 gap-2"
        ListEmptyComponent={
          <Text className="py-8 text-center text-neutral-400">
            {texto.trim() ? 'No hay usuarios que coincidan' : 'No hay usuarios registrados'}
          </Text>
        }
        renderItem={({ item }) => {
          const rol = getRol(item.roles);
          const isAdmin = item.roles[0]?.name === 'ROLE_ADMIN';
          return (
            <View className={`rounded-xl bg-white px-4 py-3 ${!item.active ? 'opacity-50' : ''}`}>
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-oficiar-dark">
                  <Text className="text-lg font-bold text-white">
                    {item.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-oficiar-very-dark" numberOfLines={1}>
                    {item.username}
                  </Text>
                  <Text className="text-xs text-neutral-400" numberOfLines={1}>
                    {item.email}
                  </Text>
                </View>
                <Badge text={rol.label} variant={rol.variant} />
              </View>

              <View className="mt-2 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Badge
                    text={item.active ? 'Activo' : 'Inactivo'}
                    variant={item.active ? 'green' : 'red'}
                  />
                  {item.telefono ? (
                    <Text className="text-xs text-neutral-400">{item.telefono}</Text>
                  ) : null}
                </View>

                {!isAdmin && (
                  item.active ? (
                    <Pressable
                      onPress={() => handleDesactivar(item)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 active:opacity-80">
                      <Text className="text-xs font-semibold text-red-600">Desactivar</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => handleReactivar(item)}
                      className="rounded-lg bg-green-50 px-3 py-1.5 active:opacity-80">
                      <Text className="text-xs font-semibold text-green-600">Reactivar</Text>
                    </Pressable>
                  )
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
