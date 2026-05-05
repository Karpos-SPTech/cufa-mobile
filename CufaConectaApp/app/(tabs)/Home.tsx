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
import * as Location from "expo-location";

import Header from "../../components/Base/Header";
import CardVaga from "../../components/Home/CardVaga";
import { publicacaoPassaNoFiltroContrato, useFiltrosVagas } from "../../constants/FiltrosVagasContext";
import { listarPublicacoes } from "../../services/publicacoesService";
import {
  atualizarLocalizacaoUsuario,
  recomendarVagasPorCoordenadas,
} from "../../services/usuariosService";
import { storageGetItem } from "../../lib/storage";
import { TOKEN_KEY } from "../../services/api";
import type { Publicacao, RecomendacaoVaga } from "../../types/api";

function recomendacaoParaPublicacao(r: RecomendacaoVaga): Publicacao {
  return {
    publicacaoId: r.id,
    empresaId: r.idEmpresa,
    nomeEmpresa: r.nomeEmpresa,
    titulo: r.titulo,
    descricao: "Vaga sugerida com base na sua localização e nas publicações próximas.",
    tipoContrato: r.tipoContrato,
    dtExpiracao: null,
    dtPublicacao: null,
  };
}

export default function HomeScreen() {
  const { filtros } = useFiltrosVagas();
  const [items, setItems] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedPorLocalizacao, setFeedPorLocalizacao] = useState(false);
  const [raioKm, setRaioKm] = useState<number | null>(null);

  const itensFiltrados = useMemo(
    () => items.filter((p) => publicacaoPassaNoFiltroContrato(p, filtros.contratos)),
    [items, filtros.contratos]
  );

  const load = useCallback(async () => {
    setError(null);
    setFeedPorLocalizacao(false);
    setRaioKm(null);
    try {
      const token = await storageGetItem(TOKEN_KEY);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (token && status === Location.PermissionStatus.GRANTED) {
        try {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const { latitude, longitude } = pos.coords;

          await atualizarLocalizacaoUsuario(latitude, longitude);
          const rec = await recomendarVagasPorCoordenadas(latitude, longitude);
          const pubs = (rec.recomendacoes ?? []).map(recomendacaoParaPublicacao);
          if (pubs.length > 0) {
            setItems(pubs);
            setFeedPorLocalizacao(true);
            setRaioKm(typeof rec.raioKm === "number" ? rec.raioKm : null);
            return;
          }
        } catch {
          /* segue para listagem geral */
        }
      }

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

          {feedPorLocalizacao ? (
            <Text style={styles.hint}>
              Vagas próximas à sua posição
              {raioKm != null ? ` (raio referência ~${raioKm} km no servidor)` : ""} e ordenadas com apoio
              de IA.
            </Text>
          ) : null}

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
  hint: {
    color: "#0B6B2F",
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
});
