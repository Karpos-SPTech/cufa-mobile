import { extractJwtFromLoginResponse } from "../lib/jwtFromLoginResponse";
import type { UsuarioToken } from "../types/api";
import { api, saveToken } from "./api";

export async function login(email: string, senha: string): Promise<UsuarioToken> {
  const response = await api.post<UsuarioToken>("/usuarios/login", { email, senha });
  const { data } = response;

  const token = extractJwtFromLoginResponse(response);
  if (token) {
    await saveToken(token);
    return { ...data, tokenJwt: token };
  }

  return data;
}

export async function register(nome: string, email: string, senha: string) {
  await api.post("/usuarios", { nome, email, senha });
}

export async function logout() {
  try {
    await api.post("/usuarios/logout");
  } finally {
    await saveToken(null);
  }
}
