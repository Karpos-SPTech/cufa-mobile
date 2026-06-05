import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { HEADER_CONTENT_HEIGHT } from "../components/Base/Header";
import { useNotifications } from "../constants/NotificationsContext";
import { formatNotificationTime } from "../lib/notifications";

function iconForKind(kind: string) {
  if (kind === "candidatura") return "briefcase";
  if (kind === "dica") return "user";
  return "info";
}

export default function Notifications() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    notifications,
    loading,
    unreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications])
  );

  async function handlePress(id: string, href?: string) {
    await markAsRead(id);
    router.back();
    if (href) {
      setTimeout(() => router.push(href as Href), 150);
    }
  }

  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      <Pressable
        style={[styles.box, { top: insets.top + HEADER_CONTENT_HEIGHT }]}
        onPress={(e) => e.stopPropagation()}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Notificações</Text>
          {unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllAsRead} hitSlop={8}>
              <Text style={styles.markAll}>Marcar lidas</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {loading && notifications.length === 0 ? (
          <ActivityIndicator color="#006916" style={{ marginVertical: 16 }} />
        ) : notifications.length === 0 ? (
          <Text style={styles.empty}>Nenhuma notificação no momento.</Text>
        ) : (
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {notifications.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.notificationItem, !item.read && styles.unreadItem]}
                activeOpacity={0.85}
                onPress={() => handlePress(item.id, item.href)}
              >
                <View style={[styles.avatar, !item.read && styles.unreadAvatar]}>
                  <Feather
                    name={iconForKind(item.kind)}
                    size={14}
                    color={item.read ? "#666" : "#006916"}
                  />
                </View>

                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.time}>{formatNotificationTime(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.message} numberOfLines={3}>
                    {item.message}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.dismissBtn}
                  hitSlop={8}
                  onPress={() => dismissNotification(item.id)}
                >
                  <Feather name="x" size={14} color="#888" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  box: {
    position: "absolute",
    left: 16,
    right: 16,
    maxHeight: 360,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontWeight: "700",
    color: "#006916",
    fontSize: 16,
  },
  markAll: {
    fontSize: 11,
    fontWeight: "600",
    color: "#006916",
  },
  list: {
    maxHeight: 300,
  },
  empty: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#f7f9f7",
  },
  unreadItem: {
    backgroundColor: "#edf6ef",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e5e5",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadAvatar: {
    backgroundColor: "#d4ead9",
  },
  content: {
    flex: 1,
    paddingRight: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },
  time: {
    fontSize: 10,
    color: "#888",
  },
  message: {
    fontSize: 11,
    color: "#555",
    marginTop: 3,
    lineHeight: 15,
  },
  dismissBtn: {
    padding: 2,
  },
});
