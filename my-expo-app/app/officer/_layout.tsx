import { Drawer } from 'expo-router/drawer';
import DrawerMenu from '../../src/components/DrawerMenu';

export default function OfficerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="index" />
    </Drawer>
  );
}
