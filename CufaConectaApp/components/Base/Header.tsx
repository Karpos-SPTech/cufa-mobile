import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 1. Importar o router

export default function Header() {
  const router = useRouter(); // 2. Inicializar o router

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push("/notifications")}>
        <Feather name="bell" size={24} color="white" />
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/cufaLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* 3. Adicionar o onPress para navegar para a rota do perfil */}
      <TouchableOpacity
        style={styles.profileCircle}
        onPress={() => router.push("/profile")}
      >
        <View style={styles.avatarPlaceholder} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#006916",
    height: 110,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  logo: {
    width: 100,
    height: 40,
    tintColor: '#FFFFFF',
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D9D9D9",
  },
  avatarPlaceholder: {
    flex: 1,
  }
});