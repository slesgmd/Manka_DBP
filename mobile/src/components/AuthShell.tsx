import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import GlassView from "./GlassView";
import ScreenBackground from "./ScreenBackground";
import { colors, text } from "../utils/theme";

interface AuthShellProps {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, children, footer }: AuthShellProps) {
  return (
    <ScreenBackground edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>Manka</Text>
          <GlassView radius={28} style={styles.motto}>
            <Text style={[text.body, styles.center]}>Dime qué tienes en casa y cuánto tiempo tienes.</Text>
          </GlassView>
          <GlassView variant="dense" style={styles.form}>
            <Text style={styles.title} accessibilityRole="header">{title}</Text>
            {children}
          </GlassView>
          {footer}
          <Text style={[text.footnote, styles.center]}>Tus datos solo se usan para tu despensa y tus recomendaciones.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: 16, gap: 16 },
  logo: {
    fontSize: 72,
    fontWeight: "300",
    letterSpacing: -3,
    textAlign: "center",
    color: colors.hi,
    textShadowColor: "rgba(55,65,105,0.35)",
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 4 },
  },
  motto: { paddingHorizontal: 20, paddingVertical: 14 },
  form: { padding: 20, gap: 16 },
  title: { fontSize: 26, lineHeight: 32, fontWeight: "400", letterSpacing: -0.8, color: colors.title },
  center: { textAlign: "center" },
});
