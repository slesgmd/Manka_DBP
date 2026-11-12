import { cx } from "./cx";

export type ButtonKind = "primary" | "secondary" | "destructive";
export type ButtonSize = "md" | "lg";

export const buttonClass = (kind: ButtonKind = "secondary", size: ButtonSize = "lg") =>
  cx(
    kind === "primary" ? "glass glass-graphite" : kind === "destructive" ? "glass glass-danger" : "glass glass-thin text-ink",
    "press inline-flex items-center justify-center gap-2 rounded-full font-medium disabled:cursor-not-allowed",
    size === "lg" ? "h-14 px-7 text-[17px]" : "h-11 px-5 text-[15px]",
  );
