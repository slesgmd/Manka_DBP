import { Image, StyleSheet, Text, View } from "react-native";
import type { ImageStyle, StyleProp } from "react-native";
import { dishImage } from "../utils/dishImages";
import { colors } from "../utils/theme";

interface DishImageProps {
  name: string;
  style?: StyleProp<ImageStyle>;
}

export default function DishImage({ name, style }: DishImageProps) {
  const source = dishImage(name);

  if (!source) {
    return (
      <View accessibilityRole="image" accessibilityLabel={name} style={[styles.fallback, style as object]}>
        <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
      </View>
    );
  }

  return <Image source={source} accessibilityLabel={name} resizeMode="cover" style={style} />;
}

const styles = StyleSheet.create({
  fallback: { alignItems: "center", justifyContent: "center", backgroundColor: colors.thin, overflow: "hidden" },
  initial: { fontSize: 32, fontWeight: "300", color: colors.title },
});
