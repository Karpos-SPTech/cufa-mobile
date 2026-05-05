import Constants from "expo-constants";
import { getExpoGoProjectConfig } from "expo";
import { NativeModules, Platform } from "react-native";

/**
 * Ordem: EXPO_PUBLIC_API_URL → extra.apiUrl → inferência (Expo Go: debuggerHost; depois hostUri / bundle URL) → fallbacks.
 * Com `expo start --tunnel`, o host do Metro não é o PC — defina EXPO_PUBLIC_API_URL com o IP da máquina ou um túnel para a API.
 */
const TUNNEL_HOST_MARKERS = [".exp.direct", "exp.host", ".expo.dev", "ngrok-free", "ngrok.io", "loca.lt"];

function hostLooksLikeExpoTunnel(host: string): boolean {
  const h = host.toLowerCase();
  return TUNNEL_HOST_MARKERS.some((m) => h.includes(m));
}

/** Host onde o Spring pode estar no dev (mesma máquina que o Metro). Rejeita túnel do Expo. */
function isPlausibleLanDevHost(host: string): boolean {
  if (!host || host === "localhost" || host === "127.0.0.1") return false;
  if (hostLooksLikeExpoTunnel(host)) return false;

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const m = host.match(ipv4);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 127) return false;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    return true;
  }

  if (host.toLowerCase().endsWith(".local")) return true;
  if (host.includes(".")) return true;
  return false;
}

function hostFromDebuggerUri(uri: string): string | undefined {
  const trimmed = uri.trim();
  const lastColon = trimmed.lastIndexOf(":");
  if (lastColon <= 0) return trimmed || undefined;
  let host = trimmed.slice(0, lastColon).trim();
  if (host.startsWith("[") && host.endsWith("]")) {
    host = host.slice(1, -1);
  }
  return host || undefined;
}

function hostFromExpoGoDebugger(): string | undefined {
  const dh = getExpoGoProjectConfig()?.debuggerHost;
  if (!dh || typeof dh !== "string") return undefined;
  const host = hostFromDebuggerUri(dh);
  return host && isPlausibleLanDevHost(host) ? host : undefined;
}

function hostFromExpoConfig(): string | undefined {
  const uri = Constants.expoConfig?.hostUri;
  if (!uri || typeof uri !== "string") return undefined;
  const host = uri.split(":")[0]?.trim();
  if (!host) return undefined;
  return isPlausibleLanDevHost(host) ? host : undefined;
}

function hostFromSourceCode(): string | undefined {
  if (Platform.OS === "web") return undefined;
  const url = NativeModules?.SourceCode?.scriptURL as string | undefined;
  if (!url || typeof url !== "string") return undefined;
  const m = url.match(/https?:\/\/([^/:]+)/);
  const host = m?.[1];
  if (!host) return undefined;
  return isPlausibleLanDevHost(host) ? host : undefined;
}

/** Com `expo start --tunnel`, o host do bundle não é o PC onde roda o Spring. */
function expoDevUsesTunnel(): boolean {
  const go = getExpoGoProjectConfig();
  const o = go?.packagerOpts as Record<string, unknown> | undefined;
  if (o?.hostType === "tunnel" || o?.urlType === "tunnel" || o?.lanType === "tunnel") {
    return true;
  }
  const dh = go?.debuggerHost;
  return typeof dh === "string" && hostLooksLikeExpoTunnel(dh);
}

function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv;

  const fromExtra = Constants.expoConfig?.extra?.apiUrl as string | undefined;
  if (fromExtra?.trim()) return fromExtra.trim();

  if (Platform.OS === "web") {
    return "http://localhost:8080";
  }

  const lanHost =
    hostFromExpoGoDebugger() ?? hostFromExpoConfig() ?? hostFromSourceCode();
  if (lanHost) {
    const url = `http://${lanHost}:8080`;
    if (__DEV__) {
      // Ajuda a depurar “funciona na web e não no celular”.
      console.warn(`[CufaConecta] API_BASE_URL=${url} (inferido do dev server)`);
    }
    return url;
  }

  if (expoDevUsesTunnel()) {
    if (__DEV__) {
      console.error(
        "[CufaConecta] Modo tunnel do Expo: defina no .env EXPO_PUBLIC_API_URL=http://IP_DO_PC_NA_WIFI:8080 (o IP do `ip addr` / `hostname -I`, não localhost)."
      );
    }
    // Falha explícita até configurar — evita 10.0.2.2 no aparelho físico.
    return "http://cufa-api-not-configured.invalid:8080";
  }

  if (__DEV__) {
    console.warn(
      "[CufaConecta] Não foi possível inferir o IP do PC. Defina EXPO_PUBLIC_API_URL=http://SEU_IP:8080 se o firewall bloquear ou o dispositivo não enxergar o Metro na LAN."
    );
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  return "http://127.0.0.1:8080";
}

export const API_BASE_URL = resolveApiBaseUrl();
