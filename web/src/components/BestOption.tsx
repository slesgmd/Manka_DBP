import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { dishPath } from "../routes";
import { getDish } from "../services/dishService";
import type { Recommendation } from "../types/account";
import { buttonClass } from "../utils/buttonClass";
import { cx } from "../utils/cx";
import ScoreBreakdown from "./ScoreBreakdown";
import CarouselDots from "./ui/CarouselDots";
import Chip from "./ui/Chip";
import DishImage from "./ui/DishImage";
import Icon from "./ui/Icon";
import ProgressBar from "./ui/ProgressBar";
import ScoreRing from "./ui/ScoreRing";
import SkeletonBlock from "./ui/SkeletonBlock";

interface BestOptionProps {
  options: Recommendation[];
  index: number;
  minutes: number;
  onSelect: (index: number) => void;
  onAddMissing: (name: string) => void;
}

const arrowClass = "glass glass-thin glass-arrow press absolute top-1/2 -mt-7 flex size-14 items-center justify-center rounded-full text-ink";

export default function BestOption({ options, index, minutes, onSelect, onAddMissing }: BestOptionProps) {
  const current = options[index];
  const dishId = current.dishId;

  const fetchDish = useCallback((signal: AbortSignal) => getDish(dishId, signal), [dishId]);
  const { data: dish } = useFetch(fetchDish);

  const have = useMemo(() => {
    if (!dish || dish.id !== dishId) return null;
    const missing = new Set(current.missingIngredients.map(name => name.toLowerCase()));
    return dish.ingredients.filter(ingredient => !missing.has(ingredient.name.toLowerCase()));
  }, [dish, dishId, current]);

  const score = Math.round(current.score);
  const total = have ? have.length + current.missingIngredients.length : null;

  return (
    <section aria-roledescription="carrusel" aria-label="Recomendaciones" className="glass flex flex-col rounded-[42px] p-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-3.5 pb-3.5 pt-2">
        <h2 className="text-title2 font-medium text-title">{index === 0 ? "Mejor opción" : `Opción ${index + 1}`}</h2>
        <span className="text-subhead text-ink-2">{index + 1} de {options.length} · Para {minutes} min</span>
      </div>

      <div className="relative">
        <DishImage name={current.name} className="aspect-[4/3] w-full rounded-inner" />
        {options.length > 1 && (
          <>
            <button type="button" aria-label="Opción anterior" onClick={() => onSelect((index - 1 + options.length) % options.length)} className={cx(arrowClass, "left-4")}>
              <Icon name="back" size={22} />
            </button>
            <button type="button" aria-label="Opción siguiente" onClick={() => onSelect((index + 1) % options.length)} className={cx(arrowClass, "right-4")}>
              <Icon name="chevron" size={22} />
            </button>
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2">
              <CarouselDots count={options.length} index={index} onSelect={onSelect} />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-5 px-3.5 pb-2 pt-[22px]">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-dish font-normal text-title">{current.name}</h3>
            <p className="text-subhead text-ink-2">{current.prepTimeMinutes} min{dish?.id === dishId && ` · ${dish.proteinCategoryName}`}</p>
          </div>
          <ScoreRing score={score} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-subhead font-medium">
            <span>{total !== null && have ? `Tienes ${have.length} de ${total} ingredientes` : "Cobertura de tu despensa"}</span>
            <span className="tabular-nums">{Math.round(current.coveragePercent)} %</span>
          </div>
          <ProgressBar thick value={current.coveragePercent} label="Ingredientes que tienes" />
        </div>

        <div className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5">
          <span className="text-sm text-ink-2">Tienes</span>
          <div className="flex flex-wrap gap-2">
            {have === null && <SkeletonBlock className="h-9 w-40 rounded-full" />}
            {have?.length === 0 && <span className="text-sm text-ink-2">Ninguno todavía</span>}
            {have?.map(ingredient => <Chip key={ingredient.id} tone="have" label={ingredient.name} />)}
          </div>
          {current.missingIngredients.length > 0 && (
            <>
              <span className="text-sm text-ink-2">Te faltan</span>
              <div className="flex flex-wrap gap-2">
                {current.missingIngredients.map(name => <Chip key={name} tone="missing" label={name} onAdd={() => onAddMissing(name)} />)}
              </div>
            </>
          )}
        </div>

        <Link to={dishPath(dishId)} state={{ name: current.name, recommendation: current }} className={cx(buttonClass("secondary", "lg"), "w-full")}>
          Ver plato <Icon name="chevron" size={18} />
        </Link>
      </div>

      <div className="mt-3.5">
        <ScoreBreakdown score={score} breakdown={current.breakdown} />
      </div>
    </section>
  );
}
