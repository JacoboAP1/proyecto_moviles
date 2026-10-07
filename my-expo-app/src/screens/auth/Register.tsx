import { Link } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Button from '../../components/Button';
import ChipSelect from '../../components/ChipSelect';
import Field from '../../components/Field';
import { useRegister } from '../../hooks/useRegister';
 
export default function RegisterScreen() {
  const {
    isWorker,
    control,
    getValues,
    perfiles,
    selectedPerfiles,
    setSelectedPerfiles,
    perfilError,
    loadingPerfiles,
    submit,
    isSubmitting,
    error,
  } = useRegister();
  
  const headerHeight = useHeaderHeight();
 
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>

      <ScrollView
        className="flex-1 bg-neutral-50"
        contentContainerClassName="gap-5 p-6"
        keyboardShouldPersistTaps="handled">

        <View className="gap-1">
          <Text className="text-2xl font-bold text-neutral-900">
            {isWorker ? 'Regístrate como Officer' : 'Regístrate como Cliente'}
          </Text>
          <Text className="text-neutral-500">
            {isWorker
              ? 'Ofrece tus servicios profesionales'
              : 'Encuentra profesionales de confianza'}
          </Text>
        </View>
  
        <Field
          control={control}
          name="name"
          label="Nombre completo"
          autoCapitalize="words"
          placeholder="Tu nombre"
          rules={{
            required: 'El nombre es obligatorio',
            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            maxLength: { value: 100, message: 'Máximo 100 caracteres' },
          }}
        />

        <Field
          control={control}
          name="email"
          label="Correo"
          keyboardType="email-address"
          placeholder="tu@correo.com"
          rules={{
            required: 'El correo es obligatorio',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
            maxLength: { value: 150, message: 'Máximo 150 caracteres' },
          }}
        />

        <Field
          control={control}
          name="telefono"
          label="Teléfono"
          keyboardType="phone-pad"
          placeholder="3101234567"
          rules={{
            required: 'El teléfono es obligatorio',
            minLength: { value: 7, message: 'Mínimo 7 dígitos' },
            maxLength: { value: 20, message: 'Máximo 20 caracteres' },
          }}
        />

        <Field
          control={control}
          name="password"
          label="Contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={{
            required: 'La contraseña es obligatoria',
            minLength: { value: 4, message: 'Mínimo 4 caracteres' },
            maxLength: { value: 50, message: 'Máximo 50 caracteres' },
          }}
        />
        
        <Field
          control={control}
          name="confirm"
          label="Confirmar contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={{
            required: 'Confirma la contraseña',
            validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden',
          }}
        />
  
        {isWorker && (
          loadingPerfiles ? (
            <ActivityIndicator />
          ) : (
            <ChipSelect
              label="¿Qué oficios dominas?"
              items={perfiles.map((p) => ({ id: p.id, label: p.oficio }))}
              selected={selectedPerfiles}
              onChange={setSelectedPerfiles}
              error={perfilError}
            />
          )
        )}
  
        {!!error && (
          <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
            {error}
          </Text>
        )}
  
        <Button
          text={isSubmitting ? 'Creando…' : 'Crear cuenta'}
          onPress={submit}
          disabled={isSubmitting}
        />
  
        <Link href="/welcome" className="text-center text-blue-600">
          Volver al inicio
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
