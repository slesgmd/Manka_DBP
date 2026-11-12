import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import Icon from "./Icon";

type SelectFieldProps = ComponentPropsWithoutRef<"select"> & {
  label: string;
  hideLabel?: boolean;
  options: { value: string; label: string }[];
};

export default function SelectField({ label, hideLabel, options, className, disabled, ...rest }: SelectFieldProps) {
  return (
    <label className={cx("flex flex-col gap-1.5", className)}>
      <span className={hideLabel ? "sr-only" : "text-[15px] font-medium"}>{label}</span>
      <span className={cx("relative flex h-[46px] items-center rounded-full", disabled ? "glass glass-thin text-ink-2 opacity-70" : "glass glass-thin")}>
        <select
          disabled={disabled}
          className="h-full w-full cursor-pointer appearance-none rounded-full border-0 bg-transparent pl-4 pr-10 text-[15px] font-medium text-ink disabled:cursor-not-allowed"
          {...rest}
        >
          {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span className="pointer-events-none absolute right-4"><Icon name="down" size={16} /></span>
      </span>
    </label>
  );
}
