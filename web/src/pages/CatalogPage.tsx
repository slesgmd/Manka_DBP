import { useCallback, useEffect, useMemo } from "react";
import DishCard from "../components/DishCard";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import SearchField from "../components/ui/SearchField";
import SelectField from "../components/ui/SelectField";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import Pagination from "../components/ui/Pagination";
import ToggleChip from "../components/ui/ToggleChip";
import { useFetch } from "../hooks/useFetch";
import { usePagination } from "../hooks/usePagination";
import { getDishes } from "../services/dishService";
import { getProteinCategories } from "../services/proteinCategoryService";
import type { DishSearchParams } from "../types/catalog";
import { plural } from "../utils/format";

const SORT_OPTIONS = [
  { value: "name,asc", label: "Nombre A–Z" },
  { value: "name,desc", label: "Nombre Z–A" },
  { value: "totalTimeMinutes,asc", label: "Menos tiempo" },
  { value: "totalTimeMinutes,desc", label: "Más tiempo" },
];

const MAX_TIMES = [20, 30, 45, 60];

export default function CatalogPage() {
  const { page, size, search: name, query, setQuery, get, update, setPage, setSize, fitTo } = usePagination();
  const sort = SORT_OPTIONS.some(option => option.value === get("sort")) ? get("sort")! : SORT_OPTIONS[0].value;
  const proteinId = Number(get("proteinCategoryId")) || null;
  const maxMinutes = Number(get("maxPrepMinutes")) || null;

  const proteins = useFetch(getProteinCategories);

  const params = useMemo(() => {
    const result: DishSearchParams = { sort, page, size };
    if (name) result.name = name;
    if (proteinId !== null) result.proteinCategoryId = proteinId;
    if (maxMinutes !== null) result.maxPrepMinutes = maxMinutes;
    return result;
  }, [name, sort, proteinId, maxMinutes, page, size]);

  const fetchDishes = useCallback((signal: AbortSignal) => getDishes(params, signal), [params]);
  const { data, loading, error, retry } = useFetch(fetchDishes);

  useEffect(() => {
    if (data && !loading) fitTo(data.totalPages);
  }, [data, loading, fitTo]);

  const hasFilters = name !== "" || proteinId !== null || maxMinutes !== null;

  const clearFilters = useCallback(() => {
    update({ search: null, proteinCategoryId: null, maxPrepMinutes: null });
  }, [update]);

  const renderResults = () => {
    if (loading && !data) {
      return (
        <ul role="status" aria-label="Cargando platos" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => <li key={i}><SkeletonBlock className="aspect-[4/5] rounded-card" /></li>)}
        </ul>
      );
    }
    if (error) {
      return <ErrorState title="No pudimos cargar el catálogo" body="Tus filtros se mantienen. Revisa tu conexión e inténtalo otra vez." onRetry={retry} />;
    }
    if (data?.content.length === 0) {
      return (
        <EmptyState
          title="Ningún plato coincide"
          body="Prueba con otro nombre o quita alguno de los filtros."
          icon={<Icon name="search" size={28} />}
          action={hasFilters && <Button size="md" kind="primary" onClick={clearFilters}>Quitar filtros</Button>}
        />
      );
    }
    return (
      <ul aria-busy={loading} className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {data?.content.map(dish => (
          <DishCard key={dish.id} id={dish.id} name={dish.name} minutes={dish.totalTimeMinutes} protein={dish.proteinCategoryName} />
        ))}
      </ul>
    );
  };

  return (
    <>
      <PageHeader title="Catálogo de platos" subtitle="Platos peruanos. Filtra por proteína y por el tiempo que tienes.">
        {data && <span className="text-subhead text-ink-2" aria-live="polite">{plural(data.totalElements, "resultado", "resultados")}</span>}
      </PageHeader>

      <section aria-label="Filtros" className="glass flex flex-col gap-4 rounded-[36px] px-[22px] py-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchField label="Buscar plato por nombre" placeholder="Buscar plato" value={query} onChange={e => setQuery(e.target.value)} className="h-[52px] flex-1" />
          <SelectField label="Ordenar" hideLabel options={SORT_OPTIONS} value={sort} onChange={e => update({ sort: e.target.value })} className="sm:w-56" />
        </div>
        <div className="grid items-center gap-x-4 gap-y-3 md:grid-cols-[130px_minmax(0,1fr)]">
          <span className="text-sm text-ink-2">Proteína</span>
          <div className="flex flex-wrap gap-2">
            <ToggleChip label="Todas" selected={proteinId === null} onClick={() => update({ proteinCategoryId: null })} />
            {proteins.data?.map(protein => (
              <ToggleChip key={protein.id} label={protein.name} selected={proteinId === protein.id} onClick={() => update({ proteinCategoryId: protein.id })} />
            ))}
          </div>
          <span className="text-sm text-ink-2">Tiempo máximo</span>
          <div className="flex flex-wrap gap-2">
            <ToggleChip label="Cualquiera" selected={maxMinutes === null} onClick={() => update({ maxPrepMinutes: null })} />
            {MAX_TIMES.map(minutes => (
              <ToggleChip key={minutes} label={`${minutes} min`} selected={maxMinutes === minutes} onClick={() => update({ maxPrepMinutes: minutes })} />
            ))}
          </div>
        </div>
      </section>

      {renderResults()}

      {data && !error && data.content.length > 0 && (
        <Pagination
          page={page}
          size={size}
          totalElements={data.totalElements}
          totalPages={data.totalPages}
          shown={data.content.length}
          sizeLabel="Platos por página"
          onPageChange={setPage}
          onSizeChange={setSize}
        />
      )}
    </>
  );
}
