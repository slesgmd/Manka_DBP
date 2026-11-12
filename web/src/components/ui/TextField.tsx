import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../utils/cx";
import FieldMessage from "./FieldMessage";

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  help?: ReactNode;
  hint?: ReactNode;
};

export default function TextField({ label, error, help, hint, className, ...rest }: TextFieldProps) {
  const hintId = useId();
  const hasHint = !!(error || help || hint);

  return (
    <label className={cx("flex flex-col gap-1.5", className)}>
      <span className="text-[15px] font-medium">{label}</span>
      <input
        aria-invalid={!!error || undefined}
        aria-describedby={hasHint ? hintId : undefined}
        className={cx("glass glass-thin h-13 rounded-full border-0 px-5 text-[17px] text-ink placeholder:text-ink-2/70", error && "glass-error")}
        {...rest}
      />
      {hasHint && (
        <span id={hintId} className="flex min-h-[18px] flex-col gap-1 text-footnote font-medium">
          {error ? <FieldMessage ok={false} text={error} /> : help && <span className="font-normal text-ink-2">{help}</span>}
          {hint}
        </span>
      )}
    </label>
  );
}
