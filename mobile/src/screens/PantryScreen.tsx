import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import GlassView from "../components/GlassView";
import IngredientSearch from "../components/IngredientSearch";
import LoadingView from "../components/LoadingView";
import ScreenBackground from "../components/ScreenBackground";
import ScreenHeader from "../components/ScreenHeader";
import { usePantry } from "../hooks/usePantry";
import { useRefreshOnFocus } from "../hooks/useRefreshOnFocus";
import type { PantryItem } from "../types/account";
import type { Ingredient } from "../types/catalog";
import { formatDate, plural } from "../utils/format";
import { colors, TARGET, text } from "../utils/theme";

export default function PantryScreen() {
  const pantry = usePantry();
  const addToPantry = pantry.add;
  const items = pantry.items;

  useRefreshOnFocus(pantry.retry);

  const handleAdd = useCallback((ingredient: Ingredient) => addToPantry(ingredient.id, ingredient.name), [addToPantry]);

  const confirmRemove = (item: PantryItem) => {
    Alert.alert(`¿Quitar ${item.ingredientName.toLowerCase()}?`, "Dejará de contar para tus recomendaciones.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Quitar", style: "destructive", onPress: () => pantry.remove(item.ingredientId, item.ingredientName) },
    ]);
  };

  const renderItems = () => {
    if (!items && pantry.loading) return <LoadingView label="Cargando tu despensa…" />;
    if (!items) return <ErrorState title="No pudimos cargar tu despensa" error={pantry.error} onRetry={pantry.retry} />;
    if (items.length === 0) {
      return (
        <EmptyState
          icon="basket-outline"
          title="Tu despensa está vacía"
          body="Busca arriba lo que tienes en casa y agrégalo para recibir recomendaciones."
        />
      );
    }
    return (
      <GlassView variant="dense" style={styles.list}>
        <Text style={[text.title3, styles.listTitle]}>Mis ingredientes</Text>
        {items.map(item => (
          <View key={item.id} style={styles.row}>
            <View style={styles.initial}>
              <Text style={styles.initialText}>{item.ingredientName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.name}>{item.ingredientName}</Text>
              <Text style={text.footnote}>Agregado el {formatDate(item.addedAt)}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Quitar ${item.ingredientName}`}
              onPress={() => confirmRemove(item)}
              style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
            >
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
        ))}
      </GlassView>
    );
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Tu despensa" subtitle={items ? plural(items.length, "ingrediente", "ingredientes") : "Lo que tienes en casa"} />
        <GlassView style={styles.add}>
          <Text style={text.title3}>Agregar ingrediente</Text>
          <IngredientSearch addedIds={pantry.ids} onAdd={handleAdd} />
          <Text style={text.footnote}>Solo un administrador puede crear ingredientes nuevos.</Text>
        </GlassView>
        {renderItems()}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  add: { padding: 18, gap: 12 },
  list: { paddingVertical: 8 },
  listTitle: { paddingHorizontal: 18, paddingVertical: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: colors.sep,
  },
  initial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.thin,
    borderWidth: 1,
    borderColor: colors.rim,
  },
  initialText: { fontSize: 16, fontWeight: "500", color: colors.title },
  flex: { flex: 1 },
  name: { fontSize: 16, fontWeight: "500", color: colors.ink },
  remove: { width: TARGET, height: TARGET, borderRadius: TARGET / 2, alignItems: "center", justifyContent: "center" },
  pressed: { backgroundColor: colors.dangerTint },
});
