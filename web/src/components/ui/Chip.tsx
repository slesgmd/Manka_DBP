import Icon from "./Icon";

interface ChipProps {
  label: string;
  tone?: "pantry" | "have" | "missing";
  onRemove?: () => void;
  onAdd?: () => void;
}

export default function Chip({ label, tone = "pantry", onRemove, onAdd }: ChipProps) {
  if (tone === "missing") {
    return (
      <button type="button" onClick={onAdd} aria-label={`Agregar ${label} a la despensa`} className="glass glass-thin press inline-flex h-11 items-center gap-1.5 rounded-full pl-3 pr-4 text-[15px] font-medium text-ink">
        <Icon name="plus" size={14} strokeWidth={2.4} />
        {label}
      </button>
    );
  }

  if (tone === "have") {
    return (
      <span className="glass glass-thin glass-ok inline-flex h-9 items-center gap-1.5 rounded-full pl-2.5 pr-3.5 text-sm font-medium">
        <Icon name="check" size={15} strokeWidth={2.6} color="var(--mk-ok)" />
        {label}
      </span>
    );
  }

  return (
    <span className="glass glass-thin inline-flex h-11 items-center rounded-full pl-4 pr-0.5 text-[15px] font-medium">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Quitar ${label}`} className="press inline-flex size-10 items-center justify-center rounded-full">
        <Icon name="cross" size={13} strokeWidth={2.4} />
      </button>
    </span>
  );
}
