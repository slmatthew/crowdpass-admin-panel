import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Booking } from "@/types/models/Booking";
import { Pagination } from "@/components/Pagination";
import { BookingEditModal } from "@/components/bookings/BookingEditModal";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useModals } from "@/context/ModalContext";

interface BookingFilters {
  search: string;
  eventId: string;
  status: string;
  page: number;
  perPage: number;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
}

export default function BookingsPage() {
  const api = useApiClient();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [params, setParams] = useSearchParams();
  const [searchId, setSearchId] = useState("");
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
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

      const result = (await api.patch<Booking>(`admin/bookings/${bookingId}/status`, { status })).data;
      if(searchedBooking !== null) setSearchedBooking(result);

      await refetch();

      toast.success("Статус брони обновлен");
    } catch (err: any) {
      console.error("[status update]", err);
      toast.error(err.response.data.message ?? "Ошибка при обновлении статуса");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearch = async () => {
    setSearchedBooking(null);
    if (!searchId) return;

    try {
      const res = await api.get<Booking>(`admin/bookings/${searchId}`);
      setSearchedBooking(res.data);
    } catch {
      toast.error("Бронирование не найдено");
    }
  };

  const bookings = data?.bookings ?? [];
  const total = data?.total ?? 0;

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
          booking={searchedBooking}
          onClose={() => setSearchedBooking(null)}
          isUpdating={updatingId === searchedBooking.id}
          onStatusChange={(newStatus) => handleStatusChange(searchedBooking.id, newStatus)}
        />
      )}

      {/* Таблица */}
      {isLoading && (
        <p>Загрузка...</p>
      )}

      {!isLoading && isMobile && (
        <p className="text-gray-500">Для просмотра списка броней воспользуйтесь компьютером</p>
      )}
      
      {!isLoading && !isMobile && bookings.length === 0 && (
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
                <th className="px-4 py-2 text-left font-medium text-gray-600">Мероприятие</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Билеты</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Статус</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b, idx) => (
                <>
                  <tr key={b.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{b.id}</td>
                    <td className="px-4 py-2">
                      <span
                        className="text-blue-500 hover:underline hover:cursor-pointer"
                        onClick={() => openModal("user", b.user)}
                      >
                        {b.user.firstName} {b.user.lastName}
                      </span>
                    </td>
                    <td className="px-4 py-2">{b.user.email ?? "—"}</td>
                    <td className="px-4 py-2">{b.bookingTickets[0]?.ticket.ticketType.event.name ?? "—"}</td>
                    <td className="px-4 py-2">{b.bookingTickets.length}</td>
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
                      {b.status !== "CANCELLED" && (
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
                    <tr>
                      <td colSpan={7} className="bg-gray-100 px-4 py-2">
                        <ul className="space-y-1">
                          {b.bookingTickets.map((bt) => (
                            <li key={bt.id}>
                              🎟 {bt.ticket.ticketType.name} — {bt.ticket.status} — {bt.ticket.ticketType.price}₽
                              {bt.ticket.ownerFirstName && (
                                <> ({bt.ticket.ownerFirstName} {bt.ticket.ownerLastName})</>
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Пагинация */}
      {total > filters.perPage && !isMobile && (
        <Pagination
          total={total}
          perPage={filters.perPage}
          page={filters.page}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
