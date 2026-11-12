import { cx } from "../../utils/cx";

interface ProgressBarProps {
  value: number;
  label: string;
  thick?: boolean;
}

export default function ProgressBar({ value, label, thick }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx("rounded-full", thick ? "glass glass-thin h-3 p-0.5" : "h-1.5 bg-track")}
    >
      <div className={cx("rounded-full bg-bar transition-[width] duration-350 ease-mk", thick ? "h-2" : "h-1.5")} style={{ width: `${width}%` }} />
    </div>
  );
}
