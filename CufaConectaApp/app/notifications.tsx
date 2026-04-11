import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Notifications() {
  const router = useRouter();

  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      
      <Pressable 
        style={styles.box}
        onPress={(e) => e.stopPropagation()}
      >
        <Text style={styles.title}>Notificações</Text>

        {[1,2,3,4].map((item) => (
          <View key={item} style={styles.notificationItem}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.name}>NOME DO USUÁRIO</Text>
              <Text style={styles.message}>Mensagem do usuário</Text>
            </View>
          </View>
        ))}

      </Pressable>

    </Pressable>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent", // 🔥 NÃO escurece tudo
  },

  box: {
    position: "absolute",
    top: 90, // 🔥 posição abaixo do header
    left: 20,
    width: 220,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    elevation: 10,
  },

  title: {
    fontWeight: "700",
    color: "#006916",
    marginBottom: 10,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    marginRight: 10,
  },

  name: {
    fontSize: 10,
    fontWeight: "700",
  },

  message: {
    fontSize: 9,
    color: "#666",
  },
});