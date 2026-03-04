import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  company: string;
  city: string;
}

export default function ExperienceCard({ title, company, city }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.circle} />

      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{company}</Text>
        <Text style={styles.city}>{city}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6E6E6',
  },
  title: {
    fontWeight: 'bold',
    color: '#0B6B2F',
  },
  subtitle: {
    fontSize: 12,
  },
  city: {
    fontSize: 12,
    color: '#666',
  },
});