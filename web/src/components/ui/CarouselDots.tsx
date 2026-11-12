interface CarouselDotsProps {
  count: number;
  index: number;
  onSelect: (i: number) => void;
}

export default function CarouselDots({ count, index, onSelect }: CarouselDotsProps) {
  return (
    <div role="group" aria-label="Elegir recomendación" className="glass glass-thin glass-arrow flex h-11 items-center rounded-full px-0.5">
      {Array.from({ length: count }, (_, i) => (
        <button key={i} type="button" aria-label={`Ver recomendación ${i + 1} de ${count}`} aria-current={i === index} onClick={() => onSelect(i)} className="flex size-11 items-center justify-center">
          <span className="block h-2 rounded-full bg-ink transition-all duration-200 ease-mk" style={{ width: i === index ? 22 : 8, opacity: i === index ? 1 : 0.38 }} />
        </button>
      ))}
    </div>
  );
}
