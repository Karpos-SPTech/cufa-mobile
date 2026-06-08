import { Alert, Platform } from "react-native";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

/**
 * Confirmação cross-platform. No RN Web o `Alert.alert` ignora os botões/callbacks,
 * então usamos `window.confirm`. No nativo, mantém o Alert com botões.
 */
export function confirmAsync(options: ConfirmOptions): Promise<boolean> {
  const {
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    destructive = false,
  } = options;

  if (Platform.OS === "web") {
    const text = message ? `${title}\n\n${message}` : title;
    const ok =
      typeof globalThis !== "undefined" && typeof globalThis.confirm === "function"
        ? globalThis.confirm(text)
        : true;
    return Promise.resolve(ok);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelLabel, style: "cancel", onPress: () => resolve(false) },
      {
        text: confirmLabel,
        style: destructive ? "destructive" : "default",
        onPress: () => resolve(true),
      },
    ]);
  });
}
