import type { ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Edge } from "react-native-safe-area-context";
import { colors } from "../utils/theme";

interface ScreenBackgroundProps {
  children: ReactNode;
  edges?: Edge[];
}

export default function ScreenBackground({ children, edges = ["top"] }: ScreenBackgroundProps) {
  return (
    <ImageBackground source={require("../../assets/background.jpg")} resizeMode="cover" style={styles.background}>
      <SafeAreaView edges={edges} style={styles.safe}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.base },
  safe: { flex: 1 },
});
