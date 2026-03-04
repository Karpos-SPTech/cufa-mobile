import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  title: string;
  showAdd?: boolean;
}

export default function SectionTitle({ title, showAdd }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {showAdd && (
          <TouchableOpacity>
            <Feather name="plus" size={20} color="#0B6B2F" />
          </TouchableOpacity>
        )}

        <TouchableOpacity>
          <Feather name="edit-2" size={18} color="#0B6B2F" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});