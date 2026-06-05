import { storageGetItem, storageSetItem } from "./storage";

export type NotificationKind = "candidatura" | "dica" | "info";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

const NOTIFICATIONS_KEY = "@cufa/notifications";
const DISMISSED_TIPS_KEY = "@cufa/dismissed-tips";

export async function loadStoredNotifications(): Promise<AppNotification[]> {
  const raw = await storageGetItem(NOTIFICATIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AppNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveStoredNotifications(items: AppNotification[]): Promise<void> {
  await storageSetItem(NOTIFICATIONS_KEY, JSON.stringify(items));
}

export async function loadDismissedTips(): Promise<Set<string>> {
  const raw = await storageGetItem(DISMISSED_TIPS_KEY);
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export async function saveDismissedTips(ids: Set<string>): Promise<void> {
  await storageSetItem(DISMISSED_TIPS_KEY, JSON.stringify([...ids]));
}

export function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
