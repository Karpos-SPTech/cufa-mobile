import { Platform, DeviceEventEmitter } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

import { API_BASE_URL } from "../lib/config";
import { storageGetItem } from "../lib/storage";
import type { AnaliseCurriculo, AnaliseCurriculoResponse, CurriculoInfo } from "../types/api";
import { api, postMultipart, saveToken, TOKEN_KEY } from "./api";

export type CurriculoUploadPick = {
  uri: string;
  name: string;
  mimeType?: string | null;
  /** Preenchido no web pelo expo-document-picker (`asset.file`). */
  file?: File | Blob;
};

async function appendCurriculoFilePart(form: FormData, pick: CurriculoUploadPick) {
  const filename = pick.name?.trim() || "curriculo.pdf";

  if (pick.file != null) {
    form.append("file", pick.file, filename);
    return;
  }

  const res = await fetch(pick.uri);
  const blob = await res.blob();
  form.append("file", blob, filename);
}

function parseUploadBody<T>(raw: string, status: number): T {
  if (status === 401) {
    void saveToken(null);
    DeviceEventEmitter.emit("cufa:unauthorized");
  }
  if (status < 200 || status >= 300) {
    let message = raw?.trim() || `Falha na requisição (${status}).`;
    try {
      const parsed = JSON.parse(raw) as { message?: string; detail?: string };
      message = parsed.message ?? parsed.detail ?? message;
    } catch {
      /* corpo não é JSON */
    }
    throw new Error(`${message} (${status})`);
  }
  if (!raw) return undefined as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

/**
 * Upload multipart de currículo.
 * - Nativo: `expo-file-system` `uploadAsync` (confiável; o FormData via fetch/axios falha com
 *   "Network Error" em uploads de arquivo no React Native/Android).
 * - Web: `fetch` com FormData (Blob/File).
 */
async function uploadCurriculoMultipart<T>(path: string, pick: CurriculoUploadPick): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const token = await storageGetItem(TOKEN_KEY);

  if (Platform.OS !== "web") {
    const result = await FileSystem.uploadAsync(url, pick.uri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      mimeType: pick.mimeType ?? "application/pdf",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return parseUploadBody<T>(result.body ?? "", result.status);
  }

  const form = new FormData();
  await appendCurriculoFilePart(form, pick);
  return postMultipart<T>(path, form);
}

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

export async function uploadCurriculo(pick: CurriculoUploadPick) {
  const data = await uploadCurriculoMultipart<unknown>("/curriculos/update", pick);
  return normalizeCurriculoUpload(data);
}

export async function removerCurriculo() {
  await api.delete("/curriculos");
}

/** POST /curriculos/analisar (multipart `file`). */
export async function analisarCurriculoPdf(pick: CurriculoUploadPick): Promise<AnaliseCurriculo> {
  const data = await uploadCurriculoMultipart<AnaliseCurriculoResponse>(
    "/curriculos/analisar",
    pick
  );
  const analise = data.resultado ?? data.analise;
  if (!analise) {
    throw new Error("Resposta de análise vazia do servidor.");
  }
  return analise;
}
