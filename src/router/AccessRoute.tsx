import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { JSX } from "react";
import { Role } from "@/types/models/Role";

interface AccessRouteProps {
  children: JSX.Element;
  requireAuth?: boolean;
  redirectTo?: string;
  requiredRoles?: Role[]; // ✅ добавлено
}

export default function AccessRoute({
  children,
  requireAuth = true,
  redirectTo,
  requiredRoles,
}: AccessRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo ?? "/login"} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectTo ?? "/dashboard"} replace />;
  }

  if (
    requiredRoles &&
    (!user || !user.admin || !requiredRoles.includes(user.admin.role))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
