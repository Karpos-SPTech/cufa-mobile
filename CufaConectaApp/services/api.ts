import axios, { type InternalAxiosRequestConfig } from "axios";
import { DeviceEventEmitter } from "react-native";

import { API_BASE_URL } from "../lib/config";
import { storageGetItem, storageRemoveItem, storageSetItem } from "../lib/storage";

export const TOKEN_KEY = "@cufa_jwt";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * O cliente padrão força `application/json`. Em FormData o boundary tem de ser gerado pelo runtime;
 * se você mandar `multipart/form-data` sem boundary, o Spring responde "Required part 'file' is not present".
 */
export function axiosFormDataConfig(): Pick<InternalAxiosRequestConfig, "transformRequest"> {
  return {
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
