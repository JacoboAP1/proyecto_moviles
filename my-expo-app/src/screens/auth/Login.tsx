import { Link } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import Button from '../../components/Button';
import Field from '../../components/Field';
import { useLogin } from '../../hooks/useLogin';

export default function LoginScreen() {
  const { control, submit, isSubmitting, error } = useLogin();
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center gap-5 bg-neutral-50 p-6"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>
      <View className="gap-1">
        <Text className="text-2xl font-bold text-neutral-900">Oficiar</Text>
        <Text className="text-neutral-500">Inicia sesión con tu cuenta</Text>
      </View>

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
        name="password"
        label="Contraseña"
        secureTextEntry
        placeholder="••••••••"
        rules={{
          required: 'La contraseña es obligatoria',
          maxLength: { value: 50, message: 'Máximo 50 caracteres' },
        }}
      />

      {!!error && (
        <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
          {error}
        </Text>
      )}

      <Button
        text={isSubmitting ? 'Entrando…' : 'Entrar'}
        onPress={submit}
        disabled={isSubmitting}
      />

      <Link href="/welcome" className="text-center text-blue-600">
        Volver al inicio
      </Link>
    </KeyboardAvoidingView>
  );
}
