import { Drawer } from 'expo-router/drawer';
import DrawerMenu from '../../src/components/DrawerMenu';

export default function AdminLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="index" />
    </Drawer>
  );
}
