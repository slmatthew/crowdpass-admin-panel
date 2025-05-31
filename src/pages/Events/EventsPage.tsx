import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types/models/Event";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { useEventFilters } from "@/hooks/useEventFilters";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useApiClient } from "@/hooks/useApiClient";
import { Header } from "@/components/Header/Header";

const PER_PAGE = 6;

export default function EventsPage() {
  const api = useApiClient();
  const { filters, update, reset, goToPage } = useEventFilters();

  const {
    data: events,
    isLoading,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => api.get<Event[]>('admin/events?extended=1&fields=organizer,category,subcategory').then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  const filtered = useMemo(() => {
    if (!events) return [];

    return events
      .filter((e) =>
        e.name.toLowerCase().includes(filters.search.toLowerCase())
      )
      .filter((e) =>
        filters.organizer ? e.organizer.name === filters.organizer : true
      )
      .filter((e) =>
        filters.category ? e.category.name === filters.category : true
      )
      .filter((e) =>
        filters.location ? e.location === filters.location : true
      )
      .filter((e) => {
        switch(filters.published) {
          case 'published':
            return e.isPublished;
          case 'hidden':
            return !e.isPublished;
          case 'all': default:
            return true;
        }
      })
      .filter((e) => {
        switch(filters.sales) {
          case 'enabled':
            return e.isSalesEnabled;
          case 'disabled':
            return !e.isSalesEnabled;
          case 'all': default:
            return true;
        }
      })
      .filter((e) => {
        if (!filters.futureOnly) return true;
        return new Date(e.endDate) >= new Date();
      })      
      .sort((a, b) => {
        switch (filters.sort) {
          case "az":
            return a.name.localeCompare(b.name);
          case "za":
            return b.name.localeCompare(a.name);
          case "latest":
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          case "soonest":
          default:
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
      });      
  }, [events, filters]);

  const paged = filtered.slice(
    (filters.page - 1) * PER_PAGE,
    filters.page * PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="space-y-6">
      <Header>
        <Header.Text>Мероприятия</Header.Text>

        <Header.Button
          variant="primary"
        >
          <Link to="/events/create" className="w-full">➕ Создать</Link>
        </Header.Button>
        <Header.Button
          variant="ghost"
          isLoading={isLoading}
          onClick={() => queryClient.invalidateQueries({ queryKey: ["events"] })}
        >
          {isLoading ? "Обновляется..." : "🔄 Обновить"}
        </Header.Button>
      </Header>


      {events && (
        <EventFilters
          events={events}
          filters={filters}
          onChange={update}
          onReset={reset}
        />
      )}

      {isLoading && <div>Загрузка...</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                filters.page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}