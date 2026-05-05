import type { AnaliseCurriculo, AnaliseCurriculoResponse, CurriculoInfo } from "../types/api";
import { api, axiosFormDataConfig } from "./api";

/** Backend POST /curriculos/update devolve texto (URL); POST /upload devolve JSON { filename }. */
function normalizeCurriculoUpload(data: unknown): CurriculoInfo {
  if (typeof data === "string") {
    const url = data.trim();
    const filename = url.includes("/") ? (url.split("/").pop() ?? url) : url;
    return { filename: filename || "" };
  }
  if (data && typeof data === "object" && "filename" in (data as object)) {
    return data as CurriculoInfo;
  }
  return { filename: "" };
}

export async function getCurriculoArquivo() {
  const { data } = await api.get<CurriculoInfo>("/curriculos");
  return data;
}

export async function uploadCurriculo(file: {
  uri: string;
  name: string;
  mimeType?: string | null;
}) {
  const form = new FormData();
  form.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? "application/pdf",
  } as unknown as Blob);

  const { data } = await api.post<unknown>("/curriculos/update", form, axiosFormDataConfig());
  return normalizeCurriculoUpload(data);
}

export async function removerCurriculo() {
  await api.delete("/curriculos");
}

/** POST /curriculos/curriculo/analisar — exige Ollama no backend; senão retorna erro 500. */
export async function analisarCurriculoPdf(file: {
  uri: string;
  name: string;
  mimeType?: string | null;
}): Promise<AnaliseCurriculo> {
  const form = new FormData();
  form.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? "application/pdf",
  } as unknown as Blob);

  const { data } = await api.post<AnaliseCurriculoResponse>(
    "/curriculos/curriculo/analisar",
    form,
    axiosFormDataConfig()
  );
  return data.analise;
}
