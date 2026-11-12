import { createContext } from "react";

export interface ToastOptions {
  tone?: "success" | "error";
  actionLabel?: string;
  onAction?: () => void;
}

export interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
