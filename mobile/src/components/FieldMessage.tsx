import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, text } from "../utils/theme";

export default function FieldMessage({ ok, message }: { ok: boolean; message: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={ok ? "checkmark-circle" : "ellipse-outline"} size={15} color={ok ? colors.ok : colors.ink2} />
      <Text style={[text.footnote, ok && styles.ok]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6, paddingLeft: 4 },
  ok: { color: colors.ok },
});
