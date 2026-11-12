import { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useRefreshOnFocus(refresh: () => void) {
  const firstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      refresh();
    }, [refresh]),
  );
}
