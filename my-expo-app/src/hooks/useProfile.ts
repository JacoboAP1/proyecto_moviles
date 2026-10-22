import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getMyProfile, updateProfile, uploadProfilePicture, deleteProfilePicture } from '../api/user';

type PerfilForm = { username: string; telefono: string };
 
export function useProfile() {
  const [loading, setLoading] = useState(true);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm<PerfilForm>();
 
  useEffect(() => {
    getMyProfile().then((data) => {
      reset({
        username: data.username || '',
        telefono: data.telefono || '',
      });
      if (data.fotoUrl) {
        setFotoUrl(data.fotoUrl);
      }
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      Alert.alert('Error', error.message || 'Error al cargar perfil');
    });
  }, [reset]);

  // Subir / Cambiar foto de perfil con expo-image-picker
  const pickAndUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar la foto de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Corte cuadrado para avatar
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      try {
        setUploadingFoto(true);
        const response = await uploadProfilePicture(result.assets[0].uri);
        setFotoUrl(response.fotoUrl);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'No se pudo subir la foto');
      } finally {
        setUploadingFoto(false);
      }
    }
  };

  // Eliminar foto de perfil
  const removeImage = async () => {
    try {
      setUploadingFoto(true);
      await deleteProfilePicture();
      setFotoUrl(null);
      Alert.alert('Éxito', 'Foto de perfil eliminada');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo eliminar la foto');
    } finally {
      setUploadingFoto(false);
    }
  };

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
 
  return {
    control,
    loading,
    fotoUrl,
    uploadingFoto,
    pickAndUploadImage,
    removeImage,
    submit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
  };
}
