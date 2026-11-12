import { useCallback, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import { deleteDish, getDishes } from "../../services/dishService";
import { getProteinCategories } from "../../services/proteinCategoryService";
import type { Dish } from "../../types/catalog";
import { statusOf } from "../../utils/http";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import DishImage from "../ui/DishImage";
import ErrorState from "../ui/ErrorState";
import Icon from "../ui/Icon";
import SearchField from "../ui/SearchField";
import SkeletonBlock from "../ui/SkeletonBlock";
import DishForm from "./DishForm";

type Editing = { dish: Dish | null } | null;

const iconButton = "glass glass-thin press flex size-11 items-center justify-center rounded-full text-ink";

export default function DishesSection() {
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const [toDelete, setToDelete] = useState<Dish | null>(null);
  const [deleting, setDeleting] = useState(false);
  const name = useDebounce(query.trim(), 400);

  const fetchDishes = useCallback((signal: AbortSignal) => getDishes({ name: name || undefined, size: 100, sort: "name,asc" }, signal), [name]);
  const { data, loading, error, retry } = useFetch(fetchDishes);
  const proteins = useFetch(getProteinCategories);

  const closeForm = useCallback(() => {
    setEditing(null);
    retry();
  }, [retry]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteDish(toDelete.id);
      showToast("success", `Borraste ${toDelete.name}`);
      retry();
    } catch (err) {
      const status = statusOf(err);
      showToast("error", status === 409 || status === 500
        ? `No se puede borrar ${toDelete.name}: alguien lo tiene en favoritos o en su historial.`
        : `No pudimos borrar ${toDelete.name}. Inténtalo otra vez.`);
    }
    setDeleting(false);
    setToDelete(null);
  };

  return (
    <>
      {editing && proteins.data && (
        <DishForm key={editing.dish?.id ?? "new"} dish={editing.dish} proteins={proteins.data} onClose={closeForm} />
      )}

      <section aria-busy={loading} className="glass glass-dense flex flex-col gap-2 rounded-[38px] px-2.5 pb-3.5 pt-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-2">
          <h2 className="text-title2 font-normal text-title">Platos{data ? ` · ${data.totalElements}` : ""}</h2>
          <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
            <SearchField label="Buscar plato" placeholder="Buscar plato" value={query} onChange={e => setQuery(e.target.value)} className="h-[46px] flex-1 sm:w-[260px]" />
            <Button size="md" kind="primary" icon={<Icon name="plus" size={18} />} disabled={!proteins.data} onClick={() => setEditing({ dish: null })}>
              Nuevo plato
            </Button>
          </div>
        </div>

        {error && !data && <ErrorState title="No pudimos cargar los platos" body="Revisa tu conexión e inténtalo otra vez." onRetry={retry} />}
        {!data && !error && (
          <div role="status" aria-label="Cargando platos" className="flex flex-col gap-3 p-2">
            {[0, 1, 2, 3].map(i => <SkeletonBlock key={i} className="h-14 rounded-[22px]" />)}
          </div>
        )}
        {data && data.content.length === 0 && (
          <p className="border-t border-sep px-4 py-6 text-subhead text-ink-2">
            {name ? `Ningún plato coincide con «${name}».` : "Aún no hay platos. Crea el primero con «Nuevo plato»."}
          </p>
        )}
        {data && data.content.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[15px]">
              <caption className="sr-only">Platos del catálogo</caption>
              <thead>
                <tr className="text-left text-footnote text-ink-2">
                  <th className="px-4 pb-2.5 pt-3.5 font-medium">Plato</th>
                  <th className="px-4 pb-2.5 pt-3.5 font-medium">Tiempo</th>
                  <th className="px-4 pb-2.5 pt-3.5 font-medium">Proteína</th>
                  <th className="px-4 pb-2.5 pt-3.5 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map(dish => (
                  <tr key={dish.id} className="border-t border-sep">
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-3">
                        <DishImage name={dish.name} className="h-12 w-16 shrink-0 rounded-thumb" />
                        <span className="text-[16px] font-medium">{dish.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-ink-2">{dish.totalTimeMinutes} min</td>
                    <td className="px-4 py-2.5 text-ink-2">{dish.proteinCategoryName}</td>
                    <td className="px-4 py-2.5">
                      <span className="flex justify-end gap-2">
                        <button type="button" aria-label={`Editar ${dish.name}`} disabled={!proteins.data} onClick={() => setEditing({ dish })} className={iconButton}>
                          <Icon name="edit" size={18} />
                        </button>
                        <button type="button" aria-label={`Borrar ${dish.name}`} onClick={() => setToDelete(dish)} className={iconButton}>
                          <Icon name="trash" size={18} color="var(--mk-danger)" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={toDelete !== null}
        title={`¿Borrar ${toDelete?.name ?? ""}?`}
        body="Se quitará del catálogo junto con su lista de ingredientes. No se puede deshacer."
        confirmLabel="Borrar"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
