import { useEffect, useRef } from "react";
import Button from "./Button";
import Icon from "./Icon";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, body, confirmLabel, loading, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={e => { e.preventDefault(); if (!loading) onCancel(); }}
      aria-labelledby="confirm-title"
      className="glass glass-dense fixed! inset-0 m-auto h-fit w-[min(420px,calc(100vw-32px))] rounded-panel p-6 text-ink backdrop:bg-[var(--mk-scrim)]"
    >
      <div className="flex flex-col gap-4">
        <h2 id="confirm-title" className="text-title3 font-normal text-title">{title}</h2>
        {body && <p className="text-subhead text-ink-2">{body}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <Button size="md" onClick={onCancel} disabled={loading}>Cancelar</Button>
          <Button size="md" kind="destructive" icon={<Icon name="trash" size={18} />} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
