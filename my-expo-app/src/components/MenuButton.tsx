import { Pressable, View } from 'react-native';
import { useDrawerMenu } from '../hooks/useDrawerMenu';

export default function MenuButton() {
  const { abrirMenu } = useDrawerMenu();

  return (
    <Pressable
      onPress={abrirMenu}
      accessibilityRole="button"
      accessibilityLabel="Abrir menú"
      hitSlop={8}
      className="h-10 w-10 items-center justify-center gap-1.5 rounded-bento-sm bg-white/10 active:bg-white/20">
      <View className="h-0.5 w-5 rounded-full bg-white" />
      <View className="h-0.5 w-5 rounded-full bg-white" />
      <View className="ml-2.5 h-0.5 w-3.5 self-start rounded-full bg-white" />
    </Pressable>
  );
}
