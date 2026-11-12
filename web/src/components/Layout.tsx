import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../routes";
import Breadcrumbs from "./Breadcrumbs";
import ErrorBoundary from "./ErrorBoundary";
import Loading from "./Loading";
import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
import Icon from "./ui/Icon";
import ThemeToggle from "./ui/ThemeToggle";

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen gap-6 md:p-6">
      <a href="#contenido" className="glass glass-dense sr-only z-50 rounded-full text-[15px] font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-5 focus:py-3">
        Saltar al contenido
      </a>
      <Sidebar className="sticky top-6 hidden h-[calc(100vh-48px)] min-h-[560px] md:flex" />

      <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 pb-28 pt-4 md:p-0">
        <header className="glass flex h-16 items-center justify-between rounded-full pl-5 pr-2.5 md:hidden">
          <Link to={ROUTES.home} aria-label="Manka, inicio" className="flex items-center gap-2">
            <Icon name="logo" size={24} strokeWidth={1.7} />
            <span className="text-[21px] font-medium tracking-[-0.03em] text-title">Manka</span>
          </Link>
          <div className="flex gap-2">
            <ThemeToggle />
            <button type="button" onClick={logout} aria-label="Cerrar sesión" className="glass glass-thin press inline-flex size-11 items-center justify-center rounded-full">
              <Icon name="logout" />
            </button>
          </div>
        </header>

        <main id="contenido" tabIndex={-1} className="flex flex-col gap-4 focus:outline-none">
          <Breadcrumbs />
          <ErrorBoundary key={location.pathname}>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <TabBar className="md:hidden" />
    </div>
  );
}
