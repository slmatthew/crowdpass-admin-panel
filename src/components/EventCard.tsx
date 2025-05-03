import { Event } from "@/types/models/Event";
import { CalendarDays, MapPin } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function getEventStatus(event: Event) {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (end < now) return "ПРОШЛО";
  if (
    start.toDateString() === now.toDateString() ||
    (start < now && end > now)
  )
    return "СЕГОДНЯ";
  return "СКОРО";
}

export function EventCard({ event }: { event: Event }) {
  const status = getEventStatus(event);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-md transition">
      <h2 className="text-lg font-semibold">
        {event.name}
        <span
          className={`text-xs ml-2 px-2 py-1 rounded-full font-semibold ${
            status === "ПРОШЛО"
              ? "bg-gray-300 text-gray-600"
              : status === "СЕГОДНЯ"
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {status}
        </span>
      </h2>
      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>

      <div className="text-sm text-gray-500 flex items-center gap-1 mt-2">
        <CalendarDays size={16} />
        {dayjs(event.startDate).format("DD.MM.YYYY HH:mm")}
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-1">
        <MapPin size={16} />
        {event.location}
      </div>

      <Link to={`/events/${event.id}/edit`} className="text-blue-500 hover:underline text-sm">
        ✏️ Редактировать
      </Link>

    </div>
  );
}