import { BookingStatus } from "./BookingStatus";
import { BookingTicket } from "./BookingTicket";
import { User } from "./User";

export interface Booking {
  id: number;
  userId: number;
  createdAt: string;
  status: BookingStatus;
  user: User;
  bookingTickets: BookingTicket[];
}