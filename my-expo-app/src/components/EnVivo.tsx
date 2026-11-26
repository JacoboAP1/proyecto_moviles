import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';

interface Props {
  conectado: boolean; // false = la última actualización falló
}

// Indicador "En vivo": el punto late mientras los números se actualizan solos (cada 10 s)
export default function EnVivo({ conectado }: Props) {
  // Se crea una sola vez y se reutiliza en cada render
  const [opacidad] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!conectado) {
      opacidad.setValue(1);
      return;
    }
    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidad, { toValue: 0.25, duration: 700, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    latido.start();
    return () => latido.stop();
  }, [conectado, opacidad]);

  return (
    <View
      accessibilityLabel={conectado ? 'Datos en vivo' : 'Sin conexión, mostrando los últimos datos'}
      className={`flex-row items-center gap-1.5 rounded-full px-3 py-1 ${
        conectado ? 'bg-exito-suave' : 'bg-peligro-suave'
      }`}>
      <Animated.View style={{ opacity: opacidad }}>
        <View className={`h-2 w-2 rounded-full ${conectado ? 'bg-exito' : 'bg-peligro'}`} />
      </Animated.View>
      <Text
        className={`text-bento-label font-semibold ${conectado ? 'text-exito-texto' : 'text-peligro'}`}>
        {conectado ? 'En vivo' : 'Sin conexión'}
      </Text>
    </View>
  );
}
