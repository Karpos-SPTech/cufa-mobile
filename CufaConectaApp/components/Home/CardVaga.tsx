import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ImageSourcePropType,
} from "react-native";
import { useState } from "react";

import { useVagas } from "../../constants/VagasContext";

const PLACEHOLDER_LOGO = require("../../assets/images/mcdonalds.png");

export type CardVagaProps = {
  company: string;
  role: string;
  city: string;
  description: string;
  publicacaoId: number;
  /** Obrigatório para nova candidatura (ex.: lista da Home). Na aba de candidaturas pode ser omitido. */
  empresaId?: number;
  /** Imagem local opcional; senão usa placeholder */
  image?: ImageSourcePropType;
};

export default function CardVaga({
  company,
  role,
  city,
  description,
  publicacaoId,
  empresaId = 0,
  image,
}: CardVagaProps) {
  const { candidatar, appliedPublicacaoIds } = useVagas();
  const jaCandidatado = appliedPublicacaoIds.has(Number(publicacaoId));
  const [submitting, setSubmitting] = useState(false);
  const empresaIdNum = Number(empresaId) || 0;
  const podeCandidatar = empresaIdNum > 0;
  /** Vaga sem id da empresa na API: não dá para candidatar, mas não é “já candidatado”. */
  const candidaturaIndisponivel = !podeCandidatar && !jaCandidatado;

  const handleCandidatura = async () => {
    if (jaCandidatado || submitting || !podeCandidatar) return;
    setSubmitting(true);
    try {
      await candidatar(publicacaoId, empresaIdNum);
      Alert.alert("Parabéns!", `Você se candidatou à vaga em ${company}`);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível enviar a candidatura. Tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const logoSource = image ?? PLACEHOLDER_LOGO;

  return (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        <Image source={logoSource} style={styles.logo} resizeMode="cover" />

        <View style={styles.infoContainer}>
          <Text style={styles.company}>{company}</Text>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.city}>{city}</Text>
        </View>
      </View>

      <Text style={styles.label}>• Vaga oferecida pela empresa</Text>
      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity
        style={[
          styles.button,
          jaCandidatado && styles.buttonDone,
          candidaturaIndisponivel && styles.buttonUnavailable,
        ]}
        onPress={handleCandidatura}
        disabled={jaCandidatado || submitting || !podeCandidatar}
      >
        <Text style={styles.buttonText}>
          {jaCandidatado
            ? "CANDIDATADO"
            : candidaturaIndisponivel
              ? "INDISPONÍVEL"
              : submitting
                ? "ENVIANDO…"
                : "ME CANDIDATAR"}
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
    width: "100%",
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
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
  buttonUnavailable: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
