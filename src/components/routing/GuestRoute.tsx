import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth();

  // Si todavía se está validando la sesión, mostramos estado de carga
  if (loading) {
    return children;
  }

  // Si el usuario ya está autenticado, redirigimos a home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Si no hay sesión, mostramos el contenido
  return children;
}