import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../constants/AuthContext";
import { useNotifications } from "../../constants/NotificationsContext";
import { absoluteApiUrl } from "../../lib/urls";

export const HEADER_CONTENT_HEIGHT = 52;

export default function Header() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();
  const { perfil } = useAuth();
  const avatarUri = absoluteApiUrl(perfil?.fotoUrl);

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top,
          minHeight: insets.top + HEADER_CONTENT_HEIGHT,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => router.push("/notifications" as Href)}
      >
        <Feather name="bell" size={24} color="white" />
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? "9+" : String(unreadCount)}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/cufaLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.profileCircle}
        onPress={() => router.push("/profile" as Href)}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Feather name="user" size={18} color="#666" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#006916",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 40,
    tintColor: '#FFFFFF',
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D9D9D9",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});