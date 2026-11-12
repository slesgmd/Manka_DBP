import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DishImage from "./DishImage";
import { colors, radius, text } from "../utils/theme";

interface DishRowProps {
  name: string;
  meta: string;
  note?: string;
  onPress: () => void;
  right?: ReactNode;
}

export default function DishRow({ name, meta, note, onPress, right }: DishRowProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${meta}`}
        onPress={onPress}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <DishImage name={name} style={styles.thumb} />
        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={2}>{name}</Text>
          <Text style={text.footnote}>{meta}</Text>
          {note ? <Text style={text.footnote}>{note}</Text> : null}
        </View>
        {!right && <Ionicons name="chevron-forward" size={18} color={colors.ink2} />}
      </Pressable>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, paddingHorizontal: 8 },
  pressed: { opacity: 0.7 },
  thumb: { width: 64, height: 64, borderRadius: radius.thumb },
  texts: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: "500", color: colors.ink },
});
