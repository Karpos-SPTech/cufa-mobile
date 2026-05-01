import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import type { ContratosFiltro } from "../constants/FiltrosVagasContext";
import { useFiltrosVagas } from "../constants/FiltrosVagasContext";

export default function FilterModal() {
  const router = useRouter();
  const { filtros, setFiltros, setContratos, resetFiltros } = useFiltrosVagas();

  const [distance, setDistance] = useState<number[]>([...filtros.distanciaKm]);
  const [flexibleSchedule, setFlexibleSchedule] = useState(filtros.horarioFlexivel);
  const [freeDress, setFreeDress] = useState(filtros.vestimentaLivre);
  const [contracts, setContracts] = useState<ContratosFiltro>({ ...filtros.contratos });

  useFocusEffect(
    useCallback(() => {
      setDistance([...filtros.distanciaKm]);
      setFlexibleSchedule(filtros.horarioFlexivel);
      setFreeDress(filtros.vestimentaLivre);
      setContracts({ ...filtros.contratos });
    }, [filtros])
  );

  const toggleContract = (type: keyof ContratosFiltro) => {
    setContracts((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  function aplicar() {
    setContratos(contracts);
    setFiltros({
      distanciaKm: [distance[0] ?? 0, distance[1] ?? 100],
      horarioFlexivel: flexibleSchedule,
      vestimentaLivre: freeDress,
    });
    router.back();
  }

  function limpar() {
    resetFiltros();
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <Pressable style={styles.filterCard} onPress={(e) => e.stopPropagation()}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />
            <Text style={styles.title}>Filtros</Text>
            <Text style={styles.hint}>
              Tipo de contrato filtra a lista na tela inicial. Demais opções ficam salvas para quando
              a API tiver esses dados.
            </Text>

            <View style={styles.row}>
              {(Object.keys(contracts) as (keyof ContratosFiltro)[]).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.checkboxContainer}
                  activeOpacity={0.8}
                  onPress={() => toggleContract(key)}
                >
                  <Text style={styles.label}>{key}</Text>
                  <Ionicons
                    name={contracts[key] ? "checkbox" : "square-outline"}
                    size={22}
                    color="#006916"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sliderSection}>
              <View style={styles.sliderLabels}>
                <Text style={styles.label}>Distância</Text>
                <Text style={styles.distanceValue}>
                  {Math.round(distance[0] ?? 0)}–{Math.round(distance[1] ?? 100)} km
                </Text>
              </View>

              <Slider
                value={distance}
                onValueChange={(value) => setDistance(value as number[])}
                maximumValue={100}
                minimumValue={0}
                step={1}
                thumbTintColor="#006916"
                minimumTrackTintColor="#006916"
                maximumTrackTintColor="#d0d8d0"
                trackStyle={{ height: 6, borderRadius: 999 }}
                thumbStyle={{ width: 18, height: 18 }}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchItem}>
                <Text style={styles.label}>Horário flexível</Text>
                <Switch
                  value={flexibleSchedule}
                  onValueChange={setFlexibleSchedule}
                  trackColor={{ false: "#d0d8d0", true: "#006916" }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={styles.switchItem}>
                <Text style={styles.label}>Vestimenta livre</Text>
                <Switch
                  value={freeDress}
                  onValueChange={setFreeDress}
                  trackColor={{ false: "#d0d8d0", true: "#006916" }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnSecondary} onPress={limpar} activeOpacity={0.85}>
              <Text style={styles.btnSecondaryText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={aplicar} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  filterCard: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    maxHeight: "88%",
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -6 },
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#d7ddd7",
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#006916",
    textAlign: "center",
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 17,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  sliderSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  switchItem: {
    alignItems: "center",
    width: "48%",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e8eee8",
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#E5EEE3",
    alignItems: "center",
  },
  btnSecondaryText: {
    fontWeight: "700",
    color: "#333",
    fontSize: 15,
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#006916",
    alignItems: "center",
  },
  btnPrimaryText: {
    fontWeight: "800",
    color: "#fff",
    fontSize: 15,
  },
});
