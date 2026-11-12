import { useCallback, useMemo, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import { createDishIngredient, deleteDishIngredient, getDishIngredients } from "../../services/dishIngredientService";
import type { DishIngredient, Ingredient } from "../../types/catalog";
import { statusOf } from "../../utils/http";
import IngredientSearch from "../IngredientSearch";
import ConfirmDialog from "../ui/ConfirmDialog";
import ErrorState from "../ui/ErrorState";
import Icon from "../ui/Icon";
import SkeletonBlock from "../ui/SkeletonBlock";

export default function DishIngredientsEditor({ dishId, dishName }: { dishId: number; dishName: string }) {
  const { showToast } = useToast();
  const { data, error, retry } = useFetch(getDishIngredients);
  const [toRemove, setToRemove] = useState<DishIngredient | null>(null);
  const [removing, setRemoving] = useState(false);

  const relations = useMemo(() => (data ?? []).filter(relation => relation.dishId === dishId), [data, dishId]);
  const addedIds = useMemo(() => new Set(relations.map(relation => relation.ingredientId)), [relations]);

  const handleAdd = useCallback(async (ingredient: Ingredient) => {
    try {
      await createDishIngredient({ dishId, ingredientId: ingredient.id });
      showToast("success", `${ingredient.name} agregado a ${dishName}`);
      retry();
    } catch (err) {
      showToast("error", statusOf(err) === 409 ? `${ingredient.name} ya está en el plato` : `No pudimos agregar ${ingredient.name}.`);
    }
  }, [dishId, dishName, retry, showToast]);

  const confirmRemove = async () => {
    if (!toRemove) return;
    setRemoving(true);
    try {
      await deleteDishIngredient(toRemove.id);
      showToast("success", `Quitaste ${toRemove.ingredientName} de ${dishName}`);
      retry();
    } catch {
      showToast("error", `No pudimos quitar ${toRemove.ingredientName}. Inténtalo otra vez.`);
    }
    setRemoving(false);
    setToRemove(null);
  };

  return (
    <div className="grid items-start gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <h3 className="text-headline font-medium">Ingredientes del plato</h3>
        {error && !data && <ErrorState title="No pudimos cargar los ingredientes del plato" body="Revisa tu conexión e inténtalo otra vez." onRetry={retry} />}
        {!data && !error && <SkeletonBlock className="h-32 rounded-[22px]" />}
        {data && relations.length === 0 && <p className="py-3 text-subhead text-ink-2">Aún no tiene ingredientes. Búscalos a la derecha y agrégalos.</p>}
        <ul>
          {relations.map(relation => (
            <li key={relation.id} className="flex min-h-[52px] items-center gap-3 border-t border-sep py-1 pl-1 pr-1">
              <span className="flex-1 text-[16px]">{relation.ingredientName}</span>
              <button type="button" onClick={() => setToRemove(relation)} aria-label={`Quitar ${relation.ingredientName} del plato`} className="press flex size-11 items-center justify-center rounded-full hover:bg-[var(--mk-g-thin)]">
                <Icon name="trash" size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-headline font-medium">Agregar ingrediente</h3>
        <IngredientSearch label="Buscar ingrediente para el plato" addedIds={addedIds} onAdd={handleAdd} />
      </div>
      <ConfirmDialog
        open={toRemove !== null}
        title={`¿Quitar ${toRemove?.ingredientName.toLowerCase() ?? ""} del plato?`}
        body="El ingrediente seguirá en el catálogo."
        confirmLabel="Quitar"
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setToRemove(null)}
      />
    </div>
  );
}
