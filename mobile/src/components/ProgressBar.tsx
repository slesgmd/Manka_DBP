import { StyleSheet, View } from "react-native";
import { colors } from "../utils/theme";

interface ProgressBarProps {
  value: number;
  label: string;
  thick?: boolean;
}

export default function ProgressBar({ value, label, thick = false }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percent) }}
      style={[styles.track, thick && styles.thick]}
    >
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 999, backgroundColor: colors.track, overflow: "hidden" },
  thick: { height: 10 },
  fill: { height: "100%", borderRadius: 999, backgroundColor: colors.graphite },
});
