import { StyleSheet } from "react-native";

export const colors = {
  title: "#2A2D36",
  ink: "#16181D",
  ink2: "#3A3D46",
  base: "#C9CEDC",
  thick: "rgba(255,255,255,0.74)",
  dense: "rgba(255,255,255,0.86)",
  thin: "rgba(255,255,255,0.56)",
  knob: "rgba(255,255,255,0.98)",
  rim: "rgba(255,255,255,0.78)",
  hi: "#FFFFFF",
  sep: "rgba(30,34,48,0.12)",
  track: "rgba(30,34,48,0.10)",
  graphite: "rgba(26,28,36,0.90)",
  graphiteInk: "#FFFFFF",
  ok: "#2F6B4F",
  okTint: "rgba(47,107,79,0.12)",
  danger: "#A3242F",
  dangerTint: "rgba(163,36,47,0.10)",
};

export const radius = { panel: 34, card: 26, inner: 24, thumb: 16, pill: 999 };

export const TARGET = 44;

export const text = StyleSheet.create({
  largeTitle: { fontSize: 28, lineHeight: 34, fontWeight: "500", letterSpacing: -0.6, color: colors.title },
  dish: { fontSize: 28, lineHeight: 34, fontWeight: "400", letterSpacing: -0.6, color: colors.title },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "500", letterSpacing: -0.3, color: colors.title },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: "500", letterSpacing: -0.2, color: colors.title },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600", color: colors.ink },
  body: { fontSize: 17, lineHeight: 22, color: colors.ink },
  subhead: { fontSize: 15, lineHeight: 20, color: colors.ink2 },
  footnote: { fontSize: 13, lineHeight: 18, color: colors.ink2 },
  caption: { fontSize: 11, lineHeight: 13, color: colors.ink2 },
});
