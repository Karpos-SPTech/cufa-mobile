import type { PublicacaoResumo } from "../types/api";
import { api } from "./api";

export async function listarCandidaturasDoUsuario() {
  const { data } = await api.get<PublicacaoResumo[]>("/candidaturas/usuario");
  return data;
}

export async function criarCandidatura(publicacaoId: number, empresaId: number) {
  await api.post("/candidaturas", { publicacaoId, empresaId });
}

export async function verificarCandidatura(publicacaoId: number) {
  const { data } = await api.get<boolean>(`/candidaturas/verificar/${publicacaoId}`);
  return data;
}
