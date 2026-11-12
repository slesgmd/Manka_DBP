export default function Spinner({ size = 18 }: { size?: number }) {
  return (
    <svg className="animate-spin motion-reduce:animate-none" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
