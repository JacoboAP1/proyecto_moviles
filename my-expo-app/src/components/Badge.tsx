import { Text, View } from 'react-native';

type Variant = 'red' | 'green' | 'blue' | 'neutral';

interface Props {
  text: string;
  variant?: Variant;
  size?: 'sm' | 'md';
}

const bgColor: Record<Variant, string> = {
  red: 'bg-red-100',
  green: 'bg-green-100',
  blue: 'bg-blue-100',
  neutral: 'bg-neutral-100',
};

const fgColor: Record<Variant, string> = {
  red: 'text-red-700',
  green: 'text-green-700',
  blue: 'text-blue-700',
  neutral: 'text-neutral-700',
};

export default function Badge({ text, variant = 'neutral', size = 'sm' }: Props) {
  // 12 px mínimo para que se lea bien
  const textSize = size === 'sm' ? 'text-bento-label' : 'text-sm';

  return (
    <View className={`rounded-full px-2.5 py-1 ${bgColor[variant]}`}>
      <Text className={`font-bold ${textSize} ${fgColor[variant]}`}>
        {text}
      </Text>
    </View>
  );
}
