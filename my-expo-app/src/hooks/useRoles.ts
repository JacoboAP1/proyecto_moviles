import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createRole, deleteRole, getRoles, type Role } from '../api/roles';
 
export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [nuevoRol, setNuevoRol] = useState('');
    const [submitting, setSubmitting] = useState(false);
 
    const cargarTodos = async () => {
        try {
        setRoles(await getRoles());
        } catch (error) {
        Alert.alert('Error', (error as Error).message);
        } finally {
        setLoading(false);
        }
    };
 
    useEffect(() => {
        cargarTodos();
    }, []);
 
    const normalizarNombre = (value: string) => {
        const nombre = value.trim().toUpperCase().replace(/\s+/g, '_');
        if (!nombre) return '';
        return nombre.startsWith('ROLE_') ? nombre : `ROLE_${nombre}`;
    };
    
    const nombreVisual = (name: string) => {
        return name.replace(/^ROLE_/, '').replace(/_/g, ' ');
    };
 
    const handleCrear = async () => {
        const nombre = normalizarNombre(nuevoRol);
        if (!nombre) {
        Alert.alert('Error', 'Escribe el nombre del rol');
        return;
        }
        if (nombre.length > 50) {
        Alert.alert('Error', 'El nombre del rol es demasiado largo');
        return;
        }
        setSubmitting(true);
        try {
        await createRole(nombre);
        setNuevoRol('');
        await cargarTodos();
        Alert.alert('Listo', `"${nombreVisual(nombre)}" fue agregado`);
        } catch (error) {
        Alert.alert('Error al crear', (error as Error).message);
        } finally {
        setSubmitting(false);
        }
    };
 
    const handleEliminar = (role: Role) => {
        Alert.alert(
        'Eliminar rol',
        `¿Seguro que quieres eliminar "${nombreVisual(role.name)}"?`,
        [
            { text: 'Cancelar', style: 'cancel' },
            {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
                try {
                await deleteRole(role.id);
                await cargarTodos();
                Alert.alert('Listo', `"${nombreVisual(role.name)}" fue eliminado`);
                } catch (error) {
                Alert.alert('No se pudo eliminar', (error as Error).message);
                }
            },
            },
        ],
        );
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
    };
}
