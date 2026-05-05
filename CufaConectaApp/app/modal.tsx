import { Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

/** Rota reservada pelo template Expo; pode ser usada como modal genérico ou removida do fluxo. */
export default function ModalRoute() {
  const router = useRouter();

  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
        <Text style={styles.title}>Modal</Text>
        <Text style={styles.hint}>Toque fora para fechar.</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B6B2F",
  },
  hint: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
});
