import { createContext, use, useState, type PropsWithChildren } from 'react';
import * as api from '../api/auth';
import { setToken } from '../api/client';
import { getMyProfile } from '../api/user';
import type { Role, User } from '../types';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  telefono: string;
  role: Role;
  perfilIds?: number[];
}

interface Session {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
}

const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession debe usarse dentro de <SessionProvider />');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const session = await api.login(email.trim().toLowerCase(), password);
    setToken(session.token);
    const profile = await getMyProfile();
    setUser({
      name: profile.username,
      email: profile.email,
      telefono: profile.telefono,
      roles: session.roles,
    });
  };

  const signUp = async (data: SignUpData) => {
    const session = await api.register({
      username: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      telefono: data.telefono.trim(),
      roles: [data.role],
      perfilIds: data.perfilIds,
    });
    setToken(session.token);
    setUser({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      telefono: data.telefono.trim(),
      roles: session.roles,
    });
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <SessionContext value={{ user, signIn, signUp, signOut }}>
      {children}
    </SessionContext>
  );
}
