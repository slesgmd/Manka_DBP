import type { ReactNode } from "react";
import { cx } from "../../utils/cx";

interface ToastProps {
  tone: "success" | "error";
  children: ReactNode;
  action?: ReactNode;
}

export default function Toast({ tone, children, action }: ToastProps) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className="glass glass-dense flex min-h-14 items-center gap-3 rounded-full py-2 pl-3.5 pr-2.5 text-[15px] font-medium">
      <span className={cx("glass flex size-8 items-center justify-center rounded-full", tone === "success" ? "glass-thin glass-ok" : "glass-danger")}>
        {tone === "success" ? (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--mk-ok)" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
        ) : (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true"><path d="M12 6v8M12 18v.5" /></svg>
        )}
      </span>
      {children}
      {action}
    </div>
  );
}
