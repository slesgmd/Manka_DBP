import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";
import Breadcrumbs from "./Breadcrumbs";
import Loading from "./Loading";

const links = [
  { to: ROUTES.home, label: "Recomendaciones" },
  { to: ROUTES.catalog, label: "Catálogo de platos" },
  { to: ROUTES.pantry, label: "Despensa" },
  { to: ROUTES.favorites, label: "Favoritos" },
  { to: ROUTES.history, label: "Historial" },
  { to: ROUTES.profile, label: "Perfil" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-3 py-2 ${isActive ? "bg-slate-300 font-semibold" : "hover:bg-slate-200"}`;

export default function Layout() {
  const { user, logout, hasRole } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 bg-slate-100 p-4 flex flex-col gap-4">
        <p className="text-xl font-bold">Manka</p>
        <nav>
          <ul className="flex flex-col gap-1">
            {links.map(link => (
              <li key={link.to}>
                <NavLink to={link.to} end className={linkClass}>{link.label}</NavLink>
              </li>
            ))}
            {hasRole("ADMIN") && (
              <li>
                <NavLink to={ROUTES.admin} className={linkClass}>Administración</NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="mt-auto text-sm">
          <p>{user?.name}</p>
          <button type="button" onClick={logout} className="mt-2 underline">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Breadcrumbs />
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
