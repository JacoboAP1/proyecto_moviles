import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { getMyProfile, updateProfile } from '../api/user';
 
type PerfilForm = { username: string; telefono: string };
 
export function useProfile() {
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
 
  return {
    control,
    loading,
    submit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
  };
}
