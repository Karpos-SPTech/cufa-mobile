import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storageGetItem, storageRemoveItem } from "../lib/storage";
import * as authService from "../services/authService";
import { TOKEN_KEY } from "../services/api";
import { getUsuarioAtual } from "../services/usuariosService";
import type { UsuarioPerfil } from "../types/api";

type AuthContextValue = {
  ready: boolean;
  token: string | null;
  perfil: UsuarioPerfil | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshPerfil: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);

  const refreshPerfil = useCallback(async () => {
    const t = await storageGetItem(TOKEN_KEY);
    if (!t) {
      setPerfil(null);
      return;
    }
    try {
      const me = await getUsuarioAtual();
      setPerfil(me);
    } catch {
      setPerfil(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const t = await storageGetItem(TOKEN_KEY);
      setToken(t);
      if (t) {
        try {
          const me = await getUsuarioAtual();
          setPerfil(me);
        } catch {
          await storageRemoveItem(TOKEN_KEY);
          setToken(null);
        }
      }
      setReady(true);
    })();
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const res = await authService.login(email, senha);
    setToken(res.tokenJwt ?? (await storageGetItem(TOKEN_KEY)));
    await refreshPerfil();
  }, [refreshPerfil]);

  const register = useCallback(async (nome: string, email: string, senha: string) => {
    await authService.register(nome, email, senha);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setToken(null);
    setPerfil(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      token,
      perfil,
      login,
      register,
      logout,
      refreshPerfil,
    }),
    [ready, token, perfil, login, register, logout, refreshPerfil]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
