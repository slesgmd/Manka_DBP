import { useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { addPantryItem, getPantryItems, removePantryItem } from "../services/pantryService";
import { errorMessage, statusOf } from "../utils/http";
import { useFetch } from "./useFetch";

export function usePantry() {
  const { data, loading, error, retry } = useFetch(getPantryItems);

  const ids = useMemo(() => new Set(data?.map(item => item.ingredientId)), [data]);

  const add = useCallback(async (ingredientId: number, name: string) => {
    try {
      await addPantryItem({ ingredientId });
      retry();
    } catch (err) {
      Alert.alert("Despensa", statusOf(err) === 409 ? `${name} ya está en tu despensa.` : errorMessage(err, `No pudimos agregar ${name}.`));
    }
  }, [retry]);

  const remove = useCallback(async (ingredientId: number, name: string) => {
    try {
      await removePantryItem(ingredientId);
      retry();
    } catch (err) {
      Alert.alert("Despensa", errorMessage(err, `No pudimos quitar ${name}.`));
    }
  }, [retry]);

  return { items: data, loading, error, retry, ids, add, remove };
}
