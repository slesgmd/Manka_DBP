import { useCallback, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { getIngredients } from "../services/ingredientService";
import type { Ingredient } from "../types/catalog";
import Icon from "./ui/Icon";
import SearchField from "./ui/SearchField";
import Spinner from "./ui/Spinner";

interface IngredientSearchProps {
  label: string;
  addedIds: Set<number>;
  onAdd: (ingredient: Ingredient) => Promise<void>;
}

export default function IngredientSearch({ label, addedIds, onAdd }: IngredientSearchProps) {
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const name = useDebounce(query.trim(), 350);

  const fetchIngredients = useCallback(
    (signal: AbortSignal) => (name ? getIngredients({ name, size: 8 }, signal).then(page => page.content) : Promise.resolve([])),
    [name],
  );
  const { data, loading, error, retry } = useFetch(fetchIngredients);

  const handleAdd = async (ingredient: Ingredient) => {
    setBusyId(ingredient.id);
    try {
      await onAdd(ingredient);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <SearchField label={label} placeholder="Buscar ingrediente" value={query} onChange={e => setQuery(e.target.value)} />
      {name && (
        <div className="glass glass-dense flex flex-col rounded-[30px] p-2" aria-live="polite">
          {loading && <p className="flex items-center gap-2 px-3.5 py-3 text-subhead text-ink-2"><Spinner /> Buscando…</p>}
          {!loading && error && (
            <p className="flex items-center justify-between gap-2 px-3.5 py-2 text-subhead text-ink-2">
              No pudimos buscar ingredientes.
              <button type="button" onClick={retry} className="glass glass-thin press h-11 rounded-full px-4 font-medium text-ink">Reintentar</button>
            </p>
          )}
          {!loading && !error && data?.length === 0 && <p className="px-3.5 py-3 text-subhead text-ink-2">Ningún ingrediente coincide con «{name}».</p>}
          {!loading && !error && data?.map(ingredient => (
            <div key={ingredient.id} className="flex min-h-[52px] items-center justify-between gap-3 rounded-[22px] py-1 pl-3.5 pr-1.5 text-[16px]">
              <span>{ingredient.name}</span>
              {addedIds.has(ingredient.id) ? (
                <span className="flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-ok">
                  <Icon name="check" size={16} strokeWidth={2.4} /> Agregado
                </span>
              ) : (
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => handleAdd(ingredient)}
                  aria-label={`Agregar ${ingredient.name}`}
                  className="glass glass-thin press flex h-11 items-center gap-1.5 rounded-full pl-3 pr-4 text-sm font-medium text-ink disabled:opacity-60"
                >
                  {busyId === ingredient.id ? <Spinner size={16} /> : <Icon name="plus" size={16} strokeWidth={2.2} />}
                  Agregar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
