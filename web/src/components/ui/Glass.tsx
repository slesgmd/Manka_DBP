import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "../../utils/cx";

export type GlassVariant = "thick" | "dense" | "thin" | "arrow" | "graphite" | "danger" | "knob";

const variantClass: Record<GlassVariant, string> = {
  thick: "glass",
  dense: "glass glass-dense",
  thin: "glass glass-thin",
  arrow: "glass glass-thin glass-arrow",
  graphite: "glass glass-graphite",
  danger: "glass glass-danger",
  knob: "glass glass-knob",
};

type GlassProps<T extends ElementType> = {
  as?: T;
  variant?: GlassVariant;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export default function Glass<T extends ElementType = "div">({ as, variant = "thick", className, ...rest }: GlassProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag className={cx(variantClass[variant], className)} {...rest} />;
}
