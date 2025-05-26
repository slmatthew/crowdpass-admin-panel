import { MoreVertical, Edit, Trash2, Ticket, Power, PowerOff } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Card } from "@/components/ui/Card";
import { TicketTypeExtended } from "@/pages/Events/EventPage";
import { cn } from "@/utils/utils";

interface Props {
  tt: TicketTypeExtended;
  focused?: boolean;
  eventComing: boolean;
  onEdit: (tt: TicketTypeExtended) => void;
  onDelete: (id: number) => void;
  onGenerate: (id: number) => void;
  onToggleSales: (id: number, enable: boolean) => any;
}

export function TicketTypeCard({ tt, focused = false, eventComing, onEdit, onDelete, onGenerate, onToggleSales }: Props) {
  return (
    <Card className={cn("relative pt-3 pr-3", focused ? 'outline-2 outline-offset-2 outline-violet-700' : '')}>
      {/* Dropdown actions */}
      <Menu as="div" className="absolute top-2 right-2 text-sm text-gray-500">
        <MenuButton className="hover:text-gray-800 transition">
          <MoreVertical size={18} />
        </MenuButton>
        <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
          <div className="py-1">
            {eventComing && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => onGenerate(tt.id)}
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } w-full px-4 py-2 text-left text-sm flex items-center gap-2`}
                  >
                    <Ticket size={16} /> Выпустить билеты
                  </button>
                )}
              </MenuItem>
            )}
            {eventComing && tt.isSalesEnabled && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => onToggleSales(tt.id, false)}
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } w-full px-4 py-2 text-left text-sm flex items-center gap-2`}
                  >
                    <PowerOff size={16} /> Отключить продажи
                  </button>
                )}
              </MenuItem>
            )}
            {eventComing && !tt.isSalesEnabled && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => onToggleSales(tt.id, true)}
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } w-full px-4 py-2 text-left text-sm flex items-center gap-2`}
                  >
                    <Power size={16} /> Включить продажи
                  </button>
                )}
              </MenuItem>
            )}
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => onEdit(tt)}
                  className={`${
                    focus ? "bg-gray-100" : ""
                  } w-full px-4 py-2 text-left text-sm flex items-center gap-2`}
                >
                  <Edit size={16} /> Редактировать
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => onDelete(tt.id)}
                  className={`${
                    focus ? "bg-red-100 text-red-700" : "text-red-500"
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
        <h3 className={cn("text-lg font-semibold", !tt.isSalesEnabled && 'text-gray-500')}>{tt.name}</h3>
        <p className="text-sm text-gray-600">Цена: {tt.price}₽</p>
        <p className="text-sm text-gray-600">Всего: {tt.quantity}</p>
        <p className={cn('text-sm', tt.isSalesEnabled && tt.stats.totalTickets === 0 ? 'text-red-600' : 'text-gray-600')}>Доступно: {tt.stats.availableTickets}</p>
      </div>
    </Card>
  );
}