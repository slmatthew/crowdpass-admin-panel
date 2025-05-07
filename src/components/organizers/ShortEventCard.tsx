import { Event } from "@/types/models/Event";
import { Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";

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

export function ShortEventCard({ event }: { event: Event }) {
  const status = getEventStatus(event);
  const hasPoster = !!event.posterUrl;

  return (
    <Card className="p-0! overflow-hidden">
      <div className="h-40 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {hasPoster ? (
          <img
            src={event.posterUrl!}
            alt="Постер мероприятия"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={36} />
            <span className="text-sm mt-1 text-gray-500">{event.name}</span>
          </div>
        )}
      </div>

      <div className="p-4 pt-1 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">
          {event.name}
          <span
            className={`text-xs ml-2 px-2 py-0.5 rounded-full font-semibold ${
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

        <Link
          to={`/events/${event.id}/edit`}
          className="text-blue-500 hover:underline text-sm mt-2 self-start"
        >
          Открыть
        </Link>
      </div>
    </Card>
  );
}