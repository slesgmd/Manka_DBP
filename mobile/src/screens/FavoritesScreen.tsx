import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";
import DishRow from "../components/DishRow";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import GlassView from "../components/GlassView";
import ListSkeleton from "../components/ListSkeleton";
import ScreenBackground from "../components/ScreenBackground";
import ScreenHeader from "../components/ScreenHeader";
import { useFetch } from "../hooks/useFetch";
import { useRefreshOnFocus } from "../hooks/useRefreshOnFocus";
import { useToast } from "../hooks/useToast";
import { getFavorites, removeFavorite } from "../services/favoriteService";
import type { Favorite } from "../types/account";
import { formatDate, plural } from "../utils/format";
import { errorMessage } from "../utils/http";
import { colors, radius, TARGET } from "../utils/theme";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { data, loading, error, retry } = useFetch(getFavorites);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const showToast = useToast();

  useRefreshOnFocus(retry);

  const remove = async (favorite: Favorite) => {
    setRemovingId(favorite.dishId);
    try {
      await removeFavorite(favorite.dishId);
      retry();
      showToast(`${favorite.dishName} se quitó de tus favoritos.`);
    } catch (err) {
      showToast(errorMessage(err, `No pudimos quitar ${favorite.dishName}.`), { tone: "error" });
    }
    setRemovingId(null);
  };

  const renderEmpty = () => {
    if (loading) return <ListSkeleton label="Cargando favoritos…" />;
    if (error) return <ErrorState title="No pudimos cargar tus favoritos" error={error} onRetry={retry} />;
    return (
      <EmptyState
        icon="heart-outline"
        title="Aún no guardas platos"
        body="Toca el corazón en un plato para tenerlo siempre a mano."
        actionLabel="Ver recomendaciones"
        onAction={() => navigation.navigate("Tabs", { screen: "Home" })}
      />
    );
  };

  return (
    <ScreenBackground>
      <FlatList
        data={error ? [] : data ?? []}
        keyExtractor={favorite => String(favorite.id)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader title="Favoritos" subtitle={data ? plural(data.length, "plato guardado", "platos guardados") : "Tus platos guardados"} />
          </View>
        }
        renderItem={({ item }) => (
          <GlassView variant="dense" radius={radius.card} style={styles.card}>
            <DishRow
              name={item.dishName}
              meta={`${item.totalTimeMinutes} min`}
              note={`Guardado el ${formatDate(item.createdAt)}`}
              onPress={() => navigation.navigate("DishDetail", { dishId: item.dishId, name: item.dishName })}
              right={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar ${item.dishName} de favoritos`}
                  disabled={removingId !== null}
                  onPress={() => remove(item)}
                  style={styles.remove}
                >
                  {removingId === item.dishId ? <ActivityIndicator color={colors.ink} /> : <Ionicons name="heart" size={22} color={colors.ink} />}
                </Pressable>
              }
            />
          </GlassView>
        )}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListEmptyComponent={renderEmpty}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 16 },
  card: { padding: 4 },
  gap: { height: 10 },
  remove: { width: TARGET, height: TARGET, alignItems: "center", justifyContent: "center", marginRight: 6 },
});
