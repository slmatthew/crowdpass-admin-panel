import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Booking } from "@/types/models/Booking";
import { useState } from "react";

interface Props {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (status: Booking["status"]) => void;
  isUpdating: boolean;
}

export function BookingEditModal({ booking, onClose, onStatusChange, isUpdating }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<Booking["status"]>(booking.status);

  const handleChange = (status: Booking["status"]) => {
    setSelectedStatus(status);
    onStatusChange(status);
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl space-y-6">
          <DialogTitle className="text-xl font-bold">
            Бронь #{booking.id}
          </DialogTitle>

          <div className="text-sm text-gray-700 space-y-1">
            <div>
              👤 <span className="font-medium">{booking.user.firstName} {booking.user.lastName}</span>
              {booking.user.email && (
                <span className="text-gray-500"> — {booking.user.email}</span>
              )}
            </div>
            <div>
              🎫 <span className="font-medium">{booking.bookingTickets[0]?.ticket.ticketType.event.name ?? "—"}</span>
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
              {booking.bookingTickets.map((bt) => (
                <li key={bt.id}>
                  🎟 {bt.ticket.id} <span className="font-medium">{bt.ticket.ticketType.name}</span> — {bt.ticket.status} — {bt.ticket.ticketType.price} ₽
                  {bt.ticket.ownerFirstName && (
                    <> ({bt.ticket.ownerFirstName} {bt.ticket.ownerLastName})</>
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