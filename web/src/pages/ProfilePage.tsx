import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Icon from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../routes";
import { mainRoleLabel } from "../utils/user";

const rowClass = "flex h-14 items-center gap-3 rounded-[26px] px-4 text-[17px] transition-colors duration-200 ease-mk hover:bg-[var(--mk-g-thin)]";

export default function ProfilePage() {
  const { user, hasRole } = useAuth();

  const links: { to: string; label: string; icon: IconName }[] = [{ to: ROUTES.history, label: "Historial", icon: "history" }];
  if (hasRole("ADMIN")) links.push({ to: ROUTES.admin, label: "Administración", icon: "admin" });

  return (
    <>
      <PageHeader title="Perfil" subtitle={user ? mainRoleLabel(user) : undefined} />

      <section className="glass glass-dense flex flex-col gap-1 rounded-panel p-6">
        <p className="text-headline font-medium">{user?.name}</p>
        <p className="text-subhead text-ink-2">{user?.email}</p>
      </section>

      <nav aria-label="Más opciones" className="glass glass-dense flex flex-col rounded-panel p-2">
        {links.map(link => (
          <Link key={link.to} to={link.to} className={rowClass}>
            <Icon name={link.icon} />
            <span className="flex-1">{link.label}</span>
            <Icon name="chevron" size={18} />
          </Link>
        ))}
      </nav>
    </>
  );
}
