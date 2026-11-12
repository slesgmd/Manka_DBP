import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../routes";
import Loading from "./Loading";

export default function PublicRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;

  if (loading) return <Loading />;
  if (user) {
    const target = from ? from.pathname + from.search + from.hash : ROUTES.home;
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}
