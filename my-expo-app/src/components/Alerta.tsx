import { ActivityIndicator, Modal, Text, View } from 'react-native';
import type { Entrada, TipoAviso } from '../session/alerta';
import { oficiar } from '../theme/tokens';
import Button from './Button';

interface Props {
  entrada?: Entrada;
  onConfirmar: () => void;
  onCerrar: () => void;
}

// Cada tipo lleva símbolo + color (nunca solo color)
const ICONO: Record<TipoAviso | 'pregunta' | 'peligro', { simbolo: string; fondo: string; color: string }> = {
  exito: { simbolo: '✓', fondo: 'bg-oficiar-blue-btn', color: 'text-white' },
  error: { simbolo: '!', fondo: 'bg-peligro', color: 'text-white' },
  info: { simbolo: 'i', fondo: 'bg-oficiar-dark', color: 'text-white' },
  pregunta: { simbolo: '?', fondo: 'bg-oficiar-yellow', color: 'text-oficiar-very-dark' },
  peligro: { simbolo: '!', fondo: 'bg-peligro-suave', color: 'text-peligro' },
};

// Alerta propia de OficiAR: reemplaza a Alert.alert. Se maneja con useAlerta()
export default function Alerta({ entrada, onConfirmar, onCerrar }: Props) {
  return (
    <Modal
      visible={!!entrada}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCerrar}>
      <View className="flex-1 items-center justify-center bg-oficiar-very-dark/60 px-6">
        {entrada && (
          <View
            accessibilityViewIsModal
            className="w-full max-w-sm items-center gap-bento rounded-bento bg-white p-6">
            <Contenido entrada={entrada} onConfirmar={onConfirmar} onCerrar={onCerrar} />
          </View>
        )}
      </View>
    </Modal>
  );
}

function Contenido({ entrada, onConfirmar, onCerrar }: Props & { entrada: Entrada }) {
  if (entrada.tipoEntrada === 'proceso') {
    return (
      <>
        <ActivityIndicator size="large" color={oficiar['blue-btn']} />
        <Text
          accessibilityLiveRegion="polite"
          className="text-center text-bento-body font-semibold text-oficiar-very-dark">
          {entrada.textoCargando}
        </Text>
      </>
    );
  }

  if (entrada.tipoEntrada === 'aviso') {
    return (
      <>
        <Icono tipo={entrada.tipo ?? 'info'} />
        <Textos titulo={entrada.titulo} mensaje={entrada.mensaje} />
        <Button text={entrada.textoBoton ?? 'Entendido'} onPress={onCerrar} className="mt-2 self-stretch" />
      </>
    );
  }

  return (
    <>
      <Icono tipo={entrada.peligro ? 'peligro' : 'pregunta'} />
      <Textos titulo={entrada.titulo} mensaje={entrada.mensaje} />
      <View className="mt-2 flex-row gap-bento self-stretch">
        <Button
          text="Cancelar"
          variant="secondary"
          onPress={onCerrar}
          disabled={entrada.cargando}
          className="flex-1"
        />
        <Button
          text={entrada.textoConfirmar}
          textoCargando={entrada.textoCargando}
          variant={entrada.peligro ? 'danger' : 'primary'}
          onPress={onConfirmar}
          cargando={entrada.cargando}
          className="flex-1"
        />
      </View>
    </>
  );
}

function Icono({ tipo }: { tipo: keyof typeof ICONO }) {
  const { simbolo, fondo, color } = ICONO[tipo];
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      className={`h-14 w-14 items-center justify-center rounded-full ${fondo}`}>
      <Text className={`text-2xl font-bold ${color}`}>{simbolo}</Text>
    </View>
  );
}

function Textos({ titulo, mensaje }: { titulo: string; mensaje: string }) {
  return (
    <>
      <Text accessibilityRole="header" className="text-center text-bento-title font-bold text-oficiar-very-dark">
        {titulo}
      </Text>
      <Text accessibilityLiveRegion="polite" className="text-center text-bento-body text-oficiar-dark">
        {mensaje}
      </Text>
    </>
  );
}
