import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Badge from '../components/Badge';
import Icono from '../components/Icono';
import Logo from '../components/Logo';
import MenuButton from '../components/MenuButton';
import TradeList from '../components/admin/TradeList';
import UserList from '../components/admin/UserList';
import RoleList from '../components/admin/RoleList';
import { useSession } from '../session/context';
import { useAdminTabs } from '../hooks/useAdminTabs';
import { oficiar } from '../theme/tokens';

export default function Admin() {
  const { user } = useSession();
  const { tab, setTab, tabs } = useAdminTabs();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-oficiar-gray">
      <View
        className="gap-1 bg-oficiar-very-dark px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center">
          <View className="w-10">
            <MenuButton />
          </View>
          <View className="flex-1 items-center">
            <Logo size="sm" light />
          </View>
          <View className="w-10" />
        </View>
        <View className="items-center gap-1">
          <Text className="text-lg font-bold text-white">
            Hola, {user?.name}
          </Text>
          <Badge text="Administrador" variant="red" size="md" />
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {tab === 'oficios' && <TradeList />}
        {tab === 'usuarios' && <UserList />}
        {tab === 'roles' && <RoleList />}
      </KeyboardAvoidingView>

      <View
        className="flex-row border-t border-oficiar-dark/10 bg-white"
        style={{ paddingBottom: insets.bottom }}>
        {tabs.map((t) => {
          const activa = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}
              className="min-h-toque flex-1 items-center pb-4 active:opacity-70">
              <View
                className={`mb-2 h-1 w-12 rounded-b-full ${activa ? 'bg-oficiar-blue-btn' : 'bg-transparent'}`}
              />
              <Icono
                nombre={t.icono}
                tamano={24}
                color={activa ? oficiar['blue-btn'] : oficiar.dark}
              />
              <Text
                className={`text-bento-body font-semibold ${activa ? 'text-oficiar-blue-btn' : 'text-oficiar-dark'}`}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
