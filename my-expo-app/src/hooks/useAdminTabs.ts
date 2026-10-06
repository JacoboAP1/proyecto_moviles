import { useState } from 'react';

type Tab = 'oficios' | 'usuarios' | 'roles';

export function useAdminTabs() {
  const [tab, setTab] = useState<Tab>('oficios');

  const tabs = [
    { key: 'oficios' as Tab, label: 'Oficios' },
    { key: 'usuarios' as Tab, label: 'Usuarios' },
    { key: 'roles' as Tab, label: 'Roles' },
  ];

  return { tab, setTab, tabs };
}
