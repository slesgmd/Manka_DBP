import { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated } from "react-native";
import type { DimensionValue } from "react-native";
import { colors } from "../utils/theme";

interface SkeletonProps {
  width?: DimensionValue;
  height: number;
  radius?: number;
}

export default function Skeleton({ width = "100%", height, radius = 8 }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (active && !reduced) pulse.start();
    });
    return () => {
      active = false;
      pulse.stop();
    };
  }, [opacity]);

  return <Animated.View style={{ width, height, borderRadius: radius, backgroundColor: colors.track, opacity }} />;
}
