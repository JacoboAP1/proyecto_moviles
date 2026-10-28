import { useHeaderHeight } from 'expo-router/react-navigation';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Button from '../components/Button';
import ChipSelect from '../components/ChipSelect';
import Field from '../components/Field';
import { useDescribirProblema } from '../hooks/useDescribirProblema';

// Vista 1: el cliente describe el problema antes de elegir officer
export default function SolicitarServicio() {
  const {
    control,
    perfiles,
    loadingPerfiles,
    perfilId,
    elegirPerfil,
    perfilError,
    submit,
  } = useDescribirProblema();

  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>

      <ScrollView
        className="flex-1 bg-oficiar-gray"
        contentContainerClassName="gap-bento p-bento-in pb-10"
        keyboardShouldPersistTaps="handled">

        <View className="gap-1 px-1 pt-2">
          <Text className="text-2xl font-bold text-oficiar-very-dark">¿Qué necesitas?</Text>
          <Text className="text-bento-body text-oficiar-dark">
            Cuéntanos el problema y te mostramos los officers disponibles
          </Text>
        </View>

        {/* Bloque Bento 1: el servicio */}
        <View className="rounded-bento bg-white p-bento-in">
          {loadingPerfiles ? (
            <ActivityIndicator />
          ) : (
            <ChipSelect
              label="Servicio"
              items={perfiles.map((p) => ({ id: p.id, label: p.oficio }))}
              selected={perfilId ? [perfilId] : []}
              onChange={elegirPerfil}
              error={perfilError}
            />
          )}
        </View>

        {/* Bloque Bento 2: los detalles */}
        <View className="gap-bento rounded-bento bg-white p-bento-in">
          <Field
            control={control}
            name="descripcion"
            label="Describe el problema"
            placeholder="Ej: hay una fuga de agua debajo del lavaplatos"
            autoCapitalize="sentences"
            multiline
            textAlignVertical="top"
            style={{ minHeight: 110 }}
            rules={{
              required: 'Describe el problema',
              minLength: { value: 10, message: 'Mínimo 10 caracteres' },
              maxLength: { value: 500, message: 'Máximo 500 caracteres' },
            }}
          />

          <Field
            control={control}
            name="direccion"
            label="Dirección (opcional)"
            placeholder="Ej: Cra 23 # 45-10"
            autoCapitalize="sentences"
            rules={{ maxLength: { value: 255, message: 'Máximo 255 caracteres' } }}
          />
        </View>

        <Button text="Ver officers disponibles" onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
