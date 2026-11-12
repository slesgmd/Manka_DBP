import { StyleSheet, Text, View } from "react-native";
import GlassView from "./GlassView";
import ProgressBar from "./ProgressBar";
import type { RecommendationBreakdown } from "../types/account";
import { SCORER_LABELS } from "../utils/recommendation";
import { colors, radius, text } from "../utils/theme";

interface ScoreBreakdownProps {
  score: number;
  breakdown: RecommendationBreakdown[];
}

export default function ScoreBreakdown({ score, breakdown }: ScoreBreakdownProps) {
  return (
    <GlassView variant="dense" radius={radius.card} style={styles.panel}>
      <View style={styles.header}>
        <Text style={text.headline}>Por qué {score}</Text>
        <Text style={text.footnote}>Suma ponderada de {breakdown.length} criterios</Text>
      </View>
      {breakdown.map(item => {
        const label = SCORER_LABELS[item.scorer] ?? item.scorer;
        return (
          <View key={item.scorer} style={styles.item}>
            <View style={styles.top}>
              <View style={styles.flex}>
                <Text style={styles.label}>{label}</Text>
                <Text style={text.footnote}>Peso {Math.round(item.weight * 100)} %</Text>
              </View>
              <View style={styles.points}>
                <Text style={styles.label}>+{Math.round(item.score * item.weight)}</Text>
                <Text style={text.caption}>{Math.round(item.score)}/100</Text>
              </View>
            </View>
            <ProgressBar value={item.score} label={`${label}: ${Math.round(item.score)} de 100`} />
            <Text style={text.footnote}>{item.explanation}</Text>
          </View>
        );
      })}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: "hidden" },
  header: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 10, gap: 2 },
  item: { borderTopWidth: 1, borderTopColor: colors.sep, paddingHorizontal: 18, paddingVertical: 12, gap: 8 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1 },
  points: { alignItems: "flex-end" },
  label: { fontSize: 15, fontWeight: "500", color: colors.ink },
});
