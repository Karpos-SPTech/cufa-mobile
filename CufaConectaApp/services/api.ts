import axios, { type InternalAxiosRequestConfig } from "axios";
import { DeviceEventEmitter } from "react-native";

import { API_BASE_URL } from "../lib/config";
import { storageGetItem, storageRemoveItem, storageSetItem } from "../lib/storage";

export const TOKEN_KEY = "@cufa_jwt";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  // Auth é via Bearer (login devolve tokenJwt no corpo). O backend usa CORS "*" sem credenciais,
  // então withCredentials=true faria o navegador bloquear as respostas na web.
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * O cliente padrão força `application/json`. Em FormData o boundary tem de ser gerado pelo runtime;
 * se você mandar `multipart/form-data` sem boundary, o Spring responde "Required part 'file' is not present".
 */
export function axiosFormDataConfig(): Pick<
  InternalAxiosRequestConfig,
  "transformRequest" | "timeout"
> {
  return {
    // Upload + análise (IA) podem demorar bem mais que o timeout padrão de 30s.
    // No React Native um timeout muitas vezes aparece como "Network Error".
    timeout: 120000,
    transformRequest: (data, headers) => {
      if (typeof FormData !== "undefined" && data instanceof FormData) {
        const h = headers as unknown as Record<string, unknown>;
        delete h["Content-Type"];
        delete h["content-type"];
      }
      return data;
    },
  };
}

api.interceptors.request.use(async (config) => {
  const token = await storageGetItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    if (status === 401) {
      await saveToken(null);
      DeviceEventEmitter.emit("cufa:unauthorized");
    }
    return Promise.reject(error);
  }
);

export async function saveToken(token: string | null) {
  if (token) {
    await storageSetItem(TOKEN_KEY, token);
  } else {
    await storageRemoveItem(TOKEN_KEY);
  }
}

/**
 * Upload multipart via `fetch` nativo (não axios).
 * O adaptador XHR do axios falha com "Network Error" em uploads de arquivo no React Native (Android);
 * o `fetch` do RN envia FormData com arquivo de forma confiável.
 */
export async function postMultipart<T = unknown>(
  path: string,
  form: FormData,
  options?: { timeoutMs?: number }
): Promise<T> {
  const token = await storageGetItem(TOKEN_KEY);
  const url = `${API_BASE_URL}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 120000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // Sem Content-Type: o runtime define multipart/form-data com boundary.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    throw new Error(
      aborted
        ? `Tempo de conexão esgotado (${url})`
        : `Sem conexão com o servidor (${url})`
    );
  } finally {
    clearTimeout(timeout);
  }

  const raw = await res.text();

  if (res.status === 401) {
    await saveToken(null);
    DeviceEventEmitter.emit("cufa:unauthorized");
  }

  if (!res.ok) {
    let message = raw?.trim() || `Falha na requisição (${res.status}).`;
    try {
      const parsed = JSON.parse(raw) as { message?: string; detail?: string };
      message = parsed.message ?? parsed.detail ?? message;
    } catch {
      /* corpo não é JSON */
    }
    throw new Error(`${message} (${res.status})`);
  }

  if (!raw) return undefined as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}
