import type { RecommendationBreakdown } from "../types/account";
import ProgressBar from "./ui/ProgressBar";
import { SCORER_LABELS } from "../utils/recommendation";

interface ScoreBreakdownProps {
  score: number;
  breakdown: RecommendationBreakdown[];
}

export default function ScoreBreakdown({ score, breakdown }: ScoreBreakdownProps) {
  return (
    <section className="glass glass-dense overflow-hidden rounded-[28px]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-[22px] pb-2.5 pt-[18px]">
        <h3 className="text-headline font-medium">Por qué {score}</h3>
        <span className="text-footnote text-ink-2">Suma ponderada de {breakdown.length} criterios</span>
      </div>
      <ul>
        {breakdown.map(item => {
          const label = SCORER_LABELS[item.scorer] ?? item.scorer;
          return (
            <li key={item.scorer} className="grid grid-cols-[minmax(0,1fr)_70px] items-center gap-x-[18px] gap-y-2 border-t border-sep px-[22px] py-[13px] md:grid-cols-[180px_minmax(0,1fr)_70px]">
              <span className="flex flex-col gap-0.5">
                <span className="text-subhead font-medium">{label}</span>
                <span className="text-footnote text-ink-2">Peso {Math.round(item.weight * 100)} %</span>
              </span>
              <span className="order-last col-span-2 flex min-w-0 flex-col gap-[7px] md:order-none md:col-span-1">
                <ProgressBar value={item.score} label={`${label}: ${Math.round(item.score)} de 100`} />
                <span className="text-footnote text-ink-2">{item.explanation}</span>
              </span>
              <span className="flex flex-col gap-0.5 text-right tabular-nums">
                <span className="text-[16px] font-medium">+{Math.round(item.score * item.weight)}</span>
                <span className="text-[12px] text-ink-2">{Math.round(item.score)}/100</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
