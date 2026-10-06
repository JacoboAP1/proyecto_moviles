import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Logo from '../components/Logo';
import TradeList from '../components/admin/TradeList';
import UserList from '../components/admin/UserList';
import RoleList from '../components/admin/RoleList';
import { useSession } from '../session/context';

type Tab = 'oficios' | 'usuarios' | 'roles';

export default function Admin() {
  const { user, signOut } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('oficios');

  return (
    <View className="flex-1 bg-oficiar-gray">
      <View className="items-center gap-1 bg-oficiar-very-dark px-6 pb-2 pt-12">
        <Logo size="sm" light />
        <Text className="text-lg font-bold text-white">
          Hola, {user?.name}
        </Text>
        <Badge text="Administrador" variant="red" size="md" />
      </View>

      <View className="flex-row bg-oficiar-dark">
        {(['oficios', 'usuarios', 'roles'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            className={`flex-1 items-center py-3 ${
              tab === t ? 'border-b-2 border-oficiar-blue' : ''
            }`}>
            <Text
              className={`text-sm font-semibold ${
                tab === t ? 'text-oficiar-blue' : 'text-white/50'
              }`}>
              {t === 'oficios' ? 'Oficios' : t === 'usuarios' ? 'Usuarios' : 'Roles'}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'oficios' && <TradeList />}
      {tab === 'usuarios' && <UserList />}
      {tab === 'roles' && <RoleList />}

      <View className="flex-row gap-3 border-t border-neutral-200 bg-white px-6 py-3">
        <View className="flex-1">
          <Button text="Perfil" onPress={() => router.push('/profile')} variant="secondary" />
        </View>
        <View className="flex-1">
          <Button text="Cerrar sesion" onPress={() => {
            Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sí, salir', style: 'destructive', onPress: signOut },
            ]);
          }} variant="danger" />
        </View>
      </View>
    </View>
  );
}
