import { Link } from "react-router-dom";
import { ROUTES } from "../routes";
import { buttonClass } from "../utils/buttonClass";

export default function NotFoundPage() {
  return (
    <main className="auth-bg flex min-h-screen flex-col items-center justify-center gap-2 px-4 py-10">
      <p aria-hidden="true" className="glass-text text-[140px] tracking-[-0.06em] md:text-[260px]">404</p>
      <section aria-labelledby="not-found-title" className="glass flex w-full max-w-[560px] flex-col items-center gap-3 rounded-panel px-6 py-8 text-center md:px-9 md:py-[34px]">
        <h1 id="not-found-title" className="text-[26px] font-normal leading-8 tracking-[-0.03em] text-title md:text-[30px] md:leading-9">
          No encontramos esta página
        </h1>
        <p className="max-w-[420px] text-[16px] leading-[23px] text-ink-2">
          Puede que el enlace esté incompleto o que el plato se haya retirado del catálogo.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2.5">
          <Link to={ROUTES.home} className={buttonClass("primary")}>Volver al inicio</Link>
          <Link to={ROUTES.catalog} className={buttonClass("secondary")}>Ver catálogo</Link>
        </div>
      </section>
    </main>
  );
}
