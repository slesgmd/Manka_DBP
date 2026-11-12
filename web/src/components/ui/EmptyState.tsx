import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({ title, body, action, icon }: EmptyStateProps) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-panel px-6 py-12 text-center">
      {icon && <span className="glass glass-thin flex size-[68px] items-center justify-center rounded-full">{icon}</span>}
      <h3 className="text-title3 font-normal text-title">{title}</h3>
      <p className="max-w-sm text-sm text-ink-2">{body}</p>
      {action}
    </div>
  );
}
