import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import DishRow from "../components/DishRow";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import GlassView from "../components/GlassView";
import ListSkeleton from "../components/ListSkeleton";
import ScreenBackground from "../components/ScreenBackground";
import { useFetch } from "../hooks/useFetch";
import { getHistory } from "../services/historyService";
import type { CookingHistory } from "../types/account";
import { dayKey, formatDay, formatTime } from "../utils/format";
import { colors, radius, text } from "../utils/theme";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { data, loading, error, retry } = useFetch(getHistory);

  const sections = useMemo(() => {
    const sorted = [...(data ?? [])].sort((a, b) => b.cookedAt.localeCompare(a.cookedAt));
    const groups = new Map<string, CookingHistory[]>();
    sorted.forEach(entry => {
      const key = dayKey(entry.cookedAt);
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    });
    return [...groups.values()].map(entries => ({ title: formatDay(entries[0].cookedAt), data: entries }));
  }, [data]);

  const summary = useMemo(() => {
    const counts = new Map<string, number>();
    (data ?? []).forEach(entry => counts.set(entry.dishName, (counts.get(entry.dishName) ?? 0) + 1));
    const favorite = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return { total: data?.length ?? 0, days: sections.length, favorite: favorite?.[0] ?? "—" };
  }, [data, sections]);

  const renderEmpty = () => {
    if (loading) return <ListSkeleton label="Cargando historial…" />;
    if (error) return <ErrorState title="No pudimos cargar tu historial" error={error} onRetry={retry} />;
    return (
      <EmptyState
        icon="time-outline"
        title="Todavía no cocinas nada"
        body="Cuando marques un plato como cocinado aparecerá aquí."
        actionLabel="Ver recomendaciones"
        onAction={() => navigation.navigate("Tabs", { screen: "Home" })}
      />
    );
  };

  return (
    <ScreenBackground edges={[]}>
      <SectionList
        sections={error ? [] : sections}
        keyExtractor={entry => String(entry.id)}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          data && data.length > 0 ? (
            <GlassView style={styles.summary}>
              <View style={styles.stat}>
                <Text style={text.title2}>{summary.total}</Text>
                <Text style={text.footnote}>Platos cocinados</Text>
              </View>
              <View style={styles.stat}>
                <Text style={text.title2}>{summary.days}</Text>
                <Text style={text.footnote}>Días activos</Text>
              </View>
              <View style={[styles.stat, styles.wide]}>
                <Text style={styles.favorite} numberOfLines={2}>{summary.favorite}</Text>
                <Text style={text.footnote}>El que más cocinas</Text>
              </View>
            </GlassView>
          ) : undefined
        }
        renderSectionHeader={({ section }) => <Text style={[text.headline, styles.day]}>{section.title}</Text>}
        renderItem={({ item }) => (
          <GlassView variant="dense" radius={radius.card} style={styles.card}>
            <DishRow
              name={item.dishName}
              meta={`Cocinado a las ${formatTime(item.cookedAt)}`}
              onPress={() => navigation.navigate("DishDetail", { dishId: item.dishId, name: item.dishName })}
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
  summary: { flexDirection: "row", gap: 12, padding: 18, marginBottom: 8 },
  stat: { flex: 1, gap: 2 },
  wide: { flex: 1.6 },
  favorite: { fontSize: 16, fontWeight: "500", lineHeight: 21, color: colors.title },
  day: { paddingHorizontal: 6, paddingTop: 16, paddingBottom: 8 },
  card: { padding: 4 },
  gap: { height: 10 },
});
