
import { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { isAxiosError } from "axios";

import * as curriculosApi from "../../services/curriculosService";
import type { AnaliseCurriculo } from "../../types/api";
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState, useEffect } from "react";

type Props = {
  filename: string | null;
  loading: boolean;
  onChanged: () => void;
};

type Analise = {
  resumo: string;
  pontosFortes: string[];
  pontosMelhoria: string[];
  sugestoes: string[];
};

export default function CurriculumCard({ filename }: Props) {
  const [localFilename, setLocalFilename] = useState<string | null>(filename);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setLocalFilename(filename);
  }, [filename]);

  async function handleAttach() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
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
    } catch (err) {
      Alert.alert("Erro", mensagemErroApi(err));
    }
  }

  async function handleAnalyze() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets?.[0]) return;
      const asset = res.assets[0];

      setAnalyzing(true);
      setAnalise(null);
      const data = await curriculosApi.analisarCurriculoPdf({
        uri: asset.uri,
        name: asset.name ?? "curriculo.pdf",
        mimeType: asset.mimeType,
      });
      setAnalise(data);
      setModalVisible(true);
    } catch (err) {
      Alert.alert("Análise", mensagemErroApi(err));
    } finally {
      setAnalyzing(false);
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
          } catch (err) {
            Alert.alert("Erro", mensagemErroApi(err));
          }
        },
      },
    ]);

      setFileUri(asset.uri);
      setLocalFilename(asset.name ?? "curriculo.pdf");

      Alert.alert("Sucesso", "Currículo anexado!");
    } catch {
      Alert.alert("Erro", "Falha ao anexar arquivo.");
    }
  }

  async function handleAnalyze() {
    if (!fileUri) {
      Alert.alert("Erro", "Anexe um currículo primeiro.");
      return;
    }

    try {
      setAnalyzing(true);

      await new Promise((r) => setTimeout(r, 1500));

      const data: Analise = {
        resumo: "Currículo bem estruturado, mas pode melhorar em palavras-chave.",
        pontosFortes: ["Boa organização", "Experiência relevante"],
        pontosMelhoria: ["Poucas métricas", "Faltam palavras-chave ATS"],
        sugestoes: ["Adicionar resultados mensuráveis", "Incluir mais tecnologias"],
      };

      setAnalise(data);
      setModalVisible(true);
    } catch {
      Alert.alert("Erro", "Falha ao analisar currículo.");
    } finally {
      setAnalyzing(false);
    }
  }

  const display =
    localFilename && localFilename.length > 0
      ? `📎 ${localFilename}`
      : "Nenhum arquivo anexado";

  return (
    <View style={styles.container}>
      <Text style={styles.file}>{display}</Text>

      <View style={styles.buttons}>
        
        <TouchableOpacity style={styles.secondary} onPress={handleAttach}>
          <Text style={styles.textGreen}>Anexar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primary} onPress={handleAnalyze}>
          <Text style={styles.textWhite}>Analisar currículo</Text>
        </TouchableOpacity>

      </View>

      {analyzing && <ActivityIndicator style={{ marginTop: 10 }} />}

      {/* ✅ MODAL CORRIGIDO */}
      {modalVisible && analise && (
        <SafeAreaView style={styles.safeArea}>
          <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>

              {/* 🔥 CONTEÚDO SCROLL */}
              <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.handle} />
                <Text style={styles.title}>Análise do currículo</Text>

                <Text style={styles.section}>Resumo</Text>
                <Text>{analise.resumo}</Text>

                <Text style={styles.section}>Pontos fortes</Text>
                {analise.pontosFortes.map((item, i) => (
                  <Text key={i}>• {item}</Text>
                ))}

                <Text style={styles.section}>Melhorias</Text>
                {analise.pontosMelhoria.map((item, i) => (
                  <Text key={`m-${i}`} style={styles.bodyText}>
                    • {item}
                  </Text>
                  <Text key={i}>• {item}</Text>
                ))}

                <Text style={styles.section}>Sugestões</Text>
                {analise.sugestoes.map((item, i) => (
                  <Text key={`s-${i}`} style={styles.bodyText}>
                    • {item}
                  </Text>
                ))}
              </ScrollView>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnClose} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
                  <Text key={i}>• {item}</Text>
                ))}
              </ScrollView>

              {/* 🔥 FOOTER FIXO (CORRIGE BUG) */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnPrimaryText}>Fechar</Text>
                </TouchableOpacity>
              </View>

            </Pressable>
          </Pressable>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },

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
  analyzeBtn: {
    backgroundColor: "#0B6B2F",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  analyzeBtnDisabled: {
    opacity: 0.7,
  },
  textWhite: {
    color: "#fff",
    fontWeight: "600",
  },
  textGreen: {
    color: "#0B6B2F",
    fontWeight: "600",
  },
  textDisabled: {
    opacity: 0.45,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingBottom: 8,
  },

  textWhite: { color: "#fff" },
  textGreen: { color: "#0B6B2F" },

  safeArea: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
  },

  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
    color: "#0B6B2F",
  },
  modalScroll: {
    maxHeight: 420,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  section: {
    marginTop: 12,
    fontWeight: "700",
    fontSize: 15,
    color: "#222",
  },
  bodyText: {
    marginTop: 4,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  modalActions: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  btnClose: {
    backgroundColor: "#0B6B2F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnCloseText: {
    marginVertical: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  section: {
    marginTop: 10,
    fontWeight: "700",
  },

  actions: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  btnPrimary: {
    backgroundColor: "#0B6B2F",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  btnPrimaryText: {
    color: "#fff",
    fontWeight: "800",
  },
});