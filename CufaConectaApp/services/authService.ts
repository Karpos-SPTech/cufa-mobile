import type { UsuarioToken } from "../types/api";
import { api, saveToken } from "./api";

export async function login(email: string, senha: string): Promise<UsuarioToken> {
  const { data } = await api.post<UsuarioToken>("/usuarios/login", { email, senha });
  if (data.tokenJwt) {
    await saveToken(data.tokenJwt);
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
