export default function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
  const stroke = size >= 90 ? 6 : 5;
  const r = size / 2 - stroke - 6;
  const c = 2 * Math.PI * r;
  const center = size / 2;

  return (
    <div role="img" aria-label={`Puntaje ${score} de 100`} className="glass glass-graphite relative shrink-0 rounded-full" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="absolute inset-0">
        <circle cx={center} cy={center} r={r} fill="none" stroke="var(--mk-ring-track)" strokeWidth={stroke} />
        <circle cx={center} cy={center} r={r} fill="none" stroke="var(--mk-ring)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} transform={`rotate(-90 ${center} ${center})`} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-normal tabular-nums tracking-[-0.03em]" style={{ fontSize: size * 0.31, lineHeight: 1 }}>{score}</span>
        <span className="text-[11px] font-medium opacity-90">de 100</span>
      </span>
    </div>
  );
}
