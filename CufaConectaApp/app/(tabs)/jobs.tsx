import { useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useVagas } from "../../constants/VagasContext";
import Vagas from "../../components/Home/CardVaga";
import Header from "../../components/Base/Header";

export default function JobsScreen() {
  const { candidaturas, loadingCandidaturas, refreshCandidaturas } = useVagas();

  useFocusEffect(
    useCallback(() => {
      refreshCandidaturas();
    }, [refreshCandidaturas])
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Minhas Candidaturas</Text>

      {loadingCandidaturas && candidaturas.length === 0 ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color="#0B6B2F" />
        </View>
      ) : candidaturas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.subtitle}>Você ainda não se candidatou a nenhuma vaga.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={loadingCandidaturas} onRefresh={refreshCandidaturas} />
          }
        >
          {candidaturas.map((vaga) => (
            <Vagas
              key={vaga.publicacaoId}
              company={vaga.nomeEmpresa}
              role={vaga.titulo}
              city={`Contrato: ${vaga.tipoContrato}`}
              description={vaga.descricao?.trim() || "Sem descrição."}
              publicacaoId={vaga.publicacaoId}
              empresaId={0}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5EEE3" },
  title: { fontSize: 20, fontWeight: "700", margin: 16, color: "#0B6B2F" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center" },
});
