import { NavLink } from "react-router-dom";
import { ROUTES } from "../routes";
import { cx } from "../utils/cx";
import Icon from "./ui/Icon";
import type { IconName } from "./ui/Icon";

const tabs: { to: string; label: string; icon: IconName }[] = [
  { to: ROUTES.home, label: "Inicio", icon: "home" },
  { to: ROUTES.catalog, label: "Catálogo", icon: "catalog" },
  { to: ROUTES.pantry, label: "Despensa", icon: "pantry" },
  { to: ROUTES.favorites, label: "Favoritos", icon: "favorites" },
  { to: ROUTES.profile, label: "Perfil", icon: "profile" },
];

export default function TabBar({ className }: { className?: string }) {
  return (
    <nav aria-label="Principal" className={cx("glass fixed inset-x-3 bottom-3 z-20 grid grid-cols-5 rounded-full p-1.5", className)}>
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            cx(
              "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-full text-caption",
              isActive ? "glass glass-thin font-semibold" : "font-medium",
            )
          }
        >
          <Icon name={tab.icon} size={22} />
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
