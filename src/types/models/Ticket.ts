import { BookingTicket } from "./BookingTicket";
import { TicketStatus } from "./TicketStatus";
import { TicketType } from "./TicketType";

export interface Ticket {
  id: number;
  ticketTypeId: number;
  qrCodeUrl?: string;
  qrCodeSecret?: string;
  ownerFirstName?: string;
  ownerLastName?: string;
  status: TicketStatus;
  ticketType: TicketType;
  bookingTickets: BookingTicket[];
}