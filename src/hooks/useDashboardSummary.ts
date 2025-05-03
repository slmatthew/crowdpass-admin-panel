import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchTyped } from "@/lib/typedApiClient";
import { DashboardSummary } from "@/types/api";

export function useDashboardSummary() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () =>
      fetchTyped<DashboardSummary>(token!, "admin/dashboard/summary"),
    staleTime: 1000 * 60 * 2,
  });
}