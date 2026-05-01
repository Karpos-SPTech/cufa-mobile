import { API_BASE_URL } from "./config";

/** Monta URL absoluta para o cliente (imagem, PDF, etc.) a partir do path relativo da API. */
export function absoluteApiUrl(path: string | null | undefined): string | undefined {
  if (path == null) return undefined;
  const p = String(path).trim();
  if (!p) return undefined;
  if (/^https?:\/\//i.test(p)) return p;
  const base = API_BASE_URL.replace(/\/$/, "");
  const rel = p.startsWith("/") ? p : `/${p}`;
  return `${base}${rel}`;
}
