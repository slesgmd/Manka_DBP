import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import GlassView from "./GlassView";
import SearchField from "./SearchField";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { getIngredients } from "../services/ingredientService";
import type { Ingredient } from "../types/catalog";
import { colors, radius, TARGET, text } from "../utils/theme";

interface IngredientSearchProps {
  addedIds: Set<number>;
  onAdd: (ingredient: Ingredient) => Promise<void>;
}

export default function IngredientSearch({ addedIds, onAdd }: IngredientSearchProps) {
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const name = useDebounce(query.trim(), 350);

  const fetchIngredients = useCallback(
    (signal: AbortSignal) => (name ? getIngredients({ name, size: 8 }, signal).then(page => page.content) : Promise.resolve([])),
    [name],
  );
  const { data, loading, error, retry } = useFetch(fetchIngredients);

  const handleAdd = async (ingredient: Ingredient) => {
    setBusyId(ingredient.id);
    try {
      await onAdd(ingredient);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View style={styles.container}>
      <SearchField label="Buscar ingrediente para tu despensa" placeholder="Buscar ingrediente" value={query} onChangeText={setQuery} />
      {name !== "" && (
        <GlassView variant="dense" radius={radius.card} style={styles.results}>
          {loading && (
            <View style={styles.message}>
              <ActivityIndicator color={colors.ink} />
              <Text style={text.subhead}>Buscando…</Text>
            </View>
          )}
          {!loading && error && (
            <View style={styles.message}>
              <Text style={[text.subhead, styles.flex]}>No pudimos buscar ingredientes.</Text>
              <Button label="Reintentar" onPress={retry} />
            </View>
          )}
          {!loading && !error && data?.length === 0 && (
            <Text style={[text.subhead, styles.message]}>Ningún ingrediente coincide con «{name}».</Text>
          )}
          {!loading && !error && data?.map(ingredient => (
            <View key={ingredient.id} style={styles.row}>
              <Text style={styles.name}>{ingredient.name}</Text>
              {addedIds.has(ingredient.id) ? (
                <View style={styles.added}>
                  <Ionicons name="checkmark" size={16} color={colors.ok} />
                  <Text style={styles.addedText}>Agregado</Text>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Agregar ${ingredient.name}`}
                  disabled={busyId !== null}
                  onPress={() => handleAdd(ingredient)}
                  style={({ pressed }) => [styles.add, busyId !== null && styles.disabled, pressed && styles.pressed]}
                >
                  {busyId === ingredient.id ? <ActivityIndicator size="small" color={colors.ink} /> : <Ionicons name="add" size={16} color={colors.ink} />}
                  <Text style={styles.addText}>Agregar</Text>
                </Pressable>
              )}
            </View>
          ))}
        </GlassView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  results: { padding: 6 },
  flex: { flex: 1 },
  message: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 52, paddingLeft: 12 },
  name: { flex: 1, fontSize: 16, color: colors.ink },
  added: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: TARGET, paddingHorizontal: 12 },
  addedText: { fontSize: 14, fontWeight: "500", color: colors.ok },
  add: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: TARGET,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.rim,
    backgroundColor: colors.thin,
  },
  addText: { fontSize: 14, fontWeight: "500", color: colors.ink },
  disabled: { opacity: 0.6 },
  pressed: { transform: [{ scale: 0.96 }] },
});
