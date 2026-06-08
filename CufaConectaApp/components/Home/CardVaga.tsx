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
import { DeviceEventEmitter } from "react-native";

import { useVagas } from "../../constants/VagasContext";

/** Paleta para o avatar gerado a partir do nome da empresa (sem logo real). */
const AVATAR_COLORS = [
  "#0B6B2F",
  "#1E6FB8",
  "#B8541E",
  "#7A1FB8",
  "#1FB89E",
  "#B81F5B",
  "#5B7A1F",
  "#1F3DB8",
];

function getCompanyInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

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
      DeviceEventEmitter.emit("cufa:candidatura-criada", {
        company,
        role,
        publicacaoId,
      });
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

  const initials = getCompanyInitials(company);
  const avatarColor = getColorForName(company || "Empresa");

  return (
    <View style={styles.card}>
      <View style={styles.headerCard}>
        {image ? (
          <Image source={image} style={styles.logo} resizeMode="cover" />
        ) : (
          <View style={[styles.logo, styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}

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
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 22,
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
