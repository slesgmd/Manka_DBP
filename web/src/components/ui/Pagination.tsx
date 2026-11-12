import { PAGE_SIZES } from "../../hooks/usePagination";
import { cx } from "../../utils/cx";
import Icon from "./Icon";
import SelectField from "./SelectField";

interface PaginationProps {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  shown: number;
  sizeLabel: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

const SIZE_OPTIONS = PAGE_SIZES.map(value => ({ value: String(value), label: `${value} por página` }));

const arrowButton = "glass glass-thin press flex h-11 items-center gap-1 rounded-full text-[15px] font-medium text-ink disabled:cursor-not-allowed disabled:opacity-50";

function pageNumbers(current: number, total: number) {
  const result: (number | null)[] = [];
  for (let i = 0; i < total; i++) {
    if (i === 0 || i === total - 1 || Math.abs(i - current) <= 1) result.push(i);
    else if (result[result.length - 1] !== null) result.push(null);
  }
  return result;
}

export default function Pagination({ page, size, totalElements, totalPages, shown, sizeLabel, onPageChange, onSizeChange }: PaginationProps) {
  const from = totalElements === 0 ? 0 : page * size + 1;
  const to = page * size + shown;

  return (
    <nav aria-label="Paginación" className="glass flex flex-col items-center gap-3 rounded-[32px] px-3 py-2.5 md:flex-row md:justify-between md:rounded-full md:pl-[26px]">
      <span className="text-[15px] tabular-nums text-ink-2" aria-live="polite">Mostrando {from}–{to} de {totalElements}</span>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button type="button" disabled={page === 0} onClick={() => onPageChange(page - 1)} className={cx(arrowButton, "pl-3 pr-4")}>
          <Icon name="back" size={18} />Anterior
        </button>
        {pageNumbers(page, totalPages).map((n, i) => n === null
          ? <span key={`gap-${i}`} className="w-6 text-center text-ink-2" aria-hidden="true">…</span>
          : (
            <button
              key={n}
              type="button"
              aria-label={`Página ${n + 1}`}
              aria-current={n === page ? "page" : undefined}
              onClick={() => onPageChange(n)}
              className={cx("press size-11 rounded-full text-[15px] font-medium tabular-nums text-ink", n === page ? "glass glass-knob" : "hover:bg-[var(--mk-g-thin)]")}
            >
              {n + 1}
            </button>
          ))}
        <button type="button" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)} className={cx(arrowButton, "pl-4 pr-3")}>
          Siguiente<Icon name="chevron" size={18} />
        </button>
      </div>
      <SelectField label={sizeLabel} hideLabel options={SIZE_OPTIONS} value={String(size)} onChange={e => onSizeChange(Number(e.target.value))} className="w-44" />
    </nav>
  );
}
