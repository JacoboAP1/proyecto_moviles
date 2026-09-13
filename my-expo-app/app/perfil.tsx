import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import Button from '../src/components/Button';
import Logo from '../src/components/Logo';
import { useSession } from '../src/session/context';
import { getMyProfile, updateProfile } from '../src/api/user';

export default function Perfil() {
  const { user, signOut } = useSession();
  const [username, setUsername] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile().then((data) => {
      setUsername(data.username || '');
      setTelefono(data.telefono || '');
      setLoading(false);
    });
  }, []);

  const handleGuardar = async () => {
    try {
      await updateProfile({ username, telefono });
      Alert.alert('Listo', 'Perfil actualizado');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) return null;

  return (
    <View className="flex-1 bg-oficiar-gray">
      <View className="items-center gap-2 bg-oficiar-very-dark px-6 pb-5 pt-12">
        <Logo size="sm" light />
        <View className="mt-2 h-20 w-20 items-center justify-center rounded-full bg-oficiar-blue">
          <Text className="text-3xl font-bold text-white">
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-lg font-bold text-white">{username}</Text>
        <Text className="text-sm text-oficiar-blue">{user?.email}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-5 gap-4">
        <Text className="text-xl font-extrabold text-oficiar-very-dark">
          Mi <Text className="text-oficiar-blue">informacion</Text>
        </Text>

        <View className="gap-1">
          <Text className="text-sm font-semibold text-neutral-500">Nombre</Text>
          <TextInput
            className="rounded-xl bg-white px-4 py-3 text-oficiar-very-dark"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-semibold text-neutral-500">Email</Text>
          <TextInput
            className="rounded-xl bg-neutral-200 px-4 py-3 text-neutral-500"
            value={user?.email || ''}
            editable={false}
          />
        </View>

        <View className="gap-1">
          <Text className="text-sm font-semibold text-neutral-500">Telefono</Text>
          <TextInput
            className="rounded-xl bg-white px-4 py-3 text-oficiar-very-dark"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mt-4 gap-3">
          <Button text="Guardar cambios" onPress={handleGuardar} />
          <Button text="Cerrar sesion" onPress={signOut} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}