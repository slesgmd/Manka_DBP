import Icon from "./Icon";

export default function FormAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="glass glass-thin flex items-center gap-2.5 rounded-[22px] px-4 py-3 text-[14px] font-medium leading-[19px]">
      <Icon name="alert" size={18} strokeWidth={2.2} color="var(--mk-danger)" />
      {message}
    </div>
  );
}
