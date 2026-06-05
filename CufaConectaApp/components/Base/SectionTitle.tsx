import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  title: string;
  showAdd?: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
  showEdit?: boolean;
}

export default function SectionTitle({
  title,
  showAdd,
  onAdd,
  onEdit,
  showEdit = true,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.actions}>
        {showAdd ? (
          <TouchableOpacity onPress={onAdd} disabled={!onAdd} hitSlop={8}>
            <Feather name="plus" size={20} color="#0B6B2F" />
          </TouchableOpacity>
        ) : null}

        {showEdit ? (
          <TouchableOpacity onPress={onEdit} disabled={!onEdit} hitSlop={8}>
            <Feather name="edit-2" size={18} color={onEdit ? "#0B6B2F" : "#aaa"} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
