import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Booking } from "@/types/models/Booking";
import { Pagination } from "@/components/Pagination";
import { BookingData, BookingEditModal } from "@/components/bookings/BookingEditModal";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useModals } from "@/context/ModalContext";
import { getDisplayTicketStatus } from "@/utils/utils";
import { BookingsResponse } from "@/types/api/BookingsResponse";

interface BookingFilters {
  search: string;
  eventId: string;
  status: string;
  page: number;
  perPage: number;
}

export default function BookingsPage() {
  const api = useApiClient();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [params, setParams] = useSearchParams();

  const [searchId, setSearchId] = useState("");
  const [searchedBooking, setSearchedBooking] = useState<BookingData | null>(null);
  const SEARCH_USE_FETCHED_DATA = false;

  const isMobile = useIsMobile(768);
  const { openModal } = useModals();

  const filters = useMemo<BookingFilters>(() => ({
    search: "",
    eventId: "",
    status: "",
    page: Number(params.get("page") ?? 1),
    perPage: Number(params.get("perPage") ?? 20),
  }), [params]);

  const goToPage = (page: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    setParams(next);
  };

  const {
    data,
    isLoading,
    refetch,
  } = useQuery<BookingsResponse>({
    queryKey: ["bookings", filters],
    queryFn: async () => {
      if(isMobile) return {
        bookings: [],
        total: 0
      };

      const res = await api.get("admin/bookings", {
        params: {
          page: filters.page,
          limit: filters.perPage,
        },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleStatusChange = async (bookingId: number, status: Booking["status"]) => {
    try {
      setUpdatingId(bookingId);

      const res = await api.patch<BookingsResponse>(`admin/bookings/${bookingId}/status`, { status });
      setSearchedBooking(makeBookingDataForModal(res.data, bookingId));

      await refetch();

      toast.success("Статус брони обновлен");
    } catch (err: any) {
      console.error("[status update]", err);
      toast.error(err.response.data.message ?? "Ошибка при обновлении статуса");
    } finally {
      setUpdatingId(null);
    }
  };

  const makeBookingDataForModal = (
    bookingsData: BookingsResponse,
    bookingId: number
  ): BookingData | null => {
    const booking = bookingsData.bookings.items.find(b => b.id === bookingId);
    if(!booking) return null;

    const user = bookingsData.users.find(u => u.id === booking.userId);
    if(!user) return null;

    const tickets = booking.tickets.map((t) => {
      const ticketType = bookingsData.ticketTypes.find(tt => tt.id === t.ticketTypeId);
      if(!ticketType) return;

      const event = bookingsData.events.find(e => e.id === ticketType.eventId);
      if(!event) return;

      return {
        ...t,
        ticketType,
        event,
      };
    });

    return {
      ...booking,
      tickets: tickets.filter(t => t !== undefined),
      user,
    };
  };

  const handleSearch = async () => {
    setSearchedBooking(null);
    if(!searchId) return;

    const bookingId = Number(searchId);
    if(bookingId <= 0) return;

    if(SEARCH_USE_FETCHED_DATA) {
      if(bookingId > 0 && data) {
        setSearchedBooking(makeBookingDataForModal(data, bookingId));
      }
    } else {
      try {
        const res = await api.get<BookingsResponse>(`admin/bookings/${bookingId}`);
        setSearchedBooking(makeBookingDataForModal(res.data, bookingId));
      } catch {
        toast.error("Бронирование не найдено");
      }
    }
  };

  const {
    bookings,
    events,
    ticketTypes,
    users,
  } = data ? data : {
    bookings: { items: [], total: 0 },
    events: [],
    ticketTypes: [],
    users: [],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Бронирования</h1>

      {/* Поиск и обновление */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="ID брони"
            className="input w-full sm:w-60 !text-base"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button className="btn-secondary w-full sm:w-auto" onClick={handleSearch}>
            Открыть
          </button>
        </div>

        {!isMobile && (
          <button className="btn-primary w-full sm:w-auto" onClick={() => refetch()}>
            🔄 Обновить
          </button>
        )}
      </div>

      {/* Модалка по ID */}
      {searchedBooking && (
        <BookingEditModal
          bookingData={searchedBooking}
          onClose={() => setSearchedBooking(null)}
          isUpdating={updatingId === Number(searchId)}
          onStatusChange={(newStatus) => handleStatusChange(Number(searchId), newStatus)}
        />
      )}

      {/* Таблица */}
      {isLoading && (
        <p>Загрузка...</p>
      )}

      {!isLoading && isMobile && (
        <p className="text-gray-500">Для просмотра списка броней воспользуйтесь компьютером</p>
      )}
      
      {!isLoading && !isMobile && bookings.items.length === 0 && (
        <p className="text-gray-500">Бронирования не найдены</p>
      )}
      
      {!isLoading && !isMobile && (
        <div className="w-full overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Пользователь</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Мероприятия</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Билеты</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Статус</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.items.map((b, idx) => {
                const eventsMap = new Map<number, { name: string; slug: string | null; }>();

                b.tickets.forEach((t) => {
                  const ticketType = ticketTypes.find(tt => tt.id === t.ticketTypeId);
                  if(!ticketType) return;

                  const event = events.find(e => e.id === ticketType.eventId);
                  if(!event) return;

                  if(!eventsMap.has(event.id)) eventsMap.set(event.id, { name: event.name, slug: event.slug });
                });

                const displayEvents = Array.from(events);

                const user = users.find(u => u.id === b.userId);
                if(!user) return null;

                return (
                  <>
                    <tr key={b.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2">{b.id}</td>
                      <td className="px-4 py-2">
                        <span
                          className="text-blue-500 hover:underline hover:cursor-pointer"
                          onClick={() => openModal("user", user)}
                        >
                          {user.isBanned ? <i>{user.firstName} {user.lastName}</i> : `${user.firstName} ${user.lastName}`}
                        </span>
                      </td>
                      <td className="px-4 py-2">{user.email ?? "—"}</td>
                      <td className="px-4 py-2">
                        {displayEvents.length === 0 && "—"}
                        {displayEvents.length > 0 && displayEvents.map((e) => {
                          const isLast = e.id === displayEvents[displayEvents.length - 1].id;

                          return (
                            <>
                              <Link
                                className="text-blue-500 hover:underline hover:cursor-pointer"
                                to={`/events/${e.slug ? e.slug : e.id}`}
                              >
                                {e.isActive ? e.name : <i>{e.name}</i>}
                              </Link>
                              {!isLast && <span>, </span>}
                            </>
                          );
                        })}
                      </td>
                      <td className="px-4 py-2">{b.tickets.length}</td>
                      <td className="px-4 py-2">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleStatusChange(b.id, e.target.value as Booking["status"])
                          }
                          disabled={updatingId === b.id}
                          className="border rounded px-2 py-1"
                        >
                          <option value="ACTIVE">Активна</option>
                          <option value="PAID">Оплачена</option>
                          <option value="CANCELLED">Отменена</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {b.status !== "CANCELLED" && b.tickets.length > 0 && (
                          <button
                            onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                            className="text-blue-600 hover:underline"
                          >
                            {expandedId === b.id ? "Скрыть" : "Показать"} билеты
                          </button>
                        )}
                      </td>
                    </tr>

                    {expandedId === b.id && (
                      <tr key={b.id + 0.5}>
                        <td colSpan={7} className="bg-gray-100 px-4 py-2">
                          <ul className="space-y-1">
                            {b.tickets.map((t) => {
                              const ticketType = ticketTypes.find(tt => tt.id === t.ticketTypeId)!;
                              const event = events.find(e => e.id === ticketType.eventId)!;

                              return (
                                <li key={t.id}>
                                  🎟 {event.name} – <Link
                                    className="text-blue-500 hover:underline hover:cursor-pointer"
                                    to={`/events/${event.slug ? event.slug : event.id}?ttid=${ticketType.id}`}
                                  >{ticketType.name}</Link> — {getDisplayTicketStatus(t.status)} — {ticketType.price}₽
                                  {t.owner.fn && (
                                    <> ({t.owner.fn} {t.owner.ln})</>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Пагинация */}
      {bookings.total > filters.perPage && !isMobile && (
        <Pagination
          total={bookings.total}
          perPage={filters.perPage}
          page={filters.page}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
