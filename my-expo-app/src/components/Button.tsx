import { Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'yellow' | 'danger';

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  variant?: Variant;
  className?: string;
}

const bg: Record<Variant, string> = {
  primary: 'bg-oficiar-blue-btn',
  secondary: 'border border-oficiar-dark/20 bg-white',
  yellow: 'bg-oficiar-yellow',
  danger: 'bg-peligro-suave',
};

const fg: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-oficiar-very-dark',
  yellow: 'text-oficiar-very-dark',
  danger: 'text-peligro',
};

export default function Button({ text, onPress, disabled, secondary, variant, className }: Props) {
  const v: Variant = variant ?? (secondary ? 'secondary' : 'primary');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      className={`min-h-toque items-center justify-center rounded-boton px-bento-in active:opacity-80 disabled:opacity-50 ${bg[v]} ${className ?? ''}`}>
      <Text className={`text-bento-body font-semibold ${fg[v]}`}>
        {text}
      </Text>
    </Pressable>
  );
}