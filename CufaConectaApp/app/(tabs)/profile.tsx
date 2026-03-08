import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';

import Header from '../../components/Base/Header';
import SectionTitle from '../../components/Base/SectionTitle';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ExperienceCard from '../../components/profile/ExperienceCard';
import CurriculumCard from '../../components/profile/CurriculumCard';

type ExperienceItem = { id: string; title: string; company: string; city: string };

// Session storage em memória (temporário, perde ao fechar o app)
let experienceSession: ExperienceItem[] = [];

export default function Profile() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expCity, setExpCity] = useState('');
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  useEffect(() => {
    setExperiences(experienceSession);
  }, []);

  const saveExperiences = (
    items: { id: string; title: string; company: string; city: string }[]
  ) => {
    setExperiences(items);
    experienceSession = items;
  };

  const handleAddExperience = async () => {
    if (!expTitle.trim() || !expCompany.trim()) {
      return;
    }

    if (editingExperienceId) {
      const updated = experiences.map((item) =>
        item.id === editingExperienceId
          ? {
              ...item,
              title: expTitle.trim(),
              company: expCompany.trim(),
              city: expCity.trim(),
            }
          : item
      );

      saveExperiences(updated);
    } else {
      const newItem = {
        id: Date.now().toString(),
        title: expTitle.trim(),
        company: expCompany.trim(),
        city: expCity.trim(),
      };

      saveExperiences([newItem, ...experiences]);
    }

    setExpTitle('');
    setExpCompany('');
    setExpCity('');
    setEditingExperienceId(null);
    setExperienceModalOpen(false);
  };

  const handleCloseExperienceModal = () => {
    setExperienceModalOpen(false);
    setEditingExperienceId(null);
    setExpTitle('');
    setExpCompany('');
    setExpCity('');
  };

  const handleEditExperience = (item: ExperienceItem) => {
    setEditingExperienceId(item.id);
    setExpTitle(item.title);
    setExpCompany(item.company);
    setExpCity(item.city);
    setExperienceModalOpen(true);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.content}>
        <ProfileHeader />

        <View style={styles.inner}>
          <SectionTitle title="Sobre" />

          <SectionTitle
            title="Experiência"
            showAdd
            onAdd={() => {
              setEditingExperienceId(null);
              setExpTitle('');
              setExpCompany('');
              setExpCity('');
              setExperienceModalOpen(true);
            }}
          />

          {experiences.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma experiência adicionada ainda.
            </Text>
          ) : (
            experiences.map((item) => (
              <ExperienceCard
                key={item.id}
                title={item.title}
                company={item.company}
                city={item.city}
                onEdit={() => handleEditExperience(item)}
              />
            ))
          )}

          <SectionTitle title="Currículo" />
          <CurriculumCard />
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
              {editingExperienceId ? 'Editar experiência' : 'Adicionar experiência'}
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
              placeholder="Cidade"
              value={expCity}
              onChangeText={setExpCity}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={handleCloseExperienceModal}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleAddExperience}
              >
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
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
    color: '#666',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#E5EEE3',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5EEE3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  modalActions: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancel: {
    backgroundColor: '#E5EEE3',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  modalCancelText: {
    color: '#333',
    fontWeight: '600',
  },
  modalSave: {
    backgroundColor: '#0B6B2F',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  modalSaveText: {
    color: '#FFF',
    fontWeight: '700',
  },
});