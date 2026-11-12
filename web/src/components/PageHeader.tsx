import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="glass glass-lq flex flex-wrap items-center justify-between gap-4 rounded-panel px-6 py-5 md:px-8 md:py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-large-title-m font-normal text-title md:text-large-title">{title}</h1>
        {subtitle && <p className="text-subhead text-ink-2">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
