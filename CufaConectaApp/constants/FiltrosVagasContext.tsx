import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { Publicacao } from "../types/api";

export type ContratosFiltro = {
  CLT: boolean;
  PJ: boolean;
  FreeLancer: boolean;
  Estagio: boolean;
};

export type FiltrosVagasState = {
  contratos: ContratosFiltro;
  /** km — reservado para quando a API tiver localização */
  distanciaKm: [number, number];
  horarioFlexivel: boolean;
  vestimentaLivre: boolean;
};

const defaultContratos: ContratosFiltro = {
  CLT: true,
  PJ: true,
  FreeLancer: true,
  Estagio: true,
};

const defaultState: FiltrosVagasState = {
  contratos: { ...defaultContratos },
  distanciaKm: [0, 100],
  horarioFlexivel: false,
  vestimentaLivre: true,
};

function normalizarTipoContrato(raw: string | null | undefined): string {
  return (raw ?? "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Retorna true se a publicação passa no filtro de tipo de contrato. */
export function publicacaoPassaNoFiltroContrato(
  p: Publicacao,
  contratos: ContratosFiltro
): boolean {
  const anyOn =
    contratos.CLT || contratos.PJ || contratos.FreeLancer || contratos.Estagio;
  const allOn =
    contratos.CLT && contratos.PJ && contratos.FreeLancer && contratos.Estagio;
  if (!anyOn || allOn) return true;

  const t = normalizarTipoContrato(p.tipoContrato);
  if (!t) return false;

  if (contratos.CLT && t.includes("CLT")) return true;
  if (contratos.PJ && (t.includes("PJ") || t.includes("PESSOA JUR"))) return true;
  if (
    contratos.FreeLancer &&
    (t.includes("FREE") ||
      t.includes("LANC") ||
      t.includes("AUTONOMO") ||
      t.includes("MEI") ||
      t.includes("TERC"))
  )
    return true;
  if (contratos.Estagio && t.includes("ESTAG")) return true;

  return false;
}

type FiltrosVagasContextValue = {
  filtros: FiltrosVagasState;
  setFiltros: (patch: Partial<FiltrosVagasState>) => void;
  setContratos: (c: ContratosFiltro) => void;
  resetFiltros: () => void;
};

const FiltrosVagasContext = createContext<FiltrosVagasContextValue | null>(null);

export function FiltrosVagasProvider({ children }: { children: React.ReactNode }) {
  const [filtros, setFiltrosState] = useState<FiltrosVagasState>({ ...defaultState });

  const setFiltros = useCallback((patch: Partial<FiltrosVagasState>) => {
    setFiltrosState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setContratos = useCallback((contratos: ContratosFiltro) => {
    setFiltrosState((prev) => ({ ...prev, contratos }));
  }, []);

  const resetFiltros = useCallback(() => {
    setFiltrosState({ ...defaultState, contratos: { ...defaultContratos } });
  }, []);

  const value = useMemo<FiltrosVagasContextValue>(
    () => ({
      filtros,
      setFiltros,
      setContratos,
      resetFiltros,
    }),
    [filtros, setFiltros, setContratos, resetFiltros]
  );

  return <FiltrosVagasContext.Provider value={value}>{children}</FiltrosVagasContext.Provider>;
}

export function useFiltrosVagas() {
  const ctx = useContext(FiltrosVagasContext);
  if (!ctx) {
    throw new Error("useFiltrosVagas deve ser usado dentro de FiltrosVagasProvider");
  }
  return ctx;
}
