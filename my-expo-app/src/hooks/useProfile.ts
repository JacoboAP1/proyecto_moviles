import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { getMyProfile, updateProfile, uploadProfilePicture, deleteProfilePicture } from '../api/user';
import { useAlerta } from '../session/alerta';

type PerfilForm = { username: string; telefono: string };

export function useProfile() {
  const { avisar, confirmar, procesar } = useAlerta();
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
      avisar({ tipo: 'error', titulo: 'Error', mensaje: error.message || 'Error al cargar perfil' });
    });
  }, [reset, avisar]);

  // Subir / Cambiar foto de perfil con expo-image-picker
  const pickAndUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      avisar({
        tipo: 'info',
        titulo: 'Permiso requerido',
        mensaje: 'Se necesita acceso a la galería para cambiar la foto de perfil.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Corte cuadrado para avatar
      quality: 0.5,
      allowsMultipleSelection: false,
    });

    const uri = result.canceled ? undefined : result.assets[0]?.uri;
    if (!uri) return;

    // La carga bloquea la pantalla hasta que Cloudinary responde
    procesar({
      textoCargando: 'Subiendo foto…',
      tituloError: 'No se pudo subir la foto',
      accion: async () => {
        setUploadingFoto(true);
        try {
          const response = await uploadProfilePicture(uri);
          setFotoUrl(response.fotoUrl);
          return { titulo: 'Listo', mensaje: 'Foto de perfil actualizada correctamente' };
        } finally {
          setUploadingFoto(false);
        }
      },
    });
  };

  // Eliminar foto de perfil
  const removeImage = () => {
    confirmar({
      titulo: 'Eliminar foto',
      mensaje: '¿Quieres quitar tu foto de perfil?',
      textoConfirmar: 'Eliminar',
      textoCargando: 'Eliminando…',
      peligro: true,
      tituloError: 'No se pudo eliminar la foto',
      accion: async () => {
        setUploadingFoto(true);
        try {
          await deleteProfilePicture();
          setFotoUrl(null);
          return { titulo: 'Listo', mensaje: 'Foto de perfil eliminada' };
        } finally {
          setUploadingFoto(false);
        }
      },
    });
  };

  const submit = async (data: PerfilForm) => {
    const { dirtyFields } = formState;
    const changes: Record<string, string> = {
      ...(dirtyFields.username ? { username: data.username } : {}),
      ...(dirtyFields.telefono ? { telefono: data.telefono } : {}),
    };

    if (Object.keys(changes).length === 0) {
      avisar({ tipo: 'info', titulo: 'Sin cambios', mensaje: 'No hay cambios para guardar' });
      return;
    }

    try {
      await updateProfile(changes);
      reset(data);
      avisar({ tipo: 'exito', titulo: 'Listo', mensaje: 'Perfil actualizado' });
    } catch (error: any) {
      avisar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: error.message });
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
