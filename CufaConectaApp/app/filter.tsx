import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FilterModal() {
  const router = useRouter();
  const [distance, setDistance] = useState([0, 100]);
  const [flexibleSchedule, setFlexibleSchedule] = useState(false);
  const [freeDress, setFreeDress] = useState(true);

  const [contracts, setContracts] = useState({
    CLT: true,
    PJ: false,
    FreeLancer: false,
    Estagio: false,
  });

  const toggleContract = (type: keyof typeof contracts) => {
    setContracts({ ...contracts, [type]: !contracts[type] });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <Pressable style={styles.filterCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Filtros</Text>

          <View style={styles.row}>
            {Object.keys(contracts).map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.checkboxContainer}
                activeOpacity={0.8}
                onPress={() => toggleContract(key as any)}
              >
                <Text style={styles.label}>{key}</Text>
                <Ionicons
                  name={contracts[key as keyof typeof contracts] ? 'checkbox' : 'square-outline'}
                  size={22}
                  color="#006916"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sliderSection}>
            <View style={styles.sliderLabels}>
              <Text style={styles.label}>Distância</Text>
              <Text style={styles.distanceValue}>{distance[0]}-{distance[1]}km</Text>
            </View>

            <Slider
              value={distance}
              onValueChange={(value: any) => setDistance(value)}
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
              <Text style={styles.label}>Horário Flexível</Text>
              <Switch
                value={flexibleSchedule}
                onValueChange={setFlexibleSchedule}
                trackColor={{ false: '#d0d8d0', true: '#006916' }}
                thumbColor={flexibleSchedule ? '#ffffff' : '#ffffff'}
              />
            </View>

            <View style={styles.switchItem}>
              <Text style={styles.label}>Vestimenta Livre</Text>
              <Switch
                value={freeDress}
                onValueChange={setFreeDress}
                trackColor={{ false: '#d0d8d0', true: '#006916' }}
                thumbColor={freeDress ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  filterCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 20,
    minHeight: 250,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -6 },
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#d7ddd7',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#006916',
    textAlign: 'center',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },
  sliderSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  switchItem: {
    alignItems: 'center',
    width: '48%',
  },
});
