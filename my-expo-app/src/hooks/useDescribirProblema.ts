import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPerfiles } from '../api/perfiles';
import type { Perfil } from '../types';

type ProblemaForm = {
  descripcion: string;
  direccion: string;
};

// Vista 1: no llama al backend para crear; solo pasa los datos a la Vista 2
export function useDescribirProblema() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<ProblemaForm>({
    defaultValues: { descripcion: '', direccion: '' },
  });

  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loadingPerfiles, setLoadingPerfiles] = useState(true);
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [perfilError, setPerfilError] = useState('');

  useEffect(() => {
    getPerfiles()
      .then(setPerfiles)
      .catch(() => setPerfiles([]))
      .finally(() => setLoadingPerfiles(false));
  }, []);

  // ChipSelect permite varios; aquí se queda solo con el último que se tocó
  const elegirPerfil = (ids: number[]) => {
    setPerfilId(ids.length ? ids[ids.length - 1] : null);
    setPerfilError('');
  };

  const submit = ({ descripcion, direccion }: ProblemaForm) => {
    if (!perfilId) {
      setPerfilError('Elige el servicio que necesitas');
      return;
    }

    router.push({
      pathname: '/elegir-officer',
      params: {
        perfilId: String(perfilId),
        oficio: perfiles.find((p) => p.id === perfilId)?.oficio ?? '',
        descripcion: descripcion.trim(),
        direccion: direccion.trim(),
      },
    });
  };

  return {
    control,
    perfiles,
    loadingPerfiles,
    perfilId,
    elegirPerfil,
    perfilError,
    submit: handleSubmit(submit),
  };
}
