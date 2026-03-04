import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CurriculumCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.file}>📎 demand_curriculo.pdf</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primary}>
          <Text style={styles.textWhite}>Anexar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary}>
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
    backgroundColor: '#E6E6E6',
    padding: 12,
    borderRadius: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  primary: {
    backgroundColor: '#0B6B2F',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#0B6B2F',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textWhite: {
    color: '#fff',
  },
  textGreen: {
    color: '#0B6B2F',
  },
});