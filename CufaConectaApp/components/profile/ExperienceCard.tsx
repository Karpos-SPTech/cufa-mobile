import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  title: string;
  company: string;
  period: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ExperienceCard({ title, company, period, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.circle}>
          <Feather name="briefcase" size={18} color="#0B6B2F" />
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{company}</Text>
          {period ? <Text style={styles.period}>{period}</Text> : null}
        </View>
      </View>

      <View style={styles.actions}>
        {onDelete ? (
          <TouchableOpacity style={styles.actionButton} onPress={onDelete} hitSlop={8}>
            <Feather name="trash-2" size={16} color="#a00" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          disabled={!onEdit}
          hitSlop={8}
        >
          <Feather name="edit-2" size={16} color={onEdit ? "#0B6B2F" : "#aaa"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#d8dfd6",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5EEE3",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    padding: 6,
  },
  title: {
    fontWeight: "700",
    color: "#0B6B2F",
    fontSize: 15,
  },
  subtitle: {
    fontSize: 13,
    color: "#333",
    marginTop: 2,
  },
  period: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
