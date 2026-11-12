import type { FormEventHandler, ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import { cx } from "../utils/cx";
import ThemeToggle from "./ui/ThemeToggle";

interface AuthShellProps {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

const tabClass = ({ isActive }: { isActive: boolean }) =>
  cx("press flex h-11 items-center justify-center rounded-full text-[15px] text-ink", isActive ? "glass glass-knob font-medium" : "font-normal");

export default function AuthShell({ title, onSubmit, children }: AuthShellProps) {
  const location = useLocation();

  return (
    <div className="auth-bg relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10 lg:flex-row lg:justify-between lg:gap-[60px] lg:px-[120px]">
      <ThemeToggle className="absolute right-4 top-4 lg:right-6 lg:top-6" />
      <div className="flex flex-col items-center gap-5 lg:items-start lg:gap-7">
        <p className="glass-text text-[96px] lg:text-[210px]">Manka</p>
        <p className="glass rounded-[28px] px-6 py-4 text-center text-[17px] leading-6 lg:self-start lg:rounded-full lg:text-left lg:text-[19px] lg:leading-[26px]">
          Dime qué tienes en casa y cuánto tiempo tienes.
          <br />
          Manka se encarga del resto.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate aria-labelledby="auth-title" className="glass glass-lq flex w-full max-w-[440px] shrink-0 flex-col gap-4 rounded-panel p-6 lg:p-[30px]">
        <h1 id="auth-title" className="mb-0.5 text-[26px] font-normal leading-8 tracking-[-0.03em] text-title">{title}</h1>
        <nav aria-label="Modo" className="glass glass-thin grid grid-cols-2 rounded-full p-1">
          <NavLink to={ROUTES.login} state={location.state} replace className={tabClass}>Iniciar sesión</NavLink>
          <NavLink to={ROUTES.register} state={location.state} replace className={tabClass}>Crear cuenta</NavLink>
        </nav>
        {children}
        <p className="text-center text-footnote text-ink-2">Tus datos solo se usan para tu despensa y tus recomendaciones.</p>
      </form>
    </div>
  );
}
