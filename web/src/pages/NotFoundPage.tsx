import { Link } from "react-router-dom";
import { ROUTES } from "../routes";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="text-6xl font-bold">404</p>
      <h1 className="text-2xl">No encontramos esta página</h1>
      <div className="flex gap-4">
        <Link to={ROUTES.home} className="underline">Volver al inicio</Link>
        <Link to={ROUTES.catalog} className="underline">Ver catálogo</Link>
      </div>
    </main>
  );
}
