import type { ExperienciaApi } from "../types/api";
import { api } from "./api";

export interface ExperienciaPayload {
  cargo: string;
  empresa: string;
  dtInicio: string;
  dtFim: string;
}

export async function listarExperiencias() {
  const { data } = await api.get<ExperienciaApi[]>("/experiencias");
  return data;
}

export async function criarExperiencia(body: ExperienciaPayload) {
  await api.post("/experiencias", body);
}

export async function atualizarExperiencia(id: number, body: ExperienciaPayload) {
  await api.put(`/experiencias/${id}`, body);
}

export async function removerExperiencia(id: number) {
  await api.delete(`/experiencias/${id}`);
}
