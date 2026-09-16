import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Button from '../src/components/Button';
import ChipSelect from '../src/components/ChipSelect';
import Field from '../src/components/Field';
import { getPerfiles } from '../src/api/perfiles';
import { useSession } from '../src/session/context';
import type { Perfil, Role } from '../src/types';

type RegisterForm = {
  name: string;
  email: string;
  telefono: string;
  password: string;
  confirm: string;
};

export default function Register() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const selectedRole: Role = role === 'WORKER' ? 'ROLE_WORKER' : 'ROLE_CLIENT';
  const isWorker = selectedRole === 'ROLE_WORKER';

  const { signUp } = useSession();
  const { control, handleSubmit, setError, getValues, formState } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', telefono: '', password: '', confirm: '' },
  });

  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [selectedPerfiles, setSelectedPerfiles] = useState<number[]>([]);
  const [perfilError, setPerfilError] = useState('');
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);

  useEffect(() => {
    if (!isWorker) return;
    setLoadingPerfiles(true);
    getPerfiles()
      .then(setPerfiles)
      .catch(() => setPerfiles([]))
      .finally(() => setLoadingPerfiles(false));
  }, [isWorker]);

  const submit = async ({ name, email, telefono, password }: RegisterForm) => {
    if (isWorker && selectedPerfiles.length === 0) {
      setPerfilError('Selecciona al menos un oficio');
      return;
    }
    setPerfilError('');

    try {
      await signUp({
        name,
        email,
        password,
        telefono,
        role: selectedRole,
        perfilIds: isWorker ? selectedPerfiles : undefined,
      });
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  return (
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

      {!!formState.errors.root && (
        <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
          {formState.errors.root.message}
        </Text>
      )}

      <Button
        text={formState.isSubmitting ? 'Creando…' : 'Crear cuenta'}
        onPress={handleSubmit(submit)}
        disabled={formState.isSubmitting}
      />

      <Link href="/welcome" className="text-center text-blue-600">
        Volver al inicio
      </Link>
    </ScrollView>
  );
}
