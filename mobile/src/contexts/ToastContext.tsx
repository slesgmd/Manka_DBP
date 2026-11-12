import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "../components/Toast";
import { ToastContext } from "./ToastContextObject";
import type { ToastOptions } from "./ToastContextObject";

interface ToastData extends ToastOptions {
  message: string;
}

const DURATION_MS = 3500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastData | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [opacity]);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, ...options });
    Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    timer.current = setTimeout(hide, DURATION_MS);
  }, [opacity, hide]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleAction = () => {
    toast?.onAction?.();
    hide();
  };

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Animated.View pointerEvents="box-none" style={[styles.container, { bottom: insets.bottom + 72, opacity }]}>
          <Toast
            message={toast.message}
            tone={toast.tone ?? "success"}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction ? handleAction : undefined}
          />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", left: 16, right: 16 },
});
