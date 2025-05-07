import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Organizer } from "@/types/models/Organizer";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";

export default function OrganizersPage() {
  const api = useApiClient();

  const { data = [], isLoading } = useQuery<Organizer[]>({
    queryKey: ["organizers"],
    queryFn: async () => {
      const res = await api.get("/admin/organizers");
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Организаторы</h1>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((org) => (
            <Card key={org.id}>
              <h2 className="text-lg font-semibold">{org.name}</h2>
              <p className="text-sm text-gray-500">{org.description || "Без описания"}</p>
              <Link
                to={`/organizers/${org.id}`}
                className="inline-block mt-3 text-blue-600 hover:underline text-sm"
              >
                Открыть →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}