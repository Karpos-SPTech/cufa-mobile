import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function EditarBio() {
  const router = useRouter();
  const { from, section } = useLocalSearchParams<{
    from?: string;
    section?: string;
  }>();
  const [bio, setBio] = useState('');
  const modalTitle = section === 'sobre' ? 'Editar sobre você' : 'Editar Biografia';

  useEffect(() => {
    if (from !== 'profile') {
      router.replace('/(tabs)/profile');
    }
  }, [from, router]);

  function handleClose() {
    router.back();
  }

  function handleSave() {
    // depois vamos conectar com state global ou API
    handleClose();
  }

  if (from !== 'profile') {
    return null;
  }

  return (
    <Pressable style={styles.overlay} onPress={handleClose}>
      <Pressable style={styles.container} onPress={() => {}}>
        <Text style={styles.title}>{modalTitle}</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sobre você"
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#E8ECE9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0B6B2F',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});