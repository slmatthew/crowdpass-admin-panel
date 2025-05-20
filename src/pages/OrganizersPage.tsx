import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Organizer } from "@/types/models/Organizer";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { OrganizerModal } from "@/components/organizers/OrganizerModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function OrganizersPage() {
  const api = useApiClient();

  const { data = [], isLoading, refetch } = useQuery<Organizer[]>({
    queryKey: ["organizers"],
    queryFn: async () => {
      const res = await api.get("/admin/organizers");
      return res.data;
    },
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  async function handleSave(data: { name: string; description?: string; contacts?: string }) {
    try {
      await api.post(`/admin/organizers/`, data);
      toast.success(`Добавлен новый организатор: ${data.name}`);
      setModalOpen(false);
      refetch();
    } catch(err) {
      if(err instanceof AxiosError) {
        if(err.response?.data.message) {
          toast.error(err.response.data.message);
          return;
        }
      }

      toast.error("Не удалось сохранить данные");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Организаторы</h1>

        <div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setModalOpen(true)}
          >
            Создать
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isLoading}
            onClick={() => refetch()}
            className="ml-2"
          >
            {isLoading ? 'Обновляется...' : '🔄 Обновить'}
          </Button>
        </div>
      </div>

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

      <OrganizerModal
        mode="create"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}