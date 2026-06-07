import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../../components/Base/Header";
// Importe seus serviços reais aqui depois
// import { fetchMercadoTrabalho } from "../../services/mercadoService";

const screenWidth = Dimensions.get("window").width;

// --- TIPAGENS ---
type Metric = {
  label: string;
  value: string;
  hint: string;
};

// --- COMPONENTES DE UI ---
function MetricCard({ label, value, hint }: Metric) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricHint}>{hint}</Text>
    </View>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export default function DashboardMarketScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- MOCKS PARA INTEGRAÇÃO FUTURA ---
  const loadDadosMercado = useCallback(async () => {
    // Aqui você fará a integração com a base de dados do mercado
    setLoading(true);
    try {
      // Simulação de delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDadosMercado();
    }, [loadDadosMercado])
  );

  function onRefresh() {
    setRefreshing(true);
    loadDadosMercado();
  }

  // Indicadores Numéricos (Métricas do Mercado)
  const topMetrics = useMemo<Metric[]>(
    () => [
      {
        label: "Área mais indicada",
        value: "Comércio",
        hint: "43% dos perfis semelhantes ao seu estão nesta área",
      },
      {
        label: "Compatibilidade",
        value: "82%",
        hint: "das vagas disponíveis no app são compativeis com seu perfil",
      },
      {
        label: "Faixa Salarial",
        value: "~ R$ 2.000",
        hint: "salário médio de trabalhadores com perfil semelhante",
      },
      {
        label: "Nivel de Empregabilidade",
        value: "64%",
        hint: "dos trabalhadores da região possuem escolaridade semelhante",
      },
    ],
    []
  );

  // Dados Gráfico: Distribuição por Modelo/Setor (BarChart)
  const barChartData = [
    { value: 43, label: "Comércio", frontColor: "#0B6B2F" },
    { value: 29, label: "Serviços", frontColor: "#66A96F" },
    { value: 18, label: "Logística", frontColor: "#A3C7A9" },
    { value: 10, label: "Construção", frontColor: "#D7E3D9" }
  ];

  return (
    <View style={styles.screen}>
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0B6B2F"
            />
          }
        >
          {/* HERO SECTION */}
          <View style={styles.heroCard}>
            <Text style={styles.heroKicker}>Inteligência de Dados</Text>
            <Text style={styles.heroTitle}>Panorama do Mercado</Text>
            <Text style={styles.heroText}>
              Acompanhe as tendências de contratação, média salarial e o
              aquecimento do mercado de trabalho em tempo real.
            </Text>

            <View style={styles.heroPillRow}>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>Atualizado hoje</Text>
              </View>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>Base Nacional</Text>
              </View>
            </View>
          </View>

          {/* MÉTRICAS NUMÉRICAS */}
          <View style={styles.metricsGrid}>
            {topMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </View>

          {/* GRÁFICO - BARRAS */}
          <SectionCard
            title="Maior potencial para seu perfil"
            subtitle="Distribuição de oportunidades por setor"
          >
            <View style={styles.chartContainer}>
              <BarChart
                data={barChartData}
                width={screenWidth - 100}
                height={270}
                barWidth={51}
                initialSpacing={10}
                spacing={22}
                barBorderRadius={4}
                maxValue={100}
                noOfSections={4}
                yAxisLabelTexts={["0%", "25%", "50%", "75%", "100%"]}
                yAxisTextStyle={{ color: "#718072", fontSize: 10 }}
                xAxisLabelTextStyle={{ color: "#718072", fontSize: 14 }}
                hideRules
                yAxisColor="#D7E3D9"
                xAxisColor="#D7E3D9"
                showValuesAsTopLabel
                topLabelTextStyle={{ color: "#4A5A4C", fontSize: 10, fontWeight: "bold" }}
                isAnimated
              />
            </View>
          </SectionCard>

        </ScrollView>
      )}
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E5EEE3",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: "#0B6B2F",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  heroKicker: {
    color: "#CFEAD4",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 8,
  },
  heroText: {
    color: "#E7F5EA",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  heroPillRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
  },
  heroPill: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D7E3D9",
  },
  metricLabel: {
    color: "#4A5A4C",
    fontSize: 12,
    fontWeight: "700",
  },
  metricValue: {
    color: "#0B6B2F",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },
  metricHint: {
    color: "#718072",
    fontSize: 12,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D7E3D9",
  },
  sectionTitle: {
    color: "#0B6B2F",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#667268",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  sectionContent: {
    marginTop: 12,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -12
  },
});