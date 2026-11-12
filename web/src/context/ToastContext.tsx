import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Toast from "../components/ui/Toast";
import { ToastContext } from "./ToastContextObject";
import type { ToastAction } from "./ToastContextObject";

interface ToastData {
  id: number;
  tone: "success" | "error";
  text: ReactNode;
  action?: ToastAction;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((tone: "success" | "error", text: ReactNode, action?: ToastAction) => {
    setToast({ id: Date.now(), tone, text, action });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-24 z-50 flex justify-center md:bottom-8">
        {toast && (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              tone={toast.tone}
              action={toast.action && (
                <button
                  type="button"
                  onClick={() => { toast.action?.onClick(); setToast(null); }}
                  className="glass glass-thin press h-10 rounded-full px-4 text-[15px] font-medium text-ink"
                >
                  {toast.action.label}
                </button>
              )}
            >
              {toast.text}
            </Toast>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
