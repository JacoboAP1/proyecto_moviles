import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPerfiles } from '../api/perfiles';
import { useSession } from '../session/context';
import type { Perfil, Role } from '../types';
 
type RegisterForm = {
    name: string;
    email: string;
    telefono: string;
    password: string;
    confirm: string;
};
 
export function useRegister() {
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
 
    return {
        isWorker,
        control,
        getValues,
        perfiles,
        selectedPerfiles,
        setSelectedPerfiles,
        perfilError,
        loadingPerfiles,
        submit: handleSubmit(submit),
        isSubmitting: formState.isSubmitting,
        error: formState.errors.root?.message ?? null,
    };
}
