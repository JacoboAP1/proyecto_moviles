import { Drawer } from 'expo-router/drawer';
import DrawerMenu from '../../src/components/DrawerMenu';
import { useAbrirAviso } from '../../src/hooks/useAbrirAviso';

export default function ClientLayout() {
  useAbrirAviso();
  
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="index" />
    </Drawer>
  );
}
