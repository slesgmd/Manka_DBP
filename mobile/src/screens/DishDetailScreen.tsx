import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import DishImage from "../components/DishImage";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import GlassView from "../components/GlassView";
import LoadingView from "../components/LoadingView";
import ScoreBreakdown from "../components/ScoreBreakdown";
import ScoreRing from "../components/ScoreRing";
import ScreenBackground from "../components/ScreenBackground";
import { useFetch } from "../hooks/useFetch";
import { usePantry } from "../hooks/usePantry";
import { useToast } from "../hooks/useToast";
import { getDish } from "../services/dishService";
import { addFavorite, getFavorites, removeFavorite } from "../services/favoriteService";
import { addHistory, deleteHistory } from "../services/historyService";
import type { RootStackParamList } from "../types/navigation";
import { errorMessage, statusOf } from "../utils/http";
import { colors, radius, TARGET, text } from "../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "DishDetail">;

export default function DishDetailScreen({ route, navigation }: Props) {
  const { dishId, recommendation } = route.params;

  const fetchDish = useCallback((signal: AbortSignal) => getDish(dishId, signal), [dishId]);
  const { data: dish, loading, error, retry } = useFetch(fetchDish);
  const favorites = useFetch(getFavorites);
  const pantry = usePantry();
  const showToast = useToast();
  const [cooking, setCooking] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const isFavorite = !!favorites.data?.some(favorite => favorite.dishId === dishId);

  const undoCook = async (historyId: number) => {
    try {
      await deleteHistory(historyId);
      showToast("Lo quitamos de tu historial.");
    } catch (err) {
      showToast(errorMessage(err, "No pudimos deshacerlo."), { tone: "error" });
    }
  };

  const markCooked = async () => {
    if (!dish) return;
    setCooking(true);
    try {
      const entry = await addHistory({ dishId });
      showToast(`${dish.name} se agregó a tu historial.`, { actionLabel: "Deshacer", onAction: () => undoCook(entry.id) });
    } catch (err) {
      showToast(errorMessage(err, "No pudimos guardarlo en tu historial."), { tone: "error" });
    }
    setCooking(false);
  };

  const toggleFavorite = async () => {
    setSavingFavorite(true);
    try {
      if (isFavorite) {
        await removeFavorite(dishId);
        showToast("Quitado de tus favoritos.");
      } else {
        await addFavorite({ dishId });
        showToast("Guardado en tus favoritos.");
      }
      favorites.retry();
    } catch (err) {
      showToast(errorMessage(err, "No pudimos actualizar tus favoritos."), { tone: "error" });
    }
    setSavingFavorite(false);
  };

  const renderContent = () => {
    if (statusOf(error) === 404 || statusOf(error) === 400) {
      return (
        <EmptyState
          icon="book-outline"
          title="No lo encontramos"
          body="Este plato no existe o se retiró del catálogo."
          actionLabel="Ver catálogo"
          onAction={() => navigation.navigate("Tabs", { screen: "Catalog" })}
        />
      );
    }
    if (error) return <ErrorState title="No pudimos cargar el plato" error={error} onRetry={retry} />;
    if (loading || !dish) return <LoadingView label="Cargando plato…" />;

    const haveCount = dish.ingredients.filter(ingredient => pantry.ids.has(ingredient.id)).length;

    return (
      <>
        <GlassView style={styles.photoPanel}>
          <DishImage name={dish.name} style={styles.photo} />
        </GlassView>

        <GlassView style={styles.info}>
          <Text style={text.dish} accessibilityRole="header">{dish.name}</Text>
          <Text style={text.subhead}>
            {dish.totalTimeMinutes} min · {dish.proteinCategoryName} · {dish.ingredients.length} ingredientes
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              accessibilityState={{ selected: isFavorite, disabled: savingFavorite || favorites.loading }}
              disabled={savingFavorite || favorites.loading}
              onPress={toggleFavorite}
              style={({ pressed }) => [styles.favorite, pressed && styles.pressed]}
            >
              {savingFavorite ? (
                <ActivityIndicator color={colors.ink} />
              ) : (
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={colors.ink} />
              )}
            </Pressable>
            <Button
              label="Marcar como cocinado"
              kind="primary"
              size="lg"
              icon="checkmark"
              loading={cooking}
              loadingLabel="Guardando…"
              onPress={markCooked}
              style={styles.flex}
            />
          </View>
        </GlassView>

        <GlassView variant="dense" style={styles.ingredients}>
          <View style={styles.ingredientsHeader}>
            <Text style={text.title2}>Ingredientes</Text>
            {pantry.items && <Text style={text.footnote}>Tienes {haveCount} de {dish.ingredients.length}</Text>}
          </View>
          {dish.ingredients.length === 0 && (
            <Text style={[text.subhead, styles.row]}>Este plato aún no tiene ingredientes registrados.</Text>
          )}
          {dish.ingredients.map(ingredient => {
            const have = pantry.ids.has(ingredient.id);
            return (
              <View key={ingredient.id} style={styles.row}>
                <View style={[styles.status, have && styles.statusOk]}>
                  <Ionicons name={have ? "checkmark" : "add"} size={16} color={have ? colors.ok : colors.ink} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={text.footnote}>{have ? "Lo tienes" : "Te falta"}</Text>
                </View>
                {!have && pantry.items && (
                  <Button label="Agregar" icon="add" onPress={() => pantry.add(ingredient.id, ingredient.name)} />
                )}
              </View>
            );
          })}
        </GlassView>

        {recommendation && (
          <>
            <GlassView style={styles.score}>
              <ScoreRing score={Math.round(recommendation.score)} />
              <View style={styles.flex}>
                <Text style={text.headline}>Tu puntaje hoy</Text>
                <Text style={text.footnote}>Calculado con tu despensa y el tiempo que elegiste.</Text>
              </View>
            </GlassView>
            <ScoreBreakdown score={Math.round(recommendation.score)} breakdown={recommendation.breakdown} />
          </>
        )}
      </>
    );
  };

  return (
    <ScreenBackground edges={[]}>
      <ScrollView contentContainerStyle={styles.content}>{renderContent()}</ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  photoPanel: { padding: 10 },
  photo: { width: "100%", aspectRatio: 4 / 3, borderRadius: radius.inner },
  info: { padding: 20, gap: 8 },
  actions: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  favorite: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.thin,
    borderWidth: 1,
    borderColor: colors.rim,
  },
  pressed: { transform: [{ scale: 0.96 }] },
  flex: { flex: 1 },
  ingredients: { paddingVertical: 8 },
  ingredientsHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.sep,
  },
  status: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.thin,
    borderWidth: 1,
    borderColor: colors.rim,
  },
  statusOk: { backgroundColor: colors.okTint },
  ingredientName: { fontSize: 16, fontWeight: "500", color: colors.ink, minHeight: TARGET / 2 },
  score: { flexDirection: "row", alignItems: "center", gap: 16, padding: 18 },
});
