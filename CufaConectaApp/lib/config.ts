import Constants from "expo-constants";

/**
 * Defina EXPO_PUBLIC_API_URL no .env (ex.: http://10.0.2.2:8080 no emulador Android).
 * Dispositivo físico: use o IP da máquina na rede (ex.: http://192.168.0.10:8080).
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  "http://10.0.2.2:8080";
