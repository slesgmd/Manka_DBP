import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { RoleName } from "../types/auth";
import { ROUTES } from "../routes";
import Loading from "./Loading";

export default function PrivateRoute({ role }: { role?: RoleName }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  if (role && !hasRole(role)) return <Navigate to={ROUTES.home} replace />;

  return <Outlet />;
}
