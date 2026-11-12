import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import IngredientSearch from "../components/IngredientSearch";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import SearchField from "../components/ui/SearchField";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import { usePantry } from "../hooks/usePantry";
import { ROUTES } from "../routes";
import type { Ingredient } from "../types/catalog";
import type { PantryItem } from "../types/account";
import { buttonClass } from "../utils/buttonClass";
import { formatDate, plural } from "../utils/format";

export default function PantryPage() {
  const { items, loading, error, retry, ids, add, remove } = usePantry();
  const [filter, setFilter] = useState("");
  const [toRemove, setToRemove] = useState<PantryItem | null>(null);
  const [removing, setRemoving] = useState(false);

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return (items ?? []).filter(item => item.ingredientName.toLowerCase().includes(q));
  }, [items, filter]);

  const handleAdd = useCallback((ingredient: Ingredient) => add(ingredient.id, ingredient.name), [add]);

  const confirmRemove = async () => {
    if (!toRemove) return;
    setRemoving(true);
    await remove(toRemove.ingredientId, toRemove.ingredientName);
    setRemoving(false);
    setToRemove(null);
  };

  const renderList = () => {
    if (!items && loading) {
      return (
        <div className="flex flex-col gap-3 p-4" role="status" aria-label="Cargando tu despensa">
          {[0, 1, 2, 3, 4].map(i => <SkeletonBlock key={i} className="h-14 rounded-[22px]" />)}
        </div>
      );
    }
    if (error && !items) {
      return <ErrorState title="No pudimos cargar tu despensa" body="Revisa tu conexión e inténtalo otra vez." onRetry={retry} />;
    }
    if (items?.length === 0) {
      return (
        <EmptyState
          title="Tu despensa está vacía"
          body="Agrega lo que tienes en casa y te diremos qué puedes cocinar hoy."
          icon={<Icon name="pantry" size={28} />}
          action={<a href="#agregar" className={buttonClass("primary", "md")}>Agregar ingredientes</a>}
        />
      );
    }
    return (
      <section className="glass glass-dense rounded-[38px] p-2.5">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
          <h2 className="text-title2 font-normal text-title">Mis ingredientes</h2>
          <SearchField label="Filtrar mi despensa" placeholder="Filtrar" value={filter} onChange={e => setFilter(e.target.value)} className="h-[46px] w-full sm:w-[280px]" />
        </div>
        <ul>
          {shown.map(item => (
            <li key={item.id} className="flex min-h-16 items-center gap-3.5 border-t border-sep py-1.5 pl-3.5 pr-2">
              <span aria-hidden="true" className="glass glass-thin flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-medium">
                {item.ingredientName.charAt(0).toUpperCase()}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[16px] font-medium">{item.ingredientName}</span>
                <span className="text-footnote text-ink-2">Agregado el {formatDate(item.addedAt)}</span>
              </span>
              <button type="button" onClick={() => setToRemove(item)} aria-label={`Quitar ${item.ingredientName}`} className="press flex size-11 items-center justify-center rounded-full hover:bg-[var(--mk-g-thin)]">
                <Icon name="trash" size={18} />
              </button>
            </li>
          ))}
        </ul>
        {shown.length === 0 && <p className="border-t border-sep px-4 py-6 text-subhead text-ink-2">Nada coincide con «{filter}» en tu despensa.</p>}
      </section>
    );
  };

  return (
    <>
      <PageHeader
        title="Tu despensa"
        subtitle={items ? `${plural(items.length, "ingrediente", "ingredientes")}. Todo lo que guardes aquí cuenta para tus recomendaciones.` : "Todo lo que guardes aquí cuenta para tus recomendaciones."}
      >
        <Link to={ROUTES.home} className={buttonClass("primary", "lg")}>¿Qué puedo cocinar?</Link>
      </PageHeader>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {renderList()}
        <section id="agregar" className="glass flex flex-col gap-3.5 rounded-[38px] p-[22px]">
          <h2 className="pl-1 text-title2 font-normal text-title">Agregar ingrediente</h2>
          <IngredientSearch label="Buscar ingrediente para agregar" addedIds={ids} onAdd={handleAdd} />
          <p className="px-1 text-footnote text-ink-2">¿No aparece? Solo un administrador puede crear ingredientes nuevos en el catálogo.</p>
        </section>
      </div>

      <ConfirmDialog
        open={toRemove !== null}
        title={`¿Quitar ${toRemove?.ingredientName.toLowerCase() ?? ""}?`}
        body="Dejará de contar para tus recomendaciones."
        confirmLabel="Quitar"
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setToRemove(null)}
      />
    </>
  );
}
