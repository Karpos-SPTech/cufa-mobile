import type { UsuarioPerfil } from "../types/api";
import { api, axiosFormDataConfig } from "./api";

export type UsuarioPerfilPatch = Partial<{
  nome: string;
  biografia: string;
  cidade: string;
  estado: string;
  fotoUrl: string;
}>;

export async function getUsuarioAtual() {
  const { data } = await api.get<UsuarioPerfil>("/usuarios");
  return data;
}

/** Atualização parcial do perfil (backend aceita PUT, PATCH ou POST em `/usuarios/perfil`). */
export async function patchPerfil(body: UsuarioPerfilPatch) {
  const { data } = await api.put<UsuarioPerfil>("/usuarios/perfil", body);
  return data;
}

export async function uploadFotoPerfil(file: {
  uri: string;
  name: string;
  mimeType?: string | null;
}) {
  const form = new FormData();
  form.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? "image/jpeg",
  } as unknown as Blob);

  const { data } = await api.post<UsuarioPerfil>("/usuarios/foto", form, axiosFormDataConfig());
  return data;
}
