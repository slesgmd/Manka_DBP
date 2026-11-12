import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, text } from "../utils/theme";

export default function LoadingView({ label = "Cargando…" }: { label?: string }) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} style={styles.container}>
      <ActivityIndicator size="large" color={colors.ink} />
      <Text style={text.subhead}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
});
