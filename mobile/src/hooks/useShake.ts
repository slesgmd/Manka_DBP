import { useFocusEffect } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD = 1.8;
const COOLDOWN_MS = 1500;

export function useShake(onShake: () => void) {
  const [available, setAvailable] = useState(false);
  const callback = useRef(onShake);

  useEffect(() => {
    callback.current = onShake;
  }, [onShake]);

  useFocusEffect(
    useCallback(() => {
      let subscription: { remove: () => void } | null = null;
      let active = true;
      let lastShake = 0;

      Accelerometer.isAvailableAsync()
        .then(isAvailable => {
          setAvailable(isAvailable);
          if (!isAvailable || !active) return;
          Accelerometer.setUpdateInterval(100);
          subscription = Accelerometer.addListener(({ x, y, z }) => {
            const force = Math.sqrt(x * x + y * y + z * z);
            const now = Date.now();
            if (force > THRESHOLD && now - lastShake > COOLDOWN_MS) {
              lastShake = now;
              callback.current();
            }
          });
        })
        .catch(() => setAvailable(false));

      return () => {
        active = false;
        subscription?.remove();
      };
    }, []),
  );

  return available;
}
