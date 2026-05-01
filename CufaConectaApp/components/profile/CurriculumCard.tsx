import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import * as curriculosApi from "../../services/curriculosService";

type Props = {
  filename: string | null;
  loading: boolean;
  onChanged: () => void;
};

export default function CurriculumCard({ filename, loading, onChanged }: Props) {
  async function handleAttach() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets?.[0]) return;
      const asset = res.assets[0];
      await curriculosApi.uploadCurriculo({
        uri: asset.uri,
        name: asset.name ?? "curriculo.pdf",
        mimeType: asset.mimeType,
      });
      Alert.alert("Sucesso", "Currículo enviado.");
      onChanged();
    } catch {
      Alert.alert("Erro", "Não foi possível enviar o arquivo.");
    }
  }

  async function handleDelete() {
    Alert.alert("Excluir currículo", "Confirma a exclusão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await curriculosApi.removerCurriculo();
            Alert.alert("Removido", "Currículo excluído.");
            onChanged();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  const display = filename && filename.length > 0 ? `📎 ${filename}` : "Nenhum arquivo anexado";

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#0B6B2F" style={{ marginBottom: 8 }} />
      ) : null}
      <Text style={styles.file}>{display}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primary} onPress={handleAttach}>
          <Text style={styles.textWhite}>Anexar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondary}
          onPress={handleDelete}
          disabled={!filename}
        >
          <Text style={styles.textGreen}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  file: {
    backgroundColor: "#E5EEE3",
    padding: 12,
    borderRadius: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  primary: {
    backgroundColor: "#0B6B2F",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  secondary: {
    borderWidth: 1,
    borderColor: "#0B6B2F",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textWhite: {
    color: "#fff",
  },
  textGreen: {
    color: "#0B6B2F",
  },
});
