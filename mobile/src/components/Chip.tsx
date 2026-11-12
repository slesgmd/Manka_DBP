import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/theme";

interface ChipProps {
  label: string;
  tone?: "pantry" | "have" | "missing";
  onRemove?: () => void;
  onAdd?: () => void;
}

export default function Chip({ label, tone = "pantry", onRemove, onAdd }: ChipProps) {
  if (tone === "missing") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Agregar ${label} a la despensa`}
        onPress={onAdd}
        hitSlop={6}
        style={({ pressed }) => [styles.chip, styles.missing, pressed && styles.pressed]}
      >
        <Ionicons name="add" size={16} color={colors.ink} />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.chip, tone === "have" && styles.have]}>
      {tone === "have" && <Ionicons name="checkmark" size={16} color={colors.ok} />}
      <Text style={styles.label}>{label}</Text>
      {onRemove && (
        <Pressable accessibilityRole="button" accessibilityLabel={`Quitar ${label}`} onPress={onRemove} hitSlop={10} style={styles.remove}>
          <Ionicons name="close" size={16} color={colors.ink2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.rim,
    backgroundColor: colors.thin,
  },
  have: { backgroundColor: colors.okTint },
  missing: { borderStyle: "dashed", borderColor: colors.ink2 },
  pressed: { transform: [{ scale: 0.96 }] },
  label: { fontSize: 14, fontWeight: "500", color: colors.ink },
  remove: { marginRight: -4 },
});
