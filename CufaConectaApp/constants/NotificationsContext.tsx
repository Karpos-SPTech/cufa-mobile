import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DeviceEventEmitter } from "react-native";

import {
  type AppNotification,
  loadDismissedTips,
  loadStoredNotifications,
  saveDismissedTips,
  saveStoredNotifications,
} from "../lib/notifications";
import * as curriculosApi from "../services/curriculosService";
import * as experienciasApi from "../services/experienciasService";
import { useAuth } from "./AuthContext";
import { useVagas } from "./VagasContext";

type CandidaturaEvent = {
  company: string;
  role: string;
  publicacaoId: number;
};

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function sortNotifications(items: AppNotification[]): AppNotification[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function upsertNotification(
  items: AppNotification[],
  notification: AppNotification
): AppNotification[] {
  const index = items.findIndex((item) => item.id === notification.id);
  if (index === -1) return sortNotifications([notification, ...items]);

  const next = [...items];
  next[index] = { ...next[index], ...notification };
  return sortNotifications(next);
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { token, perfil } = useAuth();
  const { candidaturas } = useVagas();
  const [stored, setStored] = useState<AppNotification[]>([]);
  const [tips, setTips] = useState<AppNotification[]>([]);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStoredNotifications().then(setStored);
    loadDismissedTips().then(setDismissedTips);
  }, []);

  const persistStored = useCallback(async (items: AppNotification[]) => {
    setStored(items);
    await saveStoredNotifications(items);
  }, []);

  const syncCandidaturas = useCallback(
    async (current: AppNotification[]) => {
      let next = [...current];
      let changed = false;

      for (const candidatura of candidaturas) {
        const id = `candidatura-${candidatura.publicacaoId}`;
        if (next.some((item) => item.id === id)) continue;

        changed = true;
        next = upsertNotification(next, {
          id,
          kind: "candidatura",
          title: "Candidatura enviada",
          message: `Você se candidatou à vaga de ${candidatura.titulo} em ${candidatura.nomeEmpresa}.`,
          createdAt: candidatura.dtPublicacao || new Date().toISOString(),
          read: false,
          href: "/jobs",
        });
      }

      if (changed) {
        await persistStored(next);
      }
    },
    [candidaturas, persistStored]
  );

  const buildTips = useCallback(async () => {
    if (!token) {
      setTips([]);
      return;
    }

    const dismissed = await loadDismissedTips();
    setDismissedTips(dismissed);

    const nextTips: AppNotification[] = [];

    try {
      const curriculo = await curriculosApi.getCurriculoArquivo().catch(() => null);
      const hasCurriculo = Boolean(perfil?.curriculoUrl?.trim() || curriculo?.filename?.trim());

      if (!hasCurriculo && !dismissed.has("dica-curriculo")) {
        nextTips.push({
          id: "dica-curriculo",
          kind: "dica",
          title: "Complete seu perfil",
          message: "Anexe um currículo para reforçar suas candidaturas.",
          createdAt: new Date().toISOString(),
          read: false,
          href: "/profile",
        });
      }

      if (!perfil?.biografia?.trim() && !dismissed.has("dica-biografia")) {
        nextTips.push({
          id: "dica-biografia",
          kind: "dica",
          title: "Adicione sua biografia",
          message: "Conte um pouco sobre você para destacar seu perfil.",
          createdAt: new Date().toISOString(),
          read: false,
          href: "/profile",
        });
      }

      const experiencias = await experienciasApi.listarExperiencias().catch(() => []);
      if (experiencias.length === 0 && !dismissed.has("dica-experiencia")) {
        nextTips.push({
          id: "dica-experiencia",
          kind: "dica",
          title: "Registre experiências",
          message: "Inclua experiências profissionais para enriquecer seu perfil.",
          createdAt: new Date().toISOString(),
          read: false,
          href: "/profile",
        });
      }
    } catch {
      /* mantém dicas já calculadas */
    }

    setTips(nextTips);
  }, [token, perfil]);

  const refreshNotifications = useCallback(async () => {
    if (!token) {
      setStored([]);
      setTips([]);
      return;
    }

    setLoading(true);
    try {
      const current = await loadStoredNotifications();
      setStored(current);
      await syncCandidaturas(current);
      await buildTips();
    } finally {
      setLoading(false);
    }
  }, [token, syncCandidaturas, buildTips]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      "cufa:candidatura-criada",
      async (payload: CandidaturaEvent) => {
        const current = await loadStoredNotifications();
        const id = `candidatura-${payload.publicacaoId}`;
        const next = upsertNotification(current, {
          id,
          kind: "candidatura",
          title: "Candidatura enviada",
          message: `Você se candidatou à vaga de ${payload.role} em ${payload.company}.`,
          createdAt: new Date().toISOString(),
          read: false,
          href: "/jobs",
        });
        setStored(next);
        await saveStoredNotifications(next);
      }
    );

    return () => sub.remove();
  }, []);

  const notifications = useMemo(
    () => sortNotifications([...tips, ...stored]),
    [tips, stored]
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      if (id.startsWith("dica-")) {
        setTips((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
        return;
      }

      const next = stored.map((item) => (item.id === id ? { ...item, read: true } : item));
      await persistStored(next);
    },
    [stored, persistStored]
  );

  const markAllAsRead = useCallback(async () => {
    setTips((prev) => prev.map((item) => ({ ...item, read: true })));
    const next = stored.map((item) => ({ ...item, read: true }));
    await persistStored(next);
  }, [stored, persistStored]);

  const dismissNotification = useCallback(
    async (id: string) => {
      if (id.startsWith("dica-")) {
        const nextDismissed = new Set(dismissedTips);
        nextDismissed.add(id);
        setDismissedTips(nextDismissed);
        await saveDismissedTips(nextDismissed);
        setTips((prev) => prev.filter((item) => item.id !== id));
        return;
      }

      const next = stored.filter((item) => item.id !== id);
      await persistStored(next);
    },
    [dismissedTips, stored, persistStored]
  );

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      dismissNotification,
    }),
    [
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      dismissNotification,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications deve ser usado dentro de NotificationsProvider");
  }
  return ctx;
}
