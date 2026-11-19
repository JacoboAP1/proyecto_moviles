import { useEffect, useState } from 'react';
import { createRole, deleteRole, getRoles, type Role } from '../api/roles';
import { useAlerta } from '../session/alerta';

// Roles que el backend no deja editar ni eliminar (RoleService.ROLES_BASE)
const ROLES_BASE = ['ROLE_ADMIN', 'ROLE_WORKER', 'ROLE_CLIENT'];

export function useRoles() {
    const { avisar, confirmar } = useAlerta();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [nuevoRol, setNuevoRol] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const cargarTodos = async () => {
        try {
        setRoles(await getRoles());
        } catch (error) {
        avisar({ tipo: 'error', titulo: 'Error', mensaje: (error as Error).message });
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        let cancelado = false;
        getRoles()
        .then((data) => { if (!cancelado) setRoles(data); })
        .catch((error) => {
            if (!cancelado) avisar({ tipo: 'error', titulo: 'Error', mensaje: (error as Error).message });
        })
        .finally(() => { if (!cancelado) setLoading(false); });
        return () => { cancelado = true; };
    }, [avisar]);

    const normalizarNombre = (value: string) => {
        const nombre = value.trim().toUpperCase().replace(/\s+/g, '_');
        if (!nombre) return '';
        return nombre.startsWith('ROLE_') ? nombre : `ROLE_${nombre}`;
    };

    const nombreVisual = (name: string) => {
        return name.replace(/^ROLE_/, '').replace(/_/g, ' ');
    };

    const esRolBase = (role: Role) => ROLES_BASE.includes(role.name);

    const handleCrear = async () => {
        const nombre = normalizarNombre(nuevoRol);
        if (!nombre) {
        avisar({ tipo: 'error', titulo: 'Falta el nombre', mensaje: 'Escribe el nombre del rol' });
        return;
        }
        if (nombre.length > 50) {
        avisar({ tipo: 'error', titulo: 'Nombre muy largo', mensaje: 'El nombre del rol es demasiado largo' });
        return;
        }
        setSubmitting(true);
        try {
        await createRole(nombre);
        setNuevoRol('');
        await cargarTodos();
        avisar({ tipo: 'exito', titulo: 'Listo', mensaje: `"${nombreVisual(nombre)}" fue agregado` });
        } catch (error) {
        avisar({ tipo: 'error', titulo: 'Error al crear', mensaje: (error as Error).message });
        } finally {
        setSubmitting(false);
        }
    };

    const handleEliminar = (role: Role) => {
        confirmar({
        titulo: 'Eliminar rol',
        mensaje: `¿Seguro que quieres eliminar "${nombreVisual(role.name)}"?`,
        textoConfirmar: 'Eliminar',
        textoCargando: 'Eliminando…',
        peligro: true,
        tituloError: 'No se pudo eliminar',
        accion: async () => {
            await deleteRole(role.id);
            setRoles(await getRoles());
            return { titulo: 'Listo', mensaje: `"${nombreVisual(role.name)}" fue eliminado` };
        },
        });
    };

    return {
        roles,
        setRoles,
        loading,
        cargarTodos,
        nuevoRol,
        setNuevoRol,
        submitting,
        handleCrear,
        handleEliminar,
        normalizarNombre,
        nombreVisual,
        esRolBase,
    };
}
