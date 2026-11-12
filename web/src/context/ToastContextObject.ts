import { createContext } from "react";
import type { ReactNode } from "react";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastContextType {
  showToast: (tone: "success" | "error", text: ReactNode, action?: ToastAction) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
