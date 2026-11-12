import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import Chip from "./Chip";
import DishImage from "./DishImage";
import GlassView from "./GlassView";
import ProgressBar from "./ProgressBar";
import ScoreBreakdown from "./ScoreBreakdown";
import ScoreRing from "./ScoreRing";
import { useFetch } from "../hooks/useFetch";
import { getDish } from "../services/dishService";
import type { Recommendation } from "../types/account";
import { colors, radius, TARGET, text } from "../utils/theme";

interface BestOptionProps {
  options: Recommendation[];
  index: number;
  minutes: number;
  onSelect: (index: number) => void;
  onAddMissing: (name: string) => void;
  onOpen: (recommendation: Recommendation) => void;
}

export default function BestOption({ options, index, minutes, onSelect, onAddMissing, onOpen }: BestOptionProps) {
  const current = options[index];
  const dishId = current.dishId;

  const fetchDish = useCallback((signal: AbortSignal) => getDish(dishId, signal), [dishId]);
  const { data: dish } = useFetch(fetchDish);

  const have = useMemo(() => {
    if (!dish || dish.id !== dishId) return null;
    const missing = new Set(current.missingIngredients.map(name => name.toLowerCase()));
    return dish.ingredients.filter(ingredient => !missing.has(ingredient.name.toLowerCase()));
  }, [dish, dishId, current]);

  const score = Math.round(current.score);
  const total = have ? have.length + current.missingIngredients.length : null;

  return (
    <View style={styles.container}>
      <GlassView style={styles.panel}>
        <View style={styles.heading}>
          <Text style={text.title2}>{index === 0 ? "Mejor opción" : `Opción ${index + 1}`}</Text>
          <Text style={text.footnote}>{index + 1} de {options.length} · Para {minutes} min</Text>
        </View>

        <View>
          <DishImage name={current.name} style={styles.photo} />
          {options.length > 1 && (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Opción anterior"
                onPress={() => onSelect((index - 1 + options.length) % options.length)}
                style={[styles.arrow, styles.left]}
              >
                <Ionicons name="chevron-back" size={22} color={colors.ink} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Opción siguiente"
                onPress={() => onSelect((index + 1) % options.length)}
                style={[styles.arrow, styles.right]}
              >
                <Ionicons name="chevron-forward" size={22} color={colors.ink} />
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.flex}>
              <Text style={text.dish}>{current.name}</Text>
              <Text style={text.subhead}>{current.prepTimeMinutes} min{dish?.id === dishId ? ` · ${dish.proteinCategoryName}` : ""}</Text>
            </View>
            <ScoreRing score={score} />
          </View>

          <View style={styles.coverage}>
            <View style={styles.coverageText}>
              <Text style={styles.strong}>{total !== null && have ? `Tienes ${have.length} de ${total} ingredientes` : "Cobertura de tu despensa"}</Text>
              <Text style={styles.strong}>{Math.round(current.coveragePercent)} %</Text>
            </View>
            <ProgressBar thick value={current.coveragePercent} label="Ingredientes que tienes" />
          </View>

          <View style={styles.group}>
            <Text style={text.footnote}>Tienes</Text>
            <View style={styles.chips}>
              {have?.length === 0 && <Text style={text.footnote}>Ninguno todavía</Text>}
              {have?.map(ingredient => <Chip key={ingredient.id} tone="have" label={ingredient.name} />)}
            </View>
          </View>
          {current.missingIngredients.length > 0 && (
            <View style={styles.group}>
              <Text style={text.footnote}>Te faltan</Text>
              <View style={styles.chips}>
                {current.missingIngredients.map(name => <Chip key={name} tone="missing" label={name} onAdd={() => onAddMissing(name)} />)}
              </View>
            </View>
          )}

          <Button label="Ver plato" icon="chevron-forward" size="lg" onPress={() => onOpen(current)} />
        </View>
      </GlassView>

      <ScoreBreakdown score={score} breakdown={current.breakdown} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  panel: { padding: 12 },
  heading: { paddingHorizontal: 8, paddingTop: 4, paddingBottom: 12, gap: 2 },
  photo: { width: "100%", aspectRatio: 3 / 2, borderRadius: radius.inner },
  arrow: {
    position: "absolute",
    top: "50%",
    marginTop: -TARGET / 2,
    width: TARGET,
    height: TARGET,
    borderRadius: TARGET / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: colors.rim,
  },
  left: { left: 12 },
  right: { right: 12 },
  body: { paddingHorizontal: 8, paddingTop: 16, paddingBottom: 4, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  flex: { flex: 1, gap: 4 },
  coverage: { gap: 8 },
  coverageText: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  strong: { fontSize: 15, fontWeight: "500", color: colors.ink },
  group: { gap: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
