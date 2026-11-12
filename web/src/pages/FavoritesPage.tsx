import { useState } from "react";
import { Link } from "react-router-dom";
import DishRow from "../components/DishRow";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { dishPath, ROUTES } from "../routes";
import { addFavorite, getFavorites, removeFavorite } from "../services/favoriteService";
import type { Favorite } from "../types/account";
import { buttonClass } from "../utils/buttonClass";
import { cx } from "../utils/cx";
import { formatDate, plural } from "../utils/format";

export default function FavoritesPage() {
  const { showToast } = useToast();
  const { data, loading, error, retry } = useFetch(getFavorites);
  const [toRemove, setToRemove] = useState<Favorite | null>(null);
  const [removing, setRemoving] = useState(false);

  const undo = async (favorite: Favorite) => {
    try {
      await addFavorite({ dishId: favorite.dishId });
      retry();
    } catch {
      showToast("error", `No pudimos volver a guardar ${favorite.dishName}.`);
    }
  };

  const confirmRemove = async () => {
    if (!toRemove) return;
    const favorite = toRemove;
    setRemoving(true);
    try {
      await removeFavorite(favorite.dishId);
      showToast("success", `Quitaste ${favorite.dishName} de favoritos`, { label: "Deshacer", onClick: () => undo(favorite) });
      retry();
    } catch {
      showToast("error", `No pudimos quitar ${favorite.dishName}. Inténtalo otra vez.`);
    }
    setRemoving(false);
    setToRemove(null);
  };

  const renderContent = () => {
    if (!data && loading) {
      return (
        <div className="glass glass-dense flex flex-col gap-3 rounded-[38px] p-3" role="status" aria-label="Cargando favoritos">
          {[0, 1, 2].map(i => <SkeletonBlock key={i} className="h-24 rounded-[28px]" />)}
        </div>
      );
    }
    if (error && !data) {
      return <ErrorState title="No pudimos cargar tus favoritos" body="Revisa tu conexión e inténtalo otra vez." onRetry={retry} />;
    }
    if (data?.length === 0) {
      return (
        <EmptyState
          title="Aún no guardas platos"
          body="Toca el corazón en cualquier plato y lo tendrás aquí para la próxima vez."
          icon={<Icon name="favorites" size={28} />}
          action={<Link to={ROUTES.home} className={buttonClass("primary", "md")}>Ver recomendaciones</Link>}
        />
      );
    }
    return (
      <section className="glass glass-dense rounded-[38px] p-2.5">
        <ul className="flex flex-col gap-0.5">
          {data?.map(favorite => (
            <DishRow
              key={favorite.id}
              id={favorite.dishId}
              name={favorite.dishName}
              meta={`${favorite.totalTimeMinutes} min`}
              note={`Guardado el ${formatDate(favorite.createdAt)}`}
              actions={
                <span className="flex items-center gap-2.5">
                  <Link to={dishPath(favorite.dishId)} state={{ name: favorite.dishName }} className={cx(buttonClass("secondary", "md"), "hidden sm:inline-flex")}>
                    Ver plato
                  </Link>
                  <button type="button" onClick={() => setToRemove(favorite)} aria-label={`Quitar ${favorite.dishName} de favoritos`} className="glass glass-thin press flex size-12 items-center justify-center rounded-full">
                    <Icon name="favorites" fill="currentColor" />
                  </button>
                </span>
              }
            />
          ))}
        </ul>
      </section>
    );
  };

  return (
    <>
      <PageHeader title="Favoritos" subtitle={data ? `${plural(data.length, "plato guardado", "platos guardados")} para volver a cocinarlos.` : "Platos guardados para volver a cocinarlos."} />
      {renderContent()}
      <ConfirmDialog
        open={toRemove !== null}
        title={`¿Quitar ${toRemove?.dishName ?? ""} de favoritos?`}
        body="Podrás volver a guardarlo desde el plato."
        confirmLabel="Quitar"
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setToRemove(null)}
      />
    </>
  );
}
