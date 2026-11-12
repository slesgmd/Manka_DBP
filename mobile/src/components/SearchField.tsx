import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, TARGET } from "../utils/theme";

interface SearchFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}

export default function SearchField({ label, placeholder, value, onChangeText }: SearchFieldProps) {
  return (
    <View style={styles.field}>
      <Ionicons name="search" size={18} color={colors.ink2} />
      <TextInput
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor={colors.ink2}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        returnKeyType="search"
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable accessibilityRole="button" accessibilityLabel="Borrar búsqueda" onPress={() => onChangeText("")} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color={colors.ink2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: TARGET + 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.rim,
    backgroundColor: colors.thin,
  },
  input: { flex: 1, fontSize: 16, color: colors.ink, paddingVertical: 10 },
});
