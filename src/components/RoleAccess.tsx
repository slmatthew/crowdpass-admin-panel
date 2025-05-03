import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/models/Role";
import { ReactNode } from "react";

interface Props {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleAccess({ allow, children, fallback = null }: Props) {
  const { user } = useAuth();

  const isAllowed = user?.admin?.role ? allow.includes(user.admin.role) : false;

  return isAllowed ? <>{children}</> : <>{fallback}</>;
}