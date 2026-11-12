import { useId } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import FieldMessage from "./FieldMessage";
import Icon from "./Icon";

type SelectFieldProps = ComponentPropsWithoutRef<"select"> & {
  label: string;
  hideLabel?: boolean;
  options: { value: string; label: string }[];
  error?: string;
  help?: string;
};

export default function SelectField({ label, hideLabel, options, error, help, className, disabled, ...rest }: SelectFieldProps) {
  const hintId = useId();
  const hasHint = !!(error || help);

  return (
    <label className={cx("flex flex-col gap-1.5", className)}>
      <span className={hideLabel ? "sr-only" : "text-[15px] font-medium"}>{label}</span>
      <span className={cx("relative flex h-[46px] items-center rounded-full glass glass-thin", disabled && "text-ink-2 opacity-70", error && "glass-error")}>
        <select
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={hasHint ? hintId : undefined}
          className="h-full w-full cursor-pointer appearance-none rounded-full border-0 bg-transparent pl-4 pr-10 text-[15px] font-medium text-ink disabled:cursor-not-allowed"
          {...rest}
        >
          {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span className="pointer-events-none absolute right-4"><Icon name="down" size={16} /></span>
      </span>
      {hasHint && (
        <span id={hintId} className="flex min-h-[18px] flex-col gap-1 text-footnote font-medium">
          {error ? <FieldMessage ok={false} text={error} /> : <span className="font-normal text-ink-2">{help}</span>}
        </span>
      )}
    </label>
  );
}
