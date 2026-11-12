import Spinner from "./ui/Spinner";

export default function Loading() {
  return (
    <p role="status" className="flex items-center justify-center gap-2 p-6 text-[15px] font-medium text-ink">
      <span className="glass glass-thin flex items-center gap-2 rounded-full px-4 py-2.5">
        <Spinner />
        Cargando…
      </span>
    </p>
  );
}
