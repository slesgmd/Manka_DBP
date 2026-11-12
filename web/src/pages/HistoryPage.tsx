import { useMemo } from "react";
import { Link } from "react-router-dom";
import DishRow from "../components/DishRow";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import { useFetch } from "../hooks/useFetch";
import { ROUTES } from "../routes";
import { getHistory } from "../services/historyService";
import type { CookingHistory } from "../types/account";
import { buttonClass } from "../utils/buttonClass";
import { dayKey, formatDay, formatTime } from "../utils/format";

export default function HistoryPage() {
  const { data, loading, error, retry } = useFetch(getHistory);

  const sorted = useMemo(() => [...(data ?? [])].sort((a, b) => b.cookedAt.localeCompare(a.cookedAt)), [data]);

  const groups = useMemo(() => {
    const result: { key: string; label: string; items: CookingHistory[] }[] = [];
    sorted.forEach(entry => {
      const key = dayKey(entry.cookedAt);
      const last = result[result.length - 1];
      if (last && last.key === key) last.items.push(entry);
      else result.push({ key, label: formatDay(entry.cookedAt), items: [entry] });
    });
    return result;
  }, [sorted]);

  const stats = useMemo(() => {
    const counts = new Map<string, number>();
    sorted.forEach(entry => counts.set(entry.dishName, (counts.get(entry.dishName) ?? 0) + 1));
    let top = "—";
    let topCount = 0;
    counts.forEach((count, name) => {
      if (count > topCount) {
        top = name;
        topCount = count;
      }
    });
    return [
      { label: "Platos cocinados", value: String(sorted.length), note: `${counts.size} platos distintos` },
      { label: "Días activos", value: String(groups.length), note: "Días con al menos un plato" },
      { label: "El que más cocinas", value: top, note: topCount ? `${topCount} veces` : "Aún sin datos" },
    ];
  }, [sorted, groups]);

  const renderContent = () => {
    if (!data && loading) {
      return (
        <div role="status" aria-label="Cargando historial" className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-3">{[0, 1, 2].map(i => <SkeletonBlock key={i} className="h-32 rounded-[34px]" />)}</div>
          <SkeletonBlock className="h-80 rounded-[38px]" />
        </div>
      );
    }
    if (error && !data) {
      return <ErrorState title="No pudimos cargar tu historial" error={error} onRetry={retry} />;
    }
    if (sorted.length === 0) {
      return (
        <EmptyState
          title="Todavía no cocinas nada"
          body="Cuando marques un plato como cocinado aparecerá aquí, ordenado por fecha."
          icon={<Icon name="history" size={28} />}
          action={<Link to={ROUTES.home} className={buttonClass("primary", "md")}>Ver recomendaciones</Link>}
        />
      );
    }
    return (
      <>
        <div className="grid gap-5 md:grid-cols-3">
          {stats.map(stat => (
            <section key={stat.label} className="glass flex min-w-0 flex-col gap-1 rounded-[34px] px-[26px] py-[22px]">
              <h2 className="text-sm text-ink-2">{stat.label}</h2>
              <p className="truncate text-large-title-m font-normal text-title tabular-nums md:text-large-title">{stat.value}</p>
              <p className="text-sm text-ink-2">{stat.note}</p>
            </section>
          ))}
        </div>
        <section className="glass glass-dense rounded-[38px] px-2.5 pb-3.5 pt-2.5" aria-label="Platos cocinados por día">
          {groups.map(group => (
            <div key={group.key} className="flex flex-col">
              <h2 className="px-4 pb-2 pt-[18px] text-subhead font-medium text-ink-2">{group.label}</h2>
              <ul>
                {group.items.map(entry => (
                  <DishRow
                    key={entry.id}
                    id={entry.dishId}
                    name={entry.dishName}
                    lead={<span className="w-12 shrink-0 text-subhead font-medium tabular-nums md:w-16">{formatTime(entry.cookedAt)}</span>}
                  />
                ))}
              </ul>
            </div>
          ))}
        </section>
      </>
    );
  };

  return (
    <>
      <PageHeader title="Historial" subtitle="Lo que cocinaste. Manka lo usa para no repetirte platos." />
      {renderContent()}
    </>
  );
}
