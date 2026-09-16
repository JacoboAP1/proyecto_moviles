import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import { useSession } from '../src/session/context';

type LoginForm = { email: string; password: string };

export default function Login() {
  const { signIn } = useSession();
  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const submit = async ({ email, password }: LoginForm) => {
    try {
      await signIn(email, password);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="flex-1 justify-center gap-5 p-6"
      keyboardShouldPersistTaps="handled">
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

      {!!formState.errors.root && (
        <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
          {formState.errors.root.message}
        </Text>
      )}

      <Button
        text={formState.isSubmitting ? 'Entrando…' : 'Entrar'}
        onPress={handleSubmit(submit)}
        disabled={formState.isSubmitting}
      />

      <Link href="/welcome" className="text-center text-blue-600">
        Volver al inicio
      </Link>
    </ScrollView>
  );
}
