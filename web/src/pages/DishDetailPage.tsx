import { useCallback, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ScoreBreakdown from "../components/ScoreBreakdown";
import Button from "../components/ui/Button";
import DishImage from "../components/ui/DishImage";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import ScoreRing from "../components/ui/ScoreRing";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import { useFetch } from "../hooks/useFetch";
import { usePantry } from "../hooks/usePantry";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../routes";
import { getDish } from "../services/dishService";
import { addFavorite, getFavorites, removeFavorite } from "../services/favoriteService";
import { addHistory, deleteHistory } from "../services/historyService";
import type { Recommendation } from "../types/account";
import { buttonClass } from "../utils/buttonClass";
import { errorMessage, statusOf } from "../utils/http";

export default function DishDetailPage() {
  const { id } = useParams();
  const dishId = Number(id);
  const { state } = useLocation();
  const recommendation = (state as { recommendation?: Recommendation } | null)?.recommendation;
  const { showToast } = useToast();

  const fetchDish = useCallback((signal: AbortSignal) => getDish(dishId, signal), [dishId]);
  const { data: dish, loading, error, retry } = useFetch(fetchDish);
  const favorites = useFetch(getFavorites);
  const pantry = usePantry();
  const [cooking, setCooking] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const isFavorite = !!favorites.data?.some(favorite => favorite.dishId === dishId);

  const undoCook = async (historyId: number) => {
    try {
      await deleteHistory(historyId);
      showToast("success", "Quitado de tu historial");
    } catch (err) {
      showToast("error", errorMessage(err, "No pudimos deshacerlo."));
    }
  };

  const markCooked = async () => {
    setCooking(true);
    try {
      const entry = await addHistory({ dishId });
      showToast("success", "Agregado a tu historial", { label: "Deshacer", onClick: () => undoCook(entry.id) });
    } catch (err) {
      showToast("error", errorMessage(err, "No pudimos guardarlo en tu historial."));
    }
    setCooking(false);
  };

  const toggleFavorite = async () => {
    if (!dish) return;
    setSavingFavorite(true);
    try {
      if (isFavorite) {
        await removeFavorite(dishId);
        showToast("success", `Quitaste ${dish.name} de favoritos`);
      } else {
        await addFavorite({ dishId });
        showToast("success", `${dish.name} guardado en favoritos`);
      }
      favorites.retry();
    } catch (err) {
      showToast("error", errorMessage(err, "No pudimos actualizar tus favoritos."));
    }
    setSavingFavorite(false);
  };

  if (Number.isNaN(dishId) || statusOf(error) === 404 || statusOf(error) === 400) {
    return (
      <EmptyState
        title="No lo encontramos"
        body="Este plato no existe o se retiró del catálogo."
        icon={<Icon name="catalog" size={28} />}
        action={<Link to={ROUTES.catalog} className={buttonClass("primary", "md")}>Ver catálogo</Link>}
      />
    );
  }

  if (error) {
    return <ErrorState title="No pudimos cargar el plato" error={error} onRetry={retry} />;
  }

  if (loading || !dish) {
    return (
      <div role="status" aria-label="Cargando plato" className="flex flex-col gap-5">
        <SkeletonBlock className="h-32 rounded-[36px]" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <SkeletonBlock className="aspect-[4/3] rounded-[42px]" />
          <SkeletonBlock className="h-96 rounded-[38px]" />
        </div>
      </div>
    );
  }

  const haveCount = dish.ingredients.filter(ingredient => pantry.ids.has(ingredient.id)).length;

  return (
    <>
      <header className="glass flex flex-wrap items-end justify-between gap-6 rounded-[36px] px-6 py-5 md:pl-8 md:pr-[18px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-normal leading-[38px] tracking-[-0.035em] text-title md:text-[40px] md:leading-[46px]">{dish.name}</h1>
          <p className="text-subhead text-ink-2">
            {dish.totalTimeMinutes} min · {dish.proteinCategoryName} · {dish.ingredients.length} ingredientes
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={savingFavorite || favorites.loading}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            className="glass glass-thin press flex size-14 items-center justify-center rounded-full text-ink disabled:opacity-60"
          >
            <Icon name="favorites" size={22} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <Button kind="primary" loading={cooking} loadingLabel="Guardando…" icon={<Icon name="check" size={20} strokeWidth={2.2} />} onClick={markCooked}>
            Marcar como cocinado
          </Button>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <figure className="glass rounded-[42px] p-3.5">
          <DishImage name={dish.name} className="aspect-[4/3] w-full rounded-inner" />
        </figure>

        <div className="flex flex-col gap-5">
          <section className="glass glass-dense rounded-[38px] p-2.5">
            <div className="flex items-baseline justify-between px-4 pb-2.5 pt-3.5">
              <h2 className="text-title2 font-normal text-title">Ingredientes</h2>
              {pantry.items && <span className="text-sm text-ink-2">Tienes {haveCount} de {dish.ingredients.length}</span>}
            </div>
            {dish.ingredients.length === 0 && <p className="border-t border-sep px-4 py-5 text-subhead text-ink-2">Este plato aún no tiene ingredientes registrados.</p>}
            <ul>
              {dish.ingredients.map(ingredient => {
                const have = pantry.ids.has(ingredient.id);
                return (
                  <li key={ingredient.id} className="flex min-h-14 items-center gap-3 border-t border-sep py-1 pl-3.5 pr-2">
                    <span className={have ? "glass glass-thin glass-ok flex size-8 shrink-0 items-center justify-center rounded-full" : "glass glass-thin flex size-8 shrink-0 items-center justify-center rounded-full"}>
                      <Icon name={have ? "check" : "plus"} size={15} strokeWidth={2.4} color={have ? "var(--mk-ok)" : "currentColor"} />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-[16px] font-medium">{ingredient.name}</span>
                      <span className="text-footnote text-ink-2">{have ? "Lo tienes" : "Te falta"}</span>
                    </span>
                    {!have && pantry.items && (
                      <button
                        type="button"
                        onClick={() => pantry.add(ingredient.id, ingredient.name)}
                        aria-label={`Agregar ${ingredient.name} a la despensa`}
                        className="glass glass-thin press flex h-11 items-center gap-1.5 rounded-full pl-3 pr-4 text-sm font-medium text-ink"
                      >
                        <Icon name="plus" size={15} strokeWidth={2.2} /> Agregar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {recommendation && (
            <section className="flex flex-col gap-3">
              <div className="glass flex items-center gap-[18px] rounded-[38px] px-[22px] py-[18px]">
                <ScoreRing score={Math.round(recommendation.score)} size={84} />
                <div className="flex flex-col gap-1">
                  <h2 className="text-headline font-medium">Tu puntaje hoy</h2>
                  <p className="text-sm text-ink-2">Calculado con tu despensa y el tiempo que elegiste.</p>
                </div>
              </div>
              <ScoreBreakdown score={Math.round(recommendation.score)} breakdown={recommendation.breakdown} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}
