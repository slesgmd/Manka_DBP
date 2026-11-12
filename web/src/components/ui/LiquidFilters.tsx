import { useLiquidGlass } from "../../hooks/useLiquidGlass";

export default function LiquidFilters() {
  const { reducedMotion } = useLiquidGlass();
  const wave = reducedMotion ? "0.004 0.007;0.004 0.007" : "0.004 0.007;0.006 0.005;0.004 0.007";

  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <filter id="mk-liquid" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.007" numOctaves={2} seed={11} result="noise">
          <animate attributeName="baseFrequency" dur="26s" values={wave} repeatCount="indefinite" />
        </feTurbulence>
        <feGaussianBlur in="noise" stdDeviation={2.5} result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale={60} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="mk-liquid-s" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.016 0.022" numOctaves={1} seed={4} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={14} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="mk-outline" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feComponentTransfer in="SourceAlpha" result="solid">
          <feFuncA type="linear" slope={12} />
        </feComponentTransfer>
        <feMorphology in="solid" operator="dilate" radius={1.2} result="thick" />
        <feComposite in="thick" in2="solid" operator="out" result="ring" />
        <feFlood style={{ floodColor: "var(--mk-gt-stroke)" }} />
        <feComposite in2="ring" operator="in" result="stroke" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="stroke" />
        </feMerge>
      </filter>
      <filter id="mk-lens" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves={1} seed={2} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={34} xChannelSelector="R" yChannelSelector="B" />
      </filter>
    </svg>
  );
}
