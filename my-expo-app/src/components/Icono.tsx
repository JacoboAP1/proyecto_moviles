import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { oficiar } from '../theme/tokens';

export type NombreIcono = ComponentProps<typeof Ionicons>['name'];

interface Props {
  nombre: NombreIcono;
  tamano?: number;
  color?: string;
}

// Íconos de la app (Ionicons). Son decorativos: el significado lo da el texto que los acompaña
export default function Icono({ nombre, tamano = 22, color = oficiar['very-dark'] }: Props) {
  return (
    <Ionicons
      name={nombre}
      size={tamano}
      color={color}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
