import type { PublicacaoPaginada } from "../types/api";
import { api } from "./api";

export async function listarPublicacoes(page = 1, size = 30) {
  const { data } = await api.get<PublicacaoPaginada>("/publicacoes", {
    params: { page, size },
  });
  return data;
}
