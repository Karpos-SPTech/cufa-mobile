import { Platform } from "react-native";

/** Fallback quando o módulo nativo não está disponível (web, ou bridge null). */
const memory: Record<string, string> = {};

function readWeb(key: string): string | null {
  try {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
      return globalThis.localStorage.getItem(key);
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeWeb(key: string, value: string) {
  try {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
      globalThis.localStorage.setItem(key, value);
    }
  } catch {
    memory[key] = value;
  }
}

function removeWeb(key: string) {
  try {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
      globalThis.localStorage.removeItem(key);
    }
  } catch {
    delete memory[key];
  }
}

async function nativeGet(key: string): Promise<string | null> {
  try {
    const { default: AsyncStorage } = await import(
      "@react-native-async-storage/async-storage"
    );
    return await AsyncStorage.getItem(key);
  } catch {
    return memory[key] ?? null;
  }
}

async function nativeSet(key: string, value: string): Promise<void> {
  try {
    const { default: AsyncStorage } = await import(
      "@react-native-async-storage/async-storage"
    );
    await AsyncStorage.setItem(key, value);
  } catch {
    memory[key] = value;
  }
}

async function nativeRemove(key: string): Promise<void> {
  try {
    const { default: AsyncStorage } = await import(
      "@react-native-async-storage/async-storage"
    );
    await AsyncStorage.removeItem(key);
  } catch {
    delete memory[key];
  }
}

export async function storageGetItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    const v = readWeb(key);
    return v ?? memory[key] ?? null;
  }
  const v = await nativeGet(key);
  return v;
}

export async function storageSetItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    writeWeb(key, value);
    return;
  }
  await nativeSet(key, value);
}

export async function storageRemoveItem(key: string): Promise<void> {
  if (Platform.OS === "web") {
    removeWeb(key);
    delete memory[key];
    return;
  }
  await nativeRemove(key);
}
