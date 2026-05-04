import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../../components/Base/Header";
import CardVaga from "../../components/Home/CardVaga";
import { publicacaoPassaNoFiltroContrato, useFiltrosVagas } from "../../constants/FiltrosVagasContext";
import { listarPublicacoes } from "../../services/publicacoesService";
import type { Publicacao } from "../../types/api";

export default function HomeScreen() {
  const { filtros } = useFiltrosVagas();
  const [items, setItems] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itensFiltrados = useMemo(
    () => items.filter((p) => publicacaoPassaNoFiltroContrato(p, filtros.contratos)),
    [items, filtros.contratos]
  );

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await listarPublicacoes(1, 50);
      setItems(data.publicacoes ?? []);
    } catch {
      setError("Não foi possível carregar as vagas. Confira a API e a URL em EXPO_PUBLIC_API_URL.");
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0B6B2F" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0B6B2F" />
          }
        >
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {items.length === 0 && !error ? (
            <Text style={styles.empty}>Nenhuma vaga disponível no momento.</Text>
          ) : null}

          {items.length > 0 && itensFiltrados.length === 0 && !error ? (
            <Text style={styles.empty}>
              Nenhuma vaga com os tipos de contrato selecionados. Ajuste os filtros.
            </Text>
          ) : null}

          {itensFiltrados.map((p) => {
            const pid = p.publicacaoId ?? 0;
            // Backend omite chaves null (Jackson non_null): empresaId pode vir undefined.
            const eid = Number(p.empresaId ?? 0) || 0;
            if (!pid) return null;
            return (
              <CardVaga
                key={`${pid}-${eid || "x"}`}
                company={p.nomeEmpresa ?? "Empresa"}
                role={p.titulo ?? "Vaga"}
                city={`Contrato: ${p.tipoContrato ?? "—"}`}
                description={p.descricao?.trim() || "Sem descrição."}
                publicacaoId={pid}
                empresaId={eid}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5EEE3",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#a00",
    marginBottom: 12,
    lineHeight: 20,
  },
  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
});
