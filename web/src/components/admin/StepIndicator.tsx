import { cx } from "../../utils/cx";

interface StepIndicatorProps {
  step: number;
  steps: string[];
}

export default function StepIndicator({ step, steps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-footnote font-medium text-ink-2" aria-live="polite">
        Paso {step} de {steps.length} · {steps[step - 1]}
      </p>
      <ol className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((label, i) => (
          <li key={label} aria-current={i + 1 === step ? "step" : undefined} className={cx("h-1.5 rounded-full", i + 1 <= step ? "bg-bar" : "bg-track")}>
            <span className="sr-only">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
