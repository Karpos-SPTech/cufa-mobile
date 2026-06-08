import type { AxiosResponse } from "axios";

/** Extrai o JWT do header Set-Cookie da resposta de POST /usuarios/login. */
export function extractJwtFromSetCookie(headers: unknown): string | null {
  if (!headers || typeof headers !== "object") return null;
  const h = headers as Record<string, unknown>;
  const raw = h["set-cookie"] ?? h["Set-Cookie"];
  if (raw == null) return null;

  const entries = Array.isArray(raw) ? raw.map(String) : [String(raw)];
  for (const entry of entries) {
    const match = entry.match(/(?:^|[;,]\s*)jwt=([^;\s,]+)/i);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

export function extractJwtFromLoginResponse(
  response: AxiosResponse<{ tokenJwt?: string | null }>
): string | null {
  const fromBody = response.data?.tokenJwt?.trim();
  if (fromBody) return fromBody;

  const fromAxiosHeaders = extractJwtFromSetCookie(response.headers);
  if (fromAxiosHeaders) return fromAxiosHeaders;

  const req = response.request as { responseHeaders?: Record<string, string> } | undefined;
  if (req?.responseHeaders) {
    return extractJwtFromSetCookie(req.responseHeaders);
  }

  return null;
}
