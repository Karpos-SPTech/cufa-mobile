import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCallback, useState } from "react";

import { absoluteApiUrl } from "../../lib/urls";
import * as usuariosApi from "../../services/usuariosService";
import type { UsuarioPerfil } from "../../types/api";

type Props = {
  perfil: UsuarioPerfil;
  onPerfilChanged: () => Promise<void>;
};

export default function ProfileHeader({ perfil, onPerfilChanged }: Props) {
  const nome = perfil.nome ?? "";
  const biografia = perfil.biografia ?? "";
  const cidade = perfil.cidade ?? "";
  const estado = perfil.estado ?? null;
  const fotoUrl = perfil.fotoUrl ?? null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draftNome, setDraftNome] = useState(nome);
  const [draftBio, setDraftBio] = useState(biografia);
  const [draftCidade, setDraftCidade] = useState(cidade);
  const [draftEstado, setDraftEstado] = useState(estado ?? "");

  const openEdit = useCallback(() => {
    setMenuOpen(false);
    setDraftNome(perfil.nome ?? "");
    setDraftBio(perfil.biografia ?? "");
    setDraftCidade(perfil.cidade ?? "");
    setDraftEstado(perfil.estado ?? "");
    setEditOpen(true);
  }, [perfil]);

  const closeEdit = useCallback(() => {
    if (saving) return;
    setEditOpen(false);
  }, [saving]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const body = usuariosApi.buildUsuarioCadastroPut(perfil, {
        nome: draftNome.trim(),
        biografia: draftBio.trim(),
        cidade: draftCidade.trim(),
        estado: draftEstado.trim(),
      });
      if (!body) {
        Alert.alert(
          "Cadastro incompleto",
          "Para salvar pelo app, o backend precisa retornar CPF, telefone, escolaridade, data de nascimento e estado civil no seu perfil. Complete o cadastro e tente de novo."
        );
        return;
      }
      await usuariosApi.putUsuarioDadosCadastro(body);
      await onPerfilChanged();
      setEditOpen(false);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }, [draftNome, draftBio, draftCidade, draftEstado, perfil, onPerfilChanged]);

  const remoteAvatar = absoluteApiUrl(fotoUrl);

  const location =
    cidade && estado ? `${cidade}, ${estado}` : cidade || estado || "";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuOpen((prev) => !prev)}
        hitSlop={12}
      >
        <Feather name="more-vertical" size={18} color="#000" />
      </TouchableOpacity>

      <Modal
        visible={menuOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.menuTitle}>Editar</Text>
            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={openEdit}>
              <Feather name="edit-2" size={16} color="#222" />
              <Text style={styles.menuText}>Editar perfil</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={editOpen} transparent animationType="fade" onRequestClose={closeEdit}>
        <View style={styles.editModalRoot}>
          <Pressable style={styles.editBackdrop} onPress={closeEdit} />
          <KeyboardAvoidingView
            style={styles.editKeyboard}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.editCard}>
              <Text style={styles.editTitle}>Editar perfil</Text>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text style={styles.fieldLabel}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={draftNome}
                  onChangeText={setDraftNome}
                  placeholder="Nome"
                  editable={!saving}
                />

                <Text style={styles.fieldLabel}>Biografia</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={draftBio}
                  onChangeText={setDraftBio}
                  placeholder="Sobre você"
                  multiline
                  textAlignVertical="top"
                  editable={!saving}
                />

                <Text style={styles.fieldLabel}>Cidade</Text>
                <TextInput
                  style={styles.input}
                  value={draftCidade}
                  onChangeText={setDraftCidade}
                  placeholder="Cidade"
                  editable={!saving}
                />

                <Text style={styles.fieldLabel}>Estado (UF)</Text>
                <TextInput
                  style={styles.input}
                  value={draftEstado}
                  onChangeText={setDraftEstado}
                  placeholder="Ex.: SP"
                  autoCapitalize="characters"
                  maxLength={2}
                  editable={!saving}
                />
              </ScrollView>

              <View style={styles.editActions}>
                <TouchableOpacity style={styles.btnCancel} onPress={closeEdit} disabled={saving}>
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSave} onPress={handleSave} disabled={saving}>
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnSaveText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {remoteAvatar ? (
        <Image source={{ uri: remoteAvatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Feather name="user" size={40} color="#444" />
        </View>
      )}

      <Text style={styles.name}>{nome || "Seu nome"}</Text>
      <Text style={styles.subtitle}>{biografia || "Adicione uma biografia"}</Text>
      {location ? <Text style={styles.location}>{location}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6BAA75",
    paddingVertical: 20,
    alignItems: "center",
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 12,
    paddingBottom: 18,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#EEE",
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuText: {
    fontSize: 14,
    color: "#222",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  location: {
    fontSize: 12,
    marginTop: 6,
    color: "#444",
  },
  editModalRoot: {
    flex: 1,
    justifyContent: "center",
  },
  editBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  editKeyboard: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  editCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    maxHeight: "88%",
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0B6B2F",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 100,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#E5EEE3",
  },
  btnCancelText: {
    color: "#333",
    fontWeight: "600",
  },
  btnSave: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#0B6B2F",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSaveText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
