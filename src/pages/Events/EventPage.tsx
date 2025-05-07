import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Event } from "@/types/models/Event";
import { Card } from "@/components/ui/Card";
import dayjs from "dayjs";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { CardButton } from "@/components/ui/CardButton";
import { useModals } from "@/context/ModalContext";
import { BackButton } from "@/components/ui/BackButton";

export default function EventPage() {
  const { id } = useParams();
  const api = useApiClient();
  const { openModal } = useModals();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await api.get(`admin/events/${id}/overview`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading || !event) return <p>Загрузка...</p>;

  const totalTickets = event.ticketTypes.reduce((sum, type) => sum + type.tickets.length, 0);
  const availableTickets = event.ticketTypes.reduce(
    (sum, type) => sum + type.tickets.filter(t => t.status === "AVAILABLE").length,
    0
  );
  const soldTickets = totalTickets - availableTickets;

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Обложка + Название */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {event.posterUrl ? (
          <img src={event.posterUrl} alt="Poster" className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
            Нет изображения
          </div>
        )}
        <div className="p-6 space-y-2">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-gray-700">{event.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <CardButton className="bg-blue-500! text-white!" onClick={() => navigate(`/events/${event.id}/edit`)}>Редактировать</CardButton>
        <CardButton onClick={() => openModal("organizer", event.organizer)}>{event.organizer.name}</CardButton>
        <CardButton onClick={() => navigate(`/categories?categoryId=${event.category.id}`)}>{event.category.name}</CardButton>
        <CardButton onClick={() => navigate(`/categories?subcategoryId=${event.subcategory.id}`)}>{event.subcategory.name}</CardButton>
      </div>

      {/* Инфо */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <CalendarDays size={16} />
            <span>Начало: {dayjs(event.startDate).format("DD.MM.YYYY HH:mm")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
            <CalendarDays size={16} />
            <span>Окончание: {dayjs(event.endDate).format("DD.MM.YYYY HH:mm")}</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
        </Card>
      </div>

      {/* Статистика по билетам */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Билеты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-2 text-gray-700">
              <Ticket size={18} />
              <span>Всего билетов: <strong>{totalTickets}</strong></span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-green-700">
              <Users size={18} />
              <span>Продано: <strong>{soldTickets}</strong></span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-blue-700">
              <Ticket size={18} />
              <span>Доступно: <strong>{availableTickets}</strong></span>
            </div>
          </Card>
        </div>
      </div>

      {/* Типы билетов */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Типы билетов</h2>
        {event.ticketTypes.length === 0 ? (
          <p className="text-gray-500">Нет типов билетов</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.ticketTypes.map((type) => {
              const total = type.tickets.length;
              const available = type.tickets.filter(t => t.status === "AVAILABLE").length;
              return (
                <Card key={type.id}>
                  <h3 className="text-base font-semibold">{type.name}</h3>
                  <p className="text-sm text-gray-600">Цена: {type.price}₽</p>
                  <p className="text-sm text-gray-600">Всего: {total}</p>
                  <p className="text-sm text-gray-600">Доступно: {available}</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}