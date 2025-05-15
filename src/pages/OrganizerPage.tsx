import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useApiClient } from "@/hooks/useApiClient";
import { Organizer } from "@/types/models/Organizer";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { OrganizerModal } from "@/components/organizers/OrganizerModal";
import { Card } from "@/components/ui/Card";
import { EventCarousel } from "@/components/organizers/EventCarousel";
import { useModals } from "@/context/ModalContext";
import { BackButton } from "@/components/ui/BackButton";

export default function OrganizerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApiClient();
  const { openModal } = useModals();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: organizer, isLoading, isError, refetch } = useQuery<Organizer>({
    queryKey: ["organizer", id],
    queryFn: async () => {
      const res = await api.get(`/admin/organizers/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: false,
  });

  const handleSave = async (data: { name: string; description?: string; contacts?: string }) => {
    try {
      await api.patch(`/admin/organizers/${organizer?.id}`, data);
      toast.success("Данные обновлены");
      setModalOpen(false);
      refetch();
    } catch {
      toast.error("Не удалось сохранить данные");
    }
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (isError || !organizer) return (
    <div className="text-red-500">
      Ошибка загрузки профиля организатора.
      <br />
      <Button onClick={() => navigate("/organizers")} variant="secondary">Вернуться назад</Button>
    </div>
  );

  const initialLetter = organizer.name.charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton />

      <Card className="p-6 space-y-8">
        {/* Профиль */}
        <div className="flex items-start gap-4 mt-2">
          {/* Аватар */}
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
            {initialLetter}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{organizer.name}</h1>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Pencil size={14} />}
                onClick={() => setModalOpen(true)}
              >
                Редактировать
              </Button>
            </div>
            {organizer.description && (
              <p className="text-sm text-gray-600 mt-1">{organizer.description}</p>
            )}
            {organizer.contacts && (
              <p className="text-sm text-gray-500 mt-1">📞 {organizer.contacts}</p>
            )}
          </div>
        </div>

        {/* Мероприятия */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Мероприятия</h2>
          {organizer.events.length === 0 ? (
            <p className="text-gray-500">Нет мероприятий</p>
          ) : (
            <EventCarousel events={organizer.events} />
          )}
        </div>

        {/* Менеджеры */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Менеджеры</h2>
          {organizer.admins.length === 0 ? (
            <p className="text-gray-500">Менеджеры не назначены</p>
          ) : (
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {organizer.admins.map((admin) => (
                <li key={admin.id}>
                  {admin.user.firstName} {admin.user.lastName} (ID: {admin.user.id}) /&nbsp;
                  <span className="text-blue-500 hover:underline hover:cursor-pointer" onClick={() => openModal(
                    "user", {
                      ...admin.user,
                      admin: {
                        role: admin.role,
                        organizer: { name: organizer.name, id: organizer.id }
                      },
                    }
                  )}>открыть →</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <OrganizerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSave}
          initialData={{
            name: organizer.name,
            description: organizer.description,
            contacts: organizer.contacts,
          }}
        />
      </Card>
    </div>
  );
}