import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getAllUsers, reactivateUser, softDeleteUser, type UsuarioAdmin } from '../api/usuarios';
 
export function useUsers() {
    const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
    const [loading, setLoading] = useState(true);
 
    const cargarTodos = async () => {
        try {
        setUsuarios(await getAllUsers());
        } catch (error) {
        Alert.alert('Error', (error as Error).message);
        } finally {
        setLoading(false);
        }
    };
    
    useEffect(() => { cargarTodos(); }, []);
 
    const handleDesactivar = (u: UsuarioAdmin) => {
        Alert.alert(
        'Desactivar usuario',
        `¿Seguro que quieres desactivar a "${u.username}"?\n\nNo podra iniciar sesion hasta que se reactive.`,
        [
            { text: 'Cancelar', style: 'cancel' },
            {
            text: 'Desactivar',
            style: 'destructive',
            onPress: async () => {
                try {
                await softDeleteUser(u.id);
                await cargarTodos();
                Alert.alert('Listo', `"${u.username}" fue desactivado`);
                } catch (error) {
                Alert.alert('Error', (error as Error).message);
                }
            },
            },
        ],
        );
    };
 
    const handleReactivar = (u: UsuarioAdmin) => {
        Alert.alert(
        'Reactivar usuario',
        `¿Quieres reactivar a "${u.username}"?\n\nPodra volver a iniciar sesion.`,
        [
            { text: 'Cancelar', style: 'cancel' },
            {
            text: 'Reactivar',
            onPress: async () => {
                try {
                await reactivateUser(u.id);
                await cargarTodos();
                Alert.alert('Listo', `"${u.username}" fue reactivado`);
                } catch (error) {
                Alert.alert('Error', (error as Error).message);
                }
            },
            },
        ],
        );
    };
 
    const getRol = (roles: { name: string }[]) => {
        const name = roles[0]?.name ?? '';
        if (name === 'ROLE_ADMIN') return { label: 'Admin', variant: 'red' as const };
        if (name === 'ROLE_WORKER') return { label: 'Officer', variant: 'blue' as const };
        return { label: 'Cliente', variant: 'green' as const };
    };
 
    return {
        usuarios,
        setUsuarios,
        loading,
        cargarTodos,
        handleDesactivar,
        handleReactivar,
        getRol,
    };
}
