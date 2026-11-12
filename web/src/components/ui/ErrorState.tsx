import Button from "./Button";

interface ErrorStateProps {
  title: string;
  body: string;
  onRetry: () => void;
}

export default function ErrorState({ title, body, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="glass flex flex-col items-center gap-3 rounded-panel px-6 py-12 text-center">
      <h3 className="text-title3 font-normal text-title">{title}</h3>
      <p className="max-w-sm text-sm text-ink-2">{body}</p>
      <Button onClick={onRetry} size="md">Reintentar</Button>
    </div>
  );
}
