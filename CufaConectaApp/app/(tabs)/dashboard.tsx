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
import { useAuth } from "../../constants/AuthContext";
import Header from "../../components/Base/Header";

const screenWidth = Dimensions.get("window").width;


function generateSeed(email: string) {
  let hash = 0;

  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

function generateMarketData(email: string) {
  const seed = generateSeed(email);

  const areas = [
    "Comércio",
    "Serviços",
    "Logística",
    "Construção",
  ];

  const compatibilidade = 70 + (seed % 25);

  const salario = 1950 + ((seed % 41) * 10);

  const empregabilidade = 50 + (seed % 35);

  const areaPrincipal =
  seed % 2 === 0
    ? "Comércio"
    : "Serviços";

const primeiro = 42 + (seed % 10); // 42-51
const segundo = 28 + ((seed * 3) % 8); // 28-35
const terceiro = 10 + ((seed * 5) % 6); // 10-15

let quarto = 100 - primeiro - segundo - terceiro;

// garante mínimo de 5%
if (quarto < 5) {
  quarto = 5;
}

const total = primeiro + segundo + terceiro + quarto;

// normaliza para 100%
const p1 = Math.round((primeiro / total) * 100);
const p2 = Math.round((segundo / total) * 100);
const p3 = Math.round((terceiro / total) * 100);
const p4 = 100 - p1 - p2 - p3;

let chartData = [];

if (areaPrincipal === "Comércio") {
  chartData = [
    { value: p1, label: "Comércio", frontColor: "#0B6B2F" },
    { value: p2, label: "Serviços", frontColor: "#66A96F" },
    { value: p3, label: "Logística", frontColor: "#A3C7A9" },
    { value: p4, label: "Construção", frontColor: "#D7E3D9" },
  ];
} else {
  chartData = [
    { value: p1, label: "Serviços", frontColor: "#0B6B2F" },
    { value: p2, label: "Comércio", frontColor: "#66A96F" },
    { value: p3, label: "Logística", frontColor: "#A3C7A9" },
    { value: p4, label: "Construção", frontColor: "#D7E3D9" },
  ];
}

  return {
    areaPrincipal,
    compatibilidade,
    salario,
    empregabilidade,
    chartData,
  };
}

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
  const [marketData, setMarketData] = useState<any>(null);
  const { perfil } = useAuth();

  const loadDadosMercado = useCallback(async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const email = perfil?.email ?? "guest@email.com";

      const data = generateMarketData(email);

      setMarketData(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [perfil]);

  useFocusEffect(
    useCallback(() => {
      loadDadosMercado();
    }, [loadDadosMercado])
  );

  function onRefresh() {
    setRefreshing(true);
    loadDadosMercado();
  }

  const topMetrics = useMemo<Metric[]>(() => {
    if (!marketData) return [];

    return [
      {
        label: "Área mais indicada",
        value: marketData.areaPrincipal,
        hint: `${marketData.chartData[0].value}% dos perfis semelhantes ao seu estão nesta área`,
      },
      {
        label: "Compatibilidade",
        value: `${marketData.compatibilidade}%`,
        hint: "das vagas disponíveis no app são compatíveis com seu perfil",
      },
      {
        label: "Faixa Salarial",
        value: `~ R$ ${marketData.salario.toLocaleString("pt-BR")}`,
        hint: "salário médio de trabalhadores com perfil semelhante",
      },
      {
        label: "Nível de Empregabilidade",
        value: `${marketData.empregabilidade}%`,
        hint: "dos trabalhadores da região possuem escolaridade semelhante",
      },
    ];
  }, [marketData]);

  const barChartData = marketData?.chartData ?? [];

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