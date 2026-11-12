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
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        {label}
      </button>
    );
  }

  if (tone === "have") {
    return (
      <span className="glass glass-thin glass-ok inline-flex h-9 items-center gap-1.5 rounded-full pl-2.5 pr-3.5 text-sm font-medium">
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="var(--mk-ok)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
        {label}
      </span>
    );
  }

  return (
    <span className="glass glass-thin inline-flex h-11 items-center rounded-full pl-4 pr-0.5 text-[15px] font-medium">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Quitar ${label}`} className="press inline-flex size-10 items-center justify-center rounded-full">
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </span>
  );
}
