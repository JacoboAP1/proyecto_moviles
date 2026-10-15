import { Pressable, View } from 'react-native';
import { useDrawerMenu } from '../hooks/useDrawerMenu';

export default function MenuButton() {
  const { abrirMenu } = useDrawerMenu();

  return (
    <Pressable
      onPress={abrirMenu}
      accessibilityRole="button"
      accessibilityLabel="Abrir menú"
      hitSlop={12}
      className="gap-1.5 p-2 active:opacity-60">
      <View className="h-0.5 w-6 rounded-full bg-white" />
      <View className="h-0.5 w-6 rounded-full bg-white" />
      <View className="h-0.5 w-6 rounded-full bg-white" />
    </Pressable>
  );
}
