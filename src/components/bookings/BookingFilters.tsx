import { useEffect, useState } from "react";
import { BookingFilters as IBookingFilters } from "@/hooks/useBookings";
import { useApiClient } from "@/hooks/useApiClient";
import { Event } from "@/types/models/Event";

interface Props {
  filters: IBookingFilters;
  onChange: (filters: Partial<IBookingFilters>) => void;
  onReset: () => void;
}

export function BookingFilters({ filters, onChange, onReset }: Props) {
  const api = useApiClient();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("admin/events");
      setEvents(res.data);
    })();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-end">
      <input
        type="text"
        placeholder="Поиск по пользователю или ID"
        className="input"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
      />

      <select
        value={filters.eventId}
        onChange={(e) => onChange({ eventId: e.target.value })}
        className="select"
      >
        <option value="">Все мероприятия</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>{e.name}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
        className="select"
      >
        <option value="">Все статусы</option>
        <option value="ACTIVE">Активные</option>
        <option value="PAID">Оплаченные</option>
        <option value="CANCELLED">Отменённые</option>
      </select>

      <button className="btn-secondary" onClick={onReset}>
        Сброс
      </button>
    </div>
  );
}