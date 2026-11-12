import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import GlassView from "./GlassView";
import type { IconName } from "../types/ui";
import { colors, text } from "../utils/theme";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <GlassView style={styles.panel}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={28} color={colors.ink} />
      </View>
      <Text style={[text.title3, styles.center]}>{title}</Text>
      <Text style={[text.subhead, styles.center]}>{body}</Text>
      {actionLabel && onAction && <Button label={actionLabel} kind="primary" onPress={onAction} style={styles.action} />}
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
    backgroundColor: colors.thin,
    borderWidth: 1,
    borderColor: colors.rim,
  },
  center: { textAlign: "center" },
  action: { marginTop: 6, alignSelf: "stretch" },
});
