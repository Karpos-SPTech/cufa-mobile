import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, type Href } from "expo-router";

import Header from "../../components/Base/Header";
import { useAuth } from "../../constants/AuthContext";
import SectionTitle from "../../components/Base/SectionTitle";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ExperienceCard from "../../components/profile/ExperienceCard";
import CurriculumCard from "../../components/profile/CurriculumCard";
import ConfirmDialog from "../../components/Base/ConfirmDialog";
import * as experienciasApi from "../../services/experienciasService";
import * as curriculosApi from "../../services/curriculosService";
import { getUsuarioAtual } from "../../services/usuariosService";
import { formatApiError } from "../../lib/formatApiError";
import {
  defaultExperienciaRange,
  formatExperienciaPeriod,
  normalizeApiDate,
  toDdMmYyyyFromIso,
} from "../../lib/date";
import type { ExperienciaApi, UsuarioPerfil } from "../../types/api";

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value.trim()}</Text>
    </View>
  );
}

export default function Profile() {
  const router = useRouter();
  const { logout, refreshPerfil, perfil: perfilAuth } = useAuth();
  const openProfileEditRef = useRef<(() => void) | null>(null);

  const [usuarioPerfil, setUsuarioPerfil] = useState<UsuarioPerfil | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  const [experiences, setExperiences] = useState<ExperienciaApi[]>([]);
  const [expLoading, setExpLoading] = useState(true);

  const [curriculoNome, setCurriculoNome] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(true);

  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<ExperienciaApi | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expCity, setExpCity] = useState("");
  const [expDtInicio, setExpDtInicio] = useState("");
  const [expDtFim, setExpDtFim] = useState("");
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError(false);
    try {
      const u = await getUsuarioAtual();
      setUsuarioPerfil(u);
    } catch {
      setUsuarioPerfil(perfilAuth);
      setProfileError(!perfilAuth);
    } finally {
      setProfileLoading(false);
    }
  }, [perfilAuth]);

  const loadExperiencias = useCallback(async () => {
    setExpLoading(true);
    try {
      const list = await experienciasApi.listarExperiencias();
      setExperiences(list);
    } catch {
      setExperiences([]);
    } finally {
      setExpLoading(false);
    }
  }, []);

  const loadCurriculo = useCallback(async () => {
    setCvLoading(true);
    try {
      const c = await curriculosApi.getCurriculoArquivo();
      setCurriculoNome(c.filename || null);
    } catch {
      setCurriculoNome(null);
    } finally {
      setCvLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadExperiencias();
      loadCurriculo();
    }, [loadProfile, loadExperiencias, loadCurriculo])
  );

  const resetExperienceForm = () => {
    setExpTitle("");
    setExpCompany("");
    setExpCity("");
    setExpDtInicio("");
    setExpDtFim("");
    setEditingExperienceId(null);
  };

  const handleAddExperience = async () => {
    if (!expTitle.trim() || !expCompany.trim()) {
      Alert.alert("Atenção", "Preencha cargo e empresa.");
      return;
    }

    const empresaLabel = expCity.trim()
      ? `${expCompany.trim()} (${expCity.trim()})`
      : expCompany.trim();

    const fallback = defaultExperienciaRange();
    const dtInicio = expDtInicio.trim() || fallback.dtInicio;
    const dtFim = expDtFim.trim() || fallback.dtFim;

    try {
      if (editingExperienceId != null) {
        await experienciasApi.atualizarExperiencia(editingExperienceId, {
          cargo: expTitle.trim(),
          empresa: empresaLabel,
          dtInicio,
          dtFim,
        });
      } else {
        await experienciasApi.criarExperiencia({
          cargo: expTitle.trim(),
          empresa: empresaLabel,
          dtInicio,
          dtFim,
        });
      }
      await loadExperiencias();
      resetExperienceForm();
      setExperienceModalOpen(false);
    } catch (err) {
      Alert.alert("Erro", formatApiError(err, { maxLength: 220 }));
    }
  };

  const handleCloseExperienceModal = () => {
    setExperienceModalOpen(false);
    resetExperienceForm();
  };

  const handleEditExperience = (item: ExperienciaApi) => {
    setEditingExperienceId(item.id);
    setExpTitle(item.cargo);
    setExpDtInicio(normalizeApiDate(item.dtInicio));
    setExpDtFim(normalizeApiDate(item.dtFim));

    const raw = item.empresa;
    const match = raw.match(/^(.*) \((.*)\)$/);
    if (match) {
      setExpCompany(match[1].trim());
      setExpCity(match[2].trim());
    } else {
      setExpCompany(raw);
      setExpCity("");
    }
    setExperienceModalOpen(true);
  };

  const handleDeleteExperience = (item: ExperienciaApi) => {
    setExperienceToDelete(item);
  };

  const confirmDeleteExperience = async () => {
    const item = experienceToDelete;
    if (!item) return;
    setExperienceToDelete(null);
    try {
      await experienciasApi.removerExperiencia(item.id);
      await loadExperiencias();
      handleCloseExperienceModal();
    } catch (err) {
      Alert.alert("Erro", formatApiError(err, { maxLength: 220 }));
    }
  };

  const perfil = usuarioPerfil ?? perfilAuth;

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {profileLoading ? (
          <ActivityIndicator color="#0B6B2F" style={{ marginTop: 16 }} />
        ) : perfil ? (
          <ProfileHeader
            perfil={perfil}
            onRegisterOpenEdit={(openEdit) => {
              openProfileEditRef.current = openEdit;
            }}
            onPerfilChanged={async () => {
              await loadProfile();
              await refreshPerfil();
              await loadCurriculo();
            }}
          />
        ) : profileError ? (
          <Text style={styles.errorText}>Não foi possível carregar seu perfil.</Text>
        ) : null}

        {perfil ? (
          <View style={styles.inner}>
            <SectionTitle
              title="Sobre"
              onEdit={() => openProfileEditRef.current?.()}
            />

            <View style={styles.aboutCard}>
              <Text style={styles.aboutBio}>
                {perfil.biografia?.trim() || "Nenhuma biografia cadastrada. Toque em editar para adicionar."}
              </Text>
              <InfoRow label="CPF" value={perfil.cpf} />
              <InfoRow label="Telefone" value={perfil.telefone} />
              <InfoRow
                label="Nascimento"
                value={
                  perfil.dtNascimento != null
                    ? toDdMmYyyyFromIso(normalizeApiDate(perfil.dtNascimento))
                    : null
                }
              />
              <InfoRow label="Escolaridade" value={perfil.escolaridade} />
              <InfoRow label="Estado civil" value={perfil.estadoCivil} />
              {perfil.idade != null ? (
                <InfoRow label="Idade" value={`${perfil.idade} anos`} />
              ) : null}
            </View>

            <SectionTitle
              title="Experiência"
              showAdd
              showEdit={false}
              onAdd={() => {
                resetExperienceForm();
                const { dtInicio, dtFim } = defaultExperienciaRange();
                setExpDtInicio(dtInicio);
                setExpDtFim(dtFim);
                setExperienceModalOpen(true);
              }}
            />

            {expLoading ? (
              <ActivityIndicator color="#0B6B2F" style={{ marginVertical: 8 }} />
            ) : experiences.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma experiência adicionada ainda.</Text>
            ) : (
              experiences.map((item) => (
                <ExperienceCard
                  key={item.id}
                  title={item.cargo}
                  company={item.empresa}
                  period={formatExperienciaPeriod(item.dtInicio, item.dtFim)}
                  onEdit={() => handleEditExperience(item)}
                  onDelete={() => handleDeleteExperience(item)}
                />
              ))
            )}

            <SectionTitle title="Currículo" showEdit={false} />
            <CurriculumCard
              filename={curriculoNome}
              curriculoUrl={perfil.curriculoUrl}
              loading={cvLoading}
              onChanged={async () => {
                await loadCurriculo();
                await loadProfile();
                await refreshPerfil();
              }}
            />

            <TouchableOpacity
              style={styles.logout}
              onPress={async () => {
                await logout();
                router.replace("/login" as Href);
              }}
            >
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={experienceModalOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseExperienceModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseExperienceModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>
              {editingExperienceId != null ? "Editar experiência" : "Adicionar experiência"}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Cargo"
              value={expTitle}
              onChangeText={setExpTitle}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Empresa"
              value={expCompany}
              onChangeText={setExpCompany}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Cidade (opcional)"
              value={expCity}
              onChangeText={setExpCity}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Início (AAAA-MM-DD)"
              value={expDtInicio}
              onChangeText={setExpDtInicio}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Fim (AAAA-MM-DD)"
              value={expDtFim}
              onChangeText={setExpDtFim}
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              {editingExperienceId != null ? (
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() => {
                    const item = experiences.find((e) => e.id === editingExperienceId);
                    if (item) handleDeleteExperience(item);
                  }}
                >
                  <Text style={styles.modalDeleteText}>Excluir</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancel} onPress={handleCloseExperienceModal}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={handleAddExperience}>
                  <Text style={styles.modalSaveText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={experienceToDelete != null}
        title="Excluir experiência"
        message="Remover este registro?"
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDeleteExperience}
        onCancel={() => setExperienceToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5EEE3",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  inner: {
    paddingHorizontal: 20,
  },
  aboutCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  aboutBio: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333",
    marginBottom: 10,
  },
  infoRow: {
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0B6B2F",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  emptyText: {
    color: "#666",
    marginBottom: 12,
  },
  errorText: {
    color: "#a00",
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0B6B2F",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  modalActions: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancel: {
    backgroundColor: "#E5EEE3",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  modalCancelText: {
    color: "#333",
    fontWeight: "600",
  },
  modalSave: {
    backgroundColor: "#0B6B2F",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  modalSaveText: {
    color: "#FFF",
    fontWeight: "700",
  },
  modalDelete: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  modalDeleteText: {
    color: "#a00",
    fontWeight: "700",
  },
  logout: {
    marginTop: 28,
    marginBottom: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#a00",
    fontWeight: "600",
    fontSize: 15,
  },
});
