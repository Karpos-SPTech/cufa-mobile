import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useVagas } from "../../constants/VagasContext";

export default function Card({ company, role, city, image }: any) {
  const { candidatar, vagasCandidatadas } = useVagas();
  const jaCandidatado = vagasCandidatadas.some((v: any) => v.company === company);

  const handleCandidatura = () => {
    if (!jaCandidatado) {
      candidatar({ company, role, city, image });
      Alert.alert("Parabéns!", `Você se candidatou à vaga no ${company}`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        {/* AQUI ESTÁ O SEGREDO: Definir width e height fixos */}
        <Image source={image} style={styles.logo} resizeMode="cover" />
        
        <View style={styles.infoContainer}>
          <Text style={styles.company}>{company}</Text>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.city}>{city}</Text>
        </View>
      </View>

      <Text style={styles.label}>• Vaga oferecida pela empresa</Text>
      <Text style={styles.description}>
        Descrição da empresa - Lorem ipsum dolor sit amet...
      </Text>

      <TouchableOpacity 
        style={[styles.button, jaCandidatado && styles.buttonDone]} 
        onPress={handleCandidatura}
        disabled={jaCandidatado}
      >
        <Text style={styles.buttonText}>
          {jaCandidatado ? "CANDIDATADO" : "ME CANDIDATAR"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    width: '100%', // Garante que o card não passe da tela
  },
  headerCard: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,  // TAMANHO FIXO PARA NÃO EXPLODIR
    height: 60, // TAMANHO FIXO PARA NÃO EXPLODIR
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1, // Faz o texto ocupar o resto do espaço sem empurrar a imagem
  },
  company: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0B6B2F",
  },
  role: {
    fontSize: 13,
    color: "#333",
  },
  city: {
    fontSize: 13,
    color: "#666",
  },
  label: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#0B6B2F",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonDone: {
    backgroundColor: "#000",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});