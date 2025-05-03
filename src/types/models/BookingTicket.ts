import { Booking } from "./Booking";
import { Ticket } from "./Ticket";

export interface BookingTicket {
  id: number;
  bookingId: number;
  ticketId: number;
  booking: Booking;
  ticket: Ticket;
}