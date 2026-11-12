import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GlassView from "./GlassView";
import { colors, TARGET } from "../utils/theme";

interface ToastProps {
  message: string;
  tone: "success" | "error";
  actionLabel?: string;
  onAction?: () => void;
}

export default function Toast({ message, tone, actionLabel, onAction }: ToastProps) {
  const success = tone === "success";
  return (
    <GlassView variant="dense" radius={999} style={styles.toast}>
      <View accessibilityLiveRegion="polite" accessibilityRole={success ? "text" : "alert"} style={styles.body}>
        <View style={[styles.icon, success ? styles.iconOk : styles.iconError]}>
          <Ionicons name={success ? "checkmark" : "alert"} size={16} color={success ? colors.ok : colors.danger} />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
      {actionLabel && onAction && (
        <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  toast: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 56, paddingLeft: 12, paddingRight: 8, paddingVertical: 6 },
  body: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  iconOk: { backgroundColor: colors.okTint },
  iconError: { backgroundColor: colors.dangerTint },
  message: { flex: 1, fontSize: 15, fontWeight: "500", color: colors.ink },
  action: { minHeight: TARGET, paddingHorizontal: 14, borderRadius: 999, justifyContent: "center", backgroundColor: colors.thin },
  actionText: { fontSize: 15, fontWeight: "600", color: colors.ink },
  pressed: { transform: [{ scale: 0.96 }] },
});
