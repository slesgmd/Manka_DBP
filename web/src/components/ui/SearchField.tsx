import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../../utils/cx";
import Icon from "./Icon";

type SearchFieldProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label: string;
};

export default function SearchField({ label, className, ...rest }: SearchFieldProps) {
  return (
    <label className={cx("glass glass-thin flex h-[50px] items-center gap-2.5 rounded-full px-[18px] text-ink-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--mk-focus)]", className)}>
      <Icon name="search" size={17} />
      <span className="sr-only">{label}</span>
      <input type="search" className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-2" {...rest} />
    </label>
  );
}
