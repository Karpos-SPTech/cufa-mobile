import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  title: string;
  showAdd?: boolean;
  onAdd?: () => void;
}

export default function SectionTitle({ title, showAdd, onAdd }: Props) {
  const router = useRouter();
  const normalizedTitle = title.trim().toLowerCase();

  function handleEditPress() {
    if (normalizedTitle === "sobre") {
      router.push("/editar-bio?from=profile&section=sobre");
      return;
    }

    if (normalizedTitle === "experiência") {
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        {showAdd && (
          <TouchableOpacity onPress={onAdd} disabled={!onAdd}>
            <Feather name="plus" size={20} color="#0B6B2F" />
          </TouchableOpacity>
        )}

        {normalizedTitle !== "experiência" && (
          <TouchableOpacity onPress={handleEditPress}>
            <Feather name="edit-2" size={18} color="#0B6B2F" />
          </TouchableOpacity>
        )}
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
  },
});
