import { StyleSheet, View } from "react-native";
import ScreenBackground from "../components/ScreenBackground";
import ScreenHeader from "../components/ScreenHeader";

export default function CatalogScreen() {
  return (
    <ScreenBackground>
      <View style={styles.content}>
        <ScreenHeader title="Catálogo de platos" />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
});
