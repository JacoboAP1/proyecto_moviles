import { Pressable, Text, View } from 'react-native';

interface Item {
  id: number;
  label: string;
}

interface Props {
  label: string;
  items: Item[];
  selected: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

export default function ChipSelect({ label, items, selected, onChange, error }: Props) {
  const toggle = (id: number) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  return (
    <View className="gap-2">
      <Text className="text-bento-body font-semibold text-oficiar-very-dark">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => toggle(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className={`min-h-toque justify-center rounded-full px-bento-in active:opacity-80 ${
                active ? 'bg-oficiar-blue-btn' : 'border border-oficiar-dark/20 bg-white'
              }`}>
              <Text
                className={`text-bento-body ${active ? 'font-semibold text-white' : 'text-oficiar-very-dark'}`}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text className="text-bento-label text-peligro">{error}</Text>}
    </View>
  );
}