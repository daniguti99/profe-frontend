import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { loading, user } = useAuth();

  // Mientras se valida la sesión no mostramos contenido protegido
  if (loading) {
    return null;
  }

  // Si no hay usuario, redirigimos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no es admin, redirigimos a home
  if (user.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Si es admin, mostramos el contenido
  return children;
}