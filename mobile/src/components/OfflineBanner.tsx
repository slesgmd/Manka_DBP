import { Ionicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../utils/theme";

export default function OfflineBanner() {
  const { isConnected } = useNetInfo();
  const insets = useSafeAreaInsets();

  if (isConnected !== false) return null;

  return (
    <View pointerEvents="none" style={[styles.container, { top: insets.top + 6 }]}>
      <View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.banner}>
        <Ionicons name="cloud-offline-outline" size={18} color={colors.graphiteInk} />
        <Text style={styles.text}>Sin conexión. Revisa tu red; lo que ves puede no estar al día.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", left: 16, right: 16, alignItems: "center" },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.danger,
  },
  text: { flexShrink: 1, fontSize: 14, fontWeight: "500", color: colors.graphiteInk },
});
