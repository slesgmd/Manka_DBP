import Icon from "./Icon";

export default function FieldMessage({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon name={ok ? "check" : "cross"} size={14} strokeWidth={2.4} color={ok ? "var(--mk-ok)" : "var(--mk-danger)"} />
      {text}
    </span>
  );
}
