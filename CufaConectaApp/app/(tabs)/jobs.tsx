import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useVagas } from '../../constants/VagasContext';
import Vagas from '../../components/Home/CardVaga';
import Header from '../../components/Base/Header';

export default function JobsScreen() {
  const { vagasCandidatadas } = useVagas();

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Minhas Candidaturas</Text>
      
      {vagasCandidatadas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.subtitle}>Você ainda não se candidatou a nenhuma vaga.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {vagasCandidatadas.map((vaga, index) => (
            <Vagas key={index} {...vaga} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5EEE3" },
  title: { fontSize: 20, fontWeight: '700', margin: 16, color: '#0B6B2F' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
});