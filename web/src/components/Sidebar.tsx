import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../routes";
import { cx } from "../utils/cx";
import { initials, mainRoleLabel } from "../utils/user";
import Icon from "./ui/Icon";
import type { IconName } from "./ui/Icon";
import ThemeToggle from "./ui/ThemeToggle";

const links: { to: string; label: string; icon: IconName }[] = [
  { to: ROUTES.home, label: "Recomendaciones", icon: "home" },
  { to: ROUTES.catalog, label: "Catálogo de platos", icon: "catalog" },
  { to: ROUTES.pantry, label: "Despensa", icon: "pantry" },
  { to: ROUTES.favorites, label: "Favoritos", icon: "favorites" },
  { to: ROUTES.history, label: "Historial", icon: "history" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "flex h-[46px] items-center gap-3 rounded-[26px] px-3.5 text-[15px] transition-colors duration-200 ease-mk",
    isActive ? "glass glass-thin font-medium" : "font-normal hover:bg-[var(--mk-g-thin)]",
  );

export default function Sidebar({ className }: { className?: string }) {
  const { user, logout, hasRole } = useAuth();

  return (
    <nav aria-label="Principal" className={cx("glass w-[264px] shrink-0 flex-col gap-1 rounded-[38px] p-3", className)}>
      <Link to={ROUTES.home} aria-label="Manka, inicio" className="mb-1.5 flex h-[58px] items-center gap-2.5 px-3.5">
        <Icon name="logo" size={26} strokeWidth={1.7} />
        <span className="text-[23px] font-medium tracking-[-0.03em] text-title">Manka</span>
      </Link>

      {links.map(link => (
        <NavLink key={link.to} to={link.to} end className={linkClass}>
          <Icon name={link.icon} />
          {link.label}
        </NavLink>
      ))}

      {hasRole("ADMIN") && (
        <>
          <span className="px-3.5 pb-1.5 pt-[18px] text-footnote font-medium text-ink-2">Gestión</span>
          <NavLink to={ROUTES.admin} className={linkClass}>
            <Icon name="admin" />
            Administración
          </NavLink>
        </>
      )}

      <span className="flex-1" />

      <div className="flex items-center justify-between px-1 pb-2">
        <ThemeToggle />
        <button type="button" onClick={logout} className="press inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-medium hover:bg-[var(--mk-g-thin)]">
          <Icon name="logout" size={18} />
          Cerrar sesión
        </button>
      </div>

      {user && (
        <NavLink to={ROUTES.profile} className="glass glass-thin press flex min-h-[62px] items-center gap-3 rounded-[26px] px-3 py-2">
          <span className="glass glass-graphite flex size-[42px] shrink-0 items-center justify-center rounded-full text-sm font-medium">
            {initials(user.name)}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-medium">{user.name}</span>
            <span className="text-footnote text-ink-2">{mainRoleLabel(user)}</span>
          </span>
        </NavLink>
      )}
    </nav>
  );
}
