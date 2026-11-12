import { Pressable, StyleSheet, Text } from "react-native";
import { colors, TARGET, text } from "../utils/theme";

interface AuthSwitchProps {
  question: string;
  action: string;
  onPress: () => void;
}

export default function AuthSwitch({ question, action, onPress }: AuthSwitchProps) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={styles.link}>
      <Text style={text.subhead}>
        {question} <Text style={styles.action}>{action}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: TARGET, alignItems: "center", justifyContent: "center" },
  action: { color: colors.ink, fontWeight: "600", textDecorationLine: "underline" },
});
