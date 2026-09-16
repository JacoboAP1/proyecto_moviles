import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Badge from '../src/components/Badge';
import Button from '../src/components/Button';
import Logo from '../src/components/Logo';
import TabOficios from '../src/components/TabOficios';
import TabUsuarios from '../src/components/TabUsuarios';
import TabRoles from '../src/components/TabRoles';
import { useSession } from '../src/session/context';

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

      {tab === 'oficios' && <TabOficios />}
      {tab === 'usuarios' && <TabUsuarios />}
      {tab === 'roles' && <TabRoles />}

      <View className="flex-row gap-3 border-t border-neutral-200 bg-white px-6 py-3">
        <View className="flex-1">
          <Button text="Perfil" onPress={() => router.push('/perfil')} variant="secondary" />
        </View>
        <View className="flex-1">
          <Button text="Cerrar sesion" onPress={signOut} variant="danger" />
        </View>
      </View>
    </View>
  );
}
