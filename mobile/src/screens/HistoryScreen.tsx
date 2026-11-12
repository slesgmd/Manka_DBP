import { StyleSheet, View } from "react-native";
import ScreenBackground from "../components/ScreenBackground";
import ScreenHeader from "../components/ScreenHeader";

export default function HistoryScreen() {
  return (
    <ScreenBackground>
      <View style={styles.content}>
        <ScreenHeader title="Historial" />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
});
