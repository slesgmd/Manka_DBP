import { Link, useLocation } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../routes";

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return null;

  const crumbs = [{ label: "Inicio", to: ROUTES.home }];
  if (parts[0] === "platos") {
    crumbs.push({ label: ROUTE_LABELS.platos, to: ROUTES.catalog });
    if (parts[1]) crumbs.push({ label: `Plato ${parts[1]}`, to: pathname });
  } else {
    crumbs.push({ label: ROUTE_LABELS[parts[0]] ?? parts[0], to: pathname });
  }

  return (
    <nav aria-label="Migas de pan" className="mb-4 text-sm text-slate-600">
      <ol className="flex gap-2">
        {crumbs.map((crumb, i) => (
          <li key={crumb.to} className="flex gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {i === crumbs.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} className="hover:underline">{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
