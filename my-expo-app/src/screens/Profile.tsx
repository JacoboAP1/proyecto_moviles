import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import Logo from '../components/Logo';
import { useSession } from '../session/context';
import { useLogout } from '../hooks/useLogout';
import { useProfile } from '../hooks/useProfile';
 
export default function Profile() {
  const { user } = useSession();
  const { logout } = useLogout();
  const { control, loading, submit, isSubmitting } = useProfile();
 
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
 
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
            text={isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            onPress={submit}
            disabled={isSubmitting}
          />
          <Button text="Cerrar sesion" onPress={logout} variant="secondary" />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
