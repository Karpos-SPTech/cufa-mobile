import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storageGetItem } from "../lib/storage";
import * as candidaturasApi from "../services/candidaturasService";
import { TOKEN_KEY } from "../services/api";
import type { PublicacaoResumo } from "../types/api";

type VagasContextValue = {
  candidaturas: PublicacaoResumo[];
  loadingCandidaturas: boolean;
  refreshCandidaturas: () => Promise<void>;
  candidatar: (publicacaoId: number, empresaId: number) => Promise<void>;
  appliedPublicacaoIds: Set<number>;
};

const VagasContext = createContext<VagasContextValue | null>(null);

export function VagasProvider({ children }: { children: React.ReactNode }) {
  const [candidaturas, setCandidaturas] = useState<PublicacaoResumo[]>([]);
  const [loadingCandidaturas, setLoadingCandidaturas] = useState(false);

  const refreshCandidaturas = useCallback(async () => {
    const t = await storageGetItem(TOKEN_KEY);
    if (!t) {
      setCandidaturas([]);
      return;
    }
    setLoadingCandidaturas(true);
    try {
      const list = await candidaturasApi.listarCandidaturasDoUsuario();
      setCandidaturas(list);
    } catch {
      setCandidaturas([]);
    } finally {
      setLoadingCandidaturas(false);
    }
  }, []);

  useEffect(() => {
    refreshCandidaturas();
  }, [refreshCandidaturas]);

  const candidatar = useCallback(
    async (publicacaoId: number, empresaId: number) => {
      await candidaturasApi.criarCandidatura(publicacaoId, empresaId);
      await refreshCandidaturas();
    },
    [refreshCandidaturas]
  );

  const appliedPublicacaoIds = useMemo(
    () =>
      new Set(
        candidaturas
          .map((c) => Number(c.publicacaoId))
          .filter((id) => Number.isFinite(id) && id > 0)
      ),
    [candidaturas]
  );

  const value = useMemo<VagasContextValue>(
    () => ({
      candidaturas,
      loadingCandidaturas,
      refreshCandidaturas,
      candidatar,
      appliedPublicacaoIds,
    }),
    [candidaturas, loadingCandidaturas, refreshCandidaturas, candidatar, appliedPublicacaoIds]
  );

  return <VagasContext.Provider value={value}>{children}</VagasContext.Provider>;
}

export function useVagas() {
  const ctx = useContext(VagasContext);
  if (!ctx) {
    throw new Error("useVagas deve ser usado dentro de VagasProvider");
  }
  return ctx;
}
