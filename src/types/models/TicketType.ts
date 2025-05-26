import { Ticket } from "./Ticket";
import { Event } from "./Event";

export interface TicketType {
  id: number;
  eventId: number;
  name: string;
  price: number;
  quantity: number;
  isSalesEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  event: Event;
  tickets: Ticket[];
}