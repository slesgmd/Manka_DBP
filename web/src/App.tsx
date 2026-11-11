import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Loading from "./components/Loading";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { ROUTES } from "./routes";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const RecommendationsPage = lazy(() => import("./pages/RecommendationsPage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const DishDetailPage = lazy(() => import("./pages/DishDetailPage"));
const PantryPage = lazy(() => import("./pages/PantryPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path={ROUTES.login} element={<LoginPage />} />
              <Route path={ROUTES.register} element={<RegisterPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path={ROUTES.home} element={<RecommendationsPage />} />
                <Route path={ROUTES.catalog} element={<CatalogPage />} />
                <Route path={ROUTES.dish} element={<DishDetailPage />} />
                <Route path={ROUTES.pantry} element={<PantryPage />} />
                <Route path={ROUTES.favorites} element={<FavoritesPage />} />
                <Route path={ROUTES.history} element={<HistoryPage />} />
                <Route path={ROUTES.profile} element={<ProfilePage />} />
                <Route element={<PrivateRoute role="ADMIN" />}>
                  <Route path={ROUTES.admin} element={<AdminPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
