import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import DishRow from "../components/DishRow";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import GlassView from "../components/GlassView";
import LoadingView from "../components/LoadingView";
import ScreenBackground from "../components/ScreenBackground";
import ScreenHeader from "../components/ScreenHeader";
import SearchField from "../components/SearchField";
import { useDebounce } from "../hooks/useDebounce";
import { useDishPages } from "../hooks/useDishPages";
import { plural } from "../utils/format";
import { colors, radius } from "../utils/theme";

export default function CatalogScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const search = useDebounce(query.trim(), 400);
  const { dishes, total, loading, error, loadMore, retry } = useDishPages(search);

  const renderEmpty = () => {
    if (loading) return <LoadingView label="Cargando platos…" />;
    if (error) return <ErrorState title="No pudimos cargar el catálogo" error={error} onRetry={retry} />;
    return (
      <EmptyState
        icon="search-outline"
        title="Ningún plato coincide"
        body={`No encontramos platos con «${search}».`}
        actionLabel="Quitar búsqueda"
        onAction={() => setQuery("")}
      />
    );
  };

  const renderFooter = () => {
    if (dishes.length === 0) return null;
    if (error) return <ErrorState title="No pudimos cargar más platos" error={error} onRetry={retry} />;
    if (loading) return <ActivityIndicator style={styles.footer} color={colors.ink} />;
    return null;
  };

  return (
    <ScreenBackground>
      <FlatList
        data={dishes}
        keyExtractor={dish => String(dish.id)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader title="Catálogo de platos" subtitle={loading && dishes.length === 0 ? "Buscando…" : plural(total, "plato", "platos")} />
            <SearchField label="Buscar platos por nombre" placeholder="Buscar por nombre" value={query} onChangeText={setQuery} />
          </View>
        }
        renderItem={({ item }) => (
          <GlassView variant="dense" radius={radius.card} style={styles.card}>
            <DishRow
              name={item.name}
              meta={`${item.totalTimeMinutes} min · ${item.proteinCategoryName}`}
              onPress={() => navigation.navigate("DishDetail", { dishId: item.id, name: item.name })}
            />
          </GlassView>
        )}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  header: { gap: 16, marginBottom: 16 },
  card: { padding: 4 },
  gap: { height: 10 },
  footer: { paddingVertical: 20 },
});
