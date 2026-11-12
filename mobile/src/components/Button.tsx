import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import type { IconName } from "../types/ui";
import { colors, TARGET } from "../utils/theme";

type Kind = "primary" | "secondary" | "destructive";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  kind?: Kind;
  size?: "md" | "lg";
  icon?: IconName;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const textColor: Record<Kind, string> = {
  primary: colors.graphiteInk,
  secondary: colors.ink,
  destructive: colors.danger,
};

export default function Button({
  label,
  onPress,
  kind = "secondary",
  size = "md",
  icon,
  loading = false,
  loadingLabel,
  disabled = false,
  style,
}: ButtonProps) {
  const color = textColor[kind];
  const inactive = disabled || loading;
  const shownLabel = loading && loadingLabel ? loadingLabel : label;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={shownLabel}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[kind],
        size === "lg" && styles.large,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={color} /> : icon ? <Ionicons name={icon} size={18} color={color} /> : null}
      <Text style={[styles.label, { color }]}>{shownLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TARGET,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  large: { minHeight: 56 },
  primary: { backgroundColor: colors.graphite, borderColor: "rgba(255,255,255,0.24)" },
  secondary: { backgroundColor: colors.thin, borderColor: colors.rim },
  destructive: { backgroundColor: colors.dangerTint, borderColor: "rgba(163,36,47,0.35)" },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.96 }] },
  label: { fontSize: 16, fontWeight: "500" },
});
