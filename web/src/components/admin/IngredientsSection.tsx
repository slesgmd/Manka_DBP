import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../hooks/useToast";
import { deleteIngredient, getIngredients } from "../../services/ingredientService";
import type { Ingredient } from "../../types/catalog";
import { statusOf } from "../../utils/http";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import ErrorState from "../ui/ErrorState";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import SearchField from "../ui/SearchField";
import SkeletonBlock from "../ui/SkeletonBlock";
import IngredientForm from "./IngredientForm";

type Editing = { ingredient: Ingredient | null } | null;

const iconButton = "glass glass-thin press flex size-11 items-center justify-center rounded-full text-ink";

export default function IngredientsSection() {
  const { showToast } = useToast();
  const { page, size, search: name, query, setQuery, setPage, setSize, fitTo } = usePagination();
  const [editing, setEditing] = useState<Editing>(null);
  const [toDelete, setToDelete] = useState<Ingredient | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchIngredients = useCallback((signal: AbortSignal) => getIngredients({ name: name || undefined, page, size, sort: "name,asc" }, signal), [name, page, size]);
  const { data, loading, error, retry } = useFetch(fetchIngredients);

  useEffect(() => {
    if (data && !loading) fitTo(data.totalPages);
  }, [data, loading, fitTo]);

  const closeForm = useCallback((saved: boolean) => {
    setEditing(null);
    if (saved) retry();
  }, [retry]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteIngredient(toDelete.id);
      showToast("success", `Borraste ${toDelete.name}`);
      retry();
    } catch (err) {
      const status = statusOf(err);
      showToast("error", status === 409 || status === 500
        ? `No se puede borrar ${toDelete.name}: lo usan platos, despensas o variantes.`
        : `No pudimos borrar ${toDelete.name}. Inténtalo otra vez.`);
    }
    setDeleting(false);
    setToDelete(null);
  };

  return (
    <>
      {editing && <IngredientForm key={editing.ingredient?.id ?? "new"} ingredient={editing.ingredient} onClose={closeForm} />}

      <section aria-busy={loading} className="glass glass-dense flex flex-col gap-2 rounded-[38px] px-2.5 pb-3.5 pt-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-2">
          <h2 className="text-title2 font-normal text-title">Ingredientes{data ? ` · ${data.totalElements}` : ""}</h2>
          <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
            <SearchField label="Buscar ingrediente" placeholder="Buscar ingrediente" value={query} onChange={e => setQuery(e.target.value)} className="h-[46px] flex-1 sm:w-[260px]" />
            <Button size="md" kind="primary" icon={<Icon name="plus" size={18} />} onClick={() => setEditing({ ingredient: null })}>
              Nuevo ingrediente
            </Button>
          </div>
        </div>

        {error && !data && <ErrorState title="No pudimos cargar los ingredientes" body="Revisa tu conexión e inténtalo otra vez." onRetry={retry} />}
        {!data && !error && (
          <div role="status" aria-label="Cargando ingredientes" className="flex flex-col gap-3 p-2">
            {[0, 1, 2, 3].map(i => <SkeletonBlock key={i} className="h-12 rounded-[22px]" />)}
          </div>
        )}
        {data && data.content.length === 0 && (
          <p className="border-t border-sep px-4 py-6 text-subhead text-ink-2">
            {name ? `Ningún ingrediente coincide con «${name}».` : "Aún no hay ingredientes. Crea el primero con «Nuevo ingrediente»."}
          </p>
        )}
        {data && data.content.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[15px]">
              <caption className="sr-only">Ingredientes del catálogo</caption>
              <thead>
                <tr className="text-left text-footnote text-ink-2">
                  <th className="px-4 pb-2.5 pt-3.5 font-medium">Ingrediente</th>
                  <th className="px-4 pb-2.5 pt-3.5 font-medium">Variante de</th>
                  <th className="px-4 pb-2.5 pt-3.5 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map(ingredient => (
                  <tr key={ingredient.id} className="border-t border-sep">
                    <td className="px-4 py-2 text-[16px] font-medium">{ingredient.name}</td>
                    <td className="px-4 py-2 text-ink-2">{ingredient.parentIngredientName ?? "—"}</td>
                    <td className="px-4 py-2">
                      <span className="flex justify-end gap-2">
                        <button type="button" aria-label={`Editar ${ingredient.name}`} onClick={() => setEditing({ ingredient })} className={iconButton}>
                          <Icon name="edit" size={18} />
                        </button>
                        <button type="button" aria-label={`Borrar ${ingredient.name}`} onClick={() => setToDelete(ingredient)} className={iconButton}>
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

      {data && data.content.length > 0 && (
        <Pagination
          page={page}
          size={size}
          totalElements={data.totalElements}
          totalPages={data.totalPages}
          shown={data.content.length}
          sizeLabel="Ingredientes por página"
          onPageChange={setPage}
          onSizeChange={setSize}
        />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title={`¿Borrar ${toDelete?.name ?? ""}?`}
        body="Se quitará del catálogo de ingredientes. No se puede deshacer."
        confirmLabel="Borrar"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
