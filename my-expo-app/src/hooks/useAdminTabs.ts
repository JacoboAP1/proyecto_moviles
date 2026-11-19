import { useState } from 'react';
import type { NombreIcono } from '../components/Icono';

type Tab = 'oficios' | 'usuarios' | 'roles';

export function useAdminTabs() {
  const [tab, setTab] = useState<Tab>('oficios');

  const tabs: { key: Tab; label: string; icono: NombreIcono }[] = [
    { key: 'oficios', label: 'Oficios', icono: 'construct-outline' },
    { key: 'usuarios', label: 'Usuarios', icono: 'people-outline' },
    { key: 'roles', label: 'Roles', icono: 'shield-checkmark-outline' },
  ];

  return { tab, setTab, tabs };
}
