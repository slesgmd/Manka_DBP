import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BestOption from "../components/BestOption";
import DishRow from "../components/DishRow";
import IngredientSearch from "../components/IngredientSearch";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import Chip from "../components/ui/Chip";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import SegmentedControl from "../components/ui/SegmentedControl";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import { useFetch } from "../hooks/useFetch";
import { usePantry } from "../hooks/usePantry";
import { useToast } from "../hooks/useToast";
import { dishPath, ROUTES } from "../routes";
import { getIngredients } from "../services/ingredientService";
import { removePantryItem } from "../services/pantryService";
import { getRecommendations } from "../services/recommendationService";
import type { PantryItem } from "../types/account";
import type { Ingredient } from "../types/catalog";
import { buttonClass } from "../utils/buttonClass";
import { plural } from "../utils/format";
import { TIME_OPTIONS } from "../utils/recommendation";

type PendingRemoval = { kind: "one"; item: PantryItem } | { kind: "all" };

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const pantry = usePantry();
  const addToPantry = pantry.add;
  const [minutes, setMinutes] = useState("30");
  const [query, setQuery] = useState({ minutes: 30 });
  const [index, setIndex] = useState(0);
  const [pending, setPending] = useState<PendingRemoval | null>(null);
  const [removing, setRemoving] = useState(false);

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

  const surprise = () => {
    if (!results || results.length === 0) return;
    const pick = results[Math.floor(Math.random() * results.length)];
    navigate(dishPath(pick.dishId), { state: { name: pick.name, recommendation: pick } });
  };

  const handleAdd = useCallback((ingredient: Ingredient) => addToPantry(ingredient.id, ingredient.name), [addToPantry]);

  const handleAddMissing = useCallback(async (name: string) => {
    try {
      const page = await getIngredients({ name, size: 20 });
      const match = page.content.find(ingredient => ingredient.name.toLowerCase() === name.toLowerCase());
      if (!match) {
        showToast("error", `No encontramos ${name} en el catálogo de ingredientes.`);
        return;
      }
      await addToPantry(match.id, match.name);
      setQuery(prev => ({ ...prev }));
    } catch {
      showToast("error", `No pudimos agregar ${name}. Inténtalo otra vez.`);
    }
  }, [addToPantry, showToast]);

  const confirmRemoval = async () => {
    if (!pending) return;
    setRemoving(true);
    if (pending.kind === "one") {
      await pantry.remove(pending.item.ingredientId, pending.item.ingredientName);
    } else {
      try {
        await Promise.all((pantry.items ?? []).map(item => removePantryItem(item.ingredientId)));
        showToast("success", "Vaciaste tu despensa");
      } catch {
        showToast("error", "No pudimos vaciar toda tu despensa. Inténtalo otra vez.");
      }
      pantry.retry();
    }
    setRemoving(false);
    setPending(null);
  };

  const pantryEmpty = pantry.items?.length === 0;

  const renderResults = () => {
    if (pantryEmpty) {
      return (
        <EmptyState
          title="Empecemos por tu despensa"
          body="Agrega lo que tienes en casa y te diremos qué puedes cocinar hoy."
          icon={<Icon name="pantry" size={28} />}
          action={<Link to={ROUTES.pantry} className={buttonClass("primary", "md")}>Agregar ingredientes</Link>}
        />
      );
    }
    if (recommendations.loading && !results) {
      return (
        <div role="status" aria-label="Buscando recomendaciones" className="glass flex flex-col gap-4 rounded-[42px] p-3.5">
          <SkeletonBlock className="h-8 w-48 rounded-full" />
          <SkeletonBlock className="aspect-[4/3] rounded-inner" />
          <SkeletonBlock className="h-10 w-2/3 rounded-full" />
          <SkeletonBlock className="h-3 rounded-full" />
          <SkeletonBlock className="h-48 rounded-[28px]" />
        </div>
      );
    }
    if (recommendations.error) {
      return <ErrorState title="No pudimos traer tus recomendaciones" body="Revisa tu conexión e inténtalo otra vez." onRetry={recommendations.retry} />;
    }
    if (top.length === 0) {
      const next = TIME_OPTIONS.map(option => Number(option.value)).find(value => value > query.minutes);
      return (
        <EmptyState
          title={`Nada entra en ${query.minutes} minutos`}
          body="Prueba con un poco más de tiempo o revisa el catálogo completo."
          icon={<Icon name="clock" size={28} />}
          action={next
            ? <Button size="md" kind="primary" onClick={() => tryMinutes(next)}>Probar con {next} min</Button>
            : <Link to={ROUTES.catalog} className={buttonClass("primary", "md")}>Ver catálogo</Link>}
        />
      );
    }
    return (
      <div aria-busy={recommendations.loading} className="flex flex-col gap-5">
        <BestOption options={top} index={selected} minutes={query.minutes} onSelect={setIndex} onAddMissing={handleAddMissing} />
        {others.length > 0 && (
          <section className="glass rounded-[38px] p-3">
            <h2 className="px-3.5 pb-3 pt-2.5 text-title2 font-medium text-title">Otras opciones</h2>
            <ul className="flex flex-col gap-0.5">
              {others.map(option => (
                <DishRow
                  key={option.dishId}
                  id={option.dishId}
                  name={option.name}
                  meta={`${option.prepTimeMinutes} min · ${Math.round(option.coveragePercent)} % de ingredientes`}
                  note={`Puntaje ${Math.round(option.score)} de 100`}
                  linkState={{ recommendation: option }}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  };

  return (
    <>
      <PageHeader title="Recomendaciones" subtitle="Dinos qué tienes y cuánto tiempo, y te decimos qué cocinar hoy.">
        <Link to={ROUTES.catalog} className="glass glass-thin press hidden h-[50px] w-[280px] items-center gap-2.5 rounded-full px-[18px] text-subhead text-ink-2 lg:flex">
          <Icon name="search" size={17} /> Buscar en el catálogo
        </Link>
      </PageHeader>

      <div className="grid items-start gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="glass flex flex-col gap-[18px] rounded-[38px] p-[22px]">
          <div className="flex items-center justify-between">
            <h2 className="pl-1 text-title3 font-medium text-title">Tu despensa</h2>
            <button
              type="button"
              disabled={!pantry.items || pantry.items.length === 0}
              onClick={() => setPending({ kind: "all" })}
              className="glass glass-thin press h-11 rounded-full px-4 text-sm font-medium text-ink disabled:opacity-50"
            >
              Limpiar todo
            </button>
          </div>
          <IngredientSearch label="Buscar ingrediente para tu despensa" addedIds={pantry.ids} onAdd={handleAdd} />
          {!pantry.items && pantry.loading && <SkeletonBlock className="h-24 rounded-[22px]" />}
          {pantry.error && !pantry.items && (
            <p className="flex items-center justify-between gap-2 text-subhead text-ink-2">
              No pudimos cargar tu despensa.
              <Button size="md" onClick={pantry.retry}>Reintentar</Button>
            </p>
          )}
          {pantry.items && pantry.items.length > 0 && (
            <>
              <ul className="flex flex-wrap gap-2">
                {pantry.items.map(item => (
                  <li key={item.id}>
                    <Chip label={item.ingredientName} onRemove={() => setPending({ kind: "one", item })} />
                  </li>
                ))}
              </ul>
              <p className="pl-1 text-footnote text-ink-2">{plural(pantry.items.length, "ingrediente", "ingredientes")} · se guardan en tu despensa</p>
            </>
          )}
          {pantryEmpty && <p className="px-2 py-4 text-center text-subhead text-ink-2">Tu despensa está vacía. Busca arriba lo que tienes en casa.</p>}

          <div className="h-px bg-sep" />

          <h2 className="pl-1 text-title3 font-medium text-title">¿Cuánto tiempo tienes?</h2>
          <SegmentedControl label="Tiempo disponible" options={TIME_OPTIONS} value={minutes} onChange={setMinutes} />
          <Button kind="primary" className="h-[58px]" loading={recommendations.loading} loadingLabel="Buscando…" onClick={search}>
            ¿Qué puedo cocinar?
          </Button>
          <Button className="h-[58px]" icon={<Icon name="shuffle" size={18} />} disabled={recommendations.loading || !results?.length} onClick={surprise}>
            Sorpréndeme
          </Button>
          <p className="px-1 text-footnote text-ink-2">«Sorpréndeme» elige al azar entre tus 10 mejores opciones.</p>
        </section>

        {renderResults()}
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pending?.kind === "one" ? `¿Quitar ${pending.item.ingredientName.toLowerCase()}?` : "¿Vaciar tu despensa?"}
        body={pending?.kind === "one" ? "Dejará de contar para tus recomendaciones." : "Se quitarán todos los ingredientes guardados."}
        confirmLabel={pending?.kind === "one" ? "Quitar" : "Vaciar"}
        loading={removing}
        onConfirm={confirmRemoval}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
