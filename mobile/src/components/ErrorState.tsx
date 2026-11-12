import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import GlassView from "./GlassView";
import { errorInfo } from "../utils/http";
import { colors, text } from "../utils/theme";

interface ErrorStateProps {
  title: string;
  error: unknown;
  onRetry: () => void;
}

export default function ErrorState({ title, error, onRetry }: ErrorStateProps) {
  return (
    <GlassView style={styles.panel}>
      <View style={styles.icon}>
        <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
      </View>
      <Text accessibilityRole="alert" style={[text.title3, styles.center]}>{title}</Text>
      <Text style={[text.subhead, styles.center]}>{errorInfo(error).message}</Text>
      <Button label="Reintentar" icon="refresh" onPress={onRetry} style={styles.action} />
    </GlassView>
  );
}

const styles = StyleSheet.create({
  panel: { alignItems: "center", gap: 10, paddingHorizontal: 24, paddingVertical: 28 },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerTint,
  },
  center: { textAlign: "center" },
  action: { marginTop: 6, alignSelf: "stretch" },
});
