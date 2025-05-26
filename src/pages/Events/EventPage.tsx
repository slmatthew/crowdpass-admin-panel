import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Card } from "@/components/ui/Card";
import dayjs from "dayjs";
import { CalendarDays, MapPin, Ticket, Trash, Users } from "lucide-react";
import { CardButton } from "@/components/ui/CardButton";
import { useModals } from "@/context/ModalContext";
import { BackButton } from "@/components/ui/BackButton";
import { useState } from "react";
import { TicketType } from "@/types/models";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { TicketTypeModal } from "@/components/events/TicketTypeModal";
import { TicketTypeCard } from "@/components/events/TicketTypeCard";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { EventSalesChart } from "@/components/events/EventSalesChart";
import { EventOverviewResponse, EventOverviewTicketType } from "@/types/api/EventOverviewResponse";
import { cn } from "@/utils/utils";
import { EventFormData } from "@/components/events/EventForm";
import { AxiosError } from "axios";

interface Stats {
  totalTickets: number;
  availableTickets: number;
  reservedTickets: number;
  soldTickets: number;
  usedTickets: number;
}

export interface TicketTypeExtended extends TicketType {
  stats: Stats;
}

export default function EventPage() {
  const { id } = useParams();
  const api = useApiClient();
  const { openModal } = useModals();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();

  const [ticketTypeModalOpen, setTicketTypeModalOpen] = useState(false);
  const [deleteTypeModalOpen, setDeleteTypeModalOpen] = useState(false);
  const [confirmDeleteTypeModalOpen, setConfirmDeleteTypeModalOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);

  const { data: event, isLoading, refetch } = useQuery<EventOverviewResponse>({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await api.get(`admin/events/${id}/overview`);
      return res.data;
    },
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  const openCreateTicketType = () => {
    setSelectedTicketType(null);
    setTicketTypeModalOpen(true);
  };
  
  const openEditTicketType = (tt: EventOverviewTicketType) => {
    setSelectedTicketType(tt);
    setTicketTypeModalOpen(true);
  };
  
  const handleDelete = async (ticketTypeId: number, confirmed: boolean = false) => {
    try {
      await api.delete(`/admin/ticket-types/${ticketTypeId}`, {
        params: confirmed ? { confirm: true } : {},
      });

      setDeleteTypeModalOpen(false);
      setConfirmDeleteTypeModalOpen(false);
      setSelectedTicketType(null);

      toast.success("Тип билетов удалён");
      refetch();
    } catch (error: any) {
      const status = error.response?.status;
  
      if (status === 409 && !confirmed) {
        setDeleteTypeModalOpen(false);
        setConfirmDeleteTypeModalOpen(true);
      } else {
        toast.error(error.response?.data?.message || "Ошибка при удалении");
      }
    }
  };

  const generateTickets = async (id: number) => {
    try {
      const res = await api.post(`/admin/ticket-types/${id}/issue`);
      if(res.status === 200 || res.data.count === 0) {
        toast.error("Все доступные билеты уже выпущены");
      } else {
        toast.success("Билеты выпущены");
      }

      refetch();
    } catch(err) {
      console.error(err);
      toast.error("Произошла ошибка");
    }
  };

  const toggleEvent = async (key: 'isPublished' | 'isSalesEnabled', enabled: boolean) => {
    if(!event) return;

    try {
      const data: EventFormData = {
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        organizerId: event.organizerId.toString(),
        categoryId: event.categoryId.toString(),
        subcategoryId: event.subcategoryId.toString(),
        slug: event.slug,
        isPublished: key === 'isPublished' ? enabled : event.isPublished,
        isSalesEnabled: key === 'isSalesEnabled' ? enabled : event.isSalesEnabled,
      };
      await api.patch(`admin/events/${id}`, data);
      refetch();

      const message = key === 'isPublished' ? (enabled ? 'Мероприятие опубликовано' : 'Мероприятие скрыто') 
                      : (enabled ? 'Продажи включены' : 'Продажи выключены');

      toast.success(message);
    } catch(err: any) {
      if(err instanceof AxiosError) {
        if(err.response?.data.message) {
          return toast.error(err.response.data.message);
        }
      }

      toast.error('Произошла ошибка');
    }
  };

  const toggleTicketTypeSales = async (ticketTypeId: number, enabled: boolean) => {
    try {
      await api.patch(`/admin/ticket-types/${ticketTypeId}`, { isSalesEnabled: enabled });
      toast.success("Тип билета обновлён");
      refetch();
    } catch(err: any) {
      console.error(err);

      const errorMessage = err.response.data.message ?? null;
      toast.error(errorMessage ?? 'Произошла ошибка');
    }
  };

  if (isLoading || !event) return <p>Загрузка...</p>;

  const eventComing = new Date(event.endDate) > new Date();

  const totalTickets = event.stats.totalTickets;
  const availableTickets = event.stats.availableTickets;
  const soldTickets = event.stats.soldTickets;

  const focusedTicketTypeId = ((): number | null => {
    const sp = searchParams.get('ttid');
    if(Number(sp) > 0) return Number(sp);

    return null;
  })();

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
          <div className="flex flex-row justify-items-center gap-2">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            {!event.isDeleted && (
              <div className="flex justify-center content-center pt-[6px] pb-[6px]"><Trash size={20} className="text-red-600" /></div>
            )}
          </div>
          <p className="text-gray-700">{event.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mb-2">
        <CardButton className="bg-blue-500! text-white!" onClick={() => navigate(`/events/${event.id}/edit`)}>Редактировать</CardButton>
        <CardButton
          onClick={() => toggleEvent('isPublished', !event.isPublished)}
          className={cn(
            event.isPublished ? 'bg-red-500!' : 'bg-green-500!',
            'text-white!'
          )}
        >{event.isPublished ? 'Скрыть' : 'Опубликовать'}</CardButton>
        <CardButton
          onClick={() => toggleEvent('isSalesEnabled', !event.isSalesEnabled)}
          className={cn(
            event.isSalesEnabled ? 'bg-red-500!' : 'bg-green-500!',
            'text-white!'
          )}
        >{event.isSalesEnabled ? 'Отключить' : 'Включить'} продажи</CardButton>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Типы билетов</h2>
          {eventComing && (
            <Button variant="secondary" size="sm" onClick={openCreateTicketType}>➕ Добавить</Button>
          )}
        </div>
  
        {event.ticketTypes.length === 0 ? (
          <p className="text-gray-500">Нет типов билетов</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.ticketTypes.map((type) => (
              <TicketTypeCard
                key={type.id}
                tt={type}
                focused={focusedTicketTypeId === type.id}
                eventComing={eventComing}
                onToggleSales={toggleTicketTypeSales}
                onEdit={() => openEditTicketType(type)}
                onDelete={() => {
                  setSelectedTicketType(type);
                  setDeleteTypeModalOpen(true);
                }}
                onGenerate={(id) => generateTickets(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* График продаж по дням */}
      <div>
        <h2 className="text-lg font-semibold mb-2">График продаж</h2>
        <div className="flex flex-col gap-3">
          <CardButton onClick={() => queryClient.invalidateQueries({ queryKey: ['event-sales', event.id] })}>💰 Общая выручка: {event.revenue} ₽</CardButton>
          <Card>
            <EventSalesChart eventId={event.id} />
          </Card>
        </div>
      </div>

      <TicketTypeModal
        open={ticketTypeModalOpen}
        onClose={() => setTicketTypeModalOpen(false)}
        initialData={selectedTicketType || undefined}
        mode={selectedTicketType ? "edit" : "create"}
        onSubmit={async (data) => {
          try {
            if (selectedTicketType) {
              await api.patch(`/admin/ticket-types/${selectedTicketType.id}`, data);
              toast.success("Тип билета обновлён");
            } else {
              await api.post(`/admin/ticket-types`, { ...data, eventId: event.id });
              toast.success("Тип билета создан");
            }
            setTicketTypeModalOpen(false);
            refetch();
          } catch(err: any) {
            console.error(err);

            const errorMessage = err.response.data.message ?? null;
            toast.error(errorMessage ?? 'Произошла ошибка');
          }
        }}
      />

      <ConfirmModal
        open={deleteTypeModalOpen}
        title={`Удалить тип билетов «${selectedTicketType?.name ?? 'unknown'}»?`}
        onClose={() => {
          setDeleteTypeModalOpen(false);
          setSelectedTicketType(null);
        }}
        onConfirm={() => handleDelete(selectedTicketType?.id ?? 0)}
      />
      <ConfirmModal
        open={confirmDeleteTypeModalOpen}
        title={`Удалить тип билетов «${selectedTicketType?.name ?? 'unknown'}»?`}
        description="БУДЬТЕ ВНИМАТЕЛЬНЫ! Удаление этого типа билетов приведет к отмене всех связанных с ним бронирований. Продолжайте удаление ТОЛЬКО если уверены, что это действительно необходимо"
        onClose={() => {
          setConfirmDeleteTypeModalOpen(false);
          setSelectedTicketType(null);
        }}
        onConfirm={() => handleDelete(selectedTicketType?.id ?? 0, true)}
      />
    </div>
  );
}