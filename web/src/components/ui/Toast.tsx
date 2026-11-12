import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import Icon from "./Icon";

interface ToastProps {
  tone: "success" | "error";
  children: ReactNode;
  action?: ReactNode;
}

export default function Toast({ tone, children, action }: ToastProps) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className="glass glass-dense flex min-h-14 items-center gap-3 rounded-full py-2 pl-3.5 pr-2.5 text-[15px] font-medium">
      <span className={cx("glass flex size-8 items-center justify-center rounded-full", tone === "success" ? "glass-thin glass-ok" : "glass-danger")}>
        {tone === "success"
          ? <Icon name="check" size={16} strokeWidth={2.8} color="var(--mk-ok)" />
          : <Icon name="alert" size={16} strokeWidth={2.4} />}
      </span>
      {children}
      {action}
    </div>
  );
}
