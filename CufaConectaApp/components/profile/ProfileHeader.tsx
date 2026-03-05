import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

export default function ProfileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleEditOption(field: 'foto' | 'nome' | 'biografia' | 'cidade') {
    // TODO: conectar com sua API futuramente
    setMenuOpen(false);
  }

  const menuOptions = [
    { key: 'foto', label: 'Foto', icon: 'image' },
    { key: 'nome', label: 'Nome', icon: 'user' },
    { key: 'biografia', label: 'Biografia', icon: 'file-text' },
    { key: 'cidade', label: 'Cidade', icon: 'map-pin' },
  ] as const;

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

            {menuOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.menuItem}
                onPress={() => handleEditOption(option.key)}
              >
                <Feather name={option.icon} size={16} color="#222" />
                <Text style={styles.menuText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <Image
        source={{ uri: 'https://i.pravatar.cc/150' }}
        style={styles.avatar}
      />

      <Text style={styles.name}>GUILHERME SILVA</Text>
      <Text style={styles.subtitle}>Biografia do usuário</Text>
      <Text style={styles.location}>São Paulo, SP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6BAA75',
    paddingVertical: 20,
    alignItems: 'center',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 12,
    paddingBottom: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuText: {
    fontSize: 14,
    color: '#222',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    marginTop: 6,
    color: '#444',
  },
});
