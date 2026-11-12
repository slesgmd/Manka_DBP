import { StyleSheet, View } from "react-native";
import GlassView from "./GlassView";
import Skeleton from "./Skeleton";
import { radius } from "../utils/theme";

interface ListSkeletonProps {
  rows?: number;
  label?: string;
}

export default function ListSkeleton({ rows = 5, label = "Cargando…" }: ListSkeletonProps) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} style={styles.list}>
      {Array.from({ length: rows }, (_, index) => (
        <GlassView key={index} variant="dense" radius={radius.card} style={styles.row}>
          <Skeleton width={52} height={52} radius={radius.thumb} />
          <View style={styles.lines}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="45%" height={12} />
          </View>
        </GlassView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, padding: 12 },
  lines: { flex: 1, gap: 8 },
});
