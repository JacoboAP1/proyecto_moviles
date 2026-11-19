import { ActivityIndicator, Pressable, Text } from 'react-native';
import { neutro, oficiar, peligro } from '../theme/tokens';
import Icono, { type NombreIcono } from './Icono';

type Variant = 'primary' | 'secondary' | 'yellow' | 'danger';

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  variant?: Variant;
  className?: string;
  // Muestra el spinner y bloquea el botón mientras espera al servidor
  cargando?: boolean;
  textoCargando?: string;
  accessibilityLabel?: string;
  icono?: NombreIcono;
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

// Color del spinner y del ícono (el mismo del texto)
const contenido: Record<Variant, string> = {
  primary: neutro.white,
  secondary: oficiar['very-dark'],
  yellow: oficiar['very-dark'],
  danger: peligro.DEFAULT,
};

export default function Button({
  text,
  onPress,
  disabled,
  secondary,
  variant,
  className,
  cargando,
  textoCargando,
  accessibilityLabel,
  icono,
}: Props) {
  const v: Variant = variant ?? (secondary ? 'secondary' : 'primary');
  const bloqueado = !!disabled || !!cargando;

  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: bloqueado, busy: !!cargando }}
      className={`min-h-toque flex-row items-center justify-center gap-2 rounded-boton px-bento-in active:opacity-80 disabled:opacity-50 ${bg[v]} ${className ?? ''}`}>
      {cargando ? (
        <ActivityIndicator size="small" color={contenido[v]} />
      ) : (
        icono && <Icono nombre={icono} tamano={20} color={contenido[v]} />
      )}
      <Text className={`text-bento-body font-semibold ${fg[v]}`}>
        {cargando ? (textoCargando ?? text) : text}
      </Text>
    </Pressable>
  );
}
