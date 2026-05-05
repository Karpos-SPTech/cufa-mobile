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
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, type Href } from "expo-router";

import Header from "../../components/Base/Header";
import { useAuth } from "../../constants/AuthContext";
import SectionTitle from "../../components/Base/SectionTitle";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ExperienceCard from "../../components/profile/ExperienceCard";
import CurriculumCard from "../../components/profile/CurriculumCard";
import * as experienciasApi from "../../services/experienciasService";
import * as curriculosApi from "../../services/curriculosService";
import { getUsuarioAtual } from "../../services/usuariosService";
import { defaultExperienciaRange, formatExperienciaPeriod } from "../../lib/date";
import type { ExperienciaApi, UsuarioPerfil } from "../../types/api";

export default function Profile() {
  const router = useRouter();
  const { logout, refreshPerfil } = useAuth();

  const [usuarioPerfil, setUsuarioPerfil] = useState<UsuarioPerfil | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [experiences, setExperiences] = useState<ExperienciaApi[]>([]);
  const [expLoading, setExpLoading] = useState(true);

  const [curriculoNome, setCurriculoNome] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(true);

  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expCity, setExpCity] = useState("");
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const u = await getUsuarioAtual();
      setUsuarioPerfil(u);
    } catch {
      setUsuarioPerfil(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

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

  const handleAddExperience = async () => {
    if (!expTitle.trim() || !expCompany.trim()) {
      return;
    }

    const empresaLabel = expCity.trim()
      ? `${expCompany.trim()} (${expCity.trim()})`
      : expCompany.trim();
    const { dtInicio, dtFim } = defaultExperienciaRange();

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
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a experiência.");
    }

    setExpTitle("");
    setExpCompany("");
    setExpCity("");
    setEditingExperienceId(null);
    setExperienceModalOpen(false);
  };

  const handleCloseExperienceModal = () => {
    setExperienceModalOpen(false);
    setEditingExperienceId(null);
    setExpTitle("");
    setExpCompany("");
    setExpCity("");
  };

  const handleEditExperience = (item: ExperienciaApi) => {
    setEditingExperienceId(item.id);
    setExpTitle(item.cargo);
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
    Alert.alert("Excluir experiência", "Remover este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await experienciasApi.removerExperiencia(item.id);
            await loadExperiencias();
            handleCloseExperienceModal();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.content}>
        {profileLoading ? (
          <ActivityIndicator color="#0B6B2F" style={{ marginTop: 16 }} />
        ) : usuarioPerfil ? (
          <ProfileHeader
            perfil={usuarioPerfil}
            onPerfilChanged={async () => {
              await loadProfile();
              await refreshPerfil();
            }}
          />
        ) : null}

        <View style={styles.inner}>
          <SectionTitle title="Sobre" />

          <SectionTitle
            title="Experiência"
            showAdd
            onAdd={() => {
              setEditingExperienceId(null);
              setExpTitle("");
              setExpCompany("");
              setExpCity("");
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
                city={formatExperienciaPeriod(item.dtInicio, item.dtFim)}
                onEdit={() => handleEditExperience(item)}
                onDelete={() => handleDeleteExperience(item)}
              />
            ))
          )}

          <SectionTitle title="Currículo" />
          <CurriculumCard
            filename={curriculoNome}
            loading={cvLoading}
            onChanged={loadCurriculo}
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
              <View style={{ flexDirection: "row", gap: 10 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  inner: {
    padding: 20,
  },
  emptyText: {
    color: "#666",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#E5EEE3",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  modalActions: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
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
    marginBottom: 40,
    alignItems: "center",
  },
  logoutText: {
    color: "#a00",
    fontWeight: "600",
    fontSize: 15,
  },
});
