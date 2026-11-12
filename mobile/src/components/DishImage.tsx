import { Image, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { dishImage } from "../utils/dishImages";
import { colors } from "../utils/theme";

interface DishImageProps {
  name: string;
  style?: StyleProp<ViewStyle>;
}

export default function DishImage({ name, style }: DishImageProps) {
  const source = dishImage(name);

  if (!source) {
    return (
      <View accessibilityRole="image" accessibilityLabel={name} style={[styles.box, styles.fallback, style]}>
        <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.box, style]}>
      <Image source={source} accessibilityLabel={name} resizeMode="cover" style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  fallback: { alignItems: "center", justifyContent: "center", backgroundColor: colors.thin },
  initial: { fontSize: 32, fontWeight: "300", color: colors.title },
});
