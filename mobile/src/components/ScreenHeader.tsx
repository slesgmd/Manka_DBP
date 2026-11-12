import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import GlassView from "./GlassView";
import { text } from "../utils/theme";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export default function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <GlassView radius={30} style={styles.header}>
      <View style={styles.texts}>
        <Text style={text.largeTitle} accessibilityRole="header">{title}</Text>
        {subtitle ? <Text style={text.subhead}>{subtitle}</Text> : null}
      </View>
      {right}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  texts: { flex: 1, gap: 4 },
});
