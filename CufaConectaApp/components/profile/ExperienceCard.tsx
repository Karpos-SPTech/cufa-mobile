import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  title: string;
  company: string;
  city: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ExperienceCard({ title, company, city, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.circle} />

        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{company}</Text>
          <Text style={styles.city}>{city}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {onDelete ? (
          <TouchableOpacity style={styles.editButton} onPress={onDelete} hitSlop={8}>
            <Feather name="trash-2" size={16} color="#a00" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.editButton} onPress={onEdit} disabled={!onEdit}>
          <Feather name="edit-2" size={16} color="#0B6B2F" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6E6E6',
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editButton: {
    padding: 6,
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