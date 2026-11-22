import { ActivityIndicator, Modal, Text, View } from 'react-native';
import type { Entrada, TipoAviso } from '../session/alerta';
import { oficiar, peligro } from '../theme/tokens';
import Button from './Button';
import IconoBase, { type NombreIcono } from './Icono';

interface Props {
  entrada?: Entrada;
  onConfirmar: () => void;
  onCerrar: () => void;
}

// Cada tipo lleva ícono + color (nunca solo color)
const ICONO: Record<TipoAviso | 'pregunta' | 'peligro', { nombre: NombreIcono; color: string }> = {
  exito: { nombre: 'checkmark-circle', color: oficiar['blue-btn'] },
  error: { nombre: 'close-circle', color: peligro.DEFAULT },
  info: { nombre: 'information-circle', color: oficiar.dark },
  pregunta: { nombre: 'help-circle', color: oficiar['blue-btn'] },
  peligro: { nombre: 'alert-circle', color: peligro.DEFAULT },
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
          text={entrada.textoCancelar ?? 'Cancelar'}
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
  const { nombre, color } = ICONO[tipo];
  return <IconoBase nombre={nombre} tamano={56} color={color} />;
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
