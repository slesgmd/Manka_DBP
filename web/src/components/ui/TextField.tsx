import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../utils/cx";

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  invalid?: boolean;
  hint?: ReactNode;
};

export default function TextField({ label, invalid, hint, className, ...rest }: TextFieldProps) {
  const hintId = useId();

  return (
    <label className={cx("flex flex-col gap-1.5", className)}>
      <span className="text-[15px] font-medium">{label}</span>
      <input
        aria-invalid={invalid || undefined}
        aria-describedby={hint ? hintId : undefined}
        className={cx("glass glass-thin h-13 rounded-full border-0 px-5 text-[17px] text-ink", invalid && "glass-error")}
        {...rest}
      />
      {hint && <span id={hintId} className="flex min-h-[18px] flex-col gap-1 text-footnote font-medium">{hint}</span>}
    </label>
  );
}
