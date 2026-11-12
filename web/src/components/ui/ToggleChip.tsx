import { cx } from "../../utils/cx";

interface ToggleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function ToggleChip({ label, selected, onClick }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx("press h-11 rounded-full px-[18px] text-[15px] text-ink", selected ? "glass glass-knob font-medium" : "glass glass-thin font-normal")}
    >
      {label}
    </button>
  );
}
