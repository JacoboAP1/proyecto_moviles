import { Text, View } from 'react-native';

interface Props {
  texto: string;
  mio: boolean; // true = lo escribí yo (va a la derecha, en azul)
  hora: string; // ya formateada, ej: "3:05 p. m."
  autor: string; // para el lector de pantalla
}

// Burbuja Bento del chat. Contraste: blanco sobre azul de botón 4.9:1; texto oscuro sobre blanco 17.8:1
export default function BurbujaMensaje({ texto, mio, hora, autor }: Props) {
  return (
    <View
      accessible
      accessibilityLabel={`${mio ? 'Tú' : autor}: ${texto}. ${hora}`}
      className={`max-w-[80%] gap-1 rounded-bento px-bento-in py-2.5 ${
        mio ? 'self-end rounded-br-md bg-oficiar-blue-btn' : 'self-start rounded-bl-md bg-white'
      }`}>
      <Text className={`text-bento-body ${mio ? 'text-white' : 'text-oficiar-very-dark'}`}>{texto}</Text>
      <Text className={`self-end text-bento-label ${mio ? 'text-white' : 'text-oficiar-dark'}`}>{hora}</Text>
    </View>
  );
}
