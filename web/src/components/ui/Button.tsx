import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { buttonClass } from "../../utils/buttonClass";
import { cx } from "../../utils/cx";
import Spinner from "./Spinner";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  kind?: "primary" | "secondary" | "destructive";
  size?: "md" | "lg";
  loading?: boolean;
  loadingLabel?: string;
  icon?: ReactNode;
};

export default function Button({ kind = "secondary", size = "lg", loading, loadingLabel, icon, disabled, children, className, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading;
  const look = isDisabled && kind === "primary" && !loading
    ? cx(buttonClass("secondary", size), "text-ink-2")
    : buttonClass(kind, size);

  return (
    <button type="button" disabled={isDisabled} aria-busy={loading || undefined} className={cx(look, className)} {...rest}>
      {loading ? <Spinner /> : icon}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
