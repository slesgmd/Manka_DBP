import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import SkeletonBlock from "../components/ui/SkeletonBlock";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { ROUTES } from "../routes";
import { getCurrentUser } from "../services/userService";
import { formatDate } from "../utils/format";
import { initials, mainRoleLabel } from "../utils/user";

const rowClass = "flex h-14 items-center gap-3 rounded-[26px] px-4 text-[17px] transition-colors duration-200 ease-mk hover:bg-[var(--mk-g-thin)]";

export default function ProfilePage() {
  const { hasRole, logout } = useAuth();
  const { data: user, loading, error, retry } = useFetch(getCurrentUser);

  const links: { to: string; label: string; icon: IconName }[] = [{ to: ROUTES.history, label: "Historial", icon: "history" }];
  if (hasRole("ADMIN")) links.push({ to: ROUTES.admin, label: "Administración", icon: "admin" });

  const renderContent = () => {
    if (error) {
      return <ErrorState title="No pudimos cargar tu perfil" body="Revisa tu conexión. Si tu sesión expiró, te pediremos que vuelvas a entrar." onRetry={retry} />;
    }
    if (loading || !user) {
      return (
        <div role="status" aria-label="Cargando perfil" className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <SkeletonBlock className="h-72 rounded-[40px]" />
          <SkeletonBlock className="h-72 rounded-[40px]" />
        </div>
      );
    }
    const fields = [
      { label: "Nombre", value: user.name },
      { label: "Correo", value: user.email },
      { label: "Rol", value: mainRoleLabel(user) },
      { label: "Miembro desde", value: formatDate(user.createdAt) },
    ];
    return (
      <div className="grid items-start gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="glass flex flex-col items-center gap-3.5 rounded-[40px] px-7 py-8 text-center">
          <span aria-hidden="true" className="glass glass-graphite flex size-28 items-center justify-center rounded-full text-[38px] font-normal tracking-[-0.02em]">
            {initials(user.name)}
          </span>
          <h2 className="mt-1.5 text-[26px] font-normal leading-8 tracking-[-0.025em] text-title">{user.name}</h2>
          <span className="glass glass-thin inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium">
            <Icon name="admin" size={16} /> {mainRoleLabel(user)}
          </span>
          <span className="text-sm text-ink-2">En Manka desde el {formatDate(user.createdAt)}</span>
        </section>

        <div className="flex flex-col gap-5">
          <section className="glass glass-dense rounded-[40px] p-2.5">
            <div className="flex items-center justify-between px-[18px] pb-2.5 pt-4">
              <h2 className="text-title2 font-normal text-title">Datos de la cuenta</h2>
              <span className="text-footnote text-ink-2">Solo lectura</span>
            </div>
            <dl>
              {fields.map(field => (
                <div key={field.label} className="grid min-h-[60px] items-center gap-1 border-t border-sep px-[18px] py-2 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4">
                  <dt className="text-subhead text-ink-2">{field.label}</dt>
                  <dd className="break-words text-headline font-medium">{field.value}</dd>
                </div>
              ))}
              <div className="grid min-h-[60px] items-center gap-1 border-t border-sep px-[18px] py-2 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4">
                <dt className="text-subhead text-ink-2">Estado</dt>
                <dd className="flex items-center gap-2 text-headline font-medium">
                  <span className={user.enabled ? "glass glass-thin glass-ok flex size-7 items-center justify-center rounded-full" : "glass glass-thin flex size-7 items-center justify-center rounded-full"}>
                    <Icon name={user.enabled ? "check" : "cross"} size={14} strokeWidth={2.6} color={user.enabled ? "var(--mk-ok)" : "currentColor"} />
                  </span>
                  {user.enabled ? "Cuenta activa" : "Cuenta desactivada"}
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sep px-[18px] pb-2.5 pt-4">
              <p className="max-w-[520px] text-sm text-ink-2">
                Por ahora no puedes cambiar tu nombre, correo ni contraseña desde la app. Si necesitas hacerlo, escríbele a un administrador.
              </p>
              <Button size="md" icon={<Icon name="logout" size={18} />} onClick={logout}>Cerrar sesión</Button>
            </div>
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
        </div>
      </div>
    );
  };

  return (
    <>
      <PageHeader title="Perfil" subtitle="Tus datos de cuenta." />
      {renderContent()}
    </>
  );
}
