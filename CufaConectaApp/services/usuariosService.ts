import type { UsuarioPerfil, VagasRecomendadasResponse } from "../types/api";
import { normalizeApiDate, toDdMmYyyyFromIso } from "../lib/date";
import { api } from "./api";

export async function getUsuarioAtual() {
  const { data } = await api.get<UsuarioPerfil>("/usuarios");
  return data;
}

/** Corpo do PUT `/usuarios` (UsuarioUpdateRequestDto). */
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
  cpf: string;
  telefone: string;
  escolaridade: string;
  dtNascimento: string;
  estadoCivil: string;
  estado: string;
  cidade: string;
  biografia: string;
};

export function perfilEditFieldsFromUsuario(perfil: UsuarioPerfil): PerfilEditFields {
  const iso = perfil.dtNascimento != null ? normalizeApiDate(perfil.dtNascimento) : "";
  return {
    nome: perfil.nome ?? "",
    cpf: perfil.cpf ?? "",
    telefone: perfil.telefone ?? "",
    escolaridade: perfil.escolaridade ?? "",
    dtNascimento: iso ? toDdMmYyyyFromIso(iso) : "",
    estadoCivil: perfil.estadoCivil ?? "",
    estado: perfil.estado ?? "",
    cidade: perfil.cidade ?? "",
    biografia: perfil.biografia ?? "",
  };
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidCpfDigits(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(cpf[10]);
}

function isValidBirthDate(value: string): boolean {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    year >= 1900 &&
    year <= new Date().getFullYear()
  );
}

/** Valida campos exigidos pelo backend antes do PUT. */
export function validatePerfilEdit(fields: PerfilEditFields): string | null {
  const cpfDigits = onlyDigits(fields.cpf);
  if (cpfDigits.length !== 11) {
    return "Informe um CPF com 11 dígitos.";
  }
  if (!isValidCpfDigits(cpfDigits)) {
    return "CPF inválido.";
  }

  if (!fields.telefone.trim()) {
    return "Informe o telefone.";
  }

  if (!fields.escolaridade.trim()) {
    return "Informe a escolaridade.";
  }

  const dt = fields.dtNascimento.trim();
  if (!dt) {
    return "Informe a data de nascimento no formato DD-MM-AAAA.";
  }
  if (!isValidBirthDate(dt)) {
    return "Data de nascimento inválida. Use DD-MM-AAAA.";
  }

  if (!fields.estadoCivil.trim()) {
    return "Informe o estado civil.";
  }

  if (!fields.estado.trim()) {
    return "Informe o estado (UF).";
  }
  if (fields.estado.trim().length !== 2) {
    return "O estado deve ter 2 letras (ex.: SP).";
  }

  if (!fields.cidade.trim()) {
    return "Informe a cidade.";
  }

  if (!fields.biografia.trim()) {
    return "Informe a biografia.";
  }

  return null;
}

export function buildUsuarioCadastroPut(
  fields: PerfilEditFields
): UsuarioDadosCadastroPut | null {
  const error = validatePerfilEdit(fields);
  if (error) return null;

  const body: UsuarioDadosCadastroPut = {
    cpf: onlyDigits(fields.cpf),
    telefone: fields.telefone.trim(),
    escolaridade: fields.escolaridade.trim(),
    dtNascimento: fields.dtNascimento.trim(),
    estadoCivil: fields.estadoCivil.trim(),
    estado: fields.estado.trim().toUpperCase(),
    cidade: fields.cidade.trim(),
    biografia: fields.biografia.trim(),
  };

  const nome = fields.nome.trim();
  if (nome.length > 0) {
    body.nome = nome;
  }

  return body;
}

export function getPerfilEditValidationMessage(fields: PerfilEditFields): string | null {
  return validatePerfilEdit(fields);
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
