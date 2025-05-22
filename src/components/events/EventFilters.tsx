import { Filters } from "@/hooks/useEventFilters";
import { Event } from "@/types/models/Event";
import { useState, useEffect } from "react";

interface Props {
  events: Event[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function EventFilters({ events, filters, onChange, onReset }: Props) {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleApply = () => onChange(local);

  // Уникальные значения из списка мероприятий
  const organizers = Array.from(
    new Set(events.map((e) => e.organizer.name))
  ).sort();

  const categories = Array.from(
    new Set(events.map((e) => e.category.name))
  ).sort();

  const locations = Array.from(
    new Set(events.map((e) => e.location))
  ).sort();

  return (
    <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-4 items-end">
      {/* Поиск */}
      <input
        type="text"
        placeholder="Поиск по названию"
        className="input"
        value={local.search}
        onChange={(e) => setLocal({ ...local, search: e.target.value })}
      />

      {/* Организатор */}
      <select
        value={local.organizer}
        onChange={(e) => setLocal({ ...local, organizer: e.target.value })}
        className="select"
      >
        <option value="">Все организаторы</option>
        {organizers.map((org) => (
          <option key={org} value={org}>{org}</option>
        ))}
      </select>

      {/* Категория */}
      <select
        value={local.category}
        onChange={(e) => setLocal({ ...local, category: e.target.value })}
        className="select"
      >
        <option value="">Все категории</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Локация */}
      <select
        value={local.location}
        onChange={(e) => setLocal({ ...local, location: e.target.value })}
        className="select"
      >
        <option value="">Все локации</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      {/* Сортировка */}
      <select
        value={local.sort}
        onChange={(e) =>
          setLocal({ ...local, sort: e.target.value as Filters["sort"] })
        }
        className="select"
      >
        <option value="soonest">Скоро</option>
        <option value="latest">Позже</option>
        <option value="az">Название: А–Я</option>
        <option value="za">Название: Я–А</option>
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={local.futureOnly}
          onChange={(e) =>
            setLocal({ ...local, futureOnly: e.target.checked })
          }
        />
        Только предстоящие
      </label>

      {/* Кнопки */}
      <button className="btn-primary" onClick={handleApply}>
        Применить
      </button>
      <button className="btn-secondary" onClick={onReset}>
        Сброс
      </button>
    </div>
  );
}