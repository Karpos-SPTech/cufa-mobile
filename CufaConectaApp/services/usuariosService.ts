import type { UsuarioPerfil, VagasRecomendadasResponse } from "../types/api";
import { normalizeApiDate, toDdMmYyyyFromIso } from "../lib/date";
import { api } from "./api";

export async function getUsuarioAtual() {
  const { data } = await api.get<UsuarioPerfil>("/usuarios");
  return data;
}

/** Corpo do PUT `/usuarios` (UsuarioUpdateRequestDto). Campo `nome` é opcional no backend. */
export type UsuarioDadosCadastroPut = {
  nome?: string;
  cpf: string;
  telefone: string;
  escolaridade: string;
  dtNascimento: string;
  estadoCivil: string;
  estado: string;
  cidade: string;
  biografia: string;
};

export type PerfilEditFields = {
  nome: string;
  cidade: string;
  estado: string;
  biografia: string;
};

/**
 * Monta o corpo do cadastro completo exigido pelo backend.
 * Retorna `null` se faltar CPF, telefone, escolaridade, data de nascimento ou estado civil no perfil atual.
 */
export function buildUsuarioCadastroPut(
  atual: UsuarioPerfil,
  edits: PerfilEditFields
): UsuarioDadosCadastroPut | null {
  const cpf = atual.cpf?.trim();
  const telefone = atual.telefone?.trim();
  const escolaridade = atual.escolaridade?.trim();
  const estadoCivil = atual.estadoCivil?.trim();
  const rawDt = atual.dtNascimento;
  const iso = rawDt != null ? normalizeApiDate(rawDt) : "";
  const dtNascimento = iso ? toDdMmYyyyFromIso(iso) : "";

  if (!cpf || !telefone || !escolaridade || !dtNascimento || !estadoCivil) {
    return null;
  }

  const estado = edits.estado.trim() || atual.estado?.trim() || "";
  const cidade = edits.cidade.trim();
  const biografia = edits.biografia.trim();
  const nomeTrim = edits.nome.trim();

  const body: UsuarioDadosCadastroPut = {
    cpf,
    telefone,
    escolaridade,
    dtNascimento,
    estadoCivil,
    estado,
    cidade,
    biografia,
  };
  if (nomeTrim.length > 0) {
    body.nome = nomeTrim;
  }
  return body;
}

export async function putUsuarioDadosCadastro(body: UsuarioDadosCadastroPut) {
  await api.put("/usuarios", body);
}

export async function atualizarLocalizacaoUsuario(latitude: number, longitude: number) {
  await api.patch("/usuarios/localizacao", {
    latitude: String(latitude),
    longitude: String(longitude),
  });
}

export async function recomendarVagasPorCoordenadas(latitude: number, longitude: number) {
  const { data } = await api.get<VagasRecomendadasResponse>("/usuarios/recomendar", {
    params: { latitude, longitude },
  });
  return data;
}
