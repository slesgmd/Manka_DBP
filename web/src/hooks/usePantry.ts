import { useCallback, useMemo } from "react";
import { addPantryItem, getPantryItems, removePantryItem } from "../services/pantryService";
import { statusOf } from "../utils/http";
import { useFetch } from "./useFetch";
import { useToast } from "./useToast";

export function usePantry() {
  const { showToast } = useToast();
  const { data, loading, error, retry } = useFetch(getPantryItems);

  const ids = useMemo(() => new Set(data?.map(item => item.ingredientId)), [data]);

  const add = useCallback(async (ingredientId: number, name: string) => {
    try {
      await addPantryItem({ ingredientId });
      showToast("success", `${name} agregado a tu despensa`);
      retry();
    } catch (err) {
      showToast("error", statusOf(err) === 409 ? `${name} ya está en tu despensa` : `No pudimos agregar ${name}. Inténtalo otra vez.`);
    }
  }, [retry, showToast]);

  const remove = useCallback(async (ingredientId: number, name: string) => {
    try {
      await removePantryItem(ingredientId);
      showToast("success", `Quitaste ${name} de tu despensa`);
      retry();
      return true;
    } catch {
      showToast("error", `No pudimos quitar ${name}. Inténtalo otra vez.`);
      return false;
    }
  }, [retry, showToast]);

  return { items: data, loading, error, retry, ids, add, remove };
}
