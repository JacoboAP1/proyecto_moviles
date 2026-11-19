import { useHeaderHeight } from 'expo-router/react-navigation';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import Button from '../components/Button';
import Field from '../components/Field';
import Logo from '../components/Logo';
import { useSession } from '../session/context';
import { useLogout } from '../hooks/useLogout';
import { useProfile } from '../hooks/useProfile';
import { neutro, oficiar } from '../theme/tokens';

export default function Profile() {
  const { user } = useSession();
  const { logout } = useLogout();
  const {
    control,
    loading,
    fotoUrl,
    uploadingFoto,
    pickAndUploadImage,
    removeImage,
    submit,
    isSubmitting,
  } = useProfile();

  const headerHeight = useHeaderHeight();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-oficiar-gray">
        <ActivityIndicator size="large" color={oficiar.blue} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-oficiar-gray"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled">

        {/* Header con foto de perfil */}
        <View className="items-center gap-2 bg-oficiar-very-dark px-6 pb-5 pt-12">
          <Logo size="sm" light />

          <View className="relative mt-2">
            <Pressable
              onPress={pickAndUploadImage}
              disabled={uploadingFoto}
              accessibilityRole="button"
              accessibilityLabel="Cambiar foto de perfil"
              className="h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-oficiar-blue border-2 border-white">
              {uploadingFoto ? (
                <ActivityIndicator color={neutro.white} size="small" />
              ) : fotoUrl ? (
                <Image source={{ uri: fotoUrl }} className="h-full w-full" resizeMode="cover" />
              ) : (
                <Text className="text-3xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Botones de gestión de foto (tamaño de toque de 48 px) */}
          <View className="mt-2 flex-row gap-bento self-stretch">
            <Button
              text={fotoUrl ? 'Cambiar foto' : 'Subir foto'}
              icono="camera-outline"
              variant="secondary"
              onPress={pickAndUploadImage}
              disabled={uploadingFoto}
              className="flex-1"
            />
            {fotoUrl && (
              <Button
                text="Eliminar foto"
                icono="trash-outline"
                variant="danger"
                onPress={removeImage}
                disabled={uploadingFoto}
                className="flex-1"
              />
            )}
          </View>
        </View>

        <View className="gap-4 px-6 py-5">
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
              text="Guardar cambios"
              textoCargando="Guardando…"
              icono="save-outline"
              onPress={submit}
              cargando={isSubmitting}
            />
            <Button text="Cerrar sesión" icono="log-out-outline" onPress={logout} variant="secondary" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
