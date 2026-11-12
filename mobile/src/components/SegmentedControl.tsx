import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, TARGET } from "../utils/theme";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <View accessibilityRole="radiogroup" style={styles.track}>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 999,
    backgroundColor: colors.track,
  },
  segment: { flex: 1, minHeight: TARGET, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  selected: { backgroundColor: colors.knob, borderWidth: 1, borderColor: colors.rim, elevation: 2 },
  label: { fontSize: 15, color: colors.ink2 },
  labelSelected: { color: colors.ink, fontWeight: "600" },
});
