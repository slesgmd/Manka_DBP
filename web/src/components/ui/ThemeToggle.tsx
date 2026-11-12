import { useTheme } from "../../hooks/useTheme";
import { cx } from "../../utils/cx";
import Icon from "./Icon";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      aria-pressed={dark}
      className={cx("glass glass-thin press inline-flex size-11 items-center justify-center rounded-full text-ink", className)}
    >
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}
