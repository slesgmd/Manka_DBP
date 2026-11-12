import { useCallback, useMemo } from "react";
import { addPantryItem, getPantryItems, removePantryItem } from "../services/pantryService";
import { errorMessage, statusOf } from "../utils/http";
import { useFetch } from "./useFetch";
import { useToast } from "./useToast";

export function usePantry() {
  const { data, loading, error, retry } = useFetch(getPantryItems);
  const showToast = useToast();

  const ids = useMemo(() => new Set(data?.map(item => item.ingredientId)), [data]);

  const add = useCallback(async (ingredientId: number, name: string) => {
    try {
      await addPantryItem({ ingredientId });
      retry();
      showToast(`${name} se agregó a tu despensa.`);
    } catch (err) {
      const message = statusOf(err) === 409 ? `${name} ya está en tu despensa.` : errorMessage(err, `No pudimos agregar ${name}.`);
      showToast(message, { tone: "error" });
    }
  }, [retry, showToast]);

  const remove = useCallback(async (ingredientId: number, name: string) => {
    try {
      await removePantryItem(ingredientId);
      retry();
      showToast(`${name} se quitó de tu despensa.`);
    } catch (err) {
      showToast(errorMessage(err, `No pudimos quitar ${name}.`), { tone: "error" });
    }
  }, [retry, showToast]);

  return { items: data, loading, error, retry, ids, add, remove };
}
