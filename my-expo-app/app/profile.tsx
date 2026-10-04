import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView, Text, View } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import Logo from '../src/components/Logo';
import { useSession } from '../src/session/context';
import { getMyProfile, updateProfile } from '../src/api/user';

type PerfilForm = { username: string; telefono: string };

export default function Perfil() {
  const { user, signOut } = useSession();
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset, formState } = useForm<PerfilForm>();

  useEffect(() => {
    getMyProfile().then((data) => {
      reset({
        username: data.username || '',
        telefono: data.telefono || '',
      });
      setLoading(false);
    });
  }, [reset]);

  const submit = async (data: PerfilForm) => {
    const { dirtyFields } = formState;
    const changes: Record<string, string> = {
      ...(dirtyFields.username ? { username: data.username } : {}),
      ...(dirtyFields.telefono ? { telefono: data.telefono } : {}),
    };

    if (Object.keys(changes).length === 0) {
      Alert.alert('Info', 'No hay cambios para guardar');
      return;
    }

    try {
      await updateProfile(changes);
      reset(data);
      Alert.alert('Listo', 'Perfil actualizado');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) return null;

  return (
    <View className="flex-1 bg-oficiar-gray">
      <View className="items-center gap-2 bg-oficiar-very-dark px-6 pb-5 pt-12">
        <Logo size="sm" light />
        <View className="mt-2 h-20 w-20 items-center justify-center rounded-full bg-oficiar-blue">
          <Text className="text-3xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text className="text-lg font-bold text-white">{user?.name}</Text>
        <Text className="text-sm text-oficiar-blue">{user?.email}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-5 gap-4">
        <Text className="text-xl font-extrabold text-oficiar-very-dark">
          Mi <Text className="text-oficiar-blue">informacion</Text>
        </Text>

        <Field
          control={control}
          name="username"
          label="Nombre"
          rules={{
            required: 'El nombre es obligatorio',
            maxLength: { value: 100, message: 'Máximo 100 caracteres' },
          }}
        />

        <View className="gap-1">
          <Text className="text-sm font-semibold text-neutral-500">Email</Text>
          <View className="rounded-xl bg-neutral-200 px-4 py-3">
            <Text className="text-neutral-500">{user?.email || ''}</Text>
          </View>
        </View>

        <Field
          control={control}
          name="telefono"
          label="Telefono"
          keyboardType="phone-pad"
          rules={{
            maxLength: { value: 20, message: 'Máximo 20 caracteres' },
          }}
        />

        <View className="mt-4 gap-3">
          <Button
            text={formState.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            onPress={handleSubmit(submit)}
            disabled={formState.isSubmitting}
          />
          <Button text="Cerrar sesion" onPress={signOut} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}
