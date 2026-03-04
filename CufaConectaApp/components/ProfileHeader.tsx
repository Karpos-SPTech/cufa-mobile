import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
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