import { MoreVertical, Edit, Trash2, Ticket } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Card } from "@/components/ui/Card";
import { TicketTypeExtended } from "@/pages/Events/EventPage";

interface Props {
  tt: TicketTypeExtended;
  eventComing: boolean;
  onEdit: (tt: TicketTypeExtended) => void;
  onDelete: (id: number) => void;
  onGenerate: (id: number) => void;
}

export function TicketTypeCard({ tt, eventComing, onEdit, onDelete, onGenerate }: Props) {
  return (
    <Card className="relative pt-3 pr-3">
      {/* Dropdown actions */}
      <Menu as="div" className="absolute top-2 right-2 text-sm text-gray-500">
        <MenuButton className="hover:text-gray-800 transition">
          <MoreVertical size={18} />
        </MenuButton>
        <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
          <div className="py-1">
            {eventComing && (
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => onGenerate(tt.id)}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } w-full px-4 py-2 text-left text-sm flex items-center gap-2`}
                  >
                    <Ticket size={16} /> Выпустить билеты
                  </button>
                )}
              </MenuItem>
            )}
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => onEdit(tt)}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full px-4 py-2 text-left text-sm flex items-center gap-2`}
                >
                  <Edit size={16} /> Редактировать
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => onDelete(tt.id)}
                  className={`${
                    active ? "bg-red-100 text-red-700" : "text-red-500"
                  } w-full px-4 py-2 text-left text-sm flex items-center gap-2`}
                >
                  <Trash2 size={16} /> Удалить
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{tt.name}</h3>
        <p className="text-sm text-gray-600">Цена: {tt.price}₽</p>
        <p className="text-sm text-gray-600">Всего: {tt.quantity}</p>
        <p className="text-sm text-gray-600">Доступно: {tt.stats.availableTickets}</p>
      </div>
    </Card>
  );
}