import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, type Href } from "expo-router";

/**
 * A edição de biografia foi unificada no modal "Editar perfil" em {@link ProfileHeader}.
 * Mantemos esta rota para links antigos; redireciona para a aba perfil.
 */
export default function EditarBio() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)/profile" as Href);
  }, [router]);

  return (
    <View style={styles.center}>
      <ActivityIndicator color="#0B6B2F" size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E5EEE3" },
});
