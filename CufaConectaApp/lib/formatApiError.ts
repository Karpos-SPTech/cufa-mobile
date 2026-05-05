import { isAxiosError, type AxiosError } from "axios";

const DEFAULT_MAX = 400;

function stringifyBody(data: unknown): string {
  if (data == null) return "";
  if (typeof data === "string") return data.trim();
  if (typeof data === "number" || typeof data === "boolean") return String(data);
  if (Array.isArray(data)) {
    return data
      .map((item) => stringifyBody(item))
      .filter(Boolean)
      .join("; ");
  }
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (typeof o.error === "string") return o.error;
    if (typeof o.detail === "string") return o.detail;
    if (typeof o.title === "string") return o.title;
    if (Array.isArray(o.errors)) return stringifyBody(o.errors);
    try {
      return JSON.stringify(data);
    } catch {
      return "";
    }
  }
  return String(data);
}

/**
 * Texto legível para Alert / UI — nunca concatena objetos com String() (vira "[object Object]").
 */
export function formatApiError(e: unknown, options?: { maxLength?: number }): string {
  const max = options?.maxLength ?? DEFAULT_MAX;

  let out = "";

  if (isAxiosError(e)) {
    const ax = e as AxiosError<unknown>;
    const fromBody = stringifyBody(ax.response?.data);
    out = fromBody || ax.message || "Falha na requisição.";
    const st = ax.response?.status;
    if (st != null && !out.includes(String(st))) {
      out = `${out} (${st})`;
    }
  } else if (e instanceof Error) {
    out = e.message;
  } else if (e && typeof e === "object" && "message" in e) {
    out = stringifyBody((e as { message: unknown }).message) || "Erro desconhecido.";
  } else {
    out = "Não foi possível concluir. Tente novamente.";
  }

  out = out.replace(/\s+/g, " ").trim();
  if (out.length > max) {
    return `${out.slice(0, max - 1)}…`;
  }
  return out || "Não foi possível concluir. Tente novamente.";
}
