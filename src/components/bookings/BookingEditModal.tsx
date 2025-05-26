import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Booking } from "@/types/models/Booking";
import { useState } from "react";
import { getDisplayTicketStatus } from "@/utils/utils";
import { Link } from "react-router-dom";
import { BookingStatus, TicketStatus } from "@/types/models";

export type BookingData = {
  id: number;
  userId: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  tickets: {
    id: number;
    qrCodeSecret: string | null;
    status: TicketStatus;
    owner: {
      fn: string | null;
      ln: string | null;
    };
    ticketTypeId: number;
    ticketType: {
      id: number;
      slug: string | null;
      name: string;
      price: number;
      eventId: number;
      isActive: boolean;
    };
    event: {
      id: number;
      slug: string | null;
      name: string;
      isActive: boolean;
    };
  }[];
  user: {
    id: number;
    telegramId: string | null;
    vkId: string | null;
    email: string | null;
    firstName: string;
    lastName: string;
    phone: string | null;
    createdAt: Date;
    isBanned: boolean;
  };
};

interface Props {
  bookingData: BookingData;
  onClose: () => void;
  onStatusChange: (status: Booking["status"]) => void;
  isUpdating: boolean;
}

export function BookingEditModal({ bookingData, onClose, onStatusChange, isUpdating }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<Booking["status"]>(bookingData.status);
  const handleChange = (status: Booking["status"]) => {
    setSelectedStatus(status);    
    onStatusChange(status);
  };

  const eventsMap = new Map<number, BookingData['tickets'][number]['event']>();
  bookingData.tickets.forEach((t) => {
    if(!eventsMap.has(t.event.id)) eventsMap.set(t.event.id, t.event);
  });

  const eventsList = Array.from(eventsMap.values());

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl space-y-6">
          <DialogTitle className="text-xl font-bold">
            Бронь #{bookingData.id}
          </DialogTitle>

          <div className="text-sm text-gray-700 space-y-1">
            <div>
              👤 <span className="font-medium">{bookingData.user.isBanned ? <i>{bookingData.user.firstName} {bookingData.user.lastName}</i> : `${bookingData.user.firstName} ${bookingData.user.lastName}`}</span>
              {bookingData.user.email && (
                <span className="text-gray-500"> — {bookingData.user.email}</span>
              )}
            </div>
            <div>
              🎫 <span className="font-medium">
                {eventsList.map((e, idx) => {
                  const isLast = idx === eventsList.length - 1;

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
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Статус брони</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => handleChange(e.target.value as Booking["status"])}
                disabled={isUpdating}
                className="select w-full pr-10"
              >
                <option value="ACTIVE">Активна</option>
                <option value="PAID">Оплачена</option>
                <option value="CANCELLED">Отменена</option>
              </select>
              {isUpdating && (
                <div className="absolute top-2 right-3 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-700">Билеты</h3>
            <ul className="text-sm text-gray-600 space-y-0.5">
              {bookingData.tickets.map((t) => (
                <li key={t.id}>
                  🎟 №{t.event.id}-{t.id}: <Link
                    className="text-blue-500 hover:underline hover:cursor-pointer"
                    to={`/events/${t.event.slug ? t.event.slug : t.event.id}`}
                  >
                    {t.event.isActive ? t.event.name : <i>{t.event.name}</i>}
                  </Link>
                  , <Link
                    className="text-blue-500 hover:underline hover:cursor-pointer"
                    to={`/events/${t.event.slug ? t.event.slug : t.event.id}?ttid=${t.ticketType.id}`}
                  >{t.ticketType.name}</Link>
                  , {getDisplayTicketStatus(t.status)}
                  , {t.ticketType.price} ₽

                  {t.owner.fn && (
                    <> ({t.owner.fn} {t.owner.ln})</>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 text-right">
            <button onClick={onClose} className="btn-secondary">Закрыть</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}