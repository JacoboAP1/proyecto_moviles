import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { neutro } from '../theme/tokens';
import Icono from './Icono';

interface Props {
  onEnviar: (texto: string) => Promise<boolean>; // true = se envió y se limpia el campo
  enviando: boolean;
  cerrado?: string; // si viene, el chat es de solo lectura y se muestra este texto
}

const MAX_CARACTERES = 1000;

// Barra de abajo del chat: campo de texto + botón de enviar (48 px, con nombre para el lector de pantalla)
export default function CampoMensaje({ onEnviar, enviando, cerrado }: Props) {
  const [texto, setTexto] = useState('');
  const limpio = texto.trim();

  if (cerrado) {
    return (
      <View className="border-t border-oficiar-dark/10 bg-white px-bento-in py-3">
        <Text className="text-center text-bento-label text-oficiar-dark">{cerrado}</Text>
      </View>
    );
  }

  const enviar = async () => {
    if (!limpio || enviando) return;
    if (await onEnviar(limpio)) setTexto('');
  };

  return (
    <View className="flex-row items-end gap-2 border-t border-oficiar-dark/10 bg-white px-3 py-2">
      <TextInput
        className="max-h-32 min-h-toque flex-1 rounded-bento-sm border border-oficiar-dark/20 px-bento-in py-3 text-bento-body text-oficiar-very-dark"
        placeholder="Escribe un mensaje"
        placeholderTextColor={neutro.placeholder}
        accessibilityLabel="Mensaje"
        value={texto}
        onChangeText={setTexto}
        maxLength={MAX_CARACTERES}
        multiline
      />
      <Pressable
        onPress={enviar}
        disabled={!limpio || enviando}
        accessibilityRole="button"
        accessibilityLabel="Enviar mensaje"
        accessibilityState={{ disabled: !limpio || enviando, busy: enviando }}
        className="h-12 w-12 items-center justify-center rounded-full bg-oficiar-blue-btn active:opacity-80 disabled:opacity-50">
        {enviando ? (
          <ActivityIndicator color={neutro.white} />
        ) : (
          <Icono nombre="send" tamano={20} color={neutro.white} />
        )}
      </Pressable>
    </View>
  );
}
