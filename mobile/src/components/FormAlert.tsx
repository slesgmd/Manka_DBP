import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, text } from "../utils/theme";

export default function FormAlert({ message }: { message: string }) {
  return (
    <View accessibilityRole="alert" style={styles.alert}>
      <Ionicons name="alert-circle" size={18} color={colors.danger} />
      <Text style={[text.subhead, styles.message]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.dangerTint,
  },
  message: { flex: 1, color: colors.danger },
});
