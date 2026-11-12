import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { colors, radius as radii } from "../utils/theme";

type Variant = "thick" | "dense" | "thin" | "graphite";

const fill: Record<Variant, string> = {
  thick: colors.thick,
  dense: colors.dense,
  thin: colors.thin,
  graphite: colors.graphite,
};

interface GlassViewProps {
  variant?: Variant;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export default function GlassView({ variant = "thick", radius = radii.panel, style, children }: GlassViewProps) {
  return (
    <View style={[styles.base, { backgroundColor: fill[variant], borderRadius: radius }, variant === "thin" && styles.thin, style]}>
      <View pointerEvents="none" style={[styles.highlight, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1.5,
    borderColor: colors.rim,
    ...Platform.select({
      ios: { shadowColor: "#374169", shadowOpacity: 0.22, shadowRadius: 24, shadowOffset: { width: 0, height: 16 } },
      android: { elevation: 6 },
      default: {},
    }),
  },
  thin: Platform.select<ViewStyle>({
    ios: { shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
    android: { elevation: 0 },
    default: {},
  }),
  highlight: { position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: colors.hi, opacity: 0.9 },
});
