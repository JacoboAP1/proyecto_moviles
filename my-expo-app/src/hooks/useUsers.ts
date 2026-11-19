import { useEffect, useState } from 'react';
import { getAllUsers, reactivateUser, softDeleteUser, type UsuarioAdmin } from '../api/usuarios';
import { useAlerta } from '../session/alerta';

export function useUsers() {
    const { avisar, confirmar } = useAlerta();
    const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
    const [loading, setLoading] = useState(true);

    const cargarTodos = async () => {
        try {
        setUsuarios(await getAllUsers());
        } catch (error) {
        avisar({ tipo: 'error', titulo: 'Error', mensaje: (error as Error).message });
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        let cancelado = false;
        getAllUsers()
        .then((data) => { if (!cancelado) setUsuarios(data); })
        .catch((error) => {
            if (!cancelado) avisar({ tipo: 'error', titulo: 'Error', mensaje: (error as Error).message });
        })
        .finally(() => { if (!cancelado) setLoading(false); });
        return () => { cancelado = true; };
    }, [avisar]);

    // La alerta queda cargando (y bloquea la pantalla) hasta que el servidor responde
    const handleDesactivar = (u: UsuarioAdmin) => {
        confirmar({
        titulo: 'Desactivar usuario',
        mensaje: `¿Seguro que quieres desactivar a "${u.username}"?\n\nNo podrá iniciar sesión hasta que se reactive.`,
        textoConfirmar: 'Desactivar',
        textoCargando: 'Desactivando…',
        peligro: true,
        tituloError: 'No se pudo desactivar',
        accion: async () => {
            await softDeleteUser(u.id);
            setUsuarios(await getAllUsers());
            return { titulo: 'Listo', mensaje: `"${u.username}" fue desactivado` };
        },
        });
    };

    const handleReactivar = (u: UsuarioAdmin) => {
        confirmar({
        titulo: 'Reactivar usuario',
        mensaje: `¿Quieres reactivar a "${u.username}"?\n\nPodrá volver a iniciar sesión.`,
        textoConfirmar: 'Reactivar',
        textoCargando: 'Reactivando…',
        tituloError: 'No se pudo reactivar',
        accion: async () => {
            await reactivateUser(u.id);
            setUsuarios(await getAllUsers());
            return { titulo: 'Listo', mensaje: `"${u.username}" fue reactivado` };
        },
        });
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
