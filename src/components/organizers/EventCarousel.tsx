import { Event } from "@/types/models/Event";
import { ShortEventCard } from "./ShortEventCard";

interface Props {
  events: Event[];
}

export function EventCarousel({ events }: Props) {
  if (events.length === 0) return <p className="text-gray-500">Нет мероприятий</p>;

  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="flex gap-4 snap-x snap-mandatory px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="snap-start shrink-0 w-[80%] sm:w-[45%] md:w-[30%]"
          >
            <ShortEventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}