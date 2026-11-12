import { useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import BestOption from "../components/BestOption";
import Button from "../components/Button";
import Chip from "../components/Chip";
import DishRow from "../components/DishRow";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import GlassView from "../components/GlassView";
import IngredientSearch from "../components/IngredientSearch";
import LoadingView from "../components/LoadingView";
import ScreenBackground from "../components/ScreenBackground";
import ScreenHeader from "../components/ScreenHeader";
import SegmentedControl from "../components/SegmentedControl";
import { useFetch } from "../hooks/useFetch";
import { usePantry } from "../hooks/usePantry";
import { useRefreshOnFocus } from "../hooks/useRefreshOnFocus";
import { useShake } from "../hooks/useShake";
import { getIngredients } from "../services/ingredientService";
import { removePantryItem } from "../services/pantryService";
import { getRecommendations } from "../services/recommendationService";
import type { PantryItem, Recommendation } from "../types/account";
import type { Ingredient } from "../types/catalog";
import { plural } from "../utils/format";
import { errorMessage } from "../utils/http";
import { TIME_OPTIONS } from "../utils/recommendation";
import { colors, text } from "../utils/theme";

export default function HomeScreen() {
  const navigation = useNavigation();
  const pantry = usePantry();
  const addToPantry = pantry.add;
  const [minutes, setMinutes] = useState("30");
  const [query, setQuery] = useState({ minutes: 30 });
  const [index, setIndex] = useState(0);

  useRefreshOnFocus(pantry.retry);

  const fetchRecommendations = useCallback(
    (signal: AbortSignal) => getRecommendations({ availableMinutes: query.minutes, limit: 10 }, signal),
    [query],
  );
  const recommendations = useFetch(fetchRecommendations);
  const results = recommendations.data;

  const top = useMemo(() => results?.slice(0, 5) ?? [], [results]);
  const others = useMemo(() => results?.slice(5) ?? [], [results]);
  const selected = Math.min(index, Math.max(top.length - 1, 0));

  const search = () => {
    setIndex(0);
    setQuery({ minutes: Number(minutes) });
  };

  const tryMinutes = (value: number) => {
    setMinutes(String(value));
    setIndex(0);
    setQuery({ minutes: value });
  };

  const openDish = useCallback(
    (recommendation: Recommendation) =>
      navigation.navigate("DishDetail", { dishId: recommendation.dishId, name: recommendation.name, recommendation }),
    [navigation],
  );

  const surprise = useCallback(() => {
    if (!results || results.length === 0) {
      Alert.alert("Sorpréndeme", "Primero agrega ingredientes y busca qué puedes cocinar.");
      return;
    }
    openDish(results[Math.floor(Math.random() * results.length)]);
  }, [results, openDish]);

  const shakeAvailable = useShake(surprise);

  const handleAdd = useCallback((ingredient: Ingredient) => addToPantry(ingredient.id, ingredient.name), [addToPantry]);

  const handleAddMissing = useCallback(async (name: string) => {
    try {
      const page = await getIngredients({ name, size: 20 });
      const match = page.content.find(ingredient => ingredient.name.toLowerCase() === name.toLowerCase());
      if (!match) {
        Alert.alert("Despensa", `No encontramos ${name} en el catálogo de ingredientes.`);
        return;
      }
      await addToPantry(match.id, match.name);
      setQuery(prev => ({ ...prev }));
    } catch (err) {
      Alert.alert("Despensa", errorMessage(err, `No pudimos agregar ${name}.`));
    }
  }, [addToPantry]);

  const confirmRemove = (item: PantryItem) => {
    Alert.alert(`¿Quitar ${item.ingredientName.toLowerCase()}?`, "Dejará de contar para tus recomendaciones.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Quitar", style: "destructive", onPress: () => pantry.remove(item.ingredientId, item.ingredientName) },
    ]);
  };

  const clearAll = async () => {
    try {
      await Promise.all((pantry.items ?? []).map(item => removePantryItem(item.ingredientId)));
    } catch (err) {
      Alert.alert("Despensa", errorMessage(err, "No pudimos vaciar toda tu despensa."));
    }
    pantry.retry();
  };

  const confirmClearAll = () => {
    Alert.alert("¿Vaciar tu despensa?", "Se quitarán todos los ingredientes guardados.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Vaciar", style: "destructive", onPress: clearAll },
    ]);
  };

  const pantryEmpty = pantry.items?.length === 0;

  const renderResults = () => {
    if (pantryEmpty) {
      return (
        <EmptyState
          icon="basket-outline"
          title="Empecemos por tu despensa"
          body="Agrega lo que tienes en casa y te diremos qué puedes cocinar hoy."
          actionLabel="Agregar ingredientes"
          onAction={() => navigation.navigate("Tabs", { screen: "Pantry" })}
        />
      );
    }
    if (recommendations.loading && !results) {
      return <LoadingView label="Buscando recomendaciones…" />;
    }
    if (recommendations.error) {
      return <ErrorState title="No pudimos traer tus recomendaciones" error={recommendations.error} onRetry={recommendations.retry} />;
    }
    if (top.length === 0) {
      const next = TIME_OPTIONS.map(option => Number(option.value)).find(value => value > query.minutes);
      return (
        <EmptyState
          icon="time-outline"
          title={`Nada entra en ${query.minutes} minutos`}
          body="Prueba con un poco más de tiempo o revisa el catálogo completo."
          actionLabel={next ? `Probar con ${next} min` : "Ver catálogo"}
          onAction={() => (next ? tryMinutes(next) : navigation.navigate("Tabs", { screen: "Catalog" }))}
        />
      );
    }
    return (
      <>
        <BestOption
          options={top}
          index={selected}
          minutes={query.minutes}
          onSelect={setIndex}
          onAddMissing={handleAddMissing}
          onOpen={openDish}
        />
        {others.length > 0 && (
          <GlassView style={styles.panel}>
            <Text style={[text.title2, styles.panelTitle]}>Otras opciones</Text>
            {others.map(option => (
              <DishRow
                key={option.dishId}
                name={option.name}
                meta={`${option.prepTimeMinutes} min · ${Math.round(option.coveragePercent)} % de ingredientes`}
                note={`Puntaje ${Math.round(option.score)} de 100`}
                onPress={() => openDish(option)}
              />
            ))}
          </GlassView>
        )}
      </>
    );
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Recomendaciones" subtitle="Dinos qué tienes y cuánto tiempo, y te decimos qué cocinar hoy." />

        <GlassView style={styles.pantry}>
          <View style={styles.pantryHeader}>
            <Text style={text.title3}>Tu despensa</Text>
            <Button label="Limpiar todo" disabled={!pantry.items || pantry.items.length === 0} onPress={confirmClearAll} />
          </View>
          <IngredientSearch addedIds={pantry.ids} onAdd={handleAdd} />
          {!pantry.items && pantry.loading && <LoadingView label="Cargando tu despensa…" />}
          {pantry.error && !pantry.items && (
            <View style={styles.inlineError}>
              <Text style={[text.subhead, styles.flex]}>No pudimos cargar tu despensa.</Text>
              <Button label="Reintentar" onPress={pantry.retry} />
            </View>
          )}
          {pantry.items && pantry.items.length > 0 && (
            <>
              <View style={styles.chips}>
                {pantry.items.map(item => (
                  <Chip key={item.id} label={item.ingredientName} onRemove={() => confirmRemove(item)} />
                ))}
              </View>
              <Text style={text.footnote}>{plural(pantry.items.length, "ingrediente", "ingredientes")} · se guardan en tu despensa</Text>
            </>
          )}
          {pantryEmpty && <Text style={[text.subhead, styles.center]}>Tu despensa está vacía. Busca arriba lo que tienes en casa.</Text>}

          <View style={styles.separator} />

          <Text style={text.title3}>¿Cuánto tiempo tienes?</Text>
          <SegmentedControl options={TIME_OPTIONS} value={minutes} onChange={setMinutes} />
          <Button
            label="¿Qué puedo cocinar?"
            kind="primary"
            size="lg"
            loading={recommendations.loading}
            loadingLabel="Buscando…"
            onPress={search}
          />
          <Button
            label="Sorpréndeme"
            icon="shuffle"
            disabled={recommendations.loading || !results || results.length === 0}
            onPress={surprise}
          />
          {shakeAvailable && <Text style={[text.footnote, styles.center]}>O agita tu celular para un plato al azar entre los 10 mejores.</Text>}
        </GlassView>

        {renderResults()}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  pantry: { padding: 18, gap: 16 },
  pantryHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  inlineError: { flexDirection: "row", alignItems: "center", gap: 10 },
  flex: { flex: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  center: { textAlign: "center", paddingVertical: 8 },
  separator: { height: 1, backgroundColor: colors.sep },
  panel: { padding: 10 },
  panelTitle: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 6 },
});
