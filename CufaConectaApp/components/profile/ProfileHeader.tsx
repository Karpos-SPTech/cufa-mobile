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
import { useCallback, useEffect, useState, type ReactNode } from "react";

import FormSelect from "../../components/Base/FormSelect";
import {
  ESCOLARIDADE_OPCOES,
  ESTADO_CIVIL_OPCOES,
  UF_OPCOES,
} from "../../constants/perfilOptions";
import { formatApiError } from "../../lib/formatApiError";
import { absoluteApiUrl } from "../../lib/urls";
import * as usuariosApi from "../../services/usuariosService";
import type { PerfilEditFields } from "../../services/usuariosService";
import type { UsuarioPerfil } from "../../types/api";

// Funções de formatação
const formatarCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatarTelefone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const formatarData = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.slice(0, 8).replace(/(\d{2})(\d{2})(\d{4})/, "$1-$2-$3");
};

type Props = {
  perfil: UsuarioPerfil;
  onPerfilChanged: () => Promise<void>;
  onRegisterOpenEdit?: (openEdit: () => void) => void;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function ProfileHeader({ perfil, onPerfilChanged, onRegisterOpenEdit }: Props) {
  const nome = perfil.nome ?? "";
  const cidade = perfil.cidade ?? "";
  const estado = perfil.estado ?? null;
  const fotoUrl = perfil.fotoUrl ?? null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<PerfilEditFields>(() =>
    usuariosApi.perfilEditFieldsFromUsuario(perfil)
  );

  const patchDraft = useCallback((patch: Partial<PerfilEditFields>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const openEdit = useCallback(() => {
    setMenuOpen(false);
    setDraft(usuariosApi.perfilEditFieldsFromUsuario(perfil));
    setEditOpen(true);
  }, [perfil]);

  useEffect(() => {
    onRegisterOpenEdit?.(openEdit);
  }, [onRegisterOpenEdit, openEdit]);

  const closeEdit = useCallback(() => {
    if (saving) return;
    setEditOpen(false);
  }, [saving]);

  const handleSave = useCallback(async () => {
    const validationError = usuariosApi.getPerfilEditValidationMessage(draft);
    if (validationError) {
      Alert.alert("Revise os dados", validationError);
      return;
    }

    const body = usuariosApi.buildUsuarioCadastroPut(draft);
    if (!body) {
      Alert.alert("Revise os dados", "Não foi possível montar o cadastro. Verifique os campos.");
      return;
    }

    setSaving(true);
    try {
      await usuariosApi.putUsuarioDadosCadastro(body);
      await onPerfilChanged();
      setEditOpen(false);
    } catch (err) {
      Alert.alert("Erro", formatApiError(err, { maxLength: 220 }));
    } finally {
      setSaving(false);
    }
  }, [draft, onPerfilChanged]);

  const remoteAvatar = absoluteApiUrl(fotoUrl);
  const location =
    cidade && estado ? `${cidade}, ${estado}` : cidade || estado || "";
  const cadastroIncompleto = Boolean(
    usuariosApi.getPerfilEditValidationMessage(usuariosApi.perfilEditFieldsFromUsuario(perfil))
  );

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
        <Pressable style={styles.editModalRoot} onPress={closeEdit}>
          <KeyboardAvoidingView
            style={styles.editKeyboard}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Pressable style={styles.editCard} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.editTitle}>Editar perfil</Text>
              <Text style={styles.editHint}>
                Preencha todos os campos. A data deve estar no formato DD-MM-AAAA.
              </Text>

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Field label="Nome">
                  <TextInput
                    style={styles.input}
                    value={draft.nome}
                    onChangeText={(value) => patchDraft({ nome: value })}
                    placeholder="Nome completo"
                    editable={!saving}
                  />
                </Field>

                <Field label="CPF">
                  <TextInput
                    style={styles.input}
                    value={draft.cpf}
                    onChangeText={(value) => patchDraft({ cpf: formatarCPF(value) })}
                    placeholder="000.000.000-00"
                    keyboardType="number-pad"
                    editable={!saving}
                  />
                </Field>

                <Field label="Telefone">
                  <TextInput
                    style={styles.input}
                    value={draft.telefone}
                    onChangeText={(value) => patchDraft({ telefone: formatarTelefone(value) })}
                    placeholder="(11) 99999-9999"
                    keyboardType="phone-pad"
                    editable={!saving}
                  />
                </Field>

                <Field label="Data de nascimento">
                  <TextInput
                    style={styles.input}
                    value={draft.dtNascimento}
                    onChangeText={(value) => patchDraft({ dtNascimento: formatarData(value) })}
                    placeholder="DD-MM-AAAA"
                    keyboardType="number-pad"
                    editable={!saving}
                  />
                </Field>

                <FormSelect
                  label="Estado civil"
                  value={draft.estadoCivil}
                  options={ESTADO_CIVIL_OPCOES}
                  onChange={(value) => patchDraft({ estadoCivil: value })}
                  disabled={saving}
                />

                <FormSelect
                  label="Escolaridade"
                  value={draft.escolaridade}
                  options={ESCOLARIDADE_OPCOES}
                  onChange={(value) => patchDraft({ escolaridade: value })}
                  disabled={saving}
                />

                <Field label="Cidade">
                  <TextInput
                    style={styles.input}
                    value={draft.cidade}
                    onChangeText={(value) => patchDraft({ cidade: value })}
                    placeholder="Cidade"
                    editable={!saving}
                  />
                </Field>

                <FormSelect
                  label="Estado (UF)"
                  value={draft.estado}
                  options={UF_OPCOES}
                  onChange={(value) => patchDraft({ estado: value })}
                  disabled={saving}
                />

                <Field label="Biografia">
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    value={draft.biografia}
                    onChangeText={(value) => patchDraft({ biografia: value })}
                    placeholder="Conte um pouco sobre você"
                    multiline
                    textAlignVertical="top"
                    editable={!saving}
                  />
                </Field>
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
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {remoteAvatar ? (
        <Image source={{ uri: remoteAvatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Feather name="user" size={40} color="#444" />
        </View>
      )}

      <Text style={styles.name}>{nome || "Seu nome"}</Text>
      {location ? <Text style={styles.location}>{location}</Text> : null}
      {perfil.email ? <Text style={styles.email}>{perfil.email}</Text> : null}
      {cadastroIncompleto ? (
        <Text style={styles.incompleteHint}>Complete seu cadastro para salvar alterações.</Text>
      ) : null}
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
  location: {
    fontSize: 13,
    marginTop: 6,
    color: "#333",
  },
  email: {
    fontSize: 12,
    marginTop: 4,
    color: "#555",
  },
  incompleteHint: {
    marginTop: 8,
    fontSize: 11,
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.65)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editModalRoot: {
    flex: 1,
    justifyContent: "center",
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
    marginBottom: 6,
    color: "#0B6B2F",
  },
  editHint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    lineHeight: 17,
  },
  fieldBlock: {
    marginBottom: 4,
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
    marginBottom: 8,
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
