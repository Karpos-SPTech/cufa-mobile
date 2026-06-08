import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function FormSelect({
  label,
  value,
  options,
  placeholder = "Selecione",
  onChange,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color="#555" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options as string[]}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item === value && styles.optionSelected]}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, item === value && styles.optionTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  trigger: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    paddingRight: 8,
  },
  placeholder: {
    color: "#999",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "55%",
    paddingBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B6B2F",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: "#E5EEE3",
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  optionTextSelected: {
    fontWeight: "700",
    color: "#0B6B2F",
  },
});
